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
    await page.waitForTimeout(15000); // CloudShell takes time to load
    
    await page.evaluate(() => {
      const btn = document.querySelector('[data-id="awsccc-cb-btn-accept"]');
      if (btn) btn.click();
    }).catch(() => {});
    await page.waitForTimeout(5000);
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-cloudshell.png' });
    console.log('2. CloudShell URL:', page.url());
    
    // Wait for CloudShell terminal to be ready
    // CloudShell uses xterm.js - we need to type commands
    await page.waitForTimeout(15000);
    
    // Type AWS CLI command to create access key
    const command = 'aws iam create-access-key --user-name StackOne --output json';
    await page.keyboard.type(command, { delay: 50 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(10000);
    
    // Capture terminal output
    const termText = await page.evaluate(() => {
      // Try to get text from xterm
      const term = document.querySelector('.xterm-screen, .terminal, [class*="xterm"]');
      if (term) return term.textContent;
      return document.body.innerText;
    });
    console.log('3. Terminal output:', termText.substring(0, 2000));
    
    await page.screenshot({ path: '/home/z/my-project/download/aws-cloudshell-output.png' });
    
    // If the command output is in the page text, extract keys
    const fullText = await page.evaluate(() => document.body.innerText);
    const akia = fullText.match(/AKIA[A-Z0-9]{16}/);
    const secretPattern = fullText.match(/"SecretAccessKey"\s*:\s*"([^"]+)"/);
    
    if (akia) console.log('4. ACCESS KEY ID:', akia[0]);
    if (secretPattern) console.log('4. SECRET KEY:', secretPattern[1]);
    
    if (akia && secretPattern) {
      const keys = {
        accessKeyId: akia[0],
        secretAccessKey: secretPattern[1]
      };
      fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keys, null, 2));
      console.log('5. Keys saved!');
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-cs-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
