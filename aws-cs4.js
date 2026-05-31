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
    
    // Go to CloudShell
    await page.goto('https://us-east-1.console.aws.amazon.com/cloudshell/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(30000);
    
    // Find the iframe
    const continuumFrame = page.frames().find(f => f.url().includes('continuum.console.api.aws'));
    if (continuumFrame) {
      console.log('2. Found continuum frame');
      
      // Check for terminal elements in the iframe
      const frameElements = await continuumFrame.evaluate(() => {
        const selectors = ['.xterm', '.xterm-screen', '.xterm-rows', 'canvas', '#terminal', '.terminal'];
        return selectors.map(s => ({ selector: s, count: document.querySelectorAll(s).length }));
      });
      console.log('3. Frame elements:', JSON.stringify(frameElements));
      
      // Click on the terminal in the iframe
      const xtermInFrame = continuumFrame.locator('.xterm, canvas, .terminal').first();
      if (await xtermInFrame.count() > 0) {
        await xtermInFrame.click().catch(() => {});
        console.log('4. Clicked terminal in frame');
      }
    }
    
    // Regardless, try typing on the main page (keyboard events propagate)
    await page.keyboard.type('echo TEST123', { delay: 30 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
    
    // Check terminal output via the iframe
    if (continuumFrame) {
      const output = await continuumFrame.evaluate(() => {
        const rows = document.querySelectorAll('.xterm-rows > div');
        if (rows.length > 0) {
          return Array.from(rows).map(r => r.textContent).join('\n');
        }
        // Try all text
        return document.body.innerText;
      });
      console.log('5. Frame output (last 500):', output.substring(output.length - 500));
    }
    
    // Also check main page
    const mainOutput = await page.evaluate(() => document.body.innerText);
    console.log('6. Main output (last 300):', mainOutput.substring(mainOutput.length - 300));
    
    // If we can see TEST123 in output, terminal is working
    // Now run the actual AWS CLI command
    await page.keyboard.press('Control+c');
    await page.waitForTimeout(500);
    
    await page.keyboard.type('aws iam create-access-key --user-name StackOne --query "AccessKey.[AccessKeyId,SecretAccessKey]" --output text', { delay: 20 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(20000);
    
    // Read output
    if (continuumFrame) {
      const keyOutput = await continuumFrame.evaluate(() => {
        const rows = document.querySelectorAll('.xterm-rows > div');
        if (rows.length > 0) {
          return Array.from(rows).map(r => r.textContent).join('\n');
        }
        return document.body.innerText;
      });
      console.log('7. Key output (last 1000):', keyOutput.substring(keyOutput.length - 1000));
      
      // Try to find keys
      const keyMatch = keyOutput.match(/(AKIA[A-Z0-9]{16})\s+([A-Za-z0-9/+=]{40})/);
      if (keyMatch) {
        const keys = { accessKeyId: keyMatch[1], secretAccessKey: keyMatch[2] };
        fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keys, null, 2));
        console.log('8. KEYS SAVED! AKIA:', keys.accessKeyId);
      }
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
