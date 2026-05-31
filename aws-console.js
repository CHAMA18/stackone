const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Step 1: Login
    await page.goto('https://103658463143.signin.aws.amazon.com/console', { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('#account', '103658463143');
    await page.fill('#username', 'StackOne');
    await page.fill('#password', 'StackOne!2024#Prod');
    
    const [response] = await Promise.all([
      page.waitForNavigation({ timeout: 30000 }).catch(() => {}),
      page.click('#signin_button')
    ]);
    await page.waitForTimeout(8000);
    
    console.log('After login URL:', page.url());
    
    // Check if password reset is needed again
    if (page.url().includes('changepassword')) {
      console.log('Password reset required again...');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const oldPwField = page.locator('input[name="oldPassword"]');
      if (await oldPwField.count() > 0) {
        await oldPwField.fill('StackOne!2024#Prod');
        const nextPw = 'StackOne!2024#Deploy';
        await page.locator('input[name="newPassword"]').fill(nextPw);
        await page.locator('input[name="confirmNewPassword"]').fill(nextPw);
        await page.locator('button:has-text("Confirm Password Change")').click();
        await page.waitForTimeout(10000);
        console.log('After second reset URL:', page.url());
        
        // Save new password info
        require('fs').writeFileSync('/home/z/my-project/download/aws-credentials.txt', 
          `Account: 103658463143\nUsername: StackOne\nPassword: ${nextPw}\n`);
        console.log('NEW PASSWORD SAVED:', nextPw);
      }
    }
    
    // Save auth state
    await context.storageState({ path: '/home/z/my-project/download/aws-auth.json' });
    console.log('Auth state saved');
    
    // Step 2: Go to IAM to create access keys
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(5000);
    
    console.log('IAM URL:', page.url());
    const bodyText = await page.textContent('body').catch(() => '');
    console.log('IAM page preview:', bodyText.substring(0, 500));
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-iam.png' });
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-console-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
