/**
 * Search Controller
 * Handles natural language search requests
 */

const Profile = require('../models/Profile.model');
const { callGroq } = require('../utils/groq.util');
const { buildSearchPipeline, buildFallbackPipeline } = require('../utils/searchQuery.util');

/**
 * POST /api/search
 * Natural language search endpoint
 * Accepts a query string, uses LLM to parse it, and returns weighted search results
 */
const searchProfiles = async (req, res) => {
    try {
        const { query, limit = 50, skip = 0 } = req.body;

        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const trimmedQuery = query.trim();
        console.log(`[Search] Processing query: "${trimmedQuery}"`);

        let pipeline;
        let parsedFilters = null;

        try {
            // Step 1: Call Groq LLM to parse natural language query
            console.log('[Search] Calling Groq API to parse query...');
            const { filters, weights } = await callGroq(trimmedQuery);
            parsedFilters = { filters, weights };

            console.log('[Search] Parsed filters:', JSON.stringify(filters, null, 2));
            console.log('[Search] Weights:', JSON.stringify(weights, null, 2));

            // Step 2: Build MongoDB aggregation pipeline with weighted scoring
            pipeline = buildSearchPipeline(filters, weights, {
                limit: parseInt(limit),
                skip: parseInt(skip)
            });

        } catch (llmError) {
            console.error('[Search] LLM parsing failed, using fallback:', llmError.message);

            // Use fallback pipeline if LLM fails
            pipeline = buildFallbackPipeline(trimmedQuery, {
                limit: parseInt(limit),
                skip: parseInt(skip)
            });
        }

        console.log('[Search] Executing aggregation pipeline...');
        console.log('[Search] Pipeline:', JSON.stringify(pipeline, null, 2));

        // Step 3: Execute the search
        const profiles = await Profile.aggregate(pipeline);

        console.log(`[Search] Found ${profiles.length} profiles`);

        // Step 4: Get total count for pagination (without limit/skip)
        let totalCount = profiles.length;
        if (pipeline.length > 0) {
            const countPipeline = pipeline.filter(stage =>
                !stage.$limit && !stage.$skip && !stage.$sort
            );
            countPipeline.push({ $count: 'total' });

            try {
                const countResult = await Profile.aggregate(countPipeline);
                totalCount = countResult[0]?.total || profiles.length;
            } catch (countError) {
                console.error('[Search] Count query failed:', countError.message);
            }
        }

        // Step 5: Return results
        return res.status(200).json({
            success: true,
            message: 'Search completed successfully',
            data: profiles,
            meta: {
                query: trimmedQuery,
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
