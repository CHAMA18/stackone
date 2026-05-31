const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
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
    
    // Go directly to IAM user security credentials
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/details/StackOne$security_credentials', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(10000);
    
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
    
    // Click Create access key
    const createKeyBtn = page.locator('button:has-text("Create access key")');
    const btnCount = await createKeyBtn.count();
    console.log('2. Create key buttons:', btnCount);
    
    if (btnCount > 0) {
      await createKeyBtn.nth(btnCount - 1).click({ force: true }); // Use last occurrence
      await page.waitForTimeout(5000);
      
      // Select "Other" tile
      const tiles = await page.locator('[class*="tile"], [class*="Tile"]').all();
      for (const tile of tiles) {
        const text = await tile.textContent().catch(() => '');
        if (text.includes('Other') && !text.includes('third')) {
          await tile.click();
          console.log('3. Selected Other tile');
          break;
        }
      }
      await page.waitForTimeout(2000);
      
      // Now look for the "Create access key" button on the current page
      // After selecting "Other", there should be a confirmation checkbox + Create button
      const allCheckboxes = await page.locator('input[type="checkbox"]').all();
      for (const chk of allCheckboxes) {
        if (!await chk.isChecked()) {
          await chk.check({ force: true }).catch(() => {});
        }
      }
      await page.waitForTimeout(1000);
      
      // Take screenshot to see current state
      await page.screenshot({ path: '/home/z/my-project/download/aws-csv-step.png' });
      
      // Find visible Create access key button
      const createButtons = await page.locator('button:has-text("Create access key")').all();
      for (const btn of createButtons) {
        const isVisible = await btn.isVisible().catch(() => false);
        const isEnabled = await btn.isEnabled().catch(() => false);
        const text = await btn.textContent().catch(() => '');
        console.log(`4. Button: visible=${isVisible} enabled=${isEnabled} text="${text?.trim()?.substring(0, 30)}"`);
        if (isVisible && isEnabled) {
          await btn.click({ force: true });
          console.log('5. Clicked Create access key');
          break;
        }
      }
      
      await page.waitForTimeout(10000);
      await page.screenshot({ path: '/home/z/my-project/download/aws-csv-created.png' });
      
      // Try to download CSV file
      const csvBtn = page.locator('button:has-text("Download .csv file"), a:has-text("Download .csv file")');
      if (await csvBtn.count() > 0) {
        console.log('6. Found CSV download button');
        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 15000 }).catch(() => null),
          csvBtn.first().click({ force: true })
        ]);
        
        if (download) {
          const savePath = '/home/z/my-project/download/access-keys.csv';
          await download.saveAs(savePath);
          const csvContent = fs.readFileSync(savePath, 'utf8');
          console.log('7. CSV CONTENT:', csvContent);
          
          // Parse CSV
          const lines = csvContent.split('\n');
          if (lines.length >= 2) {
            const values = lines[1].split(',');
            if (values.length >= 3) {
              const keys = {
                accessKeyId: values[0].replace(/"/g, '').trim(),
                secretAccessKey: values[1].replace(/"/g, '').trim()
              };
              fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keys, null, 2));
              console.log('8. KEYS SAVED! AKIA:', keys.accessKeyId);
            }
          }
        }
      } else {
        console.log('6. No CSV button found');
        const pageText = await page.evaluate(() => document.body.innerText);
        console.log('Page (first 800):', pageText.substring(0, 800));
      }
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-csv-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
