const nodemailer = require('nodemailer');

// Create transporter for Zoho SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: { 
        rejectUnauthorized: false 
    },
    family: 4 // Force IPv4 - important for Render deployment
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ SMTP connection error:', error.message);
        console.log('\n📧 To fix Zoho SMTP authentication:');
        console.log('1. Go to https://accounts.zoho.com/home#security/');
        console.log('2. Enable "Two-Factor Authentication" if not already enabled');
        console.log('3. Generate an "App-Specific Password" for SMTP');
        console.log('4. Update SMTP_PASS in your .env file with the app password\n');
    } else {
        console.log('✅ SMTP server is ready to send emails');
    }
});

module.exports = transporter;
