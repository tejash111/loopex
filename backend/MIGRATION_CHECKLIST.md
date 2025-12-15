# Semantic Search Migration Checklist

## Pre-Migration

- [ ] Backup database
  ```bash
  mongodump --uri="mongodb://..." --out=./backup-$(date +%Y%m%d)
  ```

- [ ] Verify Groq API key
  ```bash
  echo $GROQ_API_KEY
  # or check .env file
  ```

- [ ] Test existing search still works
  ```bash
  curl -X POST http://localhost:5000/api/search \
    -H "Content-Type: application/json" \
    -d '{"query": "developer"}'
  ```

## Migration Steps

### Step 1: Deploy Code
- [ ] Pull/deploy latest code with semantic search
- [ ] Verify server starts without errors
- [ ] Check logs for any warnings

### Step 2: Test Implementation
- [ ] Run test script
  ```bash
  cd backend
  node scripts/testSemanticSearch.js
  ```
- [ ] Verify all tests pass
- [ ] Check embedding generation works

### Step 3: Generate Embeddings
- [ ] Run migration script
  ```bash
  node scripts/generateEmbeddings.js
  ```
- [ ] Monitor progress (may take time for many profiles)
- [ ] Note any failures
- [ ] Verify embeddings in database
  ```javascript
  // In MongoDB shell
  db.profiles.findOne({ profileEmbedding: { $exists: true } })
  // Should show profileEmbedding array with ~384 numbers
  ```

### Step 4: Verify Search Works
- [ ] Test semantic search API
  ```bash
  curl -X POST http://localhost:5000/api/search \
    -H "Content-Type: application/json" \
    -d '{"query": "full stack developer in bangalore"}' | jq
  ```
- [ ] Check response includes:
  - [ ] `data` array with profiles
  - [ ] `meta.searchMethod` = "semantic"
  - [ ] `score` and `semanticScore` fields
  - [ ] `scoreBreakdown` object

### Step 5: Test Fallback
- [ ] Test keyword search still works
  ```bash
  curl -X POST http://localhost:5000/api/search \
    -H "Content-Type: application/json" \
    -d '{"query": "developer", "useSemanticSearch": false}'
  ```
- [ ] Verify response shows `meta.searchMethod` = "keyword"

### Step 6: Monitor Performance
- [ ] Check search latency
  - Expected: 100-500ms for <10K profiles
- [ ] Monitor server logs for errors
- [ ] Watch for memory usage (should be stable)

## Post-Migration

### Immediate (First Hour)
- [ ] Test common search queries from production
- [ ] Compare semantic vs keyword results
- [ ] Monitor error rates
- [ ] Check API response times

### First Day
- [ ] Review search quality with team
- [ ] Collect user feedback
- [ ] Monitor Groq API usage/limits
- [ ] Check for any edge cases

### First Week
- [ ] Analyze search patterns
- [ ] Identify common queries
- [ ] Fine-tune boosting weights if needed
- [ ] Consider caching strategy

## Quality Checks

### Search Quality Tests

Test these queries and verify results make sense:

- [ ] "senior react developer"
  - Should prioritize senior roles with React
  
- [ ] "full stack engineer with 5 years experience"
  - Should match experience requirement
  
- [ ] "frontend developer in bangalore"
  - Should filter/boost Bangalore profiles
  
- [ ] "python data scientist"
  - Should match data science profiles
  
- [ ] "ui/ux designer"
  - Should find designers, not just developers

### Edge Cases

- [ ] Empty query → Should return error
- [ ] Very long query → Should handle gracefully
- [ ] Special characters → Should work
- [ ] Non-English text → Should fallback or work
- [ ] Misspellings → Should still find results

## Rollback Plan

If semantic search has critical issues:

### Option 1: Disable Semantic Search
```javascript
// In search.controller.js
const useSemanticSearch = false; // Force to false
```

### Option 2: Frontend Fallback
```javascript
// In frontend API call
{
  query: searchQuery,
  useSemanticSearch: false
}
```

### Option 3: Full Rollback
1. Revert to previous git commit
2. Redeploy backend
3. Restart server
4. Verify keyword search works

## Success Criteria

- [ ] ✅ All profiles have embeddings
- [ ] ✅ Semantic search returns results
- [ ] ✅ Keyword fallback works
- [ ] ✅ No critical errors in logs
- [ ] ✅ Search latency acceptable
- [ ] ✅ Results are relevant
- [ ] ✅ Frontend unchanged and working

## Metrics to Track

### Technical Metrics
- Search method distribution (semantic vs keyword)
- Average search latency
- Groq API call success rate
- Number of fallbacks to keyword search

### Business Metrics
- User click-through rate
- Search result satisfaction
- Number of searches per session
- Conversion rate (if applicable)

## Common Issues & Solutions

### Issue: No embeddings generated
**Solution**: 
```bash
# Check if profiles exist
db.profiles.count()

# Run migration again
node scripts/generateEmbeddings.js
```

### Issue: Slow search performance
**Solution**:
- Check profile count
- Consider MongoDB indexing
- Add caching for popular queries
- Consider vector database

### Issue: Poor result quality
**Solution**:
1. Adjust boosting weights in `similarity.util.js`
2. Improve profile text representation in `embedding.util.js`
3. Fine-tune LLM prompts

### Issue: Groq API rate limits
**Solution**:
- Add delays between requests
- Implement request queuing
- Consider caching embeddings
- Upgrade Groq plan if needed

## Documentation Links

- [ ] Team has access to `SEMANTIC_SEARCH.md`
- [ ] Team has access to `QUICK_REFERENCE.md`
- [ ] Team knows how to run test script
- [ ] Team knows rollback procedure

## Sign-Off

- [ ] Backend engineer reviewed
- [ ] Frontend engineer verified no changes needed
- [ ] QA tested search functionality
- [ ] DevOps verified deployment
- [ ] Product manager approved results

---

**Migration Date**: _______________
**Completed By**: _______________
**Status**: ⏳ In Progress / ✅ Complete
**Notes**: 
```
Add any notes, issues encountered, or special considerations here
```
