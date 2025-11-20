const express = require('express');
const router = express.Router();
const { submitOnboarding } = require('../controllers/onboarding.controller');

// POST /api/onboarding/submit
router.post('/submit', submitOnboarding);

module.exports = router;
