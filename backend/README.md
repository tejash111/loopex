# Loopex Backend

Backend API for Loopex with authentication, profile management, and **semantic search**.

## Features

- 🔐 Email verification with magic links
- 🔑 JWT token-based authentication
- 👥 Profile and project management
- 🔍 **Semantic Search** with embeddings (NEW! ✨)
- 📧 Nodemailer with Zoho SMTP integration
- 🚀 Express.js REST API
- 🔒 Secure token expiration (15 minutes)

## 🆕 Semantic Search (v2.0)

**Upgrade complete!** Search now uses semantic embeddings for better relevance.

### Quick Start
```bash
# 1. Generate embeddings for existing profiles
node scripts/generateEmbeddings.js

# 2. Run health check
node scripts/healthCheck.js

# 3. Test it
node scripts/testSemanticSearch.js
```

### Documentation
- 📖 **[Complete Guide](./README_SEMANTIC_SEARCH.md)** - Start here!
- ⚡ **[Quick Reference](./QUICK_REFERENCE.md)** - Daily usage
- 📋 **[Migration Checklist](./MIGRATION_CHECKLIST.md)** - Deployment guide
- 📚 **[Full Documentation](./SEMANTIC_SEARCH.md)** - Technical deep dive

**Frontend requires NO changes** - API contract unchanged! ✅

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Zoho SMTP credentials:
- `SMTP_USER`: Your Zoho email address
- `SMTP_PASS`: Your Zoho app-specific password
- `JWT_SECRET`: A secure random string
- `FRONTEND_URL`: Your frontend URL (default: http://localhost:3000)

3. Start the server:
```bash
npm run dev
```

## API Endpoints

### Send Magic Link
```
POST /api/auth/send-magic-link
Content-Type: application/json

{
  "email": "user@company.com"
}
```

### Verify Magic Link
```
POST /api/auth/verify-magic-link
Content-Type: application/json

{
  "token": "jwt-token-here"
}
```

## Project Structure

```
backend/
├── config/
│   ├── jwt.config.js       # JWT configuration
│   └── mailer.config.js    # Nodemailer/SMTP setup
├── controllers/
│   └── auth.controller.js  # Authentication logic
├── routes/
│   └── auth.routes.js      # API routes
├── utils/
│   ├── jwt.util.js         # JWT helper functions
│   ├── mailer.util.js      # Email sending utilities
│   └── emailTemplates.util.js  # HTML email templates
├── .env.example            # Environment variables template
├── .gitignore
├── package.json
└── server.js               # Express app entry point
```

## Zoho SMTP Setup

1. Go to Zoho Mail settings
2. Enable IMAP/POP access
3. Generate an app-specific password
4. Use these settings:
   - Host: smtp.zoho.com
   - Port: 465
   - Secure: true

## Security

- Magic links expire after 15 minutes
- JWT tokens are signed with a secret key
- CORS configured for frontend origin
- Environment variables for sensitive data
