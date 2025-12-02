const express = require('express');
const router = express.Router();
const { submitOnboarding, getOnboardingStatus } = require('../controllers/onboarding.controller');
const { authenticate } = require('../middleware/auth.middleware');

// POST /api/onboarding/submit
router.post('/submit', submitOnboarding);

// GET /api/onboarding/status/:userId - Check if user has completed onboarding
router.get('/status/:userId', authenticate, getOnboardingStatus);

module.exports = router;
