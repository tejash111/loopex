const sgMail = require('../config/mailer.config');
const { getMagicLinkEmailTemplate, getOTPEmailTemplate } = require('./emailTemplates.util');

/**
 * Send magic link email
 * @param {string} email - Recipient email
 * @param {string} magicLink - Magic link URL
 * @returns {Promise}
 */
const sendMagicLinkEmail = async (email, magicLink) => {
    try {
        const msg = {
            to: email,
            from: {
                email: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
                name: process.env.FROM_NAME || 'Loopx Team',
            },
            subject: 'Verify your email - Loopx',
            html: getMagicLinkEmailTemplate(email, magicLink),
        };

        const response = await sgMail.send(msg);
        console.log('Email sent successfully:', response[0].statusCode);
        return { success: true, messageId: response[0].headers['x-message-id'] };
    } catch (error) {
        console.error('Email sending failed:', error.response?.body || error);
        throw new Error('Failed to send verification email');
    }
};

/**
 * Send OTP email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 * @returns {Promise}
 */
const sendOTPEmail = async (email, otp) => {
    try {
        const msg = {
            to: email,
            from: {
                email: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
                name: process.env.FROM_NAME || 'Loopx Team',
            },
            subject: 'Your verification code - Loopx',
            html: getOTPEmailTemplate(email, otp),
        };

        const response = await sgMail.send(msg);
        console.log('OTP email sent successfully:', response[0].statusCode);
        return { success: true, messageId: response[0].headers['x-message-id'] };
    } catch (error) {
        console.error('OTP email sending failed:', error.response?.body || error);
        throw new Error('Failed to send OTP email');
    }
};

module.exports = {
    sendMagicLinkEmail,
    sendOTPEmail,
};
