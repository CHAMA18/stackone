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
    await page.waitForTimeout(8000);
    
    console.log('URL:', page.url());
    
    // Wait for the password reset page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Use name selectors which we confirmed exist
    const oldPw = page.locator('input[name="oldPassword"]');
    const newPw = page.locator('input[name="newPassword"]');
    const confirmPw = page.locator('input[name="confirmNewPassword"]');
    
    console.log('Old pw count:', await oldPw.count());
    console.log('New pw count:', await newPw.count());
    console.log('Confirm pw count:', await confirmPw.count());
    
    if (await oldPw.count() > 0) {
      await oldPw.fill('StackOne2024');
      console.log('Old password filled');
    }
    
    if (await newPw.count() > 0) {
      await newPw.fill('StackOne!2024#Secure');
      console.log('New password filled');
    }
    
    if (await confirmPw.count() > 0) {
      await confirmPw.fill('StackOne!2024#Secure');
      console.log('Confirm password filled');
    }
    
    // Click the confirm button
    const confirmBtn = page.locator('button:has-text("Confirm Password Change")');
    if (await confirmBtn.count() > 0) {
      await confirmBtn.click();
      console.log('Confirm button clicked');
    } else {
      console.log('Confirm button NOT found');
      // List all buttons
      const btns = await page.locator('button').all();
      for (const b of btns) {
        console.log('Button:', (await b.textContent()).trim().substring(0, 50));
      }
    }
    
    await page.waitForTimeout(10000);
    console.log('Final URL:', page.url());
    
    const bodyText = await page.textContent('body').catch(() => '');
    if (bodyText.includes('console') || bodyText.includes('AWS')) {
      console.log('Body preview:', bodyText.substring(0, 500));
    }
    
    // Check for error alerts
    const alerts = await page.locator('[class*="alert"], [role="alert"]').all();
    for (const a of alerts) {
      const text = await a.textContent().catch(() => '');
      if (text.trim()) console.log('Alert:', text.trim().substring(0, 300));
    }
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-reset4.png' });
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-err4.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
