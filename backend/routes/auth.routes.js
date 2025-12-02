const express = require('express');
const router = express.Router();
const { signup, resendOTP, verifyOTPCode, login } = require('../controllers/auth.controller');

// POST /api/auth/signup - Create new account and send OTP
router.post('/signup', signup);

// POST /api/auth/resend-otp - Resend OTP
router.post('/resend-otp', resendOTP);

// POST /api/auth/verify-otp - Verify OTP code
router.post('/verify-otp', verifyOTPCode);

// POST /api/auth/login - Login with email and password
router.post('/login', login);

module.exports = router;
