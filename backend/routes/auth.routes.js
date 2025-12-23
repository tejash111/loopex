const express = require('express');
const router = express.Router();
const { signup, resendOTP, verifyOTPCode, login, logout } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// POST /api/auth/signup - Create new account and send OTP
router.post('/signup', signup);

// POST /api/auth/resend-otp - Resend OTP
router.post('/resend-otp', resendOTP);

// POST /api/auth/verify-otp - Verify OTP code
router.post('/verify-otp', verifyOTPCode);

// POST /api/auth/login - Login with email and password
router.post('/login', login);

// POST /api/auth/logout - Logout and clear cookie
router.post('/logout', logout);

// GET /api/auth/me - Get current user info (protected)
router.get('/me', authenticate, (req, res) => {
    res.json({
        success: true,
        user: {
            _id: req.user.userId,
            userId: req.user.userId,
            email: req.user.email,
            verified: req.user.verified,
            onboardingCompleted: req.user.onboardingCompleted
        }
    });
});

module.exports = router;
