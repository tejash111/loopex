const mongoose = require('mongoose');

const ShortlistSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        profileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
            required: true,
        },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        projectName: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

// Compound index to ensure a profile can only be shortlisted once per project per user
ShortlistSchema.index({ userId: 1, profileId: 1, projectId: 1 }, { unique: true });

const Shortlist = mongoose.model('Shortlist', ShortlistSchema);

module.exports = Shortlist;
