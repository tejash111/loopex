/**
 * Groq LLM Utility for Natural Language Search
 * Converts natural language queries to structured MongoDB filters
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * System prompt for the LLM to understand how to parse job search queries
 */
const SYSTEM_PROMPT = `You are an expert job search query parser. Your task is to analyze natural language job search queries and extract structured filters for a MongoDB database search.

IMPORTANT RULES:
1. Extract job titles, skills, experience requirements, and locations from the query
2. For job titles, generate related keywords and variations (e.g., "frontend dev" should include "Frontend Developer", "Front-End Engineer", "React Developer", "Web Developer", "FE Developer", "UI Developer")
3. For experience, extract minimum years if mentioned (e.g., "3+ years" = 3, "senior" = 5, "junior" = 0-2)
4. Skills should be normalized (e.g., "react" should be "React", "node" should be "Node.js")
5. For location: CORRECT SPELLING MISTAKES and provide MULTIPLE VARIATIONS. For example:
   - "banglore" or "bangaluru" → locationVariations: ["Bangalore", "Bengaluru", "Banglore", "Bangaluru"]
   - "mumbai" or "bombay" → locationVariations: ["Mumbai", "Bombay"]
   - "delhi" or "new delhi" → locationVariations: ["Delhi", "New Delhi", "NCR"]
   - "chennai" or "madras" → locationVariations: ["Chennai", "Madras"]
   - "kolkata" or "calcutta" → locationVariations: ["Kolkata", "Calcutta"]
   - "hyderabad" or "hyderbad" → locationVariations: ["Hyderabad", "Hyderbad", "Hyd"]
   - "pune" or "poona" → locationVariations: ["Pune", "Poona"]
   - "gurgaon" or "gurugram" → locationVariations: ["Gurgaon", "Gurugram", "Noida", "NCR"]
   Always include common misspellings AND the original user input in locationVariations
6. Return null for any field not mentioned in the query

You MUST respond with ONLY valid JSON in this exact format, no additional text:
{
  "filters": {
    "jobTitle": "string or null - the main job title mentioned",
    "jobTitleKeywords": ["array of related job title variations and keywords"],
    "location": "string or null - the CORRECTED/NORMALIZED location name",
    "locationVariations": ["array of location variations, alternate names, and common misspellings"],
    "minExperience": "number or null - minimum years of experience",
    "skills": ["array of technical skills mentioned"],
    "additionalSkills": ["array of soft skills or secondary skills"],
    "industry": "string or null - industry if mentioned"
  },
  "weights": {
    "experience": 50,
    "skills": 20,
    "jobTitle": 15,
    "location": 5
  }
}`;

/**
 * Call Groq API to parse natural language query into structured filters
 * @param {string} query - The natural language search query
 * @returns {Promise<Object>} - Parsed filters and weights
 */
async function callGroq(query) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        console.error('GROQ_API_KEY not found in environment variables');
        throw new Error('Groq API key not configured');
    }

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: SYSTEM_PROMPT
                    },
                    {
                        role: 'user',
                        content: `Parse this job search query and return structured filters:\n\n"${query}"`
                    }
                ],
                temperature: 0.1, // Low temperature for consistent, deterministic output
                max_tokens: 1024,
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API error:', response.status, errorText);
            throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error('No content in Groq response');
        }

        // Parse the JSON response
        const parsed = JSON.parse(content);

        // Validate and ensure proper structure
        return validateAndNormalizeFilters(parsed);

    } catch (error) {
        console.error('Error calling Groq API:', error);
        // Return fallback filters on error
        return getFallbackFilters(query);
    }
}

/**
 * Validate and normalize the parsed filters
 * @param {Object} parsed - The parsed response from Groq
 * @returns {Object} - Validated and normalized filters
 */
function validateAndNormalizeFilters(parsed) {
    const defaultWeights = {
        experience: 50,
        skills: 20,
        jobTitle: 15,
        location: 5
    };

    const filters = parsed.filters || {};

    return {
        filters: {
            jobTitle: filters.jobTitle || null,
            jobTitleKeywords: Array.isArray(filters.jobTitleKeywords) ? filters.jobTitleKeywords : [],
            location: filters.location || null,
            locationVariations: Array.isArray(filters.locationVariations) ? filters.locationVariations : [],
            minExperience: typeof filters.minExperience === 'number' ? filters.minExperience : null,
            skills: Array.isArray(filters.skills) ? filters.skills : [],
            additionalSkills: Array.isArray(filters.additionalSkills) ? filters.additionalSkills : [],
            industry: filters.industry || null
        },
        weights: {
            ...defaultWeights,
            ...(parsed.weights || {})
        }
    };
}

/**
 * Generate fallback filters by extracting keywords from the query
 * Used when Groq API fails
 * @param {string} query - The original search query
 * @returns {Object} - Fallback filters
 */
function getFallbackFilters(query) {
    const words = query.toLowerCase().split(/\s+/);

    // Common job-related keywords
    const skillKeywords = ['react', 'angular', 'vue', 'javascript', 'typescript', 'python', 'java', 'node', 'nodejs', 'css', 'html', 'sql', 'mongodb', 'aws', 'docker', 'kubernetes', 'git', 'figma', 'photoshop'];
    const titleKeywords = ['developer', 'engineer', 'designer', 'manager', 'analyst', 'architect', 'lead', 'senior', 'junior'];
    const experiencePatterns = /(\d+)\+?\s*(years?|yrs?)/i;

    const extractedSkills = words.filter(w => skillKeywords.includes(w));
    const extractedTitles = words.filter(w => titleKeywords.includes(w));

    // Try to extract experience
    const expMatch = query.match(experiencePatterns);
    const minExperience = expMatch ? parseInt(expMatch[1]) : null;

    return {
        filters: {
            jobTitle: extractedTitles.length > 0 ? extractedTitles.join(' ') : null,
            jobTitleKeywords: extractedTitles,
            location: null,
            minExperience,
            skills: extractedSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
            additionalSkills: [],
            industry: null
        },
        weights: {
            experience: 50,
            skills: 20,
            jobTitle: 15,
            location: 5
        }
    };
}

module.exports = {
    callGroq,
    validateAndNormalizeFilters,
    getFallbackFilters
};
