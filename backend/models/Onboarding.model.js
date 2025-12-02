const mongoose = require('mongoose');

const onboardingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
        trim: true,
    },
    foundedYear: {
        type: Number,
        required: true,
    },
    fundingStage: {
        type: String,
        required: true,
        enum: ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Bootstrapped'],
    },
    industry: {
        type: String,
        required: true,
    },
    businessCategory: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    logoUrl: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt field before saving
onboardingSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Onboarding = mongoose.model('Onboarding', onboardingSchema);

module.exports = Onboarding;
