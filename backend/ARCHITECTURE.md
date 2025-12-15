# Semantic Search Architecture Diagram

## System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Search Input: "senior react developer in bangalore"    │    │
│  └────────────────────────┬────────────────────────────────┘    │
│                           │                                       │
└───────────────────────────┼───────────────────────────────────────┘
                            │
                            │ POST /api/search
                            │ { query: "..." }
                            │
┌───────────────────────────▼───────────────────────────────────────┐
│                         BACKEND                                    │
│                                                                    │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │         SEARCH CONTROLLER                                  │   │
│  │  (controllers/search.controller.js)                        │   │
│  │                                                             │   │
│  │  1. Receive query                                          │   │
│  │  2. Parse with LLM (optional filters)                      │   │
│  │  3. Choose search method                                   │   │
│  └───────────────────────┬───────────────────────────────────┘   │
│                          │                                         │
│                          ▼                                         │
│           ┌──────────────────────────┐                            │
│           │  Semantic Search?        │                            │
│           └─────┬────────────────┬───┘                            │
│                 │ Yes            │ No                             │
│                 │                │                                │
│         ┌───────▼──────┐    ┌───▼──────────┐                     │
│         │  SEMANTIC    │    │   KEYWORD    │                     │
│         │   SEARCH     │    │   SEARCH     │                     │
│         └───────┬──────┘    └───┬──────────┘                     │
│                 │                │                                │
│                 │                └──────────────────┐             │
│                 ▼                                   │             │
│  ┌───────────────────────────────────────────┐    │             │
│  │  EMBEDDING SERVICE                         │    │             │
│  │  (utils/embedding.util.js)                │    │             │
│  │                                            │    │             │
│  │  generateEmbedding(query)                 │    │             │
│  │      ↓                                     │    │             │
│  │  Call Groq API                             │    │             │
│  │      ↓                                     │    │             │
│  │  Extract keywords with LLM                 │    │             │
│  │      ↓                                     │    │             │
│  │  Convert to 384-dim vector                 │    │             │
│  │      ↓                                     │    │             │
│  │  queryEmbedding: [0.23, -0.45, ...]       │    │             │
│  └───────────────────┬───────────────────────┘    │             │
│                      │                             │             │
│                      ▼                             │             │
│  ┌──────────────────────────────────────────┐     │             │
│  │  MONGODB                                  │     │             │
│  │                                           │     │             │
│  │  Find profiles with embeddings:          │     │             │
│  │  { profileEmbedding: { $exists: true } } │ ◄───┘             │
│  │                                           │                   │
│  │  profiles = [                             │                   │
│  │    {                                      │                   │
│  │      name: "Priya",                       │                   │
│  │      profileEmbedding: [0.12, -0.34...]  │                   │
│  │    },                                     │                   │
│  │    ...                                    │                   │
│  │  ]                                        │                   │
│  └───────────────────┬──────────────────────┘                   │
│                      │                                            │
│                      ▼                                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  SIMILARITY SERVICE                                       │   │
│  │  (utils/similarity.util.js)                              │   │
│  │                                                            │   │
│  │  For each profile:                                        │   │
│  │    similarity = cosineSimilarity(                         │   │
│  │      queryEmbedding,                                      │   │
│  │      profile.profileEmbedding                             │   │
│  │    )                                                       │   │
│  │                                                            │   │
│  │  Compute: dot(A, B) / (|A| × |B|)                         │   │
│  │  Result: 0.0 to 1.0                                       │   │
│  │                                                            │   │
│  │  scoredProfiles = [                                       │   │
│  │    { profile: {...}, similarityScore: 0.92 },            │   │
│  │    { profile: {...}, similarityScore: 0.87 },            │   │
│  │    ...                                                     │   │
│  │  ]                                                         │   │
│  └───────────────────────┬──────────────────────────────────┘   │
│                          │                                        │
│                          ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  HYBRID BOOSTING                                          │   │
│  │  (utils/similarity.util.js)                              │   │
│  │                                                            │   │
│  │  For each profile:                                        │   │
│  │                                                            │   │
│  │    baseScore = similarityScore × 70                       │   │
│  │                                                            │   │
│  │    boosts = 0                                             │   │
│  │    + 10 if experience >= requirement                      │   │
│  │    + 10 × (matched skills / total skills)                 │   │
│  │    + 5 if location matches                                │   │
│  │    + 5 if job title matches                               │   │
│  │                                                            │   │
│  │    finalScore = baseScore + boosts                        │   │
│  │                                                            │   │
│  │  Sort by finalScore DESC                                  │   │
│  │                                                            │   │
│  │  rankedProfiles = [                                       │   │
│  │    { ...profile, score: 90.3, breakdown: {...} },        │   │
│  │    { ...profile, score: 85.7, breakdown: {...} },        │   │
│  │    ...                                                     │   │
│  │  ]                                                         │   │
│  └───────────────────────┬──────────────────────────────────┘   │
│                          │                                        │
│                          ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PAGINATION & RESPONSE                                    │   │
│  │                                                            │   │
│  │  Apply skip and limit                                     │   │
│  │  Format response                                          │   │
│  │  Add metadata                                             │   │
│  └───────────────────────┬──────────────────────────────────┘   │
│                          │                                        │
└──────────────────────────┼────────────────────────────────────────┘
                           │
                           │ JSON Response
                           │
┌──────────────────────────▼────────────────────────────────────────┐
│                         FRONTEND                                   │
│                                                                    │
│  {                                                                 │
│    "success": true,                                                │
│    "data": [                                                       │
│      {                                                             │
│        "name": "Priya Sharma",                                     │
│        "location": "Bangalore",                                    │
│        "score": 90.3,                                              │
│        "semanticScore": 0.92,                                      │
│        "scoreBreakdown": {                                         │
│          "semanticScore": 0.92,                                    │
│          "baseScore": 64.4,                                        │
│          "boostScore": 25.9,                                       │
│          "finalScore": 90.3                                        │
│        }                                                            │
│      },                                                            │
│      ...                                                           │
│    ],                                                              │
│    "meta": {                                                       │
│      "searchMethod": "semantic",                                   │
│      "total": 45                                                   │
│    }                                                               │
│  }                                                                 │
└────────────────────────────────────────────────────────────────────┘
```

## Embedding Generation Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    PROFILE CREATION/UPDATE                      │
└──────────────────────────┬─────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│  MONGOOSE PRE-SAVE HOOK                                          │
│  (models/Profile.model.js)                                       │
│                                                                   │
│  if (profile data changed OR no embedding exists) {              │
│    generateEmbedding()                                           │
│  }                                                                │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│  EMBEDDING SERVICE                                               │
│  (utils/embedding.util.js)                                      │
│                                                                   │
│  1. profileToText(profile)                                       │
│     ↓                                                             │
│     "Name: Priya. Current Role: Senior Full Stack Developer      │
│      at Zentech. Experience: 5 yrs 6 mos. Location: Bangalore.  │
│      Skills: React, Node.js, MongoDB..."                         │
│                                                                   │
│  2. Call Groq API to extract keywords                            │
│     ↓                                                             │
│     {                                                             │
│       "keywords": [                                               │
│         {"term": "React", "weight": 0.9},                        │
│         {"term": "Full Stack", "weight": 0.85},                  │
│         {"term": "Bangalore", "weight": 0.7},                    │
│         ...                                                       │
│       ]                                                           │
│     }                                                             │
│                                                                   │
│  3. textToSemanticVector(text, features)                         │
│     ↓                                                             │
│     - Hash each word to multiple positions                       │
│     - Apply keyword weights                                      │
│     - Normalize to unit vector                                   │
│     ↓                                                             │
│     [0.23, -0.45, 0.67, -0.12, ..., 0.34]  (384 dimensions)     │
│                                                                   │
│  4. Return embedding                                             │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│  SAVE TO DATABASE                                                │
│                                                                   │
│  profile.profileEmbedding = [0.23, -0.45, ...]                  │
│  profile.save()                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Data Structures

### Profile Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  location: String,
  workExperience: [{
    title: String,
    company: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  skills: [{
    category: String,
    skills: [String]
  }],
  additionalSkills: {
    skills: [String]
  },
  education: [...],
  stats: {
    totalExperience: String,
    currentTenure: String,
    averageTenure: String
  },
  profileEmbedding: [Number],  // 384-dim vector
  createdAt: Date,
  updatedAt: Date
}
```

### Search Request
```javascript
{
  query: "senior react developer in bangalore",
  limit: 50,
  skip: 0,
  useSemanticSearch: true  // optional
}
```

### Search Response
```javascript
{
  success: Boolean,
  message: String,
  data: [{
    ...profileFields,
    score: Number,              // Final score (0-100)
    semanticScore: Number,      // Cosine similarity (0-1)
    scoreBreakdown: {
      semanticScore: Number,
      baseScore: Number,        // semanticScore × 70
      boostScore: Number,       // Sum of boosts
      finalScore: Number        // baseScore + boostScore
    }
  }],
  meta: {
    query: String,
    searchMethod: String,       // "semantic" | "keyword" | "keyword-fallback"
    parsedFilters: Object,
    total: Number,
    limit: Number,
    skip: Number,
    returned: Number
  }
}
```

## Scoring Example

```
Query: "Senior React Developer in Bangalore with 5+ years"

Profile: Priya Sharma
- Title: Senior Full Stack Developer
- Skills: React, Node.js, MongoDB, AWS
- Experience: 5 yrs 6 mos
- Location: Bangalore

Step 1: Cosine Similarity
  queryEmbedding:   [0.23, -0.45, 0.67, ...]
  profileEmbedding: [0.19, -0.42, 0.71, ...]
  similarity = 0.92

Step 2: Base Score
  baseScore = 0.92 × 70 = 64.4

Step 3: Boosts
  experienceBoost = 10  (5.5 years >= 5 years)
  skillsBoost = 7.5     (3/4 skills matched = 75% × 10)
  locationBoost = 5     (Bangalore matches)
  jobTitleBoost = 5     (Has "React" in title)
  
  totalBoosts = 27.5

Step 4: Final Score
  finalScore = 64.4 + 27.5 = 91.9

Result: Highly relevant match! ✅
```

## File Structure

```
backend/
├── controllers/
│   ├── search.controller.js      ✅ Modified - Added semantic search
│   └── ...
├── models/
│   ├── Profile.model.js          ✅ Modified - Added embedding field + hooks
│   └── ...
├── utils/
│   ├── embedding.util.js         ✨ NEW - Embedding generation
│   ├── similarity.util.js        ✨ NEW - Similarity computation
│   ├── groq.util.js              ✅ Existing - LLM for parsing
│   └── ...
├── scripts/
│   ├── generateEmbeddings.js     ✨ NEW - Migration script
│   ├── testSemanticSearch.js     ✨ NEW - Test suite
│   └── healthCheck.js            ✨ NEW - Health verification
├── SEMANTIC_SEARCH.md            ✨ NEW - Full documentation
├── IMPLEMENTATION_SUMMARY.md     ✨ NEW - What was built
├── QUICK_REFERENCE.md            ✨ NEW - Daily reference
├── MIGRATION_CHECKLIST.md        ✨ NEW - Deployment guide
├── README_SEMANTIC_SEARCH.md     ✨ NEW - Complete overview
├── ANNOUNCEMENT.md               ✨ NEW - Team announcement
└── README.md                     ✅ Modified - Added semantic search section
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
│                                                              │
│  Express.js → Controllers → Services → Models                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     SEMANTIC LAYER                           │
│                                                              │
│  Groq API (LLM) → Embeddings → Similarity → Ranking         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
│                                                              │
│  MongoDB → Profiles → Embeddings (384-dim vectors)           │
└─────────────────────────────────────────────────────────────┘
```

---

**Architecture Status**: ✅ Production Ready
**Version**: 2.0.0
**Last Updated**: December 2025
