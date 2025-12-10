const Project = require('../models/Project.model');

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.userId; // From auth middleware

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Project name is required'
            });
        }

        // Check if project with same name already exists for this user
        const existingProject = await Project.findOne({ userId, name: name.trim() });
        if (existingProject) {
            return res.status(400).json({
                success: false,
                message: 'A project with this name already exists'
            });
        }

        const project = new Project({
            userId,
            name: name.trim()
        });

        await project.save();

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            project: {
                id: project._id,
                name: project.name,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt
            }
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create project. Please try again.'
        });
    }
};

// Get all projects for a user
exports.getUserProjects = async (req, res) => {
    try {
        const userId = req.user.userId; // From auth middleware

        const projects = await Project.find({ userId })
            .sort({ updatedAt: -1 }) // Most recently updated first
            .select('name createdAt updatedAt');

        res.status(200).json({
            success: true,
            projects: projects.map(project => ({
                id: project._id,
                name: project.name,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt
            }))
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch projects. Please try again.'
        });
    }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId; // From auth middleware

        const project = await Project.findOne({ _id: id, userId });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.status(200).json({
            success: true,
            project: {
                id: project._id,
                name: project.name,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt
            }
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch project. Please try again.'
        });
    }
};

// Update a project
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const userId = req.user.userId; // From auth middleware

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Project name is required'
            });
        }

        const project = await Project.findOne({ _id: id, userId });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Check if another project with the same name exists
        const existingProject = await Project.findOne({
            userId,
            name: name.trim(),
            _id: { $ne: id }
        });

        if (existingProject) {
            return res.status(400).json({
                success: false,
                message: 'A project with this name already exists'
            });
        }

        project.name = name.trim();
        await project.save();

        res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            project: {
                id: project._id,
                name: project.name,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt
            }
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update project. Please try again.'
        });
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId; // From auth middleware

        const project = await Project.findOneAndDelete({ _id: id, userId });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete project. Please try again.'
        });
    }
};

// Add a saved search to a project
exports.addSavedSearch = async (req, res) => {
    try {
        const { id } = req.params;
        const { query } = req.body;
        const userId = req.user.userId;

        if (!query || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const project = await Project.findOne({ _id: id, userId });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Check if search already exists
        const existingSearch = project.savedSearches.find(
            s => s.query.toLowerCase() === query.trim().toLowerCase()
        );

        if (existingSearch) {
            return res.status(400).json({
                success: false,
                message: 'This search is already saved'
            });
        }

        project.savedSearches.push({ query: query.trim() });
        await project.save();

        res.status(201).json({
            success: true,
            message: 'Search saved successfully',
            savedSearches: project.savedSearches
        });
    } catch (error) {
        console.error('Error saving search:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save search. Please try again.'
        });
    }
};

// Get saved searches for a project
exports.getSavedSearches = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const project = await Project.findOne({ _id: id, userId });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.status(200).json({
            success: true,
            savedSearches: project.savedSearches || []
        });
    } catch (error) {
        console.error('Error fetching saved searches:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch saved searches. Please try again.'
        });
    }
};

// Delete a saved search from a project
exports.deleteSavedSearch = async (req, res) => {
    try {
        const { id, searchId } = req.params;
        const userId = req.user.userId;

        const project = await Project.findOne({ _id: id, userId });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        project.savedSearches = project.savedSearches.filter(
            s => s._id.toString() !== searchId
        );
        await project.save();

        res.status(200).json({
            success: true,
            message: 'Search deleted successfully',
            savedSearches: project.savedSearches
        });
    } catch (error) {
        console.error('Error deleting saved search:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete saved search. Please try again.'
        });
    }
};
