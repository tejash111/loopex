/**
 * Search Routes
 * Endpoints for natural language job search
 */

const express = require('express');
const { searchProfiles, getSearchSuggestions } = require('../controllers/search.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * POST /api/search
 * Natural language search for profiles
 * Body: { query: string, limit?: number, skip?: number }
 */
router.post('/', searchProfiles);

/**
 * GET /api/search/suggestions
 * Get autocomplete suggestions
 * Query: ?q=partial_query
 */
router.get('/suggestions', getSearchSuggestions);

module.exports = router;
