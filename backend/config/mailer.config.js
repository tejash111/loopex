const sgMail = require('@sendgrid/mail');

// Configure SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Verify SendGrid configuration
if (process.env.SENDGRID_API_KEY) {
    console.log('✅ SendGrid API configured successfully');
} else {
    console.warn('⚠️  Warning: SENDGRID_API_KEY not set in environment variables');
}

module.exports = sgMail;
