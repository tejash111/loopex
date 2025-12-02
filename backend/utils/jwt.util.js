const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

/**
 * Generate a JWT token
 * @param {object} payload - Payload containing userId and email
 * @returns {string} - JWT token
 */
const generateToken = (payload) => {
    const tokenPayload = {
        ...payload,
        timestamp: Date.now(),
    };

    return jwt.sign(tokenPayload, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
    });
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {object|null} - Decoded payload or null if invalid
 */
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        return decoded;
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken,
};
