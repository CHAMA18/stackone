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
    console.log('Login URL:', page.url());
    
    // Go to IAM user - Security credentials tab to create access key
    // First, let's go to the IAM dashboard
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/current', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    console.log('IAM current user URL:', page.url());
    
    // Take screenshot
    await page.screenshot({ path: '/home/z/my-project/download/aws-iam-user.png' });
    
    // Check what's on the page
    const bodyText = await page.textContent('body').catch(() => '');
    console.log('IAM body (first 500):', bodyText.substring(0, 500));
    
    // Look for the current user or navigate to the StackOne user
    // Try going to the security credentials tab directly
    await page.goto('https://us-east-1.console.aws.amazon.com/iam/home#/users/StackOne', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    
    const body2 = await page.textContent('body').catch(() => '');
    console.log('StackOne user page (first 500):', body2.substring(0, 500));
    await page.screenshot({ path: '/home/z/my-project/download/aws-stackone-user.png' });
    
    // Try clicking on Security credentials tab
    const secTab = page.locator('text=Security credentials');
    if (await secTab.count() > 0) {
      await secTab.first().click();
      await page.waitForTimeout(3000);
      console.log('Clicked Security credentials tab');
    }
    
    // Look for "Create access key" button
    const createKeyBtn = page.locator('text=Create access key');
    if (await createKeyBtn.count() > 0) {
      console.log('Found Create access key button');
      await createKeyBtn.first().click();
      await page.waitForTimeout(5000);
      
      // Handle any confirmation dialogs
      const confirmBtn = page.locator('button:has-text("Create")');
      if (await confirmBtn.count() > 0) {
        await confirmBtn.first().click();
        await page.waitForTimeout(5000);
      }
      
      // Extract the access key and secret
      await page.screenshot({ path: '/home/z/my-project/download/aws-access-key.png' });
      
      const keyPageText = await page.textContent('body').catch(() => '');
      console.log('Key page (first 800):', keyPageText.substring(0, 800));
      
      // Try to extract key values
      const accessKeyMatch = keyPageText.match(/AKIA[A-Z0-9]{16}/);
      const secretKeyMatch = keyPageText.match(/[A-Za-z0-9/+=]{40}/);
      
      if (accessKeyMatch) {
        console.log('ACCESS KEY FOUND:', accessKeyMatch[0]);
        fs.writeFileSync('/home/z/my-project/download/aws-keys.txt', 
          `Access Key: ${accessKeyMatch[0]}\n`);
      }
    } else {
      console.log('Create access key button not found directly');
      
      // List all visible elements with "access key" text
      const allElements = await page.evaluate(() => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
        const results = [];
        while (walker.nextNode()) {
          const el = walker.currentNode;
          if (el.textContent?.toLowerCase().includes('access key') && el.textContent.length < 200) {
            results.push({ tag: el.tagName, text: el.textContent.trim().substring(0, 100), id: el.id, class: el.className?.substring(0, 50) });
          }
        }
        return results;
      });
      console.log('Access key related elements:', JSON.stringify(allElements, null, 2));
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-keys-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
