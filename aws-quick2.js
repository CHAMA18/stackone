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
    await page.waitForTimeout(25000);
    console.log('2. CloudShell loaded');
    
    // Click on terminal area
    const canvas = page.locator('canvas').first();
    if (await canvas.count() > 0) {
      await canvas.click();
    }
    await page.waitForTimeout(2000);
    
    // Type simple test command first
    await page.keyboard.type('echo HELLO_WORLD_TEST', { delay: 30 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
    
    // Try to read the output using xterm helper
    const testOutput = await page.evaluate(() => {
      // Try the _core property of the xterm
      const xtermEl = document.querySelector('.xterm');
      if (!xtermEl) return 'no xterm element';
      
      // Get all text content from xterm-rows
      const rowDivs = xtermEl.querySelectorAll('.xterm-rows > div');
      const lines = [];
      rowDivs.forEach(div => {
        const text = div.textContent;
        if (text.trim()) lines.push(text);
      });
      return lines.join('\n');
    });
    
    console.log('3. Test output (last 500):', testOutput.substring(testOutput.length - 500));
    
    if (testOutput.includes('HELLO_WORLD_TEST')) {
      console.log('4. Terminal is working!');
      
      // Now run the actual command
      await page.keyboard.type('aws iam create-access-key --user-name StackOne --query "AccessKey.[AccessKeyId,SecretAccessKey]" --output text', { delay: 20 });
      await page.keyboard.press('Enter');
      await page.waitForTimeout(15000);
      
      // Read output
      const keyOutput = await page.evaluate(() => {
        const xtermEl = document.querySelector('.xterm');
        if (!xtermEl) return '';
        const rowDivs = xtermEl.querySelectorAll('.xterm-rows > div');
        const lines = [];
        rowDivs.forEach(div => {
          const text = div.textContent;
          if (text.trim()) lines.push(text);
        });
        return lines.join('\n');
      });
      
      console.log('5. Key output (last 500):', keyOutput.substring(keyOutput.length - 500));
      
      // Extract keys - format: AKIAXXXX\tSECRETKEY
      const keyMatch = keyOutput.match(/(AKIA[A-Z0-9]{16})\s+([A-Za-z0-9/+=]{40})/);
      if (keyMatch) {
        const keys = {
          accessKeyId: keyMatch[1],
          secretAccessKey: keyMatch[2]
        };
        fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keys, null, 2));
        console.log('6. KEYS SAVED! Access Key:', keys.accessKeyId);
      } else {
        console.log('6. Could not extract keys from output');
        // Try alternate pattern
        const allAkia = keyOutput.match(/AKIA[A-Z0-9]{16}/g);
        const allSecrets = keyOutput.match(/[A-Za-z0-9/+=]{40}/g);
        console.log('AKIA matches:', allAkia);
        console.log('Secret candidates:', allSecrets?.map(s => s.substring(0, 10) + '...'));
      }
    } else {
      console.log('4. Terminal not responding. Screenshot...');
      await page.screenshot({ path: '/home/z/my-project/download/aws-terminal-debug.png' });
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
