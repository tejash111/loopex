# Semantic Search - Quick Reference

## 🚀 Quick Start

### 1. First Time Setup
```bash
cd backend
node scripts/generateEmbeddings.js
```

### 2. Test It Works
```bash
node scripts/testSemanticSearch.js
```

### 3. Use the API
```bash
# Same as before - no changes needed!
POST /api/search
Body: { "query": "full stack developer in bangalore" }
```

## 📝 Files Created/Modified

### New Files
- ✅ `utils/embedding.util.js` - Embedding generation
- ✅ `utils/similarity.util.js` - Similarity computation
- ✅ `scripts/generateEmbeddings.js` - Migration script
- ✅ `scripts/testSemanticSearch.js` - Test script
- ✅ `SEMANTIC_SEARCH.md` - Full documentation
- ✅ `IMPLEMENTATION_SUMMARY.md` - Summary

### Modified Files
- ✅ `controllers/search.controller.js` - Added semantic search
- ✅ `models/Profile.model.js` - Added auto-embedding

## 🎯 How It Works

```
Query: "senior react developer"
   ↓
Generate Query Embedding (384-dim vector)
   ↓
Find Profiles with Embeddings
   ↓
Compute Cosine Similarity
   ↓
Apply Boosts (experience, skills, location)
   ↓
Sort by Final Score → Return Results
```

## 📊 Scoring

| Component | Weight | What It Does |
|-----------|--------|--------------|
| Semantic Similarity | 70% | Understands meaning and context |
| Experience Boost | +10 | Exact experience match |
| Skills Boost | +10 | Skill overlap percentage |
| Location Boost | +5 | Exact location match |
| Job Title Boost | +5 | Job title in work history |

## 🔍 API Examples

### Basic Search (Auto Semantic)
```json
POST /api/search
{
  "query": "full stack developer in bangalore",
  "limit": 50
}
```

### Force Keyword Search
```json
{
  "query": "developer",
  "useSemanticSearch": false
}
```

### Response
```json
{
  "success": true,
  "data": [{
    "_id": "...",
    "name": "Priya Sharma",
    "location": "Bangalore",
    "score": 85.4,          // ← Final score
    "semanticScore": 0.92,  // ← Cosine similarity
    "scoreBreakdown": {
      "semanticScore": 0.92,
      "baseScore": 64.4,
      "boostScore": 21,
      "finalScore": 85.4
    }
  }],
  "meta": {
    "searchMethod": "semantic",  // ← Which method used
    "total": 45
  }
}
```

## 🛠️ Common Tasks

### Regenerate All Embeddings
```bash
node scripts/generateEmbeddings.js
```

### Test Search Quality
```bash
node scripts/testSemanticSearch.js
```

### Check Logs
Look for:
```
[Search] Semantic search enabled: true
[Embedding] Generating embedding for profile: ...
[Similarity] Computed similarities for N profiles
```

### Rollback to Keyword Search
```javascript
// In frontend API call
body: {
  query: searchQuery,
  useSemanticSearch: false  // ← Add this
}
```

## ⚠️ Troubleshooting

### No Results?
1. Check if embeddings exist:
   ```bash
   # In MongoDB
   db.profiles.count({ profileEmbedding: { $exists: true, $not: { $size: 0 } } })
   ```
2. Run migration if needed:
   ```bash
   node scripts/generateEmbeddings.js
   ```

### Slow Performance?
- Normal for <10K profiles
- Consider vector DB for >10K
- Add Redis caching for popular queries

### API Errors?
- Check `GROQ_API_KEY` in `.env`
- Verify Groq API status
- Check logs for detailed errors

## 📈 Monitoring

### Key Metrics
- Search method used (semantic vs keyword)
- Number of profiles with embeddings
- Average search time
- Result relevance (user clicks)

### Log Patterns
```bash
# Successful semantic search
[Search] Using semantic embedding search...
[Search] Found 150 profiles with embeddings
[Search] Applied hybrid boosting

# Fallback to keyword
[Search] No profiles with embeddings found
[Search] Falling back to keyword search...
```

## 🎓 Understanding Scores

### Good Score (>80)
- High semantic relevance
- Strong traditional matches
- Top recommendation

### Medium Score (50-80)
- Moderate relevance
- Some matches
- Worth reviewing

### Low Score (<50)
- Weak relevance
- Few matches
- Consider broader query

## 💡 Tips

### Better Search Results
1. ✅ Use natural language: "senior react developer with 5 years"
2. ✅ Include location: "in bangalore"
3. ✅ Mention key skills: "react, node, aws"
4. ❌ Don't use only symbols: "react + node"

### Query Examples
- ✅ "experienced full stack developer in mumbai"
- ✅ "senior react engineer with aws experience"
- ✅ "ui/ux designer bangalore 3+ years"
- ✅ "python data scientist with machine learning"

## 🔗 Resources

- **Full Docs**: `SEMANTIC_SEARCH.md`
- **Summary**: `IMPLEMENTATION_SUMMARY.md`
- **Test Script**: `scripts/testSemanticSearch.js`
- **Migration**: `scripts/generateEmbeddings.js`

## 🆘 Getting Help

1. Check logs for error messages
2. Run test script: `node scripts/testSemanticSearch.js`
3. Review `SEMANTIC_SEARCH.md` troubleshooting section
4. Check Groq API status
5. Verify MongoDB connection

---

**Status**: ✅ Production Ready
**Version**: 2.0.0
**Last Updated**: December 2025
