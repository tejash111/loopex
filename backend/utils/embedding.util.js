/**
 * Embedding Service
 * Generates semantic embeddings using TF-IDF + LLM enhancement
 * This is a hybrid approach that doesn't require dedicated embedding APIs
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const EMBEDDING_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const EMBEDDING_DIMENSION = 384; // Standard dimension for lightweight embeddings

/**
 * Generate embedding vector for a given text
 * Uses LLM-enhanced TF-IDF approach for semantic representation
 * @param {string} text - The text to generate embedding for
 * @returns {Promise<number[]>} - The embedding vector
 */
async function generateEmbedding(text) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        console.error('[Embedding] GROQ_API_KEY not found in environment variables');
        throw new Error('Groq API key not configured');
    }

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        throw new Error('Text must be a non-empty string');
    }

    try {
        // Step 1: Use LLM to extract semantic keywords and their importance
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: EMBEDDING_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a semantic analyzer. Extract the 20 most important keywords from the profile text and assign weights (0.1 to 1.0) based on relevance. Return ONLY valid JSON: {"keywords":[{"term":"keyword","weight":0.9}]}'
                    },
                    {
                        role: 'user',
                        content: `Extract keywords from this profile:\n\n${text.trim()}`
                    }
                ],
                temperature: 0.1,
                max_tokens: 400,
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            console.warn('[Embedding] Groq API error, using fallback embedding');
            // Fallback to simple TF-IDF if API fails
            return generateFallbackEmbedding(text);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            return generateFallbackEmbedding(text);
        }

        // Step 2: Parse semantic features
        let features;
        try {
            features = JSON.parse(content);
        } catch (parseError) {
            console.warn('[Embedding] Failed to parse LLM response, using fallback');
            return generateFallbackEmbedding(text);
        }

        // Step 3: Convert to embedding vector
        const embedding = textToSemanticVector(text, features);
        return embedding;

    } catch (error) {
        console.error('[Embedding] Error generating embedding:', error.message);
        // Fallback to simple embedding
        return generateFallbackEmbedding(text);
    }
}

/**
 * Convert text and semantic features to a fixed-length vector
 * @param {string} text - The original text
 * @param {Object} features - Semantic features from LLM
 * @returns {number[]} - Embedding vector
 */
function textToSemanticVector(text, features) {
    const vector = new Array(EMBEDDING_DIMENSION).fill(0);

    // Extract words from original text
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    const keywords = features.keywords || [];

    // Create a combined vocabulary with weights
    const vocabulary = new Map();

    // Add regular words with base weight
    for (const word of words) {
        vocabulary.set(word, (vocabulary.get(word) || 0) + 0.5);
    }

    // Add LLM-extracted keywords with their weights
    for (const kw of keywords) {
        if (kw.term && kw.weight) {
            const term = kw.term.toLowerCase();
            vocabulary.set(term, (vocabulary.get(term) || 0) + (kw.weight * 2));
        }
    }

    // Hash each term to multiple dimensions (SimHash approach)
    for (const [term, weight] of vocabulary.entries()) {
        const hash1 = djb2Hash(term);
        const hash2 = sdbmHash(term);
        const hash3 = loseHash(term);

        // Map to 3 different positions for better distribution
        const idx1 = Math.abs(hash1) % EMBEDDING_DIMENSION;
        const idx2 = Math.abs(hash2) % EMBEDDING_DIMENSION;
        const idx3 = Math.abs(hash3) % EMBEDDING_DIMENSION;

        vector[idx1] += weight;
        vector[idx2] += weight * 0.8;
        vector[idx3] += weight * 0.6;
    }

    // Normalize to unit vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
        for (let i = 0; i < EMBEDDING_DIMENSION; i++) {
            vector[i] /= magnitude;
        }
    }

    return vector;
}

/**
 * Generate fallback embedding without LLM (pure TF-IDF)
 * @param {string} text - The text
 * @returns {number[]} - Embedding vector
 */
function generateFallbackEmbedding(text) {
    const vector = new Array(EMBEDDING_DIMENSION).fill(0);
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);

    // Term frequency
    const termFreq = new Map();
    for (const word of words) {
        termFreq.set(word, (termFreq.get(word) || 0) + 1);
    }

    // Normalize by document length
    const docLength = words.length || 1;

    // Hash each term to vector
    for (const [term, freq] of termFreq.entries()) {
        const tf = freq / docLength;
        const hash = djb2Hash(term);
        const idx = Math.abs(hash) % EMBEDDING_DIMENSION;
        vector[idx] += tf;
    }

    // Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
        for (let i = 0; i < EMBEDDING_DIMENSION; i++) {
            vector[i] /= magnitude;
        }
    }

    return vector;
}

/**
 * DJB2 hash function
 */
function djb2Hash(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    return hash;
}

/**
 * SDBM hash function
 */
function sdbmHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
    }
    return hash;
}

/**
 * Lose hash function
 */
function loseHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash += str.charCodeAt(i);
    }
    return hash;
}

/**
 * Generate embedding for a profile
 * Concatenates relevant profile fields into a single text representation
 * @param {Object} profile - The profile document
 * @returns {string} - The text representation of the profile
 */
function profileToText(profile) {
    const parts = [];

    // Name
    if (profile.name) {
        parts.push(`Name: ${profile.name}`);
    }

    // Current job title (most recent work experience)
    if (profile.workExperience && profile.workExperience.length > 0) {
        const sortedExp = [...profile.workExperience].sort((a, b) => {
            const aDate = a.endDate || new Date();
            const bDate = b.endDate || new Date();
            return bDate - aDate;
        });
        const currentJob = sortedExp[0];
        parts.push(`Current Role: ${currentJob.title} at ${currentJob.company}`);

        // Add all job titles for better matching
        const allTitles = profile.workExperience.map(exp => exp.title).join(', ');
        parts.push(`Job Titles: ${allTitles}`);
    }

    // Total experience
    if (profile.stats?.totalExperience) {
        parts.push(`Experience: ${profile.stats.totalExperience}`);
    }

    // Location
    if (profile.location) {
        parts.push(`Location: ${profile.location}`);
    }

    // Skills
    if (profile.skills && profile.skills.length > 0) {
        const allSkills = profile.skills
            .flatMap(s => s.skills || [])
            .filter(Boolean)
            .join(', ');
        if (allSkills) {
            parts.push(`Skills: ${allSkills}`);
        }
    }

    // Additional skills
    if (profile.additionalSkills?.skills && profile.additionalSkills.skills.length > 0) {
        parts.push(`Additional Skills: ${profile.additionalSkills.skills.join(', ')}`);
    }

    // Education
    if (profile.education && profile.education.length > 0) {
        const education = profile.education
            .map(e => `${e.degree || ''} ${e.fieldOfStudy || ''} from ${e.institute || ''}`.trim())
            .filter(Boolean)
            .join('; ');
        if (education) {
            parts.push(`Education: ${education}`);
        }
    }

    return parts.join('. ');
}

/**
 * Batch generate embeddings for multiple profiles
 * @param {Array} profiles - Array of profile documents
 * @returns {Promise<Array>} - Array of { profileId, embedding } objects
 */
async function generateBatchEmbeddings(profiles) {
    const results = [];

    for (const profile of profiles) {
        try {
            const text = profileToText(profile);
            const embedding = await generateEmbedding(text);
            results.push({
                profileId: profile._id,
                embedding
            });
        } catch (error) {
            console.error(`[Embedding] Failed to generate embedding for profile ${profile._id}:`, error);
            results.push({
                profileId: profile._id,
                embedding: null,
                error: error.message
            });
        }
    }

    return results;
}

module.exports = {
    generateEmbedding,
    profileToText,
    generateBatchEmbeddings
};
