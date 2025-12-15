# Semantic Search Implementation Guide

## Overview

The search system has been upgraded from keyword-based to **semantic embedding-based search** while maintaining the same API contract. The frontend requires NO changes.

## Architecture

### Key Components

1. **Embedding Service** (`utils/embedding.util.js`)
   - Generates embeddings using Groq's embedding API
   - Converts profiles to searchable text
   - Handles batch embedding generation

2. **Similarity Service** (`utils/similarity.util.js`)
   - Computes cosine similarity between embeddings
   - Applies hybrid boosting (semantic + traditional factors)
   - Ranks profiles by relevance

3. **Search Controller** (`controllers/search.controller.js`)
   - Maintains existing API contract
   - Uses semantic search as primary method
   - Falls back to keyword search if needed

4. **Profile Model** (`models/Profile.model.js`)
   - Stores `profileEmbedding` field (number array)
   - Auto-generates embeddings on create/update

## How It Works

### Search Flow

```
User Query → Generate Query Embedding → Find Similar Profiles → Apply Boosting → Return Ranked Results
```

1. **Query Embedding**: User's search query is converted to an embedding vector
2. **Similarity Computation**: Cosine similarity calculated against all profile embeddings
3. **Hybrid Boosting**: Semantic score (70%) + traditional factors (30%)
   - Experience match: +10%
   - Skills match: +10%
   - Location match: +5%
   - Job title match: +5%
4. **Ranking**: Profiles sorted by final score (descending)

### Embedding Generation

Profiles are embedded based on:
- Name
- Job titles (current + all previous)
- Total experience
- Location
- Skills (technical + soft skills)
- Education

## Setup

### 1. Environment Variables

Add to `.env`:
```bash
GROQ_API_KEY=your_groq_api_key_here
```

### 2. Generate Embeddings for Existing Profiles

Run the migration script once:

```bash
cd backend
node scripts/generateEmbeddings.js
```

This will:
- Find all profiles without embeddings
- Generate embeddings for each profile
- Update profiles in the database
- Show progress and summary

### 3. Auto-Generation for New Profiles

Embeddings are automatically generated when:
- A new profile is created
- An existing profile is updated (if relevant fields changed)

This happens via Mongoose middleware in `Profile.model.js`.

## API Usage

### Frontend (No Changes Required!)

The API contract remains identical:

```javascript
// Same as before
POST /api/search
Body: {
  "query": "full stack developer in bangalore",
  "limit": 50,
  "skip": 0
}
```

### Optional: Control Search Method

You can explicitly choose the search method:

```javascript
// Use semantic search (default)
{
  "query": "senior react developer",
  "useSemanticSearch": true
}

// Use keyword search (legacy)
{
  "query": "senior react developer",
  "useSemanticSearch": false
}
```

### Response Format

Response includes semantic scores:

```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "location": "Bangalore",
      "score": 85.4,
      "semanticScore": 0.92,
      "scoreBreakdown": {
        "semanticScore": 0.92,
        "baseScore": 64.4,
        "boostScore": 21,
        "finalScore": 85.4
      },
      "workExperience": [...],
      "skills": [...]
    }
  ],
  "meta": {
    "query": "full stack developer in bangalore",
    "searchMethod": "semantic",
    "total": 45,
    "limit": 50,
    "skip": 0,
    "returned": 45
  }
}
```

## Scoring Breakdown

### Semantic Score (70% weight)
- Raw cosine similarity: 0 to 1
- Multiplied by 70 for base score

### Boost Factors (30% weight)
- **Experience boost (+10%)**: If candidate meets minimum experience requirement
- **Skills boost (+10%)**: Proportional to skill overlap (e.g., 3/5 matched = 6%)
- **Location boost (+5%)**: Exact location match
- **Job title boost (+5%)**: Exact job title match in work experience

### Example Calculation
```
Query: "Senior React Developer in Bangalore with 5+ years"
Profile: React Dev with 6 years in Bangalore

Semantic Score: 0.89
Base Score: 0.89 × 70 = 62.3

Boosts:
- Experience: +10 (6 years >= 5 years)
- Skills: +8 (4/5 matched: React, JavaScript, Node, AWS)
- Location: +5 (Bangalore match)
- Job Title: +5 (Has "React Developer")

Final Score: 62.3 + 10 + 8 + 5 + 5 = 90.3
```

## Migration Strategy

### Phase 1: Soft Launch (Current)
✅ Semantic search enabled by default
✅ Automatic fallback to keyword search
✅ Frontend unchanged
✅ Both methods coexist

### Phase 2: Monitoring
- Monitor search quality metrics
- Compare semantic vs keyword results
- Collect user feedback

### Phase 3: Full Migration
- Remove keyword search fallback (optional)
- Migrate to vector database (Pinecone/Weaviate) for scale

## Performance Considerations

### Current Implementation
- **Suitable for**: <10,000 profiles
- **Search time**: ~100-500ms
- **Storage**: ~1KB per embedding (depends on model)

### Scaling Options

When profile count grows:

1. **Vector Database** (Recommended for >10K profiles)
   - Pinecone
   - Weaviate
   - Qdrant
   - Milvus

2. **MongoDB Atlas Search** (Easiest)
   - Native vector search support
   - No architecture changes

3. **Caching**
   - Cache popular query embeddings
   - Redis for quick lookups

## Troubleshooting

### No Results Returned

**Possible causes:**
1. Profiles don't have embeddings
   - Run: `node scripts/generateEmbeddings.js`
   
2. Groq API key missing
   - Check `.env` for `GROQ_API_KEY`
   
3. API rate limits
   - Add delays between embedding generation

### Fallback to Keyword Search

Check logs for:
```
[Search] Semantic search failed: <error>
[Search] Falling back to keyword search...
```

Common reasons:
- No profiles with embeddings
- Groq API error
- Query embedding generation failed

### Poor Search Quality

1. **Check embedding quality**
   ```javascript
   // In Profile.model.js, add logging
   console.log('Profile text:', text);
   console.log('Embedding:', embedding.slice(0, 5), '...');
   ```

2. **Adjust boosting weights**
   ```javascript
   // In similarity.util.js, modify weights
   const baseScore = similarityScore * 80; // Increase semantic weight
   ```

3. **Improve profile text representation**
   ```javascript
   // In embedding.util.js, add more fields
   if (profile.certifications) {
     parts.push(`Certifications: ${profile.certifications.join(', ')}`);
   }
   ```

## Testing

### Test Semantic Search

```bash
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "senior full stack developer in bangalore",
    "limit": 10
  }'
```

### Test Keyword Fallback

```bash
curl -X POST http://localhost:5000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "senior full stack developer",
    "useSemanticSearch": false
  }'
```

### Compare Results

```javascript
// Script to compare both methods
const testQuery = "react developer in mumbai";

const semanticResults = await fetch('/api/search', {
  method: 'POST',
  body: JSON.stringify({ query: testQuery, useSemanticSearch: true })
});

const keywordResults = await fetch('/api/search', {
  method: 'POST',
  body: JSON.stringify({ query: testQuery, useSemanticSearch: false })
});

console.log('Semantic:', semanticResults.data.length);
console.log('Keyword:', keywordResults.data.length);
```

## Code Quality

### Clean Architecture ✅
- Embedding logic separated into service
- Similarity computation isolated
- Controller remains thin
- Easy to test and maintain

### Production Ready ✅
- Error handling with fallbacks
- Logging for debugging
- Rate limiting considerations
- Graceful degradation

### Migration Safe ✅
- API contract unchanged
- Keyword search preserved
- Easy rollback (set `useSemanticSearch: false`)
- Incremental adoption

## Future Enhancements

1. **Cached Query Embeddings**
   - Store popular query embeddings in Redis
   - Reduce API calls

2. **A/B Testing Framework**
   - Compare semantic vs keyword
   - Track click-through rates

3. **Personalization**
   - User interaction history
   - Preference-based boosting

4. **Multi-modal Search**
   - Image-based search (resumes, portfolios)
   - Voice search support

5. **Real-time Updates**
   - WebSocket for live results
   - Streaming responses

## Support

For issues or questions:
1. Check logs: `console.log` statements prefixed with `[Search]`, `[Embedding]`, or `[Similarity]`
2. Review Groq API status
3. Verify MongoDB connection
4. Test with simple queries first

---

**Status**: ✅ Production Ready
**Last Updated**: December 2025
**Version**: 2.0.0
