const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto('https://103658463143.signin.aws.amazon.com/console', { waitUntil: 'networkidle', timeout: 30000 });
    await page.fill('#account', '103658463143');
    await page.fill('#username', 'StackOne');
    await page.fill('#password', 'StackOne@2024!');
    
    const [response] = await Promise.all([
      page.waitForNavigation({ timeout: 30000 }).catch(e => console.log('Nav timeout')),
      page.click('#signin_button')
    ]);
    
    await page.waitForTimeout(10000);
    console.log('URL after login:', page.url());
    
    // Check for password reset or MFA
    const bodyText = await page.textContent('body').catch(() => '');
    
    if (page.url().includes('clm') && page.url().includes('changepassword')) {
      console.log('PASSWORD RESET REQUIRED AGAIN');
      // Fill the reset form
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      const fields = await page.evaluate(() => {
        const els = document.querySelectorAll('input');
        return Array.from(els).map(i => ({ id: i.id, name: i.name, type: i.type }));
      });
      console.log('Fields:', JSON.stringify(fields, null, 2));
      
      // Fill old password (the one we just used)
      const oldPwField = page.locator('input[name="oldPassword"]');
      const newPwField = page.locator('input[name="newPassword"]');
      const confirmPwField = page.locator('input[name="confirmNewPassword"]');
      
      if (await oldPwField.count() > 0) {
        await oldPwField.fill('StackOne@2024!');
        await newPwField.fill('StackOne!2024#Prod');
        await confirmPwField.fill('StackOne!2024#Prod');
        console.log('Password reset form filled');
        
        await page.locator('button:has-text("Confirm Password Change")').click();
        await page.waitForTimeout(10000);
        console.log('After reset URL:', page.url());
      }
    } else if (page.url().includes('mfa')) {
      console.log('MFA REQUIRED');
    } else if (page.url().includes('console.aws.amazon.com') && !page.url().includes('signin')) {
      console.log('LOGIN SUCCESS!');
      await context.storageState({ path: '/home/z/my-project/download/aws-auth.json' });
    } else if (bodyText.includes('Authentication failed')) {
      console.log('AUTH FAILED with new password too');
    } else {
      console.log('UNKNOWN STATE');
      console.log('Body:', bodyText.substring(0, 500));
    }
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-new-pw.png' });
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-err5.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
