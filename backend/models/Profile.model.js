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

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
