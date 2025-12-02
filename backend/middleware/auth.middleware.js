const { verifyToken } = require('../utils/jwt.util');
const User = require('../models/User.model');

/**
 * Middleware to authenticate requests using JWT
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided',
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            });
        }

        // Get user from database
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        // Attach user to request object
        req.user = {
            userId: user._id,
            email: user.email,
            verified: user.verified,
            onboardingCompleted: user.onboardingCompleted,
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({
            success: false,
            message: 'Authentication failed',
        });
    }
};

module.exports = { authenticate };
