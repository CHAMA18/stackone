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
    
    // Go to the IAM users list first
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(8000);
    
    // Handle cookie
    await page.evaluate(() => {
      const btn = document.querySelector('[data-id="awsccc-cb-btn-accept"]');
      if (btn) btn.click();
    }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Find the StackOne user in the list and click on it
    const userLink = page.locator('a:has-text("StackOne"), td:has-text("StackOne")');
    if (await userLink.count() > 0) {
      await userLink.first().click({ force: true });
      console.log('2. Clicked StackOne user');
      await page.waitForTimeout(5000);
    }
    
    // Click Security credentials tab
    const secTab = page.locator('[role="tab"]:has-text("Security credentials")');
    if (await secTab.count() > 0) {
      await secTab.click().catch(() => {});
      await page.waitForTimeout(3000);
      console.log('3. Clicked Security credentials tab');
    }
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-user-sec.png' });
    
    // Now click Create access key
    const createKeyBtn = page.locator('button:has-text("Create access key")');
    console.log('4. Create key button count:', await createKeyBtn.count());
    
    if (await createKeyBtn.count() > 0) {
      await createKeyBtn.first().click({ force: true });
      await page.waitForTimeout(5000);
      console.log('5. Clicked Create access key');
      
      // Step 1 - Select CLI use case
      // Look for radio buttons or options
      const radioOptions = await page.locator('input[type="radio"], [role="radio"]').all();
      console.log('6. Radio options count:', radioOptions.length);
      
      // Click on CLI option
      const cliLabel = page.locator('text=Command Line Interface (CLI)').first();
      if (await cliLabel.count() > 0) {
        await cliLabel.click().catch(() => {});
        await page.waitForTimeout(1000);
        console.log('7. Selected CLI');
      }
      
      // Click Next
      await page.locator('button:has-text("Next")').first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(3000);
      console.log('8. Clicked Next (step 1)');
      
      // Step 2 - Skip description, click Next again  
      await page.locator('button:has-text("Next")').first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(3000);
      console.log('9. Clicked Next (step 2)');
      
      // Step 3 - Click Create access key
      const finalCreate = page.locator('button:has-text("Create access key")');
      if (await finalCreate.count() > 0) {
        await finalCreate.first().click({ force: true });
        await page.waitForTimeout(8000);
        console.log('10. Created access key');
      }
      
      await page.screenshot({ path: '/home/z/my-project/download/aws-keys-created.png' });
      
      // Now extract keys - look for the specific patterns
      // AWS displays keys in a specific format with copy buttons
      
      // Show secret key
      const showBtns = await page.locator('button:has-text("Show")').all();
      for (const b of showBtns) {
        await b.click({ force: true }).catch(() => {});
      }
      await page.waitForTimeout(2000);
      
      // Get all text content
      const pageContent = await page.evaluate(() => {
        const texts = [];
        // Get text from all visible elements
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const t = walker.currentNode.textContent.trim();
          if (t && t.length > 5) texts.push(t);
        }
        return texts;
      });
      
      // Find AKIA keys
      for (const t of pageContent) {
        const match = t.match(/AKIA[A-Z0-9]{16}/);
        if (match) {
          console.log('11. ACCESS KEY ID:', match[0]);
        }
      }
      
      // Find secret keys (40 char base64)
      for (const t of pageContent) {
        if (t.length >= 38 && t.length <= 42 && /^[A-Za-z0-9/+=]+$/.test(t) && !t.startsWith('AKIA')) {
          console.log('11. SECRET KEY candidate:', t.substring(0, 10) + '...');
        }
      }
      
      // Also try to get values from input fields
      const inputValues = await page.evaluate(() => {
        const vals = [];
        document.querySelectorAll('input').forEach(inp => {
          if (inp.value && inp.value.length > 10) {
            vals.push({ value: inp.value, type: inp.type, id: inp.id, name: inp.name });
          }
        });
        return vals;
      });
      console.log('12. Input values:', JSON.stringify(inputValues, null, 2));
      
      // Save whatever we found
      const keys = {};
      for (const inp of inputValues) {
        if (inp.value.startsWith('AKIA')) keys.accessKeyId = inp.value;
        else if (inp.value.length === 40) keys.secretAccessKey = inp.value;
      }
      
      if (keys.accessKeyId || keys.secretAccessKey) {
        fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keys, null, 2));
        console.log('13. Keys saved!', JSON.stringify(keys));
      } else {
        console.log('13. No keys found in inputs, checking page text...');
        const fullText = await page.evaluate(() => document.body.innerText);
        console.log(fullText.substring(0, 2000));
      }
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-keys5-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
