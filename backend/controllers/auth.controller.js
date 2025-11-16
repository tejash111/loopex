const { generateToken } = require('../utils/jwt.util');
const { verifyToken } = require('../utils/jwt.util');
const { sendMagicLinkEmail } = require('../utils/mailer.util');

/**
 * Send magic link to user's email
 */
const sendMagicLink = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format',
            });
        }

        // Generate JWT token
        const token = generateToken(email);

        // Create magic link
        const baseUrl = process.env.MAGIC_LINK_BASE_URL || 'http://localhost:3000/auth/verify';
        const magicLink = `${baseUrl}?token=${token}`;

        // Send email
        await sendMagicLinkEmail(email, magicLink);

        res.status(200).json({
            success: true,
            message: 'Verification email sent successfully',
            email,
        });
    } catch (error) {
        console.error('Error sending magic link:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send verification email',
            error: error.message,
        });
    }
};

/**
 * Verify magic link token
 */
const verifyMagicLink = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is required',
            });
        }

        // Verify token
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            });
        }

        // Token is valid
        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            email: decoded.email,
            verified: true,
        });
    } catch (error) {
        console.error('Error verifying magic link:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify token',
            error: error.message,
        });
    }
};

module.exports = {
    sendMagicLink,
    verifyMagicLink,
};
