const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  try {
    await page.goto('https://103658463143.signin.aws.amazon.com/console', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page URL:', page.url());
    
    // Try different selectors
    const selectors = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      return Array.from(inputs).map(i => ({ id: i.id, name: i.name, type: i.type, value: i.value }));
    });
    console.log('Inputs:', JSON.stringify(selectors, null, 2));
    
    // Fill using various methods
    await page.waitForSelector('input[name="username"], #username', { timeout: 10000 });
    
    // Clear and type each field
    await page.fill('input[name="account"], #account', '103658463143');
    await page.fill('input[name="username"], #username', 'StackOne');
    await page.fill('input[name="password"], #password', 'StackOne2024');
    
    console.log('Credentials filled');
    
    // Click the sign in button
    const btn = await page.$('button[type="submit"], #signin_button, input[type="submit"]');
    if (btn) {
      await btn.click();
    } else {
      console.log('No submit button found, trying form submit');
      await page.evaluate(() => document.querySelector('form')?.submit());
    }
    
    await page.waitForTimeout(15000);
    console.log('After login URL:', page.url());
    
    // Check for errors
    const pageContent = await page.content();
    const hasError = pageContent.includes('Authentication failed') || pageContent.includes('error');
    console.log('Has error:', hasError);
    
    // Get any visible error messages
    const errorEl = await page.$('#error_message, .error-message, [class*="error"]');
    if (errorEl) {
      console.log('Error text:', await errorEl.textContent());
    }
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-playwright.png' });
    
    // If redirected, save cookies
    if (!page.url().includes('signin.aws')) {
      console.log('LOGIN SUCCESS! Saving state...');
      await context.storageState({ path: '/home/z/my-project/download/aws-auth.json' });
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-error.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
