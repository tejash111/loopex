/**
 * Script to generate embeddings for existing profiles
 * Run this once to populate embeddings for all profiles
 * 
 * Usage: node scripts/generateEmbeddings.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('../models/Profile.model');
const { generateEmbedding, profileToText } = require('../utils/embedding.util');

// MongoDB connection
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/loopex';
        await mongoose.connect(mongoUri);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Main function
async function generateEmbeddings() {
    try {
        await connectDB();

        // Fetch all profiles without embeddings or with empty embeddings
        const profiles = await Profile.find({
            $or: [
                { profileEmbedding: { $exists: false } },
                { profileEmbedding: { $size: 0 } }
            ]
        });

        console.log(`\n📊 Found ${profiles.length} profiles without embeddings\n`);

        if (profiles.length === 0) {
            console.log('✅ All profiles already have embeddings!');
            process.exit(0);
        }

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < profiles.length; i++) {
            const profile = profiles[i];

            try {
                console.log(`[${i + 1}/${profiles.length}] Processing: ${profile.name} (${profile._id})`);

                // Convert profile to text
                const text = profileToText(profile);
                console.log(`   Text length: ${text.length} characters`);

                // Generate embedding
                const embedding = await generateEmbedding(text);
                console.log(`   Embedding dimension: ${embedding.length}`);

                // Update profile
                await Profile.findByIdAndUpdate(profile._id, {
                    profileEmbedding: embedding
                });

                successCount++;
                console.log(`   ✅ Success\n`);

                // Rate limiting - wait 1 second between requests
                if (i < profiles.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

            } catch (error) {
                errorCount++;
                console.error(`   ❌ Error: ${error.message}\n`);
                continue;
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('📊 SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Success: ${successCount}`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log(`📈 Total: ${profiles.length}`);
        console.log('='.repeat(50) + '\n');

    } catch (error) {
        console.error('❌ Script error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 MongoDB disconnected');
        process.exit(0);
    }
}

// Run the script
generateEmbeddings();
