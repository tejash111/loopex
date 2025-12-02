# Loopex Authentication & Onboarding Setup

## Database Setup

MongoDB connection string is configured in backend/.env:
```
MONGODB_URI=mongodb+srv://tejash:9801293794@loopex.p9yu1va.mongodb.net/loopex?retryWrites=true&w=majority
```

## Installation Steps

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies (including mongoose):
```bash
npm install
```

3. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

## Database Schema

### User Schema
- email (String, unique, required)
- password (String, required, hashed)
- verified (Boolean, default: false)
- otp { code, expiresAt }
- onboardingCompleted (Boolean, default: false)
- createdAt, updatedAt

### Onboarding Schema
- userId (ObjectId, ref: User)
- email (String)
- company (String)
- foundedYear (Number)
- fundingStage (String, enum)
- industry (String)
- businessCategory (String)
- fullName (String)
- role (String)
- logoUrl (String, optional)
- createdAt, updatedAt

## User Flow

1. **Sign Up** (POST /api/auth/signup)
   - User enters email and password
   - Password is hashed with bcrypt
   - User saved to MongoDB as unverified
   - OTP generated and sent to email
   - User redirected to verification page

2. **Email Verification** (POST /api/auth/verify-otp)
   - User enters 6-digit OTP
   - OTP validated from database
   - User marked as verified
   - JWT token generated with userId and email
   - User redirected to onboarding page

3. **Onboarding** (POST /api/onboarding/submit)
   - User completes 3-step onboarding form
   - Data saved to Onboarding collection with userId reference
   - User.onboardingCompleted set to true
   - User redirected to dashboard

4. **Login** (POST /api/auth/login)
   - User enters email and password
   - Credentials validated from MongoDB
   - If not verified, redirect to verification
   - JWT token generated
   - If onboardingCompleted is false, redirect to onboarding
   - Otherwise, redirect to dashboard

## API Endpoints

### Authentication
- POST /api/auth/signup - Create new user account
- POST /api/auth/login - Login existing user
- POST /api/auth/verify-otp - Verify email with OTP
- POST /api/auth/resend-otp - Resend OTP to email

### Onboarding
- POST /api/onboarding/submit - Submit onboarding data

## Environment Variables

Backend .env file contains:
- MONGODB_URI - MongoDB connection string
- JWT_SECRET - Secret key for JWT tokens
- SMTP settings for email
- PORT and FRONTEND_URL

## Testing the Flow

1. Go to http://localhost:3000/auth
2. Enter business email and password (min 8 chars)
3. Click "Continue" to sign up
4. Check email for OTP code
5. Enter OTP on verification page
6. Complete 3-step onboarding form
7. Submit to reach dashboard

For login, enter existing verified credentials and it will route based on onboarding status.
