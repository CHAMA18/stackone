const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Login
    await page.goto('https://103658463143.signin.aws.amazon.com/console', { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('#account', '103658463143');
    await page.fill('#username', 'StackOne');
    await page.fill('#password', 'StackOne2024');
    await page.click('#signin_button');
    await page.waitForTimeout(5000);
    
    // Fill password fields with strong password
    await page.fill('#password', 'StackOne2024');  // old password
    await page.fill('#newPassword', 'StackOne!2024#Secure');
    await page.fill('#confirmNewPassword', 'StackOne!2024#Secure');
    
    // Check for any validation errors before submitting
    const errorsBefore = await page.evaluate(() => {
      const errs = document.querySelectorAll('[class*="error"], [class*="alert"], [class*="warning"], [role="alert"]');
      return Array.from(errs).map(e => e.textContent?.trim()?.substring(0, 200));
    });
    console.log('Errors before submit:', errorsBefore);
    
    // Click the specific "Confirm Password Change" button
    await page.locator('button:has-text("Confirm Password Change")').click();
    await page.waitForTimeout(10000);
    
    console.log('URL after confirm:', page.url());
    
    // Check for errors after submitting
    const bodyText = await page.textContent('body').catch(() => '');
    console.log('Body preview:', bodyText.substring(0, 800));
    
    // Check for validation errors
    const errorsAfter = await page.evaluate(() => {
      const errs = document.querySelectorAll('[class*="error"], [class*="alert"], [class*="warning"], [role="alert"], .awsui-alert');
      return Array.from(errs).map(e => ({ text: e.textContent?.trim()?.substring(0, 300), class: e.className?.substring(0, 100) }));
    });
    console.log('Errors after submit:', JSON.stringify(errorsAfter, null, 2));
    
    if (page.url().includes('console.aws.amazon.com') && !page.url().includes('signin') && !page.url().includes('clm')) {
      console.log('SUCCESS - logged into AWS Console!');
      await context.storageState({ path: '/home/z/my-project/download/aws-auth.json' });
    }
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-reset-final.png' });
    
  } catch (e) {
    console.error('Script error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-error4.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
