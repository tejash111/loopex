const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Create a new project
router.post('/', projectController.createProject);

// Get all projects for the authenticated user
router.get('/', projectController.getUserProjects);

// Get a specific project by ID
router.get('/:id', projectController.getProjectById);

// Update a project
router.put('/:id', projectController.updateProject);

// Delete a project
router.delete('/:id', projectController.deleteProject);

// Saved searches routes
router.post('/:id/saved-searches', projectController.addSavedSearch);
router.get('/:id/saved-searches', projectController.getSavedSearches);
router.delete('/:id/saved-searches/:searchId', projectController.deleteSavedSearch);

module.exports = router;
