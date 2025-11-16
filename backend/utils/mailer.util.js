const transporter = require('../config/mailer.config');
const { getMagicLinkEmailTemplate } = require('./emailTemplates.util');

/**
 * Send magic link email
 * @param {string} email - Recipient email
 * @param {string} magicLink - Magic link URL
 * @returns {Promise}
 */
const sendMagicLinkEmail = async (email, magicLink) => {
    try {
        const mailOptions = {
            from: {
                name: process.env.FROM_NAME || 'Loopx Team',
                address: process.env.FROM_EMAIL || process.env.SMTP_USER,
            },
            to: email,
            subject: 'Verify your email - Loopx',
            html: getMagicLinkEmailTemplate(email, magicLink),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error('Failed to send verification email');
    }
};

module.exports = {
    sendMagicLinkEmail,
};
