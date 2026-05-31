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
    
    // Go to S3 console
    await page.goto('https://s3.console.aws.amazon.com/s3/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(10000);
    await page.evaluate(() => { document.querySelector('[data-id="awsccc-cb-btn-accept"]')?.click(); }).catch(() => {});
    await page.waitForTimeout(3000);
    
    const s3Text = await page.evaluate(() => document.body.innerText);
    console.log('2. S3 page (first 500):', s3Text.substring(0, 500));
    
    // Create S3 bucket for static hosting
    // Click "Create bucket"
    const createBucketBtn = page.locator('button:has-text("Create bucket"), a:has-text("Create bucket")');
    console.log('3. Create bucket buttons:', await createBucketBtn.count());
    
    if (await createBucketBtn.count() > 0) {
      await createBucketBtn.first().click({ force: true });
      await page.waitForTimeout(5000);
      console.log('4. Clicked Create bucket');
      
      // Fill bucket name
      const bucketName = 'thestackone.com';
      const nameInput = page.locator('input[type="text"]').first();
      if (await nameInput.count() > 0) {
        await nameInput.fill(bucketName);
        console.log('5. Filled bucket name:', bucketName);
      }
      
      await page.screenshot({ path: '/home/z/my-project/download/aws-s3-create.png' });
      
      // We need to:
      // 1. Set bucket name
      // 2. Enable static website hosting
      // 3. Set public access
      // This is complex via browser automation
      
      // Let me try a simpler approach - go back to creating the access key properly
    }
    
    // ALTERNATIVE APPROACH: Create access key via the proper URL path
    // The issue was with $security_credentials in URL causing userName errors
    // Let's navigate to user page first, then click the tab
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/details/StackOne', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(10000);
    await page.evaluate(() => { document.querySelector('[data-id="awsccc-cb-btn-accept"]')?.click(); }).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Click Security credentials tab properly
    await page.evaluate(() => {
      const tabs = document.querySelectorAll('[role="tab"]');
      for (const tab of tabs) {
        if (tab.textContent.includes('Security credentials')) {
          tab.click();
          break;
        }
      }
    });
    await page.waitForTimeout(5000);
    
    // Check the page - see existing keys and Create button
    const secPageText = await page.evaluate(() => document.body.innerText);
    const keySection = secPageText.substring(secPageText.indexOf('Access key'), secPageText.indexOf('Permissions'));
    console.log('6. Key section:', keySection);
    
    // The key section shows existing keys + "Create access key" button
    // Let's click it via JavaScript
    const createClicked = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent.trim() === 'Create access key' && !btn.disabled) {
          btn.click();
          return true;
        }
      }
      return false;
    });
    console.log('7. Create key clicked:', createClicked);
    await page.waitForTimeout(8000);
    
    // Now we should be on the create access key wizard
    await page.screenshot({ path: '/home/z/my-project/download/aws-wizard.png' });
    
    const wizardText = await page.evaluate(() => document.body.innerText);
    console.log('8. Wizard (first 300):', wizardText.substring(0, 300));
    
    // Select "Other" option
    await page.evaluate(() => {
      const tiles = document.querySelectorAll('[class*="tile"], [class*="Tile"]');
      for (const tile of tiles) {
        const text = tile.textContent;
        if (text.includes('Other') && text.length < 200 && !text.includes('third')) {
          tile.click();
          return 'clicked Other tile';
        }
      }
      // Fallback: click radio
      const radios = document.querySelectorAll('input[type="radio"]');
      for (const r of radios) {
        const parent = r.closest('div');
        if (parent && parent.textContent.includes('Other') && !parent.textContent.includes('third')) {
          r.click();
          return 'clicked Other radio';
        }
      }
      return 'not found';
    });
    await page.waitForTimeout(2000);
    
    // Check if there's a confirmation checkbox
    await page.evaluate(() => {
      document.querySelectorAll('input[type="checkbox"]').forEach(c => {
        if (!c.checked) { c.click(); c.checked = true; }
      });
    });
    await page.waitForTimeout(1000);
    
    // Click Create access key button (the one on the wizard page, not the tab)
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        const text = btn.textContent.trim();
        if (text === 'Create access key') {
          btn.click();
          return 'clicked';
        }
      }
      // Also try "Next"
      for (const btn of buttons) {
        if (btn.textContent.trim() === 'Next') {
          btn.click();
          return 'clicked Next';
        }
      }
      return 'not found';
    });
    await page.waitForTimeout(10000);
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-wizard2.png' });
    
    // Check current page
    const afterClick = await page.evaluate(() => document.body.innerText);
    console.log('9. After click (first 500):', afterClick.substring(0, 500));
    
    if (afterClick.includes('Retrieve access keys') || afterClick.includes('Secret access key')) {
      console.log('10. KEY RETRIEVAL PAGE!');
      
      // Show secret
      await page.evaluate(() => {
        document.querySelectorAll('button').forEach(btn => {
          if (btn.textContent.trim() === 'Show') btn.click();
        });
      });
      await page.waitForTimeout(3000);
      
      // Download CSV
      const csvDownloaded = await page.evaluate(() => {
        const btns = document.querySelectorAll('button, a');
        for (const b of btns) {
          if (b.textContent.includes('csv') || b.textContent.includes('Download')) {
            b.click();
            return b.textContent;
          }
        }
        return null;
      });
      console.log('11. CSV download:', csvDownloaded);
      
      // Wait for download
      await page.waitForTimeout(5000);
      
      // Extract from text
      const keyText = await page.evaluate(() => document.body.innerText);
      const akia = keyText.match(/AKIA[A-Z0-9]{16}/);
      console.log('12. AKIA:', akia?.[0]);
      
      // The secret key should be visible after Show click
      // Look for it in all text nodes
      const secret = await page.evaluate(() => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const t = walker.currentNode.textContent.trim();
          if (t.length >= 38 && t.length <= 42 && /^[A-Za-z0-9/+=]+$/.test(t) && !t.startsWith('AKIA')) {
            return t;
          }
        }
        return null;
      });
      
      console.log('12. Secret:', secret ? secret.substring(0, 10) + '...' : 'not found');
      
      if (akia && secret) {
        const keys = { accessKeyId: akia[0], secretAccessKey: secret };
        fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keys, null, 2));
        console.log('13. KEYS SAVED!');
      }
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
