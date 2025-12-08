const express = require('express');
const router = express.Router();
const shortlistController = require('../controllers/shortlist.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Add profile to shortlist
router.post('/add', shortlistController.addToShortlist);

// Remove profile from shortlist
router.post('/remove', shortlistController.removeFromShortlist);

// Toggle shortlist status (add if not exists, remove if exists)
router.post('/toggle', shortlistController.toggleShortlist);

// Get all shortlisted profiles for a specific project
router.get('/project/:projectId', shortlistController.getShortlistedProfiles);

// Get all shortlisted profiles for the user (across all projects)
router.get('/all', shortlistController.getAllShortlisted);

// Check if a profile is shortlisted in a project
router.get('/status', shortlistController.checkShortlistStatus);

// Batch check shortlist status for multiple profiles
router.post('/batch-status', shortlistController.batchCheckShortlistStatus);

module.exports = router;
