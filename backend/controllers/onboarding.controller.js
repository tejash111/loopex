// Controller for handling onboarding form submissions

const submitOnboarding = async (req, res) => {
    try {
        const {
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
        if (!email || !company || !foundedYear || !fundingStage || !industry || !businessCategory || !fullName || !role) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // TODO: Save to database
        // For now, we'll just log and return success
        const onboardingData = {
            email,
            company,
            foundedYear: parseInt(foundedYear),
            fundingStage,
            industry,
            businessCategory,
            fullName,
            role,
            logoUrl: logoUrl || null,
            createdAt: new Date().toISOString()
        };

        console.log('Onboarding submission:', onboardingData);

        // TODO: In production, save to database:
        // await OnboardingModel.create(onboardingData);

        res.status(201).json({
            success: true,
            message: 'Onboarding completed successfully',
            data: {
                email,
                company,
                fullName,
                role
            }
        });

    } catch (error) {
        console.error('Error submitting onboarding:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit onboarding data'
        });
    }
};

module.exports = {
    submitOnboarding
};
