/**
 * Search Controller
 * Handles natural language search requests with semantic embeddings
 */

const Profile = require('../models/Profile.model');
const { callGroq } = require('../utils/groq.util');
const { buildSearchPipeline, buildFallbackPipeline } = require('../utils/searchQuery.util');
const { generateEmbedding } = require('../utils/embedding.util');
const { computeSimilarityScores, applyHybridBoosting } = require('../utils/similarity.util');

/**
 * POST /api/search
 * Natural language search endpoint with semantic embeddings
 * Accepts a query string, uses embeddings for relevance, and returns ranked results
 */
const searchProfiles = async (req, res) => {
    try {
        const { query, limit = 50, skip = 0, useSemanticSearch = true } = req.body;

        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const trimmedQuery = query.trim();
        console.log(`[Search] Processing query: "${trimmedQuery}"`);
        console.log(`[Search] Semantic search enabled: ${useSemanticSearch}`);

        let parsedFilters = null;
        let filters = {};
        let weights = {};

        try {
            // Step 1: Parse query with LLM (for filter extraction, not primary ranking)
            console.log('[Search] Calling Groq API to parse query...');
            const parsed = await callGroq(trimmedQuery);
            filters = parsed.filters;
            weights = parsed.weights;
            parsedFilters = { filters, weights };

            console.log('[Search] Parsed filters:', JSON.stringify(filters, null, 2));
            console.log('[Search] Weights:', JSON.stringify(weights, null, 2));

        } catch (llmError) {
            console.error('[Search] LLM parsing failed:', llmError.message);
            // Continue without filters - semantic search will still work
        }

        let profiles = [];
        let totalCount = 0;
        let searchMethod = 'semantic';

        // Step 2: Choose search method
        if (useSemanticSearch) {
            try {
                console.log('[Search] Using semantic embedding search...');

                // Generate query embedding
                const queryEmbedding = await generateEmbedding(trimmedQuery);
                console.log(`[Search] Query embedding generated (dimension: ${queryEmbedding.length})`);

                // Fetch profiles with embeddings
                const profilesWithEmbeddings = await Profile.find({
                    $and: [
                        { profileEmbedding: { $exists: true } },
                        { profileEmbedding: { $not: { $size: 0 } } }
                    ]
                }).lean();

                console.log(`[Search] Found ${profilesWithEmbeddings.length} profiles with embeddings`);

                if (profilesWithEmbeddings.length === 0) {
                    console.log('[Search] No profiles with embeddings found, falling back to keyword search');
                    searchMethod = 'keyword-fallback';
                    throw new Error('No embeddings available');
                }

                // Compute similarity scores
                const scoredProfiles = computeSimilarityScores(queryEmbedding, profilesWithEmbeddings);
                console.log(`[Search] Computed similarities for ${scoredProfiles.length} profiles`);

                // Apply hybrid boosting (experience, skills, location)
                const boostedProfiles = applyHybridBoosting(scoredProfiles, filters, weights);
                console.log('[Search] Applied hybrid boosting');

                // Extract profiles with scores
                const rankedProfiles = boostedProfiles.map(item => ({
                    ...item.profile,
                    score: item.finalScore,
                    semanticScore: item.similarityScore,
                    scoreBreakdown: item.breakdown
                }));

                // Apply pagination
                totalCount = rankedProfiles.length;
                profiles = rankedProfiles.slice(parseInt(skip), parseInt(skip) + parseInt(limit));

                console.log(`[Search] Returning ${profiles.length} profiles (${skip} to ${parseInt(skip) + profiles.length} of ${totalCount})`);

            } catch (semanticError) {
                console.error('[Search] Semantic search failed:', semanticError.message);
                console.log('[Search] Falling back to keyword search...');
                searchMethod = 'keyword-fallback';

                // Fallback to keyword search
                const pipeline = parsedFilters
                    ? buildSearchPipeline(filters, weights, { limit: parseInt(limit), skip: parseInt(skip) })
                    : buildFallbackPipeline(trimmedQuery, { limit: parseInt(limit), skip: parseInt(skip) });

                profiles = await Profile.aggregate(pipeline);
                totalCount = profiles.length;
            }
        } else {
            // Use traditional keyword search
            console.log('[Search] Using traditional keyword search...');
            searchMethod = 'keyword';

            const pipeline = parsedFilters
                ? buildSearchPipeline(filters, weights, { limit: parseInt(limit), skip: parseInt(skip) })
                : buildFallbackPipeline(trimmedQuery, { limit: parseInt(limit), skip: parseInt(skip) });

            profiles = await Profile.aggregate(pipeline);
            totalCount = profiles.length;
        }

        console.log(`[Search] Found ${profiles.length} profiles using ${searchMethod}`);

        // Step 3: Return results (same format as before)
        return res.status(200).json({
            success: true,
            message: 'Search completed successfully',
            data: profiles,
            meta: {
                query: trimmedQuery,
                searchMethod,
                parsedFilters: parsedFilters,
                total: totalCount,
                limit: parseInt(limit),
                skip: parseInt(skip),
                returned: profiles.length
            }
        });

    } catch (error) {
        console.error('[Search] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Search failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

/**
 * GET /api/search/suggestions
 * Get search suggestions based on partial query
 */
const getSearchSuggestions = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.status(200).json({
                success: true,
                suggestions: []
            });
        }

        // Get unique job titles
        const titleSuggestions = await Profile.aggregate([
            { $unwind: '$workExperience' },
            {
                $match: {
                    'workExperience.title': { $regex: q, $options: 'i' }
                }
            },
            { $group: { _id: '$workExperience.title' } },
            { $limit: 5 },
            { $project: { _id: 0, suggestion: '$_id', type: { $literal: 'title' } } }
        ]);

        // Get unique skills
        const skillSuggestions = await Profile.aggregate([
            { $unwind: '$skills' },
            { $unwind: '$skills.skills' },
            {
                $match: {
                    'skills.skills': { $regex: q, $options: 'i' }
                }
            },
            { $group: { _id: '$skills.skills' } },
            { $limit: 5 },
            { $project: { _id: 0, suggestion: '$_id', type: { $literal: 'skill' } } }
        ]);

        // Get unique locations
        const locationSuggestions = await Profile.aggregate([
            {
                $match: {
                    location: { $regex: q, $options: 'i' }
                }
            },
            { $group: { _id: '$location' } },
            { $limit: 3 },
            { $project: { _id: 0, suggestion: '$_id', type: { $literal: 'location' } } }
        ]);

        const allSuggestions = [
            ...titleSuggestions,
            ...skillSuggestions,
            ...locationSuggestions
        ].slice(0, 10);

        return res.status(200).json({
            success: true,
            suggestions: allSuggestions
        });

    } catch (error) {
        console.error('[Suggestions] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get suggestions',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

module.exports = {
    searchProfiles,
    getSearchSuggestions
};
