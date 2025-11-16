const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MAGIC_LINK_EXPIRY = process.env.MAGIC_LINK_EXPIRY || '15m';

const jwtConfig = {
    secret: JWT_SECRET,
    expiresIn: MAGIC_LINK_EXPIRY,
};

module.exports = jwtConfig;
