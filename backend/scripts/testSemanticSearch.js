/**
 * Test Script for Semantic Search
 * Tests embedding generation and similarity computation
 * 
 * Usage: node scripts/testSemanticSearch.js
 */

require('dotenv').config();
const { generateEmbedding, profileToText } = require('../utils/embedding.util');
const { cosineSimilarity, computeSimilarityScores } = require('../utils/similarity.util');

// Sample profile data
const sampleProfile1 = {
    _id: 'test1',
    name: 'Priya Sharma',
    location: 'Bangalore, India',
    workExperience: [
        {
            title: 'Senior Full Stack Developer',
            company: 'Zentech',
            startDate: new Date('2022-01-01'),
            endDate: null,
            description: 'Leading MERN stack development and CI/CD automation.'
        },
        {
            title: 'Full Stack Developer',
            company: 'CodeWorks',
            startDate: new Date('2019-06-01'),
            endDate: new Date('2021-12-01'),
            description: 'Worked on React, Node.js and Cloud deployments.'
        }
    ],
    skills: [
        {
            category: 'Full Stack',
            skills: ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS']
        }
    ],
    additionalSkills: {
        skills: ['Team Leadership', 'API Design', 'System Architecture']
    },
    stats: {
        totalExperience: '5 yrs 6 mos'
    }
};

const sampleProfile2 = {
    _id: 'test2',
    name: 'Rahul Kumar',
    location: 'Mumbai, India',
    workExperience: [
        {
            title: 'Frontend Developer',
            company: 'TechCorp',
            startDate: new Date('2021-01-01'),
            endDate: null,
            description: 'Building responsive UIs with React and TypeScript.'
        }
    ],
    skills: [
        {
            category: 'Frontend',
            skills: ['React', 'TypeScript', 'CSS', 'HTML']
        }
    ],
    additionalSkills: {
        skills: ['UI/UX Design', 'Responsive Design']
    },
    stats: {
        totalExperience: '3 yrs'
    }
};

async function testEmbeddings() {
    console.log('🧪 Testing Semantic Search Implementation\n');
    console.log('='.repeat(50));
    
    try {
        // Test 1: Generate embeddings
        console.log('\n📝 Test 1: Generating embeddings for sample profiles...\n');
        
        const text1 = profileToText(sampleProfile1);
        const text2 = profileToText(sampleProfile2);
        
        console.log('Profile 1 text:', text1);
        console.log('\nProfile 2 text:', text2);
        
        console.log('\n⏳ Generating embeddings (this may take a few seconds)...');
        
        const embedding1 = await generateEmbedding(text1);
        console.log(`✅ Profile 1 embedding generated (dimension: ${embedding1.length})`);
        console.log(`   Sample values: [${embedding1.slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]`);
        
        const embedding2 = await generateEmbedding(text2);
        console.log(`✅ Profile 2 embedding generated (dimension: ${embedding2.length})`);
        console.log(`   Sample values: [${embedding2.slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]`);
        
        // Test 2: Compute similarity
        console.log('\n📊 Test 2: Computing cosine similarity...\n');
        
        const similarity = cosineSimilarity(embedding1, embedding2);
        console.log(`Similarity between profiles: ${(similarity * 100).toFixed(2)}%`);
        
        // Test 3: Query matching
        console.log('\n🔍 Test 3: Testing query matching...\n');
        
        const queries = [
            'full stack developer in bangalore',
            'react frontend developer',
            'senior developer with aws experience'
        ];
        
        sampleProfile1.profileEmbedding = embedding1;
        sampleProfile2.profileEmbedding = embedding2;
        
        for (const query of queries) {
            console.log(`Query: "${query}"`);
            const queryEmbedding = await generateEmbedding(query);
            
            const scored = computeSimilarityScores(queryEmbedding, [sampleProfile1, sampleProfile2]);
            
            console.log('  Results:');
            scored.forEach((item, idx) => {
                console.log(`    ${idx + 1}. ${item.profile.name} - ${(item.similarityScore * 100).toFixed(2)}%`);
            });
            console.log('');
        }
        
        // Test 4: Vector properties
        console.log('📐 Test 4: Verifying vector properties...\n');
        
        const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
        const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));
        
        console.log(`Embedding 1 magnitude: ${magnitude1.toFixed(6)} (should be ~1.0 for normalized vector)`);
        console.log(`Embedding 2 magnitude: ${magnitude2.toFixed(6)} (should be ~1.0 for normalized vector)`);
        
        const isNormalized = Math.abs(magnitude1 - 1.0) < 0.001 && Math.abs(magnitude2 - 1.0) < 0.001;
        console.log(`Vectors normalized: ${isNormalized ? '✅ YES' : '❌ NO'}`);
        
        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('✅ All tests completed successfully!');
        console.log('='.repeat(50));
        
        console.log('\n💡 Next steps:');
        console.log('   1. Run: node scripts/generateEmbeddings.js');
        console.log('   2. Test the search API with: POST /api/search');
        console.log('   3. Monitor logs for semantic vs keyword search performance');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error);
        console.error('\nStack trace:', error.stack);
        process.exit(1);
    }
}

// Run tests
testEmbeddings();
