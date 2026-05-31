const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true, downloadsPath: '/home/z/my-project/download' });
  const context = await browser.newContext({ acceptDownloads: true });
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
    
    // Go to IAM user page (not security_credentials subpage)
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/details/StackOne', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(10000);
    
    // Handle cookie
    await page.evaluate(() => {
      const btn = document.querySelector('[data-id="awsccc-cb-btn-accept"]');
      if (btn) btn.click();
    }).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Get the full page text to understand current state
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('2. Page text (first 1000):', pageText.substring(0, 1000));
    
    // Look for "Create access key" in the text
    if (pageText.includes('Create access key')) {
      console.log('3. Found "Create access key" on page');
      
      // Find the button
      const allButtons = await page.locator('button, a').all();
      for (const btn of allButtons) {
        const text = await btn.textContent().catch(() => '');
        const isVisible = await btn.isVisible().catch(() => false);
        if (text.includes('Create access key') && isVisible) {
          console.log('4. Found visible Create access key button');
          await btn.click({ force: true });
          await page.waitForTimeout(5000);
          break;
        }
      }
      
      // Select "Other" tile
      const tiles = await page.locator('[class*="tile"], [class*="Tile"]').all();
      for (const tile of tiles) {
        const text = await tile.textContent().catch(() => '');
        if (text.includes('Other') && text.length < 200) {
          await tile.click();
          console.log('5. Selected Other tile');
          break;
        }
      }
      await page.waitForTimeout(2000);
      
      // Check checkboxes
      const checkboxes = await page.locator('input[type="checkbox"]').all();
      for (const chk of checkboxes) {
        if (!await chk.isChecked()) {
          await chk.check({ force: true }).catch(() => {});
        }
      }
      await page.waitForTimeout(1000);
      
      // Find and click Create access key button
      const visibleCreateBtns = [];
      const allBtns = await page.locator('button').all();
      for (const btn of allBtns) {
        const text = await btn.textContent().catch(() => '');
        const isVisible = await btn.isVisible().catch(() => false);
        const isEnabled = await btn.isEnabled().catch(() => false);
        if (text.includes('Create access key') && isVisible && isEnabled) {
          visibleCreateBtns.push(btn);
          console.log(`6. Visible create button: "${text.trim().substring(0, 40)}"`);
        }
      }
      
      if (visibleCreateBtns.length > 0) {
        await visibleCreateBtns[0].click({ force: true });
        console.log('7. Clicked create');
        await page.waitForTimeout(10000);
        
        await page.screenshot({ path: '/home/z/my-project/download/aws-final-keys.png' });
        
        // Try CSV download
        const csvBtn = page.locator('button:has-text("Download .csv"), a:has-text("Download .csv")');
        if (await csvBtn.count() > 0) {
          const [download] = await Promise.all([
            page.waitForEvent('download', { timeout: 15000 }).catch(() => null),
            csvBtn.first().click({ force: true })
          ]);
          if (download) {
            await download.saveAs('/home/z/my-project/download/keys.csv');
            console.log('8. CSV:', fs.readFileSync('/home/z/my-project/download/keys.csv', 'utf8'));
          }
        }
        
        // Show secret and extract from page
        const showBtns = await page.locator('button:has-text("Show")').all();
        for (const b of showBtns) { await b.click({ force: true }).catch(() => {}); }
        await page.waitForTimeout(3000);
        
        const finalText = await page.evaluate(() => document.body.innerText);
        const akia = finalText.match(/AKIA[A-Z0-9]{16}/);
        console.log('9. AKIA:', akia?.[0]);
        
        // Find 40-char base64 strings
        const secrets = finalText.match(/[A-Za-z0-9/+=]{40}/g)?.filter(s => !s.startsWith('AKIA'));
        console.log('10. Secret candidates:', secrets);
      }
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
