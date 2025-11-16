/**
 * Generate HTML email template for magic link verification
 * @param {string} email - User's email
 * @param {string} magicLink - Magic link URL
 * @returns {string} - HTML email template
 */
const getMagicLinkEmailTemplate = (email, magicLink) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          background-color: #f4f4f5;
        }
        .email-container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #131316;
          padding: 40px 30px;
          text-align: center;
        }
        .logo {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          color: #ffffff;
          font-weight: 600;
          margin: 0;
        }
        .content {
          padding: 40px 30px;
        }
        .title {
          font-size: 24px;
          font-weight: 700;
          color: #131316;
          margin: 0 0 16px 0;
        }
        .text {
          font-size: 16px;
          color: #52525b;
          line-height: 1.6;
          margin: 0 0 24px 0;
        }
        .email-highlight {
          color: #131316;
          font-weight: 600;
        }
        .button-container {
          text-align: center;
          margin: 32px 0;
        }
        .verify-button {
          display: inline-block;
          padding: 14px 32px;
          background-color: #875bf7;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        .verify-button:hover {
          background-color: #7047d9;
        }
        .link-text {
          font-size: 14px;
          color: #71717a;
          margin-top: 24px;
        }
        .link-url {
          color: #875bf7;
          word-break: break-all;
        }
        .footer {
          background-color: #fafafa;
          padding: 24px 30px;
          text-align: center;
          font-size: 14px;
          color: #71717a;
        }
        .footer a {
          color: #875bf7;
          text-decoration: none;
        }
        .divider {
          height: 1px;
          background-color: #e4e4e7;
          margin: 24px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1 class="logo">Loopx</h1>
        </div>
        
        <div class="content">
          <h2 class="title">Verify your email address</h2>
          
          <p class="text">
            Hi there! 👋
          </p>
          
          <p class="text">
            We received a request to verify your email address <span class="email-highlight">${email}</span> for your Loopx account.
          </p>
          
          <p class="text">
            Click the button below to verify your email and complete your registration. This link will expire in 15 minutes for security reasons.
          </p>
          
          <div class="button-container">
            <a href="${magicLink}" class="verify-button">Verify Email Address</a>
          </div>
          
          <div class="divider"></div>
          
          <p class="link-text">
            Or copy and paste this link into your browser:<br>
            <span class="link-url">${magicLink}</span>
          </p>
          
          <p class="text" style="margin-top: 32px; font-size: 14px;">
            If you didn't request this email, you can safely ignore it.
          </p>
        </div>
        
        <div class="footer">
          <p>
            Need help? <a href="mailto:support@loopx.com">Contact Support</a>
          </p>
          <p style="margin-top: 8px;">
            © ${new Date().getFullYear()} Loopx. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
    getMagicLinkEmailTemplate,
};
