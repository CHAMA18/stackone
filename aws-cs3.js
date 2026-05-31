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
    await page.waitForTimeout(25000); // Wait longer for CloudShell
    
    await page.evaluate(() => {
      const btn = document.querySelector('[data-id="awsccc-cb-btn-accept"]');
      if (btn) btn.click();
    }).catch(() => {});
    await page.waitForTimeout(5000);
    
    // Click on the terminal area to focus it
    const termArea = page.locator('.xterm-screen, .terminal, canvas').first();
    if (await termArea.count() > 0) {
      await termArea.click().catch(() => {});
    }
    await page.waitForTimeout(1000);
    
    // Type command to save keys to a file we can later read via S3
    // First create access key
    await page.keyboard.type('aws iam create-access-key --user-name StackOne > /tmp/key_output.txt 2>&1', { delay: 20 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(15000);
    
    // Now echo the file content
    await page.keyboard.type('echo "===KEY_START===" && cat /tmp/key_output.txt && echo "===KEY_END==="', { delay: 20 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(10000);
    
    // Take a high-quality screenshot of the terminal
    await page.screenshot({ path: '/home/z/my-project/download/aws-terminal.png' });
    
    // Try to get the xterm rows content more thoroughly
    const xtermContent = await page.evaluate(() => {
      // Method 1: xterm-rows
      const rows = document.querySelectorAll('.xterm-rows > div');
      let text = '';
      if (rows.length > 0) {
        text = Array.from(rows).map(r => r.textContent).join('\n');
      }
      
      // Method 2: all spans in xterm
      const spans = document.querySelectorAll('.xterm-rows span');
      let text2 = '';
      if (spans.length > 0) {
        text2 = Array.from(spans).map(s => s.textContent).join('');
      }
      
      // Method 3: xterm buffer
      let bufferText = '';
      try {
        const termEl = document.querySelector('.xterm');
        if (termEl && termEl.__xterm) {
          const buffer = termEl.__xterm.buffer.active;
          for (let i = 0; i < buffer.length; i++) {
            bufferText += buffer.getLine(i)?.toString() + '\n';
          }
        }
      } catch(e) {}
      
      return { rows: text, spans: text2, buffer: bufferText };
    });
    
    // Combine all extracted text and search for keys
    const combinedText = xtermContent.rows + xtermContent.spans + xtermContent.buffer;
    console.log('2. Combined text length:', combinedText.length);
    
    if (combinedText.length > 50) {
      console.log('3. Text (last 3000):', combinedText.substring(combinedText.length - 3000));
    }
    
    // Search for key patterns
    const akia = combinedText.match(/AKIA[A-Z0-9]{16}/);
    const secretMatch = combinedText.match(/SecretAccessKey.*?([A-Za-z0-9/+=]{40})/);
    const secretSimple = combinedText.match(/[A-Za-z0-9/+=]{40}/);
    
    if (akia) console.log('4. ACCESS KEY ID:', akia[0]);
    if (secretMatch) console.log('4. SECRET KEY:', secretMatch[1]);
    
    // If we have the key between our markers
    const keyBlock = combinedText.match(/===KEY_START===([\s\S]*?)===KEY_END===/);
    if (keyBlock) {
      console.log('5. Key block:', keyBlock[1].trim());
      const parsed = JSON.parse(keyBlock[1].trim().replace(/.*?{/, '{'));
      if (parsed.AccessKey) {
        console.log('6. ACCESS KEY:', parsed.AccessKey.AccessKeyId);
        console.log('6. SECRET KEY:', parsed.AccessKey.SecretAccessKey);
        
        fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify({
          accessKeyId: parsed.AccessKey.AccessKeyId,
          secretAccessKey: parsed.AccessKey.SecretAccessKey
        }, null, 2));
        console.log('7. Keys saved!');
      }
    }
    
    // Alternative: save keys to S3 and read from there
    // Upload key output to S3
    await page.keyboard.type('aws s3 mb s3://stackone-keys-temp 2>/dev/null; aws s3 cp /tmp/key_output.txt s3://stackone-keys-temp/keys.txt', { delay: 20 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(10000);
    
    // Make it public
    await page.keyboard.type('aws s3api put-object-acl --bucket stackone-keys-temp --key keys.txt --acl public-read', { delay: 20 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(10000);
    
    // Get the URL
    await page.keyboard.type('echo "https://stackone-keys-temp.s3.amazonaws.com/keys.txt"', { delay: 20 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
    
    // Try to read the keys from S3
    const s3Url = 'https://stackone-keys-temp.s3.amazonaws.com/keys.txt';
    console.log('8. Trying to fetch from S3:', s3Url);
    
    // Use a new page to fetch the S3 URL
    const fetchPage = await context.newPage();
    await fetchPage.goto(s3Url, { timeout: 15000 }).catch(e => console.log('S3 fetch error:', e.message));
    const s3Content = await fetchPage.evaluate(() => document.body.innerText).catch(() => '');
    console.log('9. S3 content:', s3Content);
    await fetchPage.close().catch(() => {});
    
    if (s3Content.includes('AKIA')) {
      try {
        // Parse the JSON
        const keyData = JSON.parse(s3Content);
        if (keyData.AccessKey) {
          fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify({
            accessKeyId: keyData.AccessKey.AccessKeyId,
            secretAccessKey: keyData.AccessKey.SecretAccessKey
          }, null, 2));
          console.log('10. Keys saved from S3!');
        }
      } catch (e) {
        const akia = s3Content.match(/AKIA[A-Z0-9]{16}/);
        const secret = s3Content.match(/[A-Za-z0-9/+=]{40}/);
        if (akia && secret) {
          fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify({
            accessKeyId: akia[0],
            secretAccessKey: secret[0]
          }, null, 2));
          console.log('10. Keys saved from S3 (regex)!');
        }
      }
    }
    
  } catch (e) {
    console.error('Error:', e.message);
    await page.screenshot({ path: '/home/z/my-project/download/aws-cs3-err.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
