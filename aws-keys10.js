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
    
    // Go to create access key
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/details/StackOne/create-access-key', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(8000);
    
    // Handle cookie
    await page.evaluate(() => {
      const btn = document.querySelector('[data-id="awsccc-cb-btn-accept"]');
      if (btn) btn.click();
    }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Select "Other" use case - it's the last tile
    const tiles = await page.locator('[class*="tile"], [class*="Tile"]').all();
    console.log('2. Tiles found:', tiles.length);
    
    // Click "Other" tile (last tile)
    if (tiles.length > 0) {
      await tiles[tiles.length - 1].click();
      console.log('3. Clicked Other tile');
      await page.waitForTimeout(2000);
    }
    
    // Check what radio is selected
    const sel = await page.evaluate(() => {
      const r = document.querySelector('input[type="radio"]:checked');
      return r ? { value: r.value, id: r.id } : null;
    });
    console.log('4. Selected:', JSON.stringify(sel));
    
    // Click Next
    const nextBtn = page.locator('button:has-text("Next")').first();
    await nextBtn.click({ force: true });
    console.log('5. Clicked Next');
    await page.waitForTimeout(5000);
    
    // Check URL change or page content change
    console.log('6. URL:', page.url());
    
    // Try clicking the "Create access key" button at the bottom of the page
    // Sometimes the wizard is all on one page
    const allButtons = await page.locator('button').all();
    for (const btn of allButtons) {
      const text = await btn.textContent().catch(() => '');
      console.log('Button:', text?.trim()?.substring(0, 60));
    }
    
    // Maybe we need to scroll down and there's a "Create access key" button at the bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    // Try the confirmation checkbox approach
    // Some AWS accounts show "I understand" + "Create access key" when CLI is selected
    const checkboxes = await page.locator('input[type="checkbox"]').all();
    for (const chk of checkboxes) {
      if (!await chk.isChecked()) {
        await chk.check({ force: true }).catch(() => {});
        console.log('7. Checked a checkbox');
      }
    }
    
    await page.waitForTimeout(1000);
    
    // Now look for Create access key button
    const createBtn = page.locator('button:has-text("Create access key")');
    console.log('8. Create key button count:', await createBtn.count());
    
    if (await createBtn.count() > 0) {
      await createBtn.first().click({ force: true });
      await page.waitForTimeout(10000);
      console.log('9. Created access key!');
      
      await page.screenshot({ path: '/home/z/my-project/download/aws-keys10.png' });
      
      // Show and extract keys
      const showBtns = await page.locator('button:has-text("Show")').all();
      for (const b of showBtns) {
        await b.click({ force: true }).catch(() => {});
      }
      await page.waitForTimeout(2000);
      
      // Get all inputs
      const inputs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('input')).filter(i => i.value?.length > 10).map(i => ({
          value: i.value, type: i.type, id: i.id, 'aria-label': i.getAttribute('aria-label')
        }));
      });
      console.log('10. Inputs:', JSON.stringify(inputs, null, 2));
      
      // Get page text
      const text = await page.evaluate(() => document.body.innerText);
      const akia = text.match(/AKIA[A-Z0-9]{16}/);
      if (akia) console.log('11. ACCESS KEY ID:', akia[0]);
      
      // Save
      const keys = { accessKeyId: akia?.[0] || '' };
      for (const inp of inputs) {
        if (inp.value.startsWith('AKIA')) keys.accessKeyId = inp.value;
        else if (inp.value.length === 40 && /^[A-Za-z0-9/+=]+$/.test(inp.value)) keys.secretAccessKey = inp.value;
      }
      
      if (keys.accessKeyId) {
        fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keys, null, 2));
        console.log('12. Keys saved!');
      }
      
      console.log('13. Page text:', text.substring(0, 1500));
    } else {
      console.log('No Create access key button found');
      const pageText = await page.evaluate(() => document.body.innerText);
      console.log('Page:', pageText.substring(0, 1000));
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-keys10-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
