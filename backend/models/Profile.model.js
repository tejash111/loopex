const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    isPromoted: { type: Boolean, default: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date }, // null means Present
    description: { type: String },
    location: { type: String },
});

const EducationSchema = new mongoose.Schema({
    institute: { type: String, required: true },
    degree: { type: String },
    fieldOfStudy: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String },
});

const SkillSchema = new mongoose.Schema({
    category: { type: String }, // e.g., "Front-end"
    skills: [{ type: String }], // ["Wireframing", "Prototyping", ...]
});

const AdditionalSkillSchema = new mongoose.Schema({
    skills: [{ type: String }],
});

const ProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        name: { type: String, required: true },
        location: { type: String },
        socials: {
            whatsapp: String,
            linkedin: String,
            github: String,
            mail: String,
            portfolio: String,
        },
        workExperience: [ExperienceSchema],
        education: [EducationSchema],
        skills: [SkillSchema],
        additionalSkills: AdditionalSkillSchema,
        languages: [{ type: String }], // ["Telugu", "Hindi", "English"]
        stats: {
            averageTenure: { type: String }, // "3 yrs 1 mo"
            currentTenure: { type: String }, // "7 yrs 2 mos"
            totalExperience: { type: String }, // "24 yrs 8 mos"
        },
        profileEmbedding: { type: [Number], default: [] },
    },
    { timestamps: true }
);

// Middleware to generate embeddings on save
ProfileSchema.pre('save', async function (next) {
    try {
        // Only regenerate embedding if profile data changed
        const changedFields = this.modifiedPaths();
        const relevantFields = ['name', 'location', 'workExperience', 'skills', 'additionalSkills', 'education', 'stats'];
        const shouldRegenerate = relevantFields.some(field => changedFields.includes(field));

        if (shouldRegenerate || this.profileEmbedding.length === 0) {
            console.log(`[Profile] Generating embedding for profile: ${this._id || 'new'}`);

            // Lazy load to avoid circular dependency
            const { generateEmbedding, profileToText } = require('../utils/embedding.util');

            const text = profileToText(this);
            const embedding = await generateEmbedding(text);
            this.profileEmbedding = embedding;

            console.log(`[Profile] Embedding generated (dimension: ${embedding.length})`);
        }

        next();
    } catch (error) {
        console.error('[Profile] Error generating embedding:', error);
        // Don't block profile save if embedding fails
        next();
    }
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
