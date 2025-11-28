const nodemailer = require('nodemailer');

// Create transporter for Zoho SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.SMTP_PORT || '465'), // Try port 465 (SSL) - often more reliable on Render
    secure: process.env.SMTP_PORT === '465', // Use SSL for port 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2' // Ensure TLS 1.2 minimum
    },
    requireTLS: true, // Force TLS
    connectionTimeout: 30000, // 30 seconds - increased for Render
    greetingTimeout: 10000, // 10 seconds greeting timeout
    socketTimeout: 30000, // 30 seconds socket timeout
    family: 4, // Force IPv4 - important for Render deployment
    logger: process.env.NODE_ENV === 'production', // Enable logging in production
    debug: process.env.NODE_ENV === 'production' // Enable debug in production
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ SMTP connection error:', error.message);
    } else {
        console.log('✅ SMTP server is ready to send emails');
    }
});

module.exports = transporter;
