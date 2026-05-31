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
    
    // Open CloudShell
    await page.goto('https://us-east-1.console.aws.amazon.com/cloudshell/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(20000); // Wait for CloudShell to fully start
    
    await page.evaluate(() => {
      const btn = document.querySelector('[data-id="awsccc-cb-btn-accept"]');
      if (btn) btn.click();
    }).catch(() => {});
    await page.waitForTimeout(5000);
    
    console.log('2. CloudShell loaded');
    
    // Use CloudShell's built-in terminal - type the command and capture output
    // First clear any existing text
    await page.keyboard.press('Control+c');
    await page.waitForTimeout(500);
    
    // Type the command
    const cmd = 'aws iam create-access-key --user-name StackOne --output json 2>&1 && echo "DONE_KEY"';
    await page.keyboard.type(cmd, { delay: 30 });
    await page.keyboard.press('Enter');
    
    // Wait for the command to complete
    console.log('3. Command sent, waiting for output...');
    await page.waitForTimeout(15000);
    
    // Take screenshot
    await page.screenshot({ path: '/home/z/my-project/download/aws-cs-output.png' });
    
    // Try to get the terminal content
    // CloudShell uses xterm.js - the content is in a canvas element
    // We can try to select all text and copy it
    
    // Method 1: Try reading from the xterm buffer
    const terminalContent = await page.evaluate(() => {
      // Try to access the terminal instance
      if (window.terminal) {
        return window.terminal.buffer.active.toString();
      }
      
      // Try to get text from the xterm-rows
      const rows = document.querySelectorAll('.xterm-rows > div');
      if (rows.length > 0) {
        return Array.from(rows).map(r => r.textContent).join('\n');
      }
      
      // Fallback to all text
      return document.body.innerText;
    });
    
    console.log('4. Terminal content (last 2000 chars):', terminalContent.substring(terminalContent.length - 2000));
    
    // Method 2: Select all and copy
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Control+c');
    await page.waitForTimeout(2000);
    
    // Method 3: Re-run with output redirect to a file, then read the file
    await page.keyboard.press('Control+c');
    await page.waitForTimeout(500);
    
    // Save output to file
    const cmd2 = 'aws iam create-access-key --user-name StackOne --output json > /tmp/keys.json 2>&1';
    await page.keyboard.type(cmd2, { delay: 30 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(10000);
    
    // Now cat the file
    await page.keyboard.type('cat /tmp/keys.json', { delay: 30 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
    
    // Get the terminal rows content
    const rowsContent = await page.evaluate(() => {
      const rows = document.querySelectorAll('.xterm-rows > div');
      if (rows.length > 0) {
        return Array.from(rows).map(r => r.textContent).join('\n');
      }
      return '';
    });
    
    console.log('5. Rows content (last 2000):', rowsContent.substring(rowsContent.length - 2000));
    
    // Extract keys from the output
    const allText = rowsContent + terminalContent;
    const akia = allText.match(/AKIA[A-Z0-9]{16}/);
    const secret = allText.match(/"SecretAccessKey"\s*:\s*"([^"]+)"/);
    const secret2 = allText.match(/[A-Za-z0-9/+=]{40}/);
    
    if (akia) console.log('6. ACCESS KEY ID:', akia[0]);
    if (secret) console.log('6. SECRET KEY:', secret[1]);
    if (!secret && secret2) console.log('6. SECRET CANDIDATE:', secret2[0]);
    
    if (akia && (secret || secret2)) {
      const keys = {
        accessKeyId: akia[0],
        secretAccessKey: secret ? secret[1] : secret2[0]
      };
      fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keys, null, 2));
      console.log('7. Keys saved!');
    }
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-cs-final.png' });
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-cs2-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
