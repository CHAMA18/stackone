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
    
    // List all inputs on the password reset page
    const inputs = await page.evaluate(() => {
      const els = document.querySelectorAll('input, button');
      return Array.from(els).map(i => ({ tag: i.tagName, id: i.id, name: i.name, type: i.type, placeholder: i.placeholder, text: i.textContent?.trim()?.substring(0, 50) }));
    });
    console.log('Form elements:', JSON.stringify(inputs, null, 2));
    
    // Try various selectors for password fields
    const selectors = [
      '#old_password', '#new_password', '#confirm_password',
      'input[name="oldPassword"]', 'input[name="newPassword"]', 'input[name="confirmPassword"]',
      'input[type="password"]'
    ];
    
    for (const sel of selectors) {
      const count = await page.locator(sel).count();
      if (count > 0) console.log(`Found: ${sel} (${count})`);
    }
    
    // Fill password fields using type attribute
    const pwFields = await page.locator('input[type="password"]').all();
    console.log(`Found ${pwFields.length} password fields`);
    
    if (pwFields.length >= 3) {
      await pwFields[0].fill('StackOne2024');
      const newPassword = 'StackOne@2024!';
      await pwFields[1].fill(newPassword);
      await pwFields[2].fill(newPassword);
      console.log('All 3 password fields filled');
    } else if (pwFields.length >= 1) {
      // Maybe only 1 password field visible, use labels
      await page.screenshot({ path: '/home/z/my-project/download/aws-reset-debug.png' });
      console.log('Need to investigate - only 1 password field found');
    }
    
    // Find and click the submit/confirm button
    const buttons = await page.locator('button, input[type="submit"]').all();
    for (const btn of buttons) {
      const text = await btn.textContent().catch(() => '');
      const type = await btn.getAttribute('type').catch(() => '');
      console.log(`Button: text="${text?.trim()}" type="${type}"`);
    }
    
    // Click confirm button
    const confirmBtn = page.locator('button:has-text("Confirm"), button:has-text("Change"), input[type="submit"]');
    if (await confirmBtn.count() > 0) {
      await confirmBtn.first().click();
      await page.waitForTimeout(10000);
      console.log('After confirm URL:', page.url());
    }
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-reset-result.png' });
    
  } catch (e) {
    console.error('Script error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-error3.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
