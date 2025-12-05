/**
 * Search Query Builder Utility
 * Builds MongoDB aggregation pipelines for weighted profile search
 */

/**
 * Parse experience string like "3 yrs 2 mos" to total months
 * @param {string} expString - Experience string
 * @returns {number} - Total months
 */
function parseExperienceToMonths(expString) {
    if (!expString) return 0;

    let totalMonths = 0;

    // Match years
    const yearsMatch = expString.match(/(\d+)\s*(years?|yrs?)/i);
    if (yearsMatch) {
        totalMonths += parseInt(yearsMatch[1]) * 12;
    }

    // Match months
    const monthsMatch = expString.match(/(\d+)\s*(months?|mos?)/i);
    if (monthsMatch) {
        totalMonths += parseInt(monthsMatch[1]);
    }

    return totalMonths;
}

/**
 * Build regex patterns for job title matching
 * @param {string[]} keywords - Array of job title keywords
 * @returns {RegExp[]} - Array of regex patterns
 */
function buildJobTitleRegex(keywords) {
    if (!keywords || keywords.length === 0) return [];

    return keywords.map(keyword => {
        // Escape special regex characters and create case-insensitive pattern
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(escaped, 'i');
    });
}

/**
 * Build the $match stage for filtering
 * Job title/keywords are REQUIRED matches (AND logic)
 * Skills, location, experience are only used for scoring, not filtering
 * @param {Object} filters - The parsed filters from LLM
 * @returns {Object} - MongoDB $match stage
 */
function buildMatchStage(filters) {
    const titleOrConditions = [];

    // Job title matching - these are REQUIRED (using OR within title matches)
    if (filters.jobTitleKeywords && filters.jobTitleKeywords.length > 0) {
        filters.jobTitleKeywords.forEach(keyword => {
            titleOrConditions.push({
                'workExperience.title': { $regex: keyword, $options: 'i' }
            });
        });
    }

    // Main job title
    if (filters.jobTitle) {
        titleOrConditions.push({
            'workExperience.title': { $regex: filters.jobTitle, $options: 'i' }
        });
    }

    // If we have job title conditions, require at least one to match
    if (titleOrConditions.length > 0) {
        return {
            $match: {
                $or: titleOrConditions
            }
        };
    }

    // Location-only search (no job title specified)
    const locationVariations = filters.locationVariations || [];
    if (filters.location) {
        locationVariations.push(filters.location);
    }

    if (locationVariations.length > 0) {
        const locationOrConditions = locationVariations.map(loc => ({
            'location': { $regex: loc, $options: 'i' }
        }));
        return {
            $match: {
                $or: locationOrConditions
            }
        };
    }

    // If no conditions, return empty match (match all)
    return { $match: {} };
}

/**
 * Build the $addFields stage for weighted scoring
 * @param {Object} filters - The parsed filters from LLM
 * @param {Object} weights - The scoring weights
 * @returns {Object} - MongoDB $addFields stage
 */
function buildScoreStage(filters, weights) {
    const scoreExpressions = [];

    // Experience score (+50 if experience exists and has value)
    // We use a simplified approach - just check if experience field exists
    // The $match stage already filters by minExperience if needed
    if (filters.minExperience !== null && filters.minExperience !== undefined) {
        scoreExpressions.push({
            $cond: {
                if: {
                    $and: [
                        { $ne: [{ $ifNull: ['$stats.totalExperience', ''] }, ''] },
                        { $ne: [{ $ifNull: ['$stats.totalExperience', ''] }, null] }
                    ]
                },
                then: weights.experience,
                else: 0
            }
        });
    }

    // Skills score (+20 for each matched skill)
    const allSkills = [...(filters.skills || []), ...(filters.additionalSkills || [])];
    if (allSkills.length > 0) {
        // Create skill matching expression
        scoreExpressions.push({
            $multiply: [
                weights.skills,
                {
                    $size: {
                        $filter: {
                            input: { $ifNull: [{ $reduce: { input: '$skills.skills', initialValue: [], in: { $concatArrays: ['$$value', '$$this'] } } }, []] },
                            as: 'skill',
                            cond: {
                                $or: allSkills.map(s => ({
                                    $regexMatch: { input: '$$skill', regex: s, options: 'i' }
                                }))
                            }
                        }
                    }
                }
            ]
        });

        // Also check additionalSkills
        scoreExpressions.push({
            $multiply: [
                weights.skills,
                {
                    $size: {
                        $filter: {
                            input: { $ifNull: ['$additionalSkills.skills', []] },
                            as: 'skill',
                            cond: {
                                $or: allSkills.map(s => ({
                                    $regexMatch: { input: '$$skill', regex: s, options: 'i' }
                                }))
                            }
                        }
                    }
                }
            ]
        });
    }

    // Job title score (+15 if matches)
    const titleKeywords = filters.jobTitleKeywords || [];
    if (filters.jobTitle) {
        titleKeywords.push(filters.jobTitle);
    }

    if (titleKeywords.length > 0) {
        scoreExpressions.push({
            $cond: {
                if: {
                    $gt: [
                        {
                            $size: {
                                $filter: {
                                    input: { $ifNull: ['$workExperience', []] },
                                    as: 'exp',
                                    cond: {
                                        $or: titleKeywords.map(keyword => ({
                                            $regexMatch: { input: '$$exp.title', regex: keyword, options: 'i' }
                                        }))
                                    }
                                }
                            }
                        },
                        0
                    ]
                },
                then: weights.jobTitle,
                else: 0
            }
        });
    }

    // Location score (+5 if matches any variation)
    const locationVariations = filters.locationVariations || [];
    if (filters.location) {
        locationVariations.push(filters.location);
    }

    if (locationVariations.length > 0) {
        scoreExpressions.push({
            $cond: {
                if: {
                    $or: locationVariations.map(loc => ({
                        $regexMatch: { input: { $ifNull: ['$location', ''] }, regex: loc, options: 'i' }
                    }))
                },
                then: weights.location,
                else: 0
            }
        });
    }

    // If no score expressions, return base score of 0
    if (scoreExpressions.length === 0) {
        return {
            $addFields: {
                score: 0
            }
        };
    }

    return {
        $addFields: {
            score: {
                $add: scoreExpressions
            }
        }
    };
}

/**
 * Build the complete aggregation pipeline for search
 * @param {Object} filters - The parsed filters from LLM
 * @param {Object} weights - The scoring weights
 * @param {Object} options - Additional options (limit, skip)
 * @returns {Array} - MongoDB aggregation pipeline
 */
function buildSearchPipeline(filters, weights, options = {}) {
    const { limit = 50, skip = 0 } = options;

    const pipeline = [];

    // Stage 1: Match (loose OR-based)
    const matchStage = buildMatchStage(filters);
    pipeline.push(matchStage);

    // Stage 2: Add score field
    const scoreStage = buildScoreStage(filters, weights);
    pipeline.push(scoreStage);

    // Stage 3: Sort by score descending
    pipeline.push({
        $sort: { score: -1, createdAt: -1 }
    });

    // Stage 4: Skip for pagination
    if (skip > 0) {
        pipeline.push({ $skip: skip });
    }

    // Stage 5: Limit results
    pipeline.push({ $limit: limit });

    return pipeline;
}

/**
 * Build a simpler pipeline for when LLM parsing fails
 * Uses basic text matching
 * @param {string} query - Original search query
 * @param {Object} options - Additional options
 * @returns {Array} - MongoDB aggregation pipeline
 */
function buildFallbackPipeline(query, options = {}) {
    const { limit = 50, skip = 0 } = options;
    const searchTerms = query.split(/\s+/).filter(term => term.length > 2);

    const pipeline = [];

    if (searchTerms.length > 0) {
        const orConditions = searchTerms.flatMap(term => [
            { name: { $regex: term, $options: 'i' } },
            { location: { $regex: term, $options: 'i' } },
            { 'workExperience.title': { $regex: term, $options: 'i' } },
            { 'workExperience.company': { $regex: term, $options: 'i' } },
            { 'skills.skills': { $regex: term, $options: 'i' } },
            { 'additionalSkills.skills': { $regex: term, $options: 'i' } }
        ]);

        pipeline.push({
            $match: { $or: orConditions }
        });
    }

    // Add a basic relevance score
    pipeline.push({
        $addFields: {
            score: {
                $add: [
                    { $cond: [{ $isArray: '$workExperience' }, { $size: '$workExperience' }, 0] },
                    { $cond: [{ $isArray: '$skills' }, { $multiply: [{ $size: '$skills' }, 5] }, 0] }
                ]
            }
        }
    });

    pipeline.push({ $sort: { score: -1, createdAt: -1 } });

    if (skip > 0) {
        pipeline.push({ $skip: skip });
    }

    pipeline.push({ $limit: limit });

    return pipeline;
}

module.exports = {
    parseExperienceToMonths,
    buildJobTitleRegex,
    buildMatchStage,
    buildScoreStage,
    buildSearchPipeline,
    buildFallbackPipeline
};
