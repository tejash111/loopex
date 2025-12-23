const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { authenticate } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// All routes require authentication
router.use(authenticate);

// Get all users for messaging
router.get('/users', messageController.getUsers);

// Get conversation with a specific user
router.get('/conversation/:userId', messageController.getConversation);

// Send a message (with optional file upload)
router.post('/send', upload.single('file'), messageController.sendMessage);

// Get unread message count
router.get('/unread-count', messageController.getUnreadCount);

module.exports = router;
