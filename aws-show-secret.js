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
    
    // Navigate back to the IAM user's security credentials 
    // We need to go to the user and look at the existing access key
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/details/StackOne$security_credentials', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(8000);
    
    // Handle cookie
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
    
    // The key was already created. We can't see the secret again from the console.
    // Let's download the CSV file instead - it contains both keys
    
    // Actually, the "Show" button on the create page would have shown it.
    // Since we lost that page, let's create a NEW key and capture the secret this time.
    
    // First, let's check if we can use the existing key
    // Actually, let me try downloading the .csv file which might still be accessible
    
    // Go back to create access key page - it might still show the keys
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/details/StackOne/create-access-key', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(8000);
    
    // Handle cookie
    await page.evaluate(() => {
      const btn = document.querySelector('[data-id="awsccc-cb-btn-accept"]');
      if (btn) btn.click();
    }).catch(() => {});
    await page.waitForTimeout(2000);
    
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('2. Page (first 600):', pageText.substring(0, 600));
    
    // Check if we're on the key retrieval page
    if (pageText.includes('AKIARQIUGT6TTQTF2GUF')) {
      console.log('Still on key page - clicking Show');
      
      // Click Show button
      const showBtns = await page.locator('button:has-text("Show")').all();
      for (const b of showBtns) {
        await b.click({ force: true }).catch(() => {});
      }
      await page.waitForTimeout(3000);
      
      // Extract the secret key
      const text = await page.evaluate(() => document.body.innerText);
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('AKIA')) {
          console.log('3. Found AKIA line:', lines[i].trim());
          // The next line might be the secret
          if (i + 1 < lines.length) {
            console.log('3. Next line:', lines[i+1].trim());
          }
        }
      }
      
      // Also check all text nodes for 40-char base64 strings
      const allText = await page.evaluate(() => {
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
      console.log('4. Secret key candidates:', allText);
      
      // Try to download the CSV
      const csvBtn = page.locator('button:has-text("Download .csv file")');
      if (await csvBtn.count() > 0) {
        // Set up download handler
        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 10000 }).catch(() => null),
          csvBtn.first().click({ force: true })
        ]);
        
        if (download) {
          const path = '/home/z/my-project/download/access-keys.csv';
          await download.saveAs(path);
          console.log('5. CSV downloaded to:', path);
          const csvContent = fs.readFileSync(path, 'utf8');
          console.log('5. CSV content:', csvContent);
        }
      }
    } else {
      console.log('Not on key page anymore - creating new key');
      
      // We need to create a new access key since we lost the secret
      // Select "Other" use case
      const tiles = await page.locator('[class*="tile"], [class*="Tile"]').all();
      if (tiles.length > 0) {
        await tiles[tiles.length - 1].click();
        await page.waitForTimeout(2000);
      }
      
      // Click Next
      await page.locator('button:has-text("Next")').first().click({ force: true });
      await page.waitForTimeout(5000);
      
      // Click Next again (skip description)
      await page.locator('button:has-text("Next")').first().click({ force: true });
      await page.waitForTimeout(5000);
      
      // Click Create access key
      await page.locator('button:has-text("Create access key")').first().click({ force: true });
      await page.waitForTimeout(10000);
      
      console.log('6. New key created');
      
      // NOW click Show immediately
      const showBtns = await page.locator('button:has-text("Show")').all();
      for (const b of showBtns) {
        await b.click({ force: true }).catch(() => {});
      }
      await page.waitForTimeout(3000);
      
      // Download CSV
      const csvBtn = page.locator('button:has-text("Download .csv file"), a:has-text("Download .csv file")');
      if (await csvBtn.count() > 0) {
        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 10000 }).catch(() => null),
          csvBtn.first().click({ force: true })
        ]);
        
        if (download) {
          const path = '/home/z/my-project/download/access-keys.csv';
          await download.saveAs(path);
          console.log('7. CSV downloaded');
          const csvContent = fs.readFileSync(path, 'utf8');
          console.log('7. CSV content:', csvContent);
        }
      }
      
      // Get all text content
      const text = await page.evaluate(() => document.body.innerText);
      console.log('8. Page text (first 1500):', text.substring(0, 1500));
      
      // Extract keys
      const akia = text.match(/AKIA[A-Z0-9]{16}/);
      if (akia) console.log('9. ACCESS KEY ID:', akia[0]);
      
      // Find secret in text
      const secretCandidates = await page.evaluate(() => {
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
      console.log('10. Secret candidates:', secretCandidates);
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-show-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
