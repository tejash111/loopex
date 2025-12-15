/**
 * Health Check Script for Semantic Search
 * Verifies the semantic search system is working correctly
 * 
 * Usage: node scripts/healthCheck.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('../models/Profile.model');
const { generateEmbedding } = require('../utils/embedding.util');
const { cosineSimilarity } = require('../utils/similarity.util');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/loopex';
        await mongoose.connect(mongoUri);
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        return false;
    }
};

async function healthCheck() {
    console.log('🏥 Semantic Search Health Check\n');
    console.log('='.repeat(60));
    
    const results = {
        passed: 0,
        failed: 0,
        warnings: 0
    };

    // Check 1: Environment Variables
    console.log('\n✓ Check 1: Environment Variables');
    if (process.env.GROQ_API_KEY) {
        console.log('  ✅ GROQ_API_KEY is set');
        results.passed++;
    } else {
        console.log('  ❌ GROQ_API_KEY is missing');
        results.failed++;
    }

    // Check 2: Database Connection
    console.log('\n✓ Check 2: Database Connection');
    const dbConnected = await connectDB();
    if (dbConnected) {
        console.log('  ✅ MongoDB connected');
        results.passed++;
    } else {
        console.log('  ❌ MongoDB connection failed');
        results.failed++;
        return printSummary(results);
    }

    // Check 3: Profile Count
    console.log('\n✓ Check 3: Profile Count');
    try {
        const totalProfiles = await Profile.countDocuments();
        console.log(`  ✅ Total profiles: ${totalProfiles}`);
        results.passed++;

        if (totalProfiles === 0) {
            console.log('  ⚠️  Warning: No profiles found in database');
            results.warnings++;
        }
    } catch (error) {
        console.log('  ❌ Failed to count profiles:', error.message);
        results.failed++;
    }

    // Check 4: Embeddings Count
    console.log('\n✓ Check 4: Embeddings Status');
    try {
        const withEmbeddings = await Profile.countDocuments({
            profileEmbedding: { $exists: true, $not: { $size: 0 } }
        });
        const withoutEmbeddings = await Profile.countDocuments({
            $or: [
                { profileEmbedding: { $exists: false } },
                { profileEmbedding: { $size: 0 } }
            ]
        });

        console.log(`  ✅ Profiles with embeddings: ${withEmbeddings}`);
        console.log(`  ℹ️  Profiles without embeddings: ${withoutEmbeddings}`);
        
        results.passed++;

        if (withoutEmbeddings > 0) {
            console.log(`  ⚠️  Warning: ${withoutEmbeddings} profiles need embeddings`);
            console.log('     Run: node scripts/generateEmbeddings.js');
            results.warnings++;
        }
    } catch (error) {
        console.log('  ❌ Failed to check embeddings:', error.message);
        results.failed++;
    }

    // Check 5: Embedding Generation
    console.log('\n✓ Check 5: Embedding Generation');
    try {
        const testText = 'Senior Full Stack Developer with React and Node.js experience in Bangalore';
        const embedding = await generateEmbedding(testText);
        
        if (embedding && Array.isArray(embedding) && embedding.length > 0) {
            console.log(`  ✅ Embedding generated successfully (dimension: ${embedding.length})`);
            results.passed++;

            // Check if normalized
            const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
            const isNormalized = Math.abs(magnitude - 1.0) < 0.01;
            
            if (isNormalized) {
                console.log(`  ✅ Vector is normalized (magnitude: ${magnitude.toFixed(6)})`);
            } else {
                console.log(`  ⚠️  Warning: Vector not normalized (magnitude: ${magnitude.toFixed(6)})`);
                results.warnings++;
            }
        } else {
            console.log('  ❌ Invalid embedding generated');
            results.failed++;
        }
    } catch (error) {
        console.log('  ❌ Embedding generation failed:', error.message);
        results.failed++;
    }

    // Check 6: Similarity Computation
    console.log('\n✓ Check 6: Similarity Computation');
    try {
        const vec1 = Array(384).fill(0).map(() => Math.random());
        const vec2 = Array(384).fill(0).map(() => Math.random());
        
        const similarity = cosineSimilarity(vec1, vec2);
        
        if (typeof similarity === 'number' && similarity >= 0 && similarity <= 1) {
            console.log(`  ✅ Similarity computed: ${similarity.toFixed(4)}`);
            results.passed++;
        } else {
            console.log(`  ❌ Invalid similarity: ${similarity}`);
            results.failed++;
        }
    } catch (error) {
        console.log('  ❌ Similarity computation failed:', error.message);
        results.failed++;
    }

    // Check 7: Sample Profile Test
    console.log('\n✓ Check 7: Sample Profile Test');
    try {
        const sampleProfile = await Profile.findOne({ profileEmbedding: { $exists: true, $not: { $size: 0 } } });
        
        if (sampleProfile) {
            console.log(`  ✅ Found profile with embedding: ${sampleProfile.name}`);
            console.log(`     Embedding dimension: ${sampleProfile.profileEmbedding.length}`);
            
            // Test similarity with a query
            const query = 'developer';
            const queryEmbedding = await generateEmbedding(query);
            const similarity = cosineSimilarity(queryEmbedding, sampleProfile.profileEmbedding);
            
            console.log(`     Similarity with query "${query}": ${(similarity * 100).toFixed(2)}%`);
            results.passed++;
        } else {
            console.log('  ⚠️  No profiles with embeddings found');
            console.log('     Run: node scripts/generateEmbeddings.js');
            results.warnings++;
        }
    } catch (error) {
        console.log('  ⚠️  Sample profile test skipped:', error.message);
        results.warnings++;
    }

    // Check 8: API Availability
    console.log('\n✓ Check 8: Groq API Availability');
    try {
        const testEmbedding = await generateEmbedding('test');
        if (testEmbedding && testEmbedding.length > 0) {
            console.log('  ✅ Groq API is accessible');
            results.passed++;
        } else {
            console.log('  ❌ Groq API returned invalid response');
            results.failed++;
        }
    } catch (error) {
        console.log('  ❌ Groq API not accessible:', error.message);
        results.failed++;
    }

    await mongoose.disconnect();
    printSummary(results);
}

function printSummary(results) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 HEALTH CHECK SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`⚠️  Warnings: ${results.warnings}`);
    console.log('='.repeat(60));

    if (results.failed === 0 && results.warnings === 0) {
        console.log('\n🎉 All checks passed! Semantic search is healthy.');
    } else if (results.failed === 0) {
        console.log('\n✅ System is operational but has warnings.');
    } else {
        console.log('\n❌ System has critical issues. Please fix failed checks.');
    }

    console.log('\n💡 Next Steps:');
    if (results.failed > 0) {
        console.log('   1. Fix the failed checks above');
        console.log('   2. Check logs for detailed error messages');
        console.log('   3. Verify .env configuration');
    } else if (results.warnings > 0) {
        console.log('   1. Run: node scripts/generateEmbeddings.js');
        console.log('   2. Re-run this health check');
    } else {
        console.log('   1. Test the search API');
        console.log('   2. Monitor search quality');
        console.log('   3. Collect user feedback');
    }

    process.exit(results.failed > 0 ? 1 : 0);
}

// Run health check
healthCheck().catch(error => {
    console.error('\n❌ Health check failed:', error);
    process.exit(1);
});
