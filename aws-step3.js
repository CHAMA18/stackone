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
    
    // Go to IAM user
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/details/StackOne', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(10000);
    await page.evaluate(() => { document.querySelector('[data-id="awsccc-cb-btn-accept"]')?.click(); }).catch(() => {});
    await page.waitForTimeout(3000);
    
    // Click Security credentials tab
    await page.evaluate(() => {
      document.querySelectorAll('[role="tab"]').forEach(tab => {
        if (tab.textContent.includes('Security credentials')) tab.click();
      });
    });
    await page.waitForTimeout(5000);
    
    // Click Create access key
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.trim() === 'Create access key' && !btn.disabled) btn.click();
      });
    });
    await page.waitForTimeout(5000);
    console.log('1. On wizard Step 1');
    
    // Select "Other" tile
    await page.evaluate(() => {
      const tiles = document.querySelectorAll('[class*="tile"], [class*="Tile"]');
      for (const tile of tiles) {
        const text = tile.textContent;
        if (text.includes('Other') && text.length < 200 && !text.includes('third')) {
          tile.click();
          return;
        }
      }
    });
    await page.waitForTimeout(2000);
    
    // Click Create access key (at the bottom of step 1 page - for "Other" use case, 
    // it shows the Create button directly, not Next)
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        const text = btn.textContent.trim();
        // When "Other" is selected, the button changes to "Create access key"
        if (text === 'Create access key' || text === 'Next') {
          btn.click();
          return text;
        }
      }
    });
    await page.waitForTimeout(5000);
    console.log('2. After Step 1 action');
    
    // Check if we're on step 2 or the key page
    let pageText = await page.evaluate(() => document.body.innerText);
    
    if (pageText.includes('Set description tag')) {
      console.log('3. On Step 2 - Description');
      // Skip description, click Next/Create
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          const text = btn.textContent.trim();
          if (text === 'Next' || text === 'Create access key') {
            btn.click();
            return text;
          }
        }
      });
      await page.waitForTimeout(5000);
      pageText = await page.evaluate(() => document.body.innerText);
    }
    
    if (pageText.includes('Retrieve access keys')) {
      console.log('4. On Retrieve keys page - clicking Create');
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent.trim() === 'Create access key') {
            btn.click();
            return 'clicked';
          }
        }
      });
      await page.waitForTimeout(10000);
    }
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-step3.png' });
    
    // Check if keys are shown
    const resultText = await page.evaluate(() => document.body.innerText);
    console.log('5. Result (first 800):', resultText.substring(0, 800));
    
    if (resultText.includes('Secret access key') || resultText.includes('Retrieve')) {
      // Show the secret
      await page.evaluate(() => {
        document.querySelectorAll('button').forEach(btn => {
          if (btn.textContent.trim() === 'Show') btn.click();
        });
      });
      await page.waitForTimeout(3000);
      
      // Download CSV
      try {
        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 15000 }),
          page.evaluate(() => {
            const btns = document.querySelectorAll('button, a');
            for (const b of btns) {
              if (b.textContent.includes('csv') || b.textContent.includes('Download')) {
                b.click();
                return true;
              }
            }
          })
        ]);
        
        if (download) {
          await download.saveAs('/home/z/my-project/download/credentials.csv');
          const csv = fs.readFileSync('/home/z/my-project/download/credentials.csv', 'utf8');
          console.log('6. CSV:', csv);
          
          // Parse CSV
          const lines = csv.split('\n');
          if (lines.length >= 2) {
            const cols = lines[1].split(',');
            if (cols.length >= 2) {
              const keys = {
                accessKeyId: cols[0].replace(/"/g, '').trim(),
                secretAccessKey: cols[1].replace(/"/g, '').trim()
              };
              fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keys, null, 2));
              console.log('7. KEYS FROM CSV! AKIA:', keys.accessKeyId);
            }
          }
        }
      } catch (e) {
        console.log('6. Download failed:', e.message);
      }
      
      // Also try extracting from text
      const afterShow = await page.evaluate(() => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const texts = [];
        while (walker.nextNode()) {
          const t = walker.currentNode.textContent.trim();
          if (t.length > 5) texts.push(t);
        }
        return texts.join(' ');
      });
      
      const akia = afterShow.match(/AKIA[A-Z0-9]{16}/);
      const secrets = afterShow.match(/[A-Za-z0-9/+=]{40}/g)?.filter(s => !s.startsWith('AKIA'));
      console.log('8. AKIA:', akia?.[0]);
      console.log('8. Secrets:', secrets);
      
      if (akia && secrets && secrets.length > 0) {
        const keys = { accessKeyId: akia[0], secretAccessKey: secrets[0] };
        fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keys, null, 2));
        console.log('9. KEYS SAVED FROM TEXT!');
      }
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
