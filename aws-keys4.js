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
    
    // Navigate to IAM user security credentials
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/details/StackOne$security_credentials', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(8000);
    
    // Handle cookie consent
    await page.evaluate(() => {
      const btn = document.querySelector('[data-id="awsccc-cb-btn-accept"]');
      if (btn) btn.click();
    }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Click on Security credentials tab
    const secTab = page.locator('[role="tab"]:has-text("Security credentials")');
    if (await secTab.count() > 0) {
      await secTab.click().catch(() => {});
      await page.waitForTimeout(3000);
    }
    
    // Click Create access key
    const createKeyBtn = page.locator('button:has-text("Create access key")');
    if (await createKeyBtn.count() > 0) {
      await createKeyBtn.first().click({ force: true });
      await page.waitForTimeout(5000);
      console.log('2. Clicked Create access key');
    }
    
    // Step 1: Select use case "Command Line Interface (CLI)"
    // Look for the CLI radio option
    const cliOption = page.locator('text=Command Line Interface (CLI)').first();
    if (await cliOption.count() > 0) {
      await cliOption.click().catch(() => {});
      console.log('3. Selected CLI use case');
      await page.waitForTimeout(1000);
    }
    
    // Click Next button
    const nextBtn = page.locator('button:has-text("Next")');
    if (await nextBtn.count() > 0) {
      await nextBtn.click({ force: true });
      console.log('4. Clicked Next');
      await page.waitForTimeout(3000);
    }
    
    // Step 2: Optional description - just skip or add description
    // Click Next again
    const nextBtn2 = page.locator('button:has-text("Next")');
    if (await nextBtn2.count() > 0) {
      await nextBtn2.click({ force: true });
      console.log('5. Skipped description step');
      await page.waitForTimeout(3000);
    }
    
    // Step 3: Create the key
    const createBtn = page.locator('button:has-text("Create access key")');
    if (await createBtn.count() > 0) {
      await createBtn.first().click({ force: true });
      console.log('6. Creating access key...');
      await page.waitForTimeout(8000);
    }
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-keys-final.png' });
    
    // Extract the access key and secret key
    const keyData = await page.evaluate(() => {
      const result = {};
      
      // Method 1: Look for input fields containing the keys
      document.querySelectorAll('input, textarea, code, span, div, p').forEach(el => {
        const text = el.value || el.textContent || '';
        if (text.match(/^AKIA[A-Z0-9]{16}$/)) {
          result.accessKeyId = text;
        }
        // Secret keys are 40 chars with base64 chars
        if (text.length === 40 && text.match(/^[A-Za-z0-9/+=]+$/) && !text.startsWith('AKIA')) {
          result.secretAccessKey = text;
        }
      });
      
      return result;
    });
    
    console.log('7. Key data from elements:', JSON.stringify(keyData));
    
    // Try showing the secret key
    const showBtn = page.locator('button:has-text("Show")');
    if (await showBtn.count() > 0) {
      // Click all Show buttons
      const shows = await showBtn.all();
      for (const s of shows) {
        await s.click({ force: true }).catch(() => {});
      }
      await page.waitForTimeout(2000);
    }
    
    // Try the "Copy" approach - get value from copy actions
    const secretKeyInput = page.locator('input[aria-label*="Secret"], input[aria-label*="secret"], [data-testid*="secret"]');
    if (await secretKeyInput.count() > 0) {
      const secret = await secretKeyInput.first().getAttribute('value').catch(() => '');
      if (secret) {
        keyData.secretAccessKey = secret;
        console.log('Got secret key from input');
      }
    }
    
    // Get the full page text after showing keys
    const finalPageText = await page.evaluate(() => document.body.innerText);
    
    // Extract access key
    const akiaMatch = finalPageText.match(/AKIA[A-Z0-9]{16}/);
    if (akiaMatch) {
      keyData.accessKeyId = akiaMatch[0];
      console.log('8. ACCESS KEY ID:', akiaMatch[0]);
    }
    
    // Look for secret key patterns in displayed text
    const secretPatterns = finalPageText.match(/[A-Za-z0-9/+=]{40}/g);
    if (secretPatterns) {
      // Filter out common false positives
      for (const p of secretPatterns) {
        if (!p.startsWith('AKIA') && !p.startsWith('AAAA') && p.length === 40) {
          keyData.secretAccessKey = p;
          console.log('8. SECRET KEY candidate found');
          break;
        }
      }
    }
    
    console.log('9. Final key data:', JSON.stringify(keyData));
    
    // Save keys
    if (keyData.accessKeyId) {
      fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keyData, null, 2));
      console.log('Keys saved to aws-keys.json');
    }
    
    // Also print full page for debugging
    console.log('10. Page text (first 1500):', finalPageText.substring(0, 1500));
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-keys4-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
