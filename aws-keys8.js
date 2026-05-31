const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Login
    await page.goto('https://103658463143.signin.aws.amazon.com/console', { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('#account', '103658463143');
    await page.fill('#username', 'StackOne');
    await page.fill('#password', 'StackOne@2024!');
    await page.click('#signin_button');
    await page.waitForTimeout(10000);
    console.log('1. Logged in');
    
    // Go to create access key
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/details/StackOne/create-access-key', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(8000);
    
    await page.evaluate(() => {
      const btn = document.querySelector('[data-id="awsccc-cb-btn-accept"]');
      if (btn) btn.click();
    }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Check what's on step 1 page
    const step1Text = await page.evaluate(() => document.body.innerText);
    console.log('2. Step 1 page (first 800):', step1Text.substring(0, 800));
    
    // Select CLI use case and click Next
    // The CLI radio has value="default" and is already selected
    // Click Next
    const nextBtns = await page.locator('button').all();
    for (const btn of nextBtns) {
      const text = await btn.textContent().catch(() => '');
      if (text.trim() === 'Next') {
        await btn.click({ force: true }).catch(() => {});
        console.log('3. Clicked Next');
        break;
      }
    }
    await page.waitForTimeout(5000);
    
    // Step 2 - description (optional), look for Next or Create
    const step2Text = await page.evaluate(() => document.body.innerText);
    console.log('4. Step 2 page (first 500):', step2Text.substring(0, 500));
    
    // Click Next or Create
    const step2Btns = await page.locator('button').all();
    for (const btn of step2Btns) {
      const text = await btn.textContent().catch(() => '');
      const trimmed = text.trim();
      if (trimmed === 'Next' || trimmed === 'Create access key') {
        await btn.click({ force: true }).catch(() => {});
        console.log('5. Clicked:', trimmed);
        break;
      }
    }
    await page.waitForTimeout(5000);
    
    // Check current step
    const step3Text = await page.evaluate(() => document.body.innerText);
    console.log('6. Step 3 page (first 500):', step3Text.substring(0, 500));
    
    // Look for Create access key button on this step
    const step3Btns = await page.locator('button').all();
    for (const btn of step3Btns) {
      const text = await btn.textContent().catch(() => '');
      const trimmed = text.trim();
      if (trimmed.includes('Create access key') && !trimmed.includes('best practices')) {
        await btn.click({ force: true }).catch(() => {});
        console.log('7. Clicked:', trimmed);
        break;
      }
    }
    await page.waitForTimeout(8000);
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-final-keys.png' });
    
    // Show secret key
    const allBtns = await page.locator('button').all();
    for (const btn of allBtns) {
      const text = await btn.textContent().catch(() => '');
      if (text.trim() === 'Show') {
        await btn.click({ force: true }).catch(() => {});
      }
    }
    await page.waitForTimeout(2000);
    
    // Get ALL values
    const allValues = await page.evaluate(() => {
      const results = { inputs: [], texts: [] };
      document.querySelectorAll('input').forEach(inp => {
        if (inp.value?.length > 5) {
          results.inputs.push({ value: inp.value, type: inp.type, id: inp.id });
        }
      });
      // Get text nodes that look like keys
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const t = walker.currentNode.textContent.trim();
        if (t.match(/^AKIA[A-Z0-9]{16}$/) || (t.length === 40 && /^[A-Za-z0-9/+=]+$/.test(t))) {
          results.texts.push(t);
        }
      }
      return results;
    });
    
    console.log('8. All values:', JSON.stringify(allValues, null, 2));
    
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('9. Page text (first 1500):', pageText.substring(0, 1500));
    
    // Save keys
    let accessKeyId = '';
    let secretAccessKey = '';
    
    for (const inp of allValues.inputs) {
      if (inp.value.startsWith('AKIA')) accessKeyId = inp.value;
      else if (inp.value.length === 40) secretAccessKey = inp.value;
    }
    
    for (const t of allValues.texts) {
      if (t.startsWith('AKIA')) accessKeyId = t;
      else if (t.length === 40) secretAccessKey = t;
    }
    
    if (accessKeyId || secretAccessKey) {
      fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify({ accessKeyId, secretAccessKey }, null, 2));
      console.log('10. Keys saved! AKIA:', accessKeyId);
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-keys8-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
