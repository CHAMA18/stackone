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
    await page.fill('#password', 'StackOne@2024!');
    await page.click('#signin_button');
    await page.waitForTimeout(10000);
    console.log('1. Logged in');
    
    // Go to IAM users list
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(8000);
    
    // Handle cookie
    await page.evaluate(() => {
      const btn = document.querySelector('[data-id="awsccc-cb-btn-accept"]');
      if (btn) btn.click();
    }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Screenshot the users list
    await page.screenshot({ path: '/home/z/my-project/download/aws-users-list.png' });
    
    // Get the page content
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('2. Users list (first 800):', pageText.substring(0, 800));
    
    // Find all links that might be user links
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a')).map(a => ({
        href: a.href?.substring(0, 100),
        text: a.textContent?.trim()?.substring(0, 50)
      })).filter(l => l.text.length > 0 && l.text.length < 30);
    });
    console.log('3. Links:', JSON.stringify(links.filter(l => l.text.includes('Stack') || l.text.includes('stack')), null, 2));
    
    // Click on the StackOne user link properly
    const stackOneLink = page.locator('a[href*="StackOne"], a[href*="stackone"]').first();
    if (await stackOneLink.count() > 0) {
      await stackOneLink.click().catch(() => {});
      await page.waitForTimeout(5000);
      console.log('4. Clicked StackOne user via href');
    } else {
      // Try clicking the user name in the table
      const userCell = page.locator('td a, td button').first();
      if (await userCell.count() > 0) {
        const cellText = await userCell.textContent().catch(() => '');
        console.log('4. First user cell:', cellText);
        await userCell.click().catch(() => {});
        await page.waitForTimeout(5000);
      }
    }
    
    console.log('5. Current URL:', page.url());
    await page.screenshot({ path: '/home/z/my-project/download/aws-user-detail.png' });
    
    const detailText = await page.evaluate(() => document.body.innerText);
    console.log('6. User detail (first 800):', detailText.substring(0, 800));
    
    // Click Security credentials tab
    const allTabs = await page.locator('[role="tab"]').all();
    for (const tab of allTabs) {
      const text = await tab.textContent().catch(() => '');
      console.log('Tab found:', text?.trim()?.substring(0, 50));
      if (text?.includes('Security credentials')) {
        await tab.click().catch(() => {});
        console.log('7. Clicked Security credentials');
        await page.waitForTimeout(3000);
        break;
      }
    }
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-sec-cred-tab.png' });
    
    const secText = await page.evaluate(() => document.body.innerText);
    console.log('8. Security credentials section (first 1000):', secText.substring(0, 1000));
    
    // Now look for Create access key
    const allBtns = await page.locator('button, a').all();
    for (const btn of allBtns) {
      const text = await btn.textContent().catch(() => '');
      if (text.toLowerCase().includes('access key') || text.toLowerCase().includes('create')) {
        console.log('9. Relevant button:', text.trim().substring(0, 80));
      }
    }
    
    const createKeyBtn = page.locator('button:has-text("Create access key")');
    console.log('10. Create key button count:', await createKeyBtn.count());
    
    if (await createKeyBtn.count() > 0) {
      console.log('Found it! Clicking...');
      await createKeyBtn.first().click({ force: true });
      await page.waitForTimeout(5000);
      console.log('11. After click URL:', page.url());
      
      // Continue the wizard...
      // Select CLI
      const cliRadio = page.locator('[value="cli"], [data-testid*="cli"]').first();
      if (await cliRadio.count() > 0) {
        await cliRadio.click().catch(() => {});
      } else {
        // Try clicking the text label
        const cliText = page.locator('text=Command Line Interface (CLI)').first();
        if (await cliText.count() > 0) {
          await cliText.click().catch(() => {});
        }
      }
      await page.waitForTimeout(1000);
      
      // Click Next
      await page.locator('button:has-text("Next")').first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(3000);
      
      // Skip description - Next again
      await page.locator('button:has-text("Next")').first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(3000);
      
      // Create the key
      await page.locator('button:has-text("Create access key")').first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(8000);
      
      await page.screenshot({ path: '/home/z/my-project/download/aws-key-created2.png' });
      
      // Extract keys
      const keyPageText = await page.evaluate(() => document.body.innerText);
      console.log('12. Key page (first 1500):', keyPageText.substring(0, 1500));
      
      // Show secret
      const showBtns = await page.locator('button:has-text("Show")').all();
      for (const b of showBtns) {
        await b.click({ force: true }).catch(() => {});
      }
      await page.waitForTimeout(2000);
      
      // Get all input values
      const inputs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('input')).map(i => ({
          value: i.value, type: i.type, id: i.id, name: i.name,
          placeholder: i.placeholder, 'aria-label': i.getAttribute('aria-label')
        })).filter(i => i.value && i.value.length > 5);
      });
      console.log('13. Input values:', JSON.stringify(inputs, null, 2));
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-keys6-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
