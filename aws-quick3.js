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
    await page.waitForTimeout(30000); // Longer wait
    
    // Check what elements are on the page
    const elements = await page.evaluate(() => {
      const selectors = ['.xterm', '.xterm-screen', '.xterm-rows', 'canvas', '#terminal', '.terminal', '[class*="xterm"]', '[class*="terminal"]', '[class*="shell"]'];
      return selectors.map(s => ({ selector: s, count: document.querySelectorAll(s).length }));
    });
    console.log('2. Elements:', JSON.stringify(elements));
    
    // Get all class names containing 'term' or 'shell'
    const relevantClasses = await page.evaluate(() => {
      const all = document.querySelectorAll('*');
      const classes = new Set();
      all.forEach(el => {
        el.classList?.forEach(c => {
          if (c.toLowerCase().includes('term') || c.toLowerCase().includes('shell')) {
            classes.add(c);
          }
        });
      });
      return Array.from(classes);
    });
    console.log('3. Relevant classes:', relevantClasses);
    
    // Take screenshot to see what's happening
    await page.screenshot({ path: '/home/z/my-project/download/aws-cs-debug.png' });
    
    // Try to find and click the terminal iframe if it exists
    const iframes = page.frames();
    console.log('4. Frames:', iframes.length);
    for (const frame of iframes) {
      const url = frame.url();
      console.log('  Frame URL:', url.substring(0, 100));
    }
    
    // Wait more and try again
    await page.waitForTimeout(15000);
    
    // Try finding the terminal after additional wait
    const elements2 = await page.evaluate(() => {
      const selectors = ['.xterm', '.xterm-screen', '.xterm-rows', 'canvas', '[class*="xterm"]'];
      return selectors.map(s => ({ selector: s, count: document.querySelectorAll(s).length }));
    });
    console.log('5. Elements after wait:', JSON.stringify(elements2));
    
    // If xterm is present now, type commands
    if (elements2.some(e => e.selector.includes('xterm') && e.count > 0)) {
      console.log('6. Terminal found!');
      
      // Click on the xterm area
      const xtermEl = page.locator('.xterm').first();
      await xtermEl.click().catch(() => {});
      await page.waitForTimeout(1000);
      
      // Type command
      await page.keyboard.type('aws iam create-access-key --user-name StackOne --query "AccessKey.[AccessKeyId,SecretAccessKey]" --output text', { delay: 20 });
      await page.keyboard.press('Enter');
      await page.waitForTimeout(15000);
      
      // Get output
      const output = await page.evaluate(() => {
        const rows = document.querySelectorAll('.xterm-rows > div');
        const lines = [];
        rows.forEach(r => { if (r.textContent?.trim()) lines.push(r.textContent.trim()); });
        return lines.join('\n');
      });
      
      console.log('7. Output (last 1000):', output.substring(output.length - 1000));
      
      const keyMatch = output.match(/(AKIA[A-Z0-9]{16})\s+([A-Za-z0-9/+=]{40})/);
      if (keyMatch) {
        const keys = { accessKeyId: keyMatch[1], secretAccessKey: keyMatch[2] };
        fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keys, null, 2));
        console.log('8. KEYS SAVED! AKIA:', keys.accessKeyId);
      }
    } else {
      console.log('6. Terminal still not found');
      
      // Check if CloudShell is showing an error or needs setup
      const pageText = await page.evaluate(() => document.body.innerText);
      console.log('Page text (first 500):', pageText.substring(0, 500));
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
