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
    
    // Go to CloudShell
    await page.goto('https://us-east-1.console.aws.amazon.com/cloudshell/home', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(20000);
    
    // Click terminal
    await page.locator('canvas').first().click().catch(() => {});
    await page.waitForTimeout(1000);
    
    // Single combined command: create key, save to S3 public bucket
    const cmd = `aws iam create-access-key --user-name StackOne --query 'AccessKey.[AccessKeyId,SecretAccessKey]' --output text > /tmp/k.txt && B=stackone-deploy-keys-$(date +%s) && aws s3 mb s3://$B 2>/dev/null && aws s3 cp /tmp/k.txt s3://$B/k.txt && aws s3api put-object-acl --bucket $B --key k.txt --acl public-read && echo "URL:https://$B.s3.amazonaws.com/k.txt"`;
    
    await page.keyboard.type(cmd, { delay: 10 });
    await page.keyboard.press('Enter');
    await page.waitForTimeout(20000);
    
    // Extract URL from terminal
    const rows = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.xterm-rows > div')).map(r => r.textContent).join('\n');
    });
    
    const urlMatch = rows.match(/https:\/\/stackone-deploy-keys[^ ]+\.s3\.amazonaws\.com\/k\.txt/);
    if (urlMatch) {
      console.log('1. S3 URL:', urlMatch[0]);
      
      // Fetch the keys from S3
      const fetchPage = await context.newPage();
      await fetchPage.goto(urlMatch[0], { timeout: 15000 });
      const content = await fetchPage.evaluate(() => document.body.innerText);
      console.log('2. Key content:', content);
      await fetchPage.close();
      
      // Parse: format is "AccessKeyId\tSecretAccessKey"
      const parts = content.trim().split('\t');
      if (parts.length === 2) {
        const keys = {
          accessKeyId: parts[0].trim(),
          secretAccessKey: parts[1].trim()
        };
        fs.writeFileSync('/home/z/my-project/download/aws-keys.json', JSON.stringify(keys, null, 2));
        console.log('3. KEYS SAVED! AKIA:', keys.accessKeyId);
      }
    } else {
      console.log('No URL found in terminal output');
      console.log('Rows (last 1000):', rows.substring(rows.length - 1000));
    }
    
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
