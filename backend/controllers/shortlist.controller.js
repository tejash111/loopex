const Shortlist = require('../models/Shortlist.model');
const Project = require('../models/Project.model');
const Profile = require('../models/Profile.model');

// Add profile to shortlist
exports.addToShortlist = async (req, res) => {
    try {
        const { profileId, projectId } = req.body;
        const userId = req.user.userId;

        if (!profileId || !projectId) {
            return res.status(400).json({
                success: false,
                message: 'Profile ID and Project ID are required',
            });
        }

        // Verify the project exists and belongs to the user
        const project = await Project.findOne({ _id: projectId, userId });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found or access denied',
            });
        }

        // Verify the profile exists
        const profile = await Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found',
            });
        }

        // Check if already shortlisted
        const existingShortlist = await Shortlist.findOne({
            userId,
            profileId,
            projectId,
        });

        if (existingShortlist) {
            return res.status(400).json({
                success: false,
                message: 'Profile is already shortlisted in this project',
            });
        }

        // Create shortlist entry
        const shortlist = new Shortlist({
            userId,
            profileId,
            projectId,
            projectName: project.name,
        });

        await shortlist.save();

        res.status(201).json({
            success: true,
            message: 'Profile shortlisted successfully',
            shortlist,
        });
    } catch (error) {
        console.error('Error adding to shortlist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add profile to shortlist',
            error: error.message,
        });
    }
};

// Remove profile from shortlist
exports.removeFromShortlist = async (req, res) => {
    try {
        const { profileId, projectId } = req.body;
        const userId = req.user.userId;

        if (!profileId || !projectId) {
            return res.status(400).json({
                success: false,
                message: 'Profile ID and Project ID are required',
            });
        }

        const result = await Shortlist.findOneAndDelete({
            userId,
            profileId,
            projectId,
        });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Shortlist entry not found',
            });
        }

        res.json({
            success: true,
            message: 'Profile removed from shortlist',
        });
    } catch (error) {
        console.error('Error removing from shortlist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove profile from shortlist',
            error: error.message,
        });
    }
};

// Toggle shortlist status
exports.toggleShortlist = async (req, res) => {
    try {
        const { profileId, projectId } = req.body;
        const userId = req.user.userId;

        if (!profileId || !projectId) {
            return res.status(400).json({
                success: false,
                message: 'Profile ID and Project ID are required',
            });
        }

        // Verify the project exists and belongs to the user
        const project = await Project.findOne({ _id: projectId, userId });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found or access denied',
            });
        }

        // Check if already shortlisted
        const existingShortlist = await Shortlist.findOne({
            userId,
            profileId,
            projectId,
        });

        if (existingShortlist) {
            // Remove from shortlist
            await Shortlist.findByIdAndDelete(existingShortlist._id);
            return res.json({
                success: true,
                message: 'Profile removed from shortlist',
                isShortlisted: false,
            });
        } else {
            // Add to shortlist
            const shortlist = new Shortlist({
                userId,
                profileId,
                projectId,
                projectName: project.name,
            });
            await shortlist.save();
            return res.status(201).json({
                success: true,
                message: 'Profile shortlisted successfully',
                isShortlisted: true,
                shortlist,
            });
        }
    } catch (error) {
        console.error('Error toggling shortlist:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle shortlist status',
            error: error.message,
        });
    }
};

// Get all shortlisted profiles for a project
exports.getShortlistedProfiles = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.userId;

        const shortlists = await Shortlist.find({ userId, projectId })
            .populate('profileId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            shortlists,
            profiles: shortlists.map((s) => s.profileId),
        });
    } catch (error) {
        console.error('Error fetching shortlisted profiles:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch shortlisted profiles',
            error: error.message,
        });
    }
};

// Get all shortlisted profiles for a user (across all projects)
exports.getAllShortlisted = async (req, res) => {
    try {
        const userId = req.user.userId;

        const shortlists = await Shortlist.find({ userId })
            .populate('profileId')
            .populate('projectId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            shortlists,
        });
    } catch (error) {
        console.error('Error fetching all shortlisted profiles:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch shortlisted profiles',
            error: error.message,
        });
    }
};

// Check if a profile is shortlisted in a project
exports.checkShortlistStatus = async (req, res) => {
    try {
        const { profileId, projectId } = req.query;
        const userId = req.user.userId;

        if (!profileId || !projectId) {
            return res.status(400).json({
                success: false,
                message: 'Profile ID and Project ID are required',
            });
        }

        const shortlist = await Shortlist.findOne({
            userId,
            profileId,
            projectId,
        });

        res.json({
            success: true,
            isShortlisted: !!shortlist,
            shortlist: shortlist || null,
        });
    } catch (error) {
        console.error('Error checking shortlist status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check shortlist status',
            error: error.message,
        });
    }
};

// Get shortlist status for multiple profiles in a project (batch check)
exports.batchCheckShortlistStatus = async (req, res) => {
    try {
        const { profileIds, projectId } = req.body;
        const userId = req.user.userId;

        if (!profileIds || !Array.isArray(profileIds) || !projectId) {
            return res.status(400).json({
                success: false,
                message: 'Profile IDs array and Project ID are required',
            });
        }

        const shortlists = await Shortlist.find({
            userId,
            profileId: { $in: profileIds },
            projectId,
        });

        // Create a map of profileId -> isShortlisted
        const shortlistMap = {};
        profileIds.forEach((id) => {
            shortlistMap[id] = false;
        });
        shortlists.forEach((s) => {
            shortlistMap[s.profileId.toString()] = true;
        });

        res.json({
            success: true,
            shortlistMap,
        });
    } catch (error) {
        console.error('Error batch checking shortlist status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check shortlist status',
            error: error.message,
        });
    }
};
