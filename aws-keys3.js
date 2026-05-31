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
    console.log('1. Logged in:', page.url().substring(0, 80));
    
    // Navigate to IAM user security credentials with a direct approach
    // Use the security credentials URL which is more direct
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/StackOne$security_credentials', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(8000);
    console.log('2. IAM URL:', page.url().substring(0, 100));
    
    // Handle cookie consent via JavaScript (force click)
    await page.evaluate(() => {
      // Try clicking accept button via JS
      const btn = document.querySelector('[data-id="awsccc-cb-btn-accept"]');
      if (btn) btn.click();
      // Also try the cookie banner
      const banner = document.querySelector('#awsccc-cb-content');
      if (banner) banner.style.display = 'none';
    }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Also try iframe-based cookie consent
    const frames = page.frames();
    for (const frame of frames) {
      try {
        const acceptBtn = frame.locator('button:has-text("Accept"), button:has-text("Decline")');
        if (await acceptBtn.count() > 0) {
          await acceptBtn.first().click({ force: true });
          console.log('Clicked cookie consent in frame');
        }
      } catch(e) {}
    }
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-iam3.png' });
    
    // Get page content
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('3. Page text (first 600):', pageText.substring(0, 600));
    
    // Check if we need to re-authenticate for IAM
    if (pageText.includes('Sign in') || pageText.includes('IAM user sign in')) {
      console.log('Need to re-authenticate for IAM');
      // Fill credentials on this page too
      const accountInput = page.locator('#account, input[name="account"]');
      if (await accountInput.count() > 0) {
        await page.fill('#account', '103658463143');
        await page.fill('#username', 'StackOne');
        await page.fill('#password', 'StackOne@2024!');
        await page.click('#signin_button');
        await page.waitForTimeout(10000);
        console.log('Re-authenticated for IAM');
      }
    }
    
    // Look for the security credentials section or create access key
    const createKeyLink = page.locator('a:has-text("Create access key"), button:has-text("Create access key")');
    console.log('4. Create key button count:', await createKeyLink.count());
    
    // Try clicking directly on the user's security credentials section
    // Often the page has tabs - let's find and click the right one
    const tabs = await page.locator('[role="tab"], .awsui-tab, a[role="tab"]').all();
    for (const tab of tabs) {
      const text = await tab.textContent().catch(() => '');
      console.log('Tab:', text?.trim()?.substring(0, 50));
      if (text?.includes('Security credentials') || text?.includes('security')) {
        await tab.click().catch(() => {});
        console.log('Clicked Security credentials tab');
        break;
      }
    }
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/home/z/my-project/download/aws-iam4.png' });
    
    // Now look for Create access key
    const allButtons = await page.locator('button, a').all();
    for (const btn of allButtons) {
      const text = await btn.textContent().catch(() => '');
      if (text.toLowerCase().includes('access key') || text.toLowerCase().includes('create key')) {
        console.log('Found relevant button:', text.trim().substring(0, 80));
      }
    }
    
    // Try direct approach - use AWS CLI-style access via Security Token Service
    // Actually, let's just go to the security credentials page for the current user
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#security_credential', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(8000);
    
    // Handle cookie consent
    await page.evaluate(() => {
      const btn = document.querySelector('[data-id="awsccc-cb-btn-accept"]');
      if (btn) btn.click();
    }).catch(() => {});
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-sec-cred2.png' });
    
    const secPageText = await page.evaluate(() => document.body.innerText);
    console.log('5. Security credentials text (first 600):', secPageText.substring(0, 600));
    
    // Create access key
    const createKeyBtn2 = page.locator('button:has-text("Create access key")');
    console.log('6. Create key button count:', await createKeyBtn2.count());
    
    if (await createKeyBtn2.count() > 0) {
      await createKeyBtn2.first().click({ force: true });
      await page.waitForTimeout(5000);
      console.log('Clicked Create access key');
      
      // Handle any confirmation dialog or warning
      // Check for "I understand" checkbox
      const checkboxes = await page.locator('input[type="checkbox"]').all();
      for (const chk of checkboxes) {
        if (!await chk.isChecked()) {
          await chk.check({ force: true }).catch(() => {});
        }
      }
      
      // Click Create access key on the confirmation dialog
      const confirmBtn = page.locator('button:has-text("Create access key")');
      if (await confirmBtn.count() > 0) {
        await confirmBtn.first().click({ force: true });
        await page.waitForTimeout(5000);
        console.log('Confirmed key creation');
      }
      
      await page.screenshot({ path: '/home/z/my-project/download/aws-key-done.png' });
      
      // Extract the keys
      const keyPageText = await page.evaluate(() => document.body.innerText);
      console.log('7. Key page text (first 1000):', keyPageText.substring(0, 1000));
      
      // Try to extract AKIA key
      const akiaMatch = keyPageText.match(/AKIA[A-Z0-9]{16}/);
      if (akiaMatch) {
        console.log('ACCESS KEY ID:', akiaMatch[0]);
      }
      
      // Click Show on secret key if available
      const showSecretBtn = page.locator('button:has-text("Show"), a:has-text("Show")');
      if (await showSecretBtn.count() > 0) {
        await showSecretBtn.first().click({ force: true });
        await page.waitForTimeout(2000);
      }
      
      // Get the final page with all keys visible
      const finalText = await page.evaluate(() => {
        const results = {};
        const allInputs = document.querySelectorAll('input');
        allInputs.forEach(input => {
          if (input.value?.startsWith('AKIA')) results.accessKeyId = input.value;
          if (input.value?.length === 40 && !input.value.startsWith('AKIA')) results.secretAccessKey = input.value;
        });
        // Also check for displayed text
        const allText = document.body.innerText;
        const akMatch = allText.match(/AKIA[A-Z0-9]{16}/);
        if (akMatch) results.accessKeyId = akMatch[0];
        return results;
      });
      
      console.log('8. Extracted key data:', JSON.stringify(finalText));
      
      if (finalText.accessKeyId || akiaMatch) {
        const keyData = {
          accessKeyId: finalText.accessKeyId || akiaMatch?.[0],
          secretAccessKey: finalText.secretAccessKey || ''
        };
        fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keyData, null, 2));
        console.log('Keys saved!');
      }
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-keys3-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
