const { generateToken } = require('../utils/jwt.util');
const bcrypt = require('bcryptjs');
const { sendOTPEmail } = require('../utils/mailer.util');
const User = require('../models/User.model');

/**
 * Sign up - Create account with email and password, send OTP
 */
const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
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

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long',
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });

        // If user exists and is verified, don't allow signup
        if (existingUser && existingUser.verified) {
            return res.status(400).json({
                success: false,
                message: 'User already exists. Please login instead.',
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // If unverified user exists, update their details and resend OTP
        if (existingUser && !existingUser.verified) {
            existingUser.password = hashedPassword;
            existingUser.otp = {
                code: otp,
                expiresAt: otpExpiresAt,
            };
            await existingUser.save();

            // Send OTP email
            await sendOTPEmail(email, otp);

            return res.status(200).json({
                success: true,
                message: 'OTP sent to your email',
                email: email.toLowerCase(),
            });
        }

        // Create new user
        const newUser = new User({
            email: email.toLowerCase(),
            password: hashedPassword,
            verified: false,
            otp: {
                code: otp,
                expiresAt: otpExpiresAt,
            },
        });

        await newUser.save();

        // Send OTP email
        await sendOTPEmail(email, otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email',
            email: email.toLowerCase(),
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create account',
            error: error.message,
        });
    }
};

/**
 * Resend OTP
 */
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Generate new 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Update user with new OTP
        user.otp = {
            code: otp,
            expiresAt: otpExpiresAt,
        };
        await user.save();

        // Send OTP email
        await sendOTPEmail(email, otp);

        res.status(200).json({
            success: true,
            message: 'OTP resent successfully',
        });
    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to resend OTP',
            error: error.message,
        });
    }
};

/**
 * Verify OTP and activate account
 */
const verifyOTPCode = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required',
            });
        }

        // Get user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check if OTP exists and is not expired
        if (!user.otp || !user.otp.code) {
            return res.status(401).json({
                success: false,
                message: 'No OTP found. Please request a new one.',
            });
        }

        if (new Date() > user.otp.expiresAt) {
            return res.status(401).json({
                success: false,
                message: 'OTP has expired. Please request a new one.',
            });
        }

        // Verify OTP
        if (user.otp.code !== otp) {
            return res.status(401).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        // Mark user as verified and remove OTP
        user.verified = true;
        user.otp = undefined;
        await user.save();

        // Generate JWT token for session
        const token = generateToken({ userId: user._id, email: user.email });

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            token,
            user: {
                userId: user._id,
                email: user.email,
                verified: user.verified,
                onboardingCompleted: user.onboardingCompleted,
            },
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify OTP',
            error: error.message,
        });
    }
};

/**
 * Login with email and password
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        // Get user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check if user is verified
        if (!user.verified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email first',
                needsVerification: true,
                email: user.email,
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate JWT token
        const token = generateToken({ userId: user._id, email: user.email });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                userId: user._id,
                email: user.email,
                verified: user.verified,
                onboardingCompleted: user.onboardingCompleted,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message,
        });
    }
};

module.exports = {
    signup,
    resendOTP,
    verifyOTPCode,
    login,
};
