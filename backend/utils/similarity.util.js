/**
 * Similarity Utility
 * Functions for computing cosine similarity between embedding vectors
 */

/**
 * Compute cosine similarity between two vectors
 * @param {number[]} vecA - First embedding vector
 * @param {number[]} vecB - Second embedding vector
 * @returns {number} - Cosine similarity score (0 to 1)
 */
function cosineSimilarity(vecA, vecB) {
    if (!Array.isArray(vecA) || !Array.isArray(vecB)) {
        throw new Error('Both inputs must be arrays');
    }

    if (vecA.length !== vecB.length) {
        throw new Error('Vectors must have the same length');
    }

    if (vecA.length === 0) {
        return 0;
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        magnitudeA += vecA[i] * vecA[i];
        magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Compute similarity scores for a query embedding against multiple profile embeddings
 * @param {number[]} queryEmbedding - The query embedding vector
 * @param {Array} profiles - Array of profile objects with profileEmbedding field
 * @returns {Array} - Array of { profile, similarityScore } objects, sorted by score DESC
 */
function computeSimilarityScores(queryEmbedding, profiles) {
    const scored = [];

    for (const profile of profiles) {
        // Skip profiles without embeddings
        if (!profile.profileEmbedding || 
            !Array.isArray(profile.profileEmbedding) || 
            profile.profileEmbedding.length === 0) {
            continue;
        }

        try {
            const similarity = cosineSimilarity(queryEmbedding, profile.profileEmbedding);
            scored.push({
                profile,
                similarityScore: similarity
            });
        } catch (error) {
            console.error(`[Similarity] Error computing similarity for profile ${profile._id}:`, error);
            continue;
        }
    }

    // Sort by similarity score descending
    scored.sort((a, b) => b.similarityScore - a.similarityScore);

    return scored;
}

/**
 * Normalize a score to 0-100 range
 * @param {number} score - The score to normalize
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Normalized score (0-100)
 */
function normalizeScore(score, min = 0, max = 1) {
    if (max === min) return 0;
    return ((score - min) / (max - min)) * 100;
}

/**
 * Apply hybrid boosting to similarity scores
 * Combines semantic similarity with traditional matching factors
 * @param {Array} scoredProfiles - Array of { profile, similarityScore } objects
 * @param {Object} filters - The parsed search filters
 * @param {Object} weights - The scoring weights
 * @returns {Array} - Array with updated scores including boosts
 */
function applyHybridBoosting(scoredProfiles, filters, weights) {
    const boostedProfiles = scoredProfiles.map(item => {
        const { profile, similarityScore } = item;
        let boostScore = 0;

        // Base semantic score (dominant - 70% weight)
        const baseScore = similarityScore * 70;

        // Experience boost (10%)
        if (filters.minExperience !== null && profile.stats?.totalExperience) {
            const totalExp = parseExperienceToMonths(profile.stats.totalExperience);
            const minExpMonths = filters.minExperience * 12;
            
            if (totalExp >= minExpMonths) {
                boostScore += 10;
            }
        }

        // Skills boost (10%)
        const allRequestedSkills = [
            ...(filters.skills || []),
            ...(filters.additionalSkills || [])
        ];
        
        if (allRequestedSkills.length > 0) {
            const profileSkills = [
                ...(profile.skills?.flatMap(s => s.skills || []) || []),
                ...(profile.additionalSkills?.skills || [])
            ].map(s => s.toLowerCase());

            const matchedSkills = allRequestedSkills.filter(reqSkill =>
                profileSkills.some(profSkill => 
                    profSkill.includes(reqSkill.toLowerCase()) || 
                    reqSkill.toLowerCase().includes(profSkill)
                )
            );

            const skillMatchRatio = matchedSkills.length / allRequestedSkills.length;
            boostScore += skillMatchRatio * 10;
        }

        // Location boost (5%)
        const locationVariations = [
            ...(filters.locationVariations || []),
            filters.location
        ].filter(Boolean);

        if (locationVariations.length > 0 && profile.location) {
            const locationMatch = locationVariations.some(loc =>
                profile.location.toLowerCase().includes(loc.toLowerCase())
            );
            
            if (locationMatch) {
                boostScore += 5;
            }
        }

        // Job title exact match boost (5%)
        const titleKeywords = [
            ...(filters.jobTitleKeywords || []),
            filters.jobTitle
        ].filter(Boolean);

        if (titleKeywords.length > 0 && profile.workExperience?.length > 0) {
            const hasExactMatch = profile.workExperience.some(exp =>
                titleKeywords.some(keyword =>
                    exp.title.toLowerCase().includes(keyword.toLowerCase())
                )
            );

            if (hasExactMatch) {
                boostScore += 5;
            }
        }

        // Final score = base semantic score + boosts
        const finalScore = baseScore + boostScore;

        return {
            ...item,
            boostScore,
            finalScore,
            breakdown: {
                semanticScore: similarityScore,
                baseScore,
                boostScore,
                finalScore
            }
        };
    });

    // Sort by final score descending
    boostedProfiles.sort((a, b) => b.finalScore - a.finalScore);

    return boostedProfiles;
}

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

module.exports = {
    cosineSimilarity,
    computeSimilarityScores,
    normalizeScore,
    applyHybridBoosting,
    parseExperienceToMonths
};
