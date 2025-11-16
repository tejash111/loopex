const express = require('express');
const router = express.Router();
const { sendMagicLink, verifyMagicLink } = require('../controllers/auth.controller');

// POST /api/auth/send-magic-link
router.post('/send-magic-link', sendMagicLink);

// POST /api/auth/verify-magic-link
router.post('/verify-magic-link', verifyMagicLink);

module.exports = router;
