const { chromium } = require('playwright');
const fs = require('fs');

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
    
    // Go to user security credentials page
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/details/StackOne$security_credentials', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(8000);
    
    await page.evaluate(() => {
      const btn = document.querySelector('[data-id="awsccc-cb-btn-accept"]');
      if (btn) btn.click();
    }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Click Security credentials tab
    const secTab = page.locator('[role="tab"]:has-text("Security credentials")');
    if (await secTab.count() > 0) {
      await secTab.click().catch(() => {});
      await page.waitForTimeout(3000);
    }
    
    // Now navigate to create-access-key
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/details/StackOne/create-access-key', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(10000);
    
    await page.evaluate(() => {
      const btn = document.querySelector('[data-id="awsccc-cb-btn-accept"]');
      if (btn) btn.click();
    }).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Select "Other" tile
    const tiles = await page.locator('[class*="tile"], [class*="Tile"]').all();
    console.log('2. Tiles:', tiles.length);
    if (tiles.length > 0) {
      // Find the "Other" tile specifically
      for (let i = 0; i < tiles.length; i++) {
        const text = await tiles[i].textContent().catch(() => '');
        if (text.includes('Other')) {
          await tiles[i].click();
          console.log('3. Selected "Other" tile');
          break;
        }
      }
    }
    await page.waitForTimeout(2000);
    
    // Now click Create access key (it should be visible at the bottom now)
    const createKeyBtn = page.locator('button:has-text("Create access key")');
    console.log('4. Create key button count:', await createKeyBtn.count());
    
    if (await createKeyBtn.count() > 0) {
      await createKeyBtn.first().click({ force: true });
      await page.waitForTimeout(10000);
      console.log('5. Key creation triggered');
      
      // Click Show immediately
      const showBtn = page.locator('button:has-text("Show")');
      if (await showBtn.count() > 0) {
        await showBtn.first().click({ force: true });
        await page.waitForTimeout(3000);
        console.log('6. Clicked Show');
      }
      
      // Download CSV file
      const csvBtn = page.locator('button:has-text("Download .csv file"), a:has-text("Download .csv file"), button:has-text("csv")');
      if (await csvBtn.count() > 0) {
        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 15000 }).catch(() => null),
          csvBtn.first().click({ force: true })
        ]);
        
        if (download) {
          const path = '/home/z/my-project/download/access-keys.csv';
          await download.saveAs(path);
          const csvContent = fs.readFileSync(path, 'utf8');
          console.log('7. CSV CONTENT:', csvContent);
        }
      }
      
      // Get full page text
      const text = await page.evaluate(() => document.body.innerText);
      console.log('8. Page (first 1500):', text.substring(0, 1500));
      
      // Extract AKIA
      const akia = text.match(/AKIA[A-Z0-9]{16}/);
      if (akia) console.log('9. ACCESS KEY ID:', akia[0]);
      
      // Find secret in text nodes after Show
      const secrets = await page.evaluate(() => {
        const results = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const t = walker.currentNode.textContent.trim();
          if (t.length >= 38 && t.length <= 42 && /^[A-Za-z0-9/+=]+$/.test(t) && !t.startsWith('AKIA')) {
            results.push(t);
          }
        }
        return results;
      });
      console.log('10. Secret candidates:', secrets);
      
      // Also try getting from value attributes
      const inputVals = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('input, textarea, [contenteditable]')).map(el => {
          return { tag: el.tagName, value: el.value || el.textContent, type: el.type, id: el.id };
        }).filter(el => el.value && el.value.length > 15);
      });
      console.log('11. Input values:', JSON.stringify(inputVals, null, 2));
      
      await page.screenshot({ path: '/home/z/my-project/download/aws-keys-final2.png' });
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-new-key-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
