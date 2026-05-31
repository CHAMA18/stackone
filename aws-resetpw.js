const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Login first
    await page.goto('https://103658463143.signin.aws.amazon.com/console', { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('#account', '103658463143');
    await page.fill('#username', 'StackOne');
    await page.fill('#password', 'StackOne2024');
    
    // Click sign in and wait for redirect
    await page.click('#signin_button');
    await page.waitForTimeout(5000);
    
    console.log('Current URL:', page.url());
    
    // We should be on the password reset page
    // Fill old password
    await page.fill('#old_password', 'StackOne2024');
    
    // Set new password (keeping same for simplicity, or set a new one)
    const newPassword = 'StackOne@2024!';
    await page.fill('#new_password', newPassword);
    await page.fill('#confirm_password', newPassword);
    
    console.log('Password fields filled');
    
    // Click confirm
    const [response] = await Promise.all([
      page.waitForNavigation({ timeout: 30000 }).catch(e => console.log('Nav error:', e.message)),
      page.click('button[type="submit"], #confirm_button, input[type="submit"]').catch(() => {
        // Try finding by text
        return page.click('text/Confirm Password Change').catch(() => 
          page.click('text/Change').catch(() => null)
        );
      })
    ]);
    
    await page.waitForTimeout(8000);
    console.log('After password change URL:', page.url());
    
    // Check if we're now on the console
    const bodyText = await page.textContent('body').catch(() => '');
    console.log('Body preview:', bodyText.substring(0, 500));
    
    if (page.url().includes('console.aws.amazon.com') && !page.url().includes('signin')) {
      console.log('LOGIN SUCCESS - now on AWS Console!');
      await context.storageState({ path: '/home/z/my-project/download/aws-auth.json' });
    } else if (bodyText.includes('Password change successful')) {
      console.log('PASSWORD CHANGED - need to re-login');
    }
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-after-reset.png' });
    
  } catch (e) {
    console.error('Script error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-error2.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
