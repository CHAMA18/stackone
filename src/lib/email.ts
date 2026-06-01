/**
 * AWS SES Email Service for StackOne
 *
 * Uses the existing SES setup in us-east-1:
 * - SMTP: email-smtp.us-east-1.amazonaws.com:587
 * - From: noreply@thestackone.com (verified domain)
 *
 * For production, use the AWS SDK directly instead of SMTP.
 */

interface EmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = "StackOne <noreply@thestackone.com>",
}: EmailParams) {
  // In development/local mode, log instead of sending
  if (process.env.NODE_ENV === "development") {
    console.log("[EMAIL] Sending email:", {
      from,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
    });
    return { success: true, messageId: "dev-mode" };
  }

  try {
    // Production: Use AWS SDK v3 for SES
    const { SESClient, SendEmailCommand } = await import("@aws-sdk/client-ses");

    const client = new SESClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });

    const command = new SendEmailCommand({
      Source: from,
      Destination: {
        ToAddresses: Array.isArray(to) ? to : [to],
      },
      Message: {
        Subject: { Data: subject, Charset: "UTF-8" },
        Body: {
          Html: { Data: html, Charset: "UTF-8" },
        },
      },
    });

    const response = await client.send(command);
    return { success: true, messageId: response.MessageId };
  } catch (error) {
    console.error("[EMAIL] Failed to send:", error);
    return { success: false, error: String(error) };
  }
}

export function getVerificationEmailHtml(name: string, verificationUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Satoshi', -apple-system, sans-serif; background: #050507; color: #f0f0f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .logo { font-size: 24px; font-weight: 700; background: linear-gradient(135deg, #fff 0%, #6d7bff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 40px; }
        .card { background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.005) 100%); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 40px; }
        h1 { color: #f0f0f5; font-size: 22px; font-weight: 700; margin: 0 0 16px; }
        p { color: rgba(139,141,163,0.6); font-size: 14px; line-height: 1.6; margin: 0 0 24px; font-weight: 300; }
        .btn { display: inline-block; background: linear-gradient(135deg, #3b4fff 0%, #2d3fff 100%); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; }
        .footer { color: rgba(139,141,163,0.2); font-size: 11px; text-align: center; margin-top: 40px; letter-spacing: 0.1em; text-transform: uppercase; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">StackOne</div>
        <div class="card">
          <h1>Welcome, ${name}!</h1>
          <p>Thank you for creating your StackOne account. Please verify your email address to get full access to all features and start building the extraordinary.</p>
          <a href="${verificationUrl}" class="btn">Verify Email Address</a>
          <p style="margin-top: 24px; font-size: 12px; color: rgba(139,141,163,0.3);">If you didn't create this account, you can safely ignore this email.</p>
        </div>
        <div class="footer">StackOne Architectural Systems &middot; thestackone.com</div>
      </div>
    </body>
    </html>
  `;
}

export function getWelcomeEmailHtml(name: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Satoshi', -apple-system, sans-serif; background: #050507; color: #f0f0f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .logo { font-size: 24px; font-weight: 700; background: linear-gradient(135deg, #fff 0%, #6d7bff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 40px; }
        .card { background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.005) 100%); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 40px; }
        h1 { color: #f0f0f5; font-size: 22px; font-weight: 700; margin: 0 0 16px; }
        p { color: rgba(139,141,163,0.6); font-size: 14px; line-height: 1.6; margin: 0 0 16px; font-weight: 300; }
        .highlight { color: #6d7bff; font-weight: 500; }
        .btn { display: inline-block; background: linear-gradient(135deg, #3b4fff 0%, #2d3fff 100%); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; }
        .footer { color: rgba(139,141,163,0.2); font-size: 11px; text-align: center; margin-top: 40px; letter-spacing: 0.1em; text-transform: uppercase; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">StackOne</div>
        <div class="card">
          <h1>You're all set, ${name}!</h1>
          <p>Your StackOne account is verified and ready to go. You now have access to your personal dashboard where you can manage projects, collaborate with your team, and track progress.</p>
          <p>Here's what you can do next:</p>
          <p><span class="highlight">1.</span> Create your first project and define your objectives<br>
          <span class="highlight">2.</span> Invite team members to collaborate<br>
          <span class="highlight">3.</span> Explore the dashboard to discover all features</p>
          <a href="${process.env.NEXTAUTH_URL || 'https://thestackone.com'}/dashboard/overview" class="btn">Go to Dashboard</a>
        </div>
        <div class="footer">StackOne Architectural Systems &middot; thestackone.com</div>
      </div>
    </body>
    </html>
  `;
}

export function getPasswordResetEmailHtml(name: string, resetUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Satoshi', -apple-system, sans-serif; background: #050507; color: #f0f0f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .logo { font-size: 24px; font-weight: 700; background: linear-gradient(135deg, #fff 0%, #6d7bff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 40px; }
        .card { background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.005) 100%); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 40px; }
        h1 { color: #f0f0f5; font-size: 22px; font-weight: 700; margin: 0 0 16px; }
        p { color: rgba(139,141,163,0.6); font-size: 14px; line-height: 1.6; margin: 0 0 24px; font-weight: 300; }
        .btn { display: inline-block; background: linear-gradient(135deg, #3b4fff 0%, #2d3fff 100%); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; }
        .footer { color: rgba(139,141,163,0.2); font-size: 11px; text-align: center; margin-top: 40px; letter-spacing: 0.1em; text-transform: uppercase; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">StackOne</div>
        <div class="card">
          <h1>Reset your password</h1>
          <p>We received a request to reset the password for your StackOne account. Click the button below to set a new password. This link will expire in 1 hour.</p>
          <a href="${resetUrl}" class="btn">Reset Password</a>
          <p style="margin-top: 24px; font-size: 12px; color: rgba(139,141,163,0.3);">If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
        </div>
        <div class="footer">StackOne Architectural Systems &middot; thestackone.com</div>
      </div>
    </body>
    </html>
  `;
}
