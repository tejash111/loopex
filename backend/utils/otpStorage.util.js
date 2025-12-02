/**
 * In-memory OTP storage
 * In production, use Redis or database with TTL
 */

const otpStore = new Map();

/**
 * Store OTP with expiration time
 * @param {string} email - User email
 * @param {string} otp - OTP code
 * @param {number} expiresIn - Expiration time in minutes (default: 10)
 */
const storeOTP = (email, otp, expiresIn = 10) => {
    const expiresAt = Date.now() + expiresIn * 60 * 1000;
    otpStore.set(email, {
        otp,
        expiresAt,
        attempts: 0,
    });
    console.log(`OTP stored for ${email}: ${otp} (expires in ${expiresIn} minutes)`);
};

/**
 * Verify OTP code
 * @param {string} email - User email
 * @param {string} otp - OTP code to verify
 * @returns {boolean} - True if OTP is valid
 */
const verifyOTP = (email, otp) => {
    const stored = otpStore.get(email);

    if (!stored) {
        console.log(`No OTP found for ${email}`);
        return false;
    }

    // Check if OTP expired
    if (Date.now() > stored.expiresAt) {
        console.log(`OTP expired for ${email}`);
        otpStore.delete(email);
        return false;
    }

    // Check attempt limit (max 5 attempts)
    if (stored.attempts >= 5) {
        console.log(`Too many attempts for ${email}`);
        otpStore.delete(email);
        return false;
    }

    // Increment attempt counter
    stored.attempts += 1;
    otpStore.set(email, stored);

    // Verify OTP
    if (stored.otp === otp) {
        console.log(`OTP verified successfully for ${email}`);
        return true;
    }

    console.log(`Invalid OTP for ${email} (attempt ${stored.attempts}/5)`);
    return false;
};

/**
 * Remove OTP from storage
 * @param {string} email - User email
 */
const removeOTP = (email) => {
    otpStore.delete(email);
    console.log(`OTP removed for ${email}`);
};

/**
 * Clean up expired OTPs (run periodically)
 */
const cleanupExpiredOTPs = () => {
    const now = Date.now();
    for (const [email, data] of otpStore.entries()) {
        if (now > data.expiresAt) {
            otpStore.delete(email);
            console.log(`Cleaned up expired OTP for ${email}`);
        }
    }
};

// Run cleanup every 5 minutes
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);

module.exports = {
    storeOTP,
    verifyOTP,
    removeOTP,
};
