const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const passwords = ['StackOne!2024#Prod', 'StackOne!2024#Deploy', 'StackOne@2024!'];
  
  try {
    // Login
    await page.goto('https://103658463143.signin.aws.amazon.com/console', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Try each password
    let loggedIn = false;
    let workingPassword = '';
    
    for (const pw of passwords) {
      await page.goto('https://103658463143.signin.aws.amazon.com/console', { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      
      await page.fill('#account', '103658463143');
      await page.fill('#username', 'StackOne');
      await page.fill('#password', pw);
      await page.click('#signin_button');
      await page.waitForTimeout(10000);
      
      const url = page.url();
      const body = await page.textContent('body').catch(() => '');
      
      if (url.includes('changepassword')) {
        console.log(`Password "${pw}" works but needs reset`);
        workingPassword = pw;
        
        // Reset password
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        const oldPw = page.locator('input[name="oldPassword"]');
        if (await oldPw.count() > 0) {
          const newPassword = 'StackOne!Secure2024#AWS';
          await oldPw.fill(pw);
          await page.locator('input[name="newPassword"]').fill(newPassword);
          await page.locator('input[name="confirmNewPassword"]').fill(newPassword);
          await page.locator('button:has-text("Confirm Password Change")').click();
          await page.waitForTimeout(10000);
          
          console.log('After reset URL:', page.url());
          workingPassword = newPassword;
          
          // Save the new credentials
          fs.writeFileSync('/home/z/my-project/download/aws-credentials.txt', 
            `AWS Account: 103658463143\nIAM Username: StackOne\nPassword: ${newPassword}\n`);
          console.log('NEW CREDENTIALS SAVED');
          
          // If we got redirected to console, we're logged in
          if (page.url().includes('console.aws.amazon.com') && !page.url().includes('signin')) {
            loggedIn = true;
          }
        }
        break;
      } else if (url.includes('console.aws.amazon.com') && !url.includes('signin')) {
        console.log(`Login success with password: ${pw}`);
        loggedIn = true;
        workingPassword = pw;
        break;
      } else if (body.includes('Authentication failed')) {
        console.log(`Password "${pw}" failed`);
        continue;
      } else {
        console.log(`Unknown state with password "${pw}": ${url}`);
      }
    }
    
    if (!loggedIn) {
      console.log('Could not get past login. Trying direct console access...');
      // Try going to the console directly - the session might be valid
      await page.goto('https://console.aws.amazon.com/console/home', { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(5000);
      console.log('Console URL:', page.url());
    }
    
    // Save session
    await context.storageState({ path: '/home/z/my-project/download/aws-auth.json' });
    
    // Now navigate to IAM to create access keys
    console.log('Navigating to IAM...');
    await page.goto('https://console.aws.amazon.com/iam/home#/users', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(10000);
    console.log('IAM URL:', page.url());
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-iam-page.png' });
    
    const bodyText = await page.textContent('body').catch(() => '');
    if (bodyText.includes('Authentication failed') || bodyText.includes('Sign in')) {
      console.log('Session expired, need to re-login on this domain');
    } else {
      console.log('IAM page loaded successfully');
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-deploy-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
