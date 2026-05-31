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
    
    // Select the CLI radio option - need to click the tile/label, not just the radio
    // The "Command Line Interface (CLI)" tile needs to be selected
    const cliTile = page.locator('[data-testid="tile-cli"], [data-testid*="cli"]').first();
    if (await cliTile.count() > 0) {
      await cliTile.click();
      console.log('2. Clicked CLI tile via data-testid');
    } else {
      // Try clicking the actual tile element that contains CLI text
      const tiles = await page.locator('[class*="tile"], [class*="Tile"], [class*="awsui-tiles"]').all();
      console.log('2. Tiles found:', tiles.length);
      
      // Find the tile containing "Command Line Interface"
      for (const tile of tiles) {
        const text = await tile.textContent().catch(() => '');
        if (text.includes('Command Line Interface')) {
          await tile.click();
          console.log('2. Clicked CLI tile');
          break;
        }
      }
      
      // If no tiles found, try clicking the label text directly
      if (tiles.length === 0) {
        const cliLabel = page.locator('text=Command Line Interface (CLI)').first();
        if (await cliLabel.count() > 0) {
          await cliLabel.click();
          console.log('2. Clicked CLI label');
        }
      }
    }
    
    await page.waitForTimeout(2000);
    
    // Verify the radio is selected
    const selectedRadio = await page.evaluate(() => {
      const radios = document.querySelectorAll('input[type="radio"]');
      for (const r of radios) {
        if (r.checked) return { value: r.value, id: r.id };
      }
      return null;
    });
    console.log('3. Selected radio:', JSON.stringify(selectedRadio));
    
    if (!selectedRadio) {
      // Force select the CLI radio
      await page.evaluate(() => {
        const radios = document.querySelectorAll('input[type="radio"]');
        for (const r of radios) {
          if (r.value === 'default' || r.id.includes('cli')) {
            r.click();
            r.checked = true;
            break;
          }
        }
      });
      await page.waitForTimeout(1000);
      console.log('3. Force-selected CLI radio');
    }
    
    // Click Next button
    const nextBtn = page.locator('button:has-text("Next")');
    await nextBtn.first().click({ force: true });
    await page.waitForTimeout(5000);
    console.log('4. Clicked Next');
    
    // Step 2 - Description (skip it)
    // Click Next again or Create
    const step2Btns = await page.locator('button').all();
    for (const btn of step2Btns) {
      const text = await btn.textContent().catch(() => '');
      const trimmed = text.trim();
      if (trimmed === 'Next') {
        await btn.click({ force: true }).catch(() => {});
        console.log('5. Clicked Next on step 2');
        break;
      }
    }
    await page.waitForTimeout(5000);
    
    // Step 3 - Create the access key
    const createBtns = await page.locator('button').all();
    for (const btn of createBtns) {
      const text = await btn.textContent().catch(() => '');
      if (text.includes('Create access key') && text.trim() !== '') {
        await btn.click({ force: true }).catch(() => {});
        console.log('6. Clicked Create access key');
        break;
      }
    }
    await page.waitForTimeout(10000);
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-keys-created3.png' });
    
    // Check the result
    const resultText = await page.evaluate(() => document.body.innerText);
    console.log('7. Result (first 1500):', resultText.substring(0, 1500));
    
    // Show secret keys
    const allBtnsFinal = await page.locator('button').all();
    for (const btn of allBtnsFinal) {
      const text = await btn.textContent().catch(() => '');
      if (text.trim() === 'Show') {
        await btn.click({ force: true }).catch(() => {});
      }
    }
    await page.waitForTimeout(3000);
    
    // Extract keys from inputs
    const finalInputs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('input')).filter(i => i.value?.length > 10).map(i => ({
        value: i.value, type: i.type, id: i.id
      }));
    });
    console.log('8. Final inputs:', JSON.stringify(finalInputs, null, 2));
    
    // Extract keys from page text
    const akiaMatch = resultText.match(/AKIA[A-Z0-9]{16}/);
    if (akiaMatch) console.log('9. ACCESS KEY ID:', akiaMatch[0]);
    
    // Save keys
    const keys = {};
    for (const inp of finalInputs) {
      if (inp.value.startsWith('AKIA')) keys.accessKeyId = inp.value;
      else if (inp.value.length === 40) keys.secretAccessKey = inp.value;
    }
    if (akiaMatch) keys.accessKeyId = akiaMatch[0];
    
    if (keys.accessKeyId) {
      fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keys, null, 2));
      console.log('10. Keys saved:', JSON.stringify(keys, null, 2));
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-keys9-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
