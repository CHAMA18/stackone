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
    
    // First, delete the old key that we don't have the secret for
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/details/StackOne$security_credentials', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(10000);
    await page.evaluate(() => { document.querySelector('[data-id="awsccc-cb-btn-accept"]')?.click(); }).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Click Security credentials tab
    await page.locator('[role="tab"]:has-text("Security credentials")').click().catch(() => {});
    await page.waitForTimeout(5000);
    
    // Find and click "Make inactive" or "Delete" for Access key 1
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('1. Security page (key section):', pageText.substring(pageText.indexOf('Access key'), pageText.indexOf('Access key') + 500));
    
    // Try to find the delete/deactivate button for the existing key
    const deactivateBtn = page.locator('button:has-text("Deactivate"), button:has-text("Delete")');
    if (await deactivateBtn.count() > 0) {
      await deactivateBtn.first().click({ force: true });
      console.log('2. Clicked Deactivate/Delete');
      await page.waitForTimeout(3000);
      
      // Confirm deletion
      const confirmBtn = page.locator('button:has-text("Deactivate"), button:has-text("Delete"), button:has-text("Confirm")');
      if (await confirmBtn.count() > 0) {
        await confirmBtn.first().click({ force: true });
        console.log('3. Confirmed');
        await page.waitForTimeout(5000);
      }
    }
    
    // Now go to the user page and click Create access key
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/details/StackOne', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(8000);
    await page.evaluate(() => { document.querySelector('[data-id="awsccc-cb-btn-accept"]')?.click(); }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // The create-access-key page URL pattern
    // Go through the wizard step by step
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/details/StackOne/create-access-key', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(10000);
    await page.evaluate(() => { document.querySelector('[data-id="awsccc-cb-btn-accept"]')?.click(); }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Select "Other" - we know it's a tile element
    // Use JavaScript to select the right radio
    await page.evaluate(() => {
      // Find and click the "Other" radio option
      const radios = document.querySelectorAll('input[type="radio"]');
      for (const r of radios) {
        // Check nearby label text
        const parent = r.closest('[class*="tile"], [class*="Tile"], label, div');
        if (parent && parent.textContent.includes('Other') && !parent.textContent.includes('third')) {
          r.click();
          r.checked = true;
          r.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
    });
    await page.waitForTimeout(2000);
    
    // Verify radio is selected
    const selected = await page.evaluate(() => {
      const r = document.querySelector('input[type="radio"]:checked');
      return r ? r.value : 'none';
    });
    console.log('4. Selected radio value:', selected);
    
    // Now we need to check the "I understand" checkbox if it exists
    await page.evaluate(() => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(c => {
        if (!c.checked) {
          c.click();
          c.checked = true;
          c.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });
    await page.waitForTimeout(1000);
    
    // Find and click the Create access key button using JavaScript
    const clicked = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent.includes('Create access key') && btn.offsetParent !== null) {
          btn.click();
          return true;
        }
      }
      // If no visible button, try clicking all matching buttons
      for (const btn of buttons) {
        if (btn.textContent.includes('Create access key')) {
          btn.click();
          return true;
        }
      }
      return false;
    });
    console.log('5. Clicked Create key:', clicked);
    
    await page.waitForTimeout(10000);
    await page.screenshot({ path: '/home/z/my-project/download/aws-recreate.png' });
    
    // Check the result page
    const resultText = await page.evaluate(() => document.body.innerText);
    console.log('6. Result (first 1500):', resultText.substring(0, 1500));
    
    // If we see the key retrieval page
    if (resultText.includes('Retrieve access keys') || resultText.includes('Secret access key')) {
      console.log('7. ON KEY RETRIEVAL PAGE!');
      
      // Click Show button(s)
      await page.evaluate(() => {
        document.querySelectorAll('button').forEach(btn => {
          if (btn.textContent.trim() === 'Show') btn.click();
        });
      });
      await page.waitForTimeout(3000);
      
      // Download CSV
      const csvClicked = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button, a');
        for (const btn of buttons) {
          if (btn.textContent.includes('Download .csv') || btn.textContent.includes('csv')) {
            btn.click();
            return btn.textContent;
          }
        }
        return null;
      });
      console.log('8. CSV button:', csvClicked);
      
      // Wait for download
      await page.waitForTimeout(5000);
      
      // Extract from visible text
      const finalText = await page.evaluate(() => document.body.innerText);
      const akia = finalText.match(/AKIA[A-Z0-9]{16}/);
      const secrets = finalText.match(/[A-Za-z0-9/+=]{40}/g)?.filter(s => !s.startsWith('AKIA'));
      
      console.log('9. AKIA:', akia?.[0]);
      console.log('9. Secrets:', secrets);
      
      if (akia && secrets && secrets.length > 0) {
        const keys = { accessKeyId: akia[0], secretAccessKey: secrets[0] };
        fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keys, null, 2));
        console.log('10. KEYS SAVED!');
      }
      
      // Also check for download
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 5000 }).catch(() => null),
        page.evaluate(() => {
          const btns = document.querySelectorAll('button, a');
          for (const b of btns) {
            if (b.textContent.includes('csv') || b.textContent.includes('Download')) {
              b.click();
              return true;
            }
          }
          return false;
        })
      ]);
      
      if (download) {
        await download.saveAs('/home/z/my-project/download/credentials.csv');
        const csv = fs.readFileSync('/home/z/my-project/download/credentials.csv', 'utf8');
        console.log('11. CSV:', csv);
      }
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
