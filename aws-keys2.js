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
    console.log('Logged in:', page.url());
    
    // Go to IAM user page
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/StackOne', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    
    // Handle cookie consent - click "Decline" or "Customize"
    const declineBtn = page.locator('button:has-text("Decline"), button:has-text("Accept"), button[data-testid="cookies-notice-decline"], button[data-testid="cookies-notice-accept"]');
    if (await declineBtn.count() > 0) {
      await declineBtn.first().click();
      console.log('Cookie consent handled');
      await page.waitForTimeout(2000);
    }
    
    // Now look for Security credentials tab
    const secCredTab = page.locator('[data-testid="security-credentials"], a:has-text("Security credentials"), button:has-text("Security credentials")');
    if (await secCredTab.count() > 0) {
      await secCredTab.first().click();
      console.log('Clicked Security credentials tab');
      await page.waitForTimeout(3000);
    }
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-iam2.png' });
    
    // Try direct URL to Security Credentials
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/StackOne?section=security_credentials', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    
    // Handle cookie again if needed
    const decline2 = page.locator('button:has-text("Decline"), button:has-text("Accept")');
    if (await decline2.count() > 0) {
      await decline2.first().click();
      await page.waitForTimeout(2000);
    }
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-sec-cred.png' });
    
    // Look for Create access key
    const createKeyBtn = page.locator('button:has-text("Create access key"), a:has-text("Create access key")');
    console.log('Create key button count:', await createKeyBtn.count());
    
    if (await createKeyBtn.count() > 0) {
      await createKeyBtn.first().click();
      console.log('Clicked Create access key');
      await page.waitForTimeout(5000);
      
      await page.screenshot({ path: '/home/z/my-project/download/aws-create-key.png' });
      
      // Check for warning/confirmation page
      const confirmCreateBtn = page.locator('button:has-text("Create access key"), button:has-text("Confirm")');
      if (await confirmCreateBtn.count() > 0) {
        // Check for "I understand" checkbox first
        const understandCheck = page.locator('input[type="checkbox"]');
        const allChecks = await understandCheck.all();
        for (const chk of allChecks) {
          if (!await chk.isChecked()) {
            await chk.check().catch(() => {});
          }
        }
        await confirmCreateBtn.first().click();
        console.log('Confirmed access key creation');
        await page.waitForTimeout(5000);
      }
      
      await page.screenshot({ path: '/home/z/my-project/download/aws-key-created.png' });
      
      // Extract key values from the page
      const keyText = await page.textContent('body').catch(() => '');
      
      // Look for AKIA pattern (Access Key ID always starts with AKIA)
      const akiaMatch = keyText.match(/AKIA[A-Z0-9]{16}/);
      
      // Look for Secret Access Key - it's typically 40 chars, base64
      // Try to get it from input fields or displayed text
      const secretInputs = await page.locator('input[type="text"], input[type="password"], [class*="secret"], [class*="key"]').all();
      
      let accessKeyId = '';
      let secretAccessKey = '';
      
      // Try getting values from the page
      const keyData = await page.evaluate(() => {
        const results = {};
        // Look for access key ID
        document.querySelectorAll('span, div, p, code, input').forEach(el => {
          const text = el.textContent || el.value || '';
          if (text.match(/^AKIA[A-Z0-9]{16}$/)) {
            results.accessKeyId = text;
          }
          // Secret keys are typically 40 chars with /+= chars
          if (text.match(/^[A-Za-z0-9/+=]{40}$/) && !text.startsWith('AKIA')) {
            results.secretAccessKey = text;
          }
        });
        return results;
      });
      
      console.log('Key data found:', JSON.stringify(keyData));
      
      if (akiaMatch) {
        accessKeyId = akiaMatch[0];
        console.log('ACCESS KEY ID:', accessKeyId);
      }
      
      // Also check for a "Show" button to reveal the secret key
      const showBtn = page.locator('button:has-text("Show"), a:has-text("Show")');
      if (await showBtn.count() > 0) {
        await showBtn.first().click();
        await page.waitForTimeout(2000);
      }
      
      // Try to copy or get the secret key
      const copyBtn = page.locator('button:has-text("Copy"), a:has-text("Copy")');
      
      // Get all text on the page and search for the keys
      const fullText = await page.evaluate(() => document.body.innerText);
      console.log('Key page text (first 1000):', fullText.substring(0, 1000));
      
      // Save credentials if found
      if (keyData.accessKeyId) {
        fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keyData, null, 2));
        console.log('Keys saved to aws-keys.json');
      }
    } else {
      console.log('No Create access key button found');
      // Check page state
      const pageText = await page.evaluate(() => document.body.innerText);
      console.log('Page text (first 500):', pageText.substring(0, 500));
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-keys2-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
