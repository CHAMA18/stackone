const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto('https://103658463143.signin.aws.amazon.com/console', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Fill credentials
    await page.fill('#account', '103658463143');
    await page.fill('#username', 'StackOne');
    await page.fill('#password', 'StackOne2024');
    
    // Get form action and all hidden inputs
    const formInfo = await page.evaluate(() => {
      const form = document.querySelector('form');
      const action = form?.action;
      const method = form?.method;
      const hiddens = Array.from(form?.querySelectorAll('input[type="hidden"]') || []).map(i => ({ name: i.name, value: i.value }));
      return { action, method, hiddens };
    });
    console.log('Form info:', JSON.stringify(formInfo, null, 2));
    
    // Try the actual sign-in button click with proper wait
    const [response] = await Promise.all([
      page.waitForNavigation({ timeout: 30000 }).catch(e => console.log('Nav error:', e.message)),
      page.click('#signin_button')
    ]);
    
    console.log('After click URL:', page.url());
    if (response) console.log('Response status:', response.status());
    
    await page.waitForTimeout(5000);
    console.log('Final URL:', page.url());
    
    // Check for errors
    const bodyText = await page.textContent('body').catch(() => '');
    if (bodyText.includes('Authentication failed')) {
      console.log('AUTH FAILED');
    } else if (page.url().includes('console.aws.amazon.com') && !page.url().includes('signin')) {
      console.log('LOGIN SUCCESS!');
      await context.storageState({ path: '/home/z/my-project/download/aws-auth.json' });
    } else if (page.url().includes('mfa')) {
      console.log('MFA REQUIRED');
    } else {
      console.log('UNKNOWN STATE');
      console.log('Body preview:', bodyText.substring(0, 500));
    }
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-result.png' });
    
  } catch (e) {
    console.error('Script error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-error.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
