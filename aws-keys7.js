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
    
    // Go directly to the create access key page
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/details/StackOne/create-access-key', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(8000);
    
    // Handle cookie
    await page.evaluate(() => {
      const btn = document.querySelector('[data-id="awsccc-cb-btn-accept"]');
      if (btn) btn.click();
    }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Step 1: CLI is already selected (value="default")
    // Click Next
    await page.locator('button:has-text("Next")').first().click({ force: true });
    await page.waitForTimeout(3000);
    console.log('2. Clicked Next (step 1)');
    
    // Step 2: Skip description, click Next
    await page.locator('button:has-text("Next")').first().click({ force: true });
    await page.waitForTimeout(3000);
    console.log('3. Clicked Next (step 2)');
    
    // Step 3: Create the key
    await page.locator('button:has-text("Create access key")').first().click({ force: true });
    await page.waitForTimeout(8000);
    console.log('4. Created access key');
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-keys-done.png' });
    
    // Show secret key
    const showBtns = await page.locator('button:has-text("Show")').all();
    for (const b of showBtns) {
      await b.click({ force: true }).catch(() => {});
    }
    await page.waitForTimeout(2000);
    
    // Get ALL input values
    const inputs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('input')).map(i => ({
        value: i.value, type: i.type, id: i.id, name: i.name,
        'aria-label': i.getAttribute('aria-label'),
        'data-testid': i.getAttribute('data-testid'),
        className: i.className?.substring(0, 50)
      })).filter(i => i.value && i.value.length > 10);
    });
    console.log('5. All inputs:', JSON.stringify(inputs, null, 2));
    
    // Get page text to find keys
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('6. Key page (first 2000):', pageText.substring(0, 2000));
    
    // Extract keys
    const akiaMatch = pageText.match(/AKIA[A-Z0-9]{16}/);
    if (akiaMatch) {
      console.log('7. ACCESS KEY ID:', akiaMatch[0]);
    }
    
    // Also check for secret in input fields
    let secretKey = '';
    for (const inp of inputs) {
      if (inp.value.startsWith('AKIA')) {
        console.log('8. ACCESS KEY from input:', inp.value);
      } else if (inp.value.length === 40 && /^[A-Za-z0-9/+=]+$/.test(inp.value)) {
        secretKey = inp.value;
        console.log('8. SECRET KEY from input:', inp.value.substring(0, 10) + '...');
      }
    }
    
    // Save keys
    if (akiaMatch || secretKey) {
      const keyData = {
        accessKeyId: akiaMatch ? akiaMatch[0] : '',
        secretAccessKey: secretKey
      };
      fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keyData, null, 2));
      console.log('9. Keys saved!');
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-keys7-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
