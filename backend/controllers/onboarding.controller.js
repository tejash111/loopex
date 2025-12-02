// Controller for handling onboarding form submissions
const User = require('../models/User.model');
const Onboarding = require('../models/Onboarding.model');

const submitOnboarding = async (req, res) => {
    try {
        const {
            userId,
            email,
            company,
            foundedYear,
            fundingStage,
            industry,
            businessCategory,
            fullName,
            role,
            logoUrl
        } = req.body;

        // Validate required fields
        if (!userId || !email || !company || !foundedYear || !fundingStage || !industry || !businessCategory || !fullName || !role) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Verify user exists and is verified
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.verified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email first'
            });
        }

        // Check if onboarding already exists for this user
        let onboarding = await Onboarding.findOne({ userId });

        if (onboarding) {
            // Update existing onboarding
            onboarding.company = company;
            onboarding.foundedYear = parseInt(foundedYear);
            onboarding.fundingStage = fundingStage;
            onboarding.industry = industry;
            onboarding.businessCategory = businessCategory;
            onboarding.fullName = fullName;
            onboarding.role = role;
            onboarding.logoUrl = logoUrl || null;
            await onboarding.save();
        } else {
            // Create new onboarding
            onboarding = new Onboarding({
                userId,
                email: email.toLowerCase(),
                company,
                foundedYear: parseInt(foundedYear),
                fundingStage,
                industry,
                businessCategory,
                fullName,
                role,
                logoUrl: logoUrl || null,
            });
            await onboarding.save();
        }

        // Mark user's onboarding as completed
        user.onboardingCompleted = true;
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Onboarding completed successfully',
            data: {
                userId: user._id,
                email: user.email,
                company,
                fullName,
                role,
                onboardingCompleted: true,
            }
        });

    } catch (error) {
        console.error('Error submitting onboarding:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit onboarding data',
            error: error.message
        });
    }
};

const getOnboardingStatus = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Get user from database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            onboardingCompleted: user.onboardingCompleted || false,
            verified: user.verified
        });

    } catch (error) {
        console.error('Error getting onboarding status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get onboarding status',
            error: error.message
        });
    }
};

module.exports = {
    submitOnboarding,
    getOnboardingStatus
};
