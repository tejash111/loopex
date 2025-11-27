'use client'

import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { isBusinessEmail, getEmailErrorMessage } from '@/utils/emailValidator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoopxHiring() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)

  // Check if user is already authenticated with completed onboarding
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userId = localStorage.getItem('userId')
    
    if (token && userId) {
      // Check onboarding status
      const checkStatus = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/onboarding/status/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          const data = await response.json()
          
          if (data.success && data.onboardingCompleted) {
            // Already logged in with completed onboarding, redirect to dashboard
            router.push('/dashboard')
          } else if (data.success && !data.onboardingCompleted) {
            // Logged in but onboarding not completed
            router.push('/onboarding')
          }
        } catch (error) {
          console.error('Error checking auth status:', error)
        }
      }
      checkStatus()
    }
  }, [router])

  const handleGoogleSignIn = async () => {
    if (!auth || !googleProvider) {
      console.error('Firebase not initialized')
      return
    }
    
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      console.log('User signed in:', user)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    
    if (emailError) {
      setEmailError('')
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    
    if (passwordError) {
      setPasswordError('')
    }
  }

  const handleEmailBlur = () => {
    if (email.trim()) {
      const errorMessage = getEmailErrorMessage(email)
      setEmailError(errorMessage)
    }
  }

  const handlePasswordBlur = () => {
    if (isSignUp && password.trim()) {
      if (password.length < 8) {
        setPasswordError('Password must be at least 8 characters long')
      }
    }
  }

  const isFormValid = email.trim() !== '' && 
                       isBusinessEmail(email) && 
                       password.trim() !== '' &&
                       (!isSignUp || password.length >= 8)

  const handleContinue = async () => {
    if (!isFormValid) return

    setIsLoading(true)
    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login'
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        if (isSignUp) {
          router.push(`/auth/verify?email=${encodeURIComponent(email)}`)
        } else {
          // Store token and user data
          localStorage.setItem('authToken', data.token)
          if (data.user) {
            localStorage.setItem('userId', data.user.userId)
            localStorage.setItem('userEmail', data.user.email)
            // Redirect based on onboarding status
            if (data.user.onboardingCompleted) {
              router.push('/dashboard')
            } else {
              router.push('/onboarding')
            }
          } else {
            router.push('/dashboard')
          }
        }
      } else {
        if (data.needsVerification) {
          router.push(`/auth/verify?email=${encodeURIComponent(email)}`)
        } else {
          setPasswordError(data.message || `Failed to ${isSignUp ? 'sign up' : 'login'}`)
        }
      }
    } catch (error) {
      console.error(`Error during ${isSignUp ? 'signup' : 'login'}:`, error)
      setPasswordError(`Failed to ${isSignUp ? 'sign up' : 'login'}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background)' }}>
 
      <div className="w-1/2 px-8 pt-4 flex flex-col justify-between relative ">

        <div className="text-white text-4xl font-normal" style={{ fontFamily: 'var(--font-heading)' }}>Loopx</div>
        
   
        <div className="absolute inset-0 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
          <div className="max-w-md flex flex-col gap-2" style={{ pointerEvents: 'auto' }}>

          <h1 className="text-white text-3xl font-bold " style={{ color: 'var(--Text-Primary, #FFF)', fontFamily: 'var(--font-heading)', fontSize: '24px', fontStyle: 'normal', fontWeight: '500', lineHeight: '32px' }}>
            {isSignUp ? 'Start Hiring with Loopx' : 'Welcome Back'}
          </h1>
          <p className="text-gray-400 text-sm " style={{ color: 'var(--Text-Tertiary, #A0A0AB)', fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on", fontFamily: 'var(--font-body)', fontSize: '14px', fontStyle: 'normal', fontWeight: '400', lineHeight: '20px' }}>
            {isSignUp ? (
              <>Already have an account? <span className="cursor-pointer" style={{ color: 'var(--active)' }} onClick={() => setIsSignUp(false)}>Sign in →</span></>
            ) : (
              <>Don&apos;t have an account? <span className="cursor-pointer" style={{ color: 'var(--active)' }} onClick={() => setIsSignUp(true)}>Sign up →</span></>
            )}
          </p>
          <button 
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-gray-100 transition"
            style={{ display: 'flex', padding: '10px 16px', justifyContent: 'center', alignItems: 'center', gap: '12px', alignSelf: 'stretch', borderRadius: '12px', background: 'var(--Surface-Primary_inverted, #FFF)', marginTop: '32px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ width: '24px', height: '24px', aspectRatio: '1/1', flexShrink: '0' }}>
              <g clipPath="url(#clip0_234_16)">
                <path d="M23.7663 12.2764C23.7663 11.4607 23.7001 10.6406 23.559 9.83807H12.2402V14.4591H18.722C18.453 15.9494 17.5888 17.2678 16.3233 18.1056V21.1039H20.1903C22.4611 19.0139 23.7663 15.9274 23.7663 12.2764Z" fill="#4285F4"/>
                <path d="M12.24 24.0008C15.4764 24.0008 18.2058 22.9382 20.1944 21.1039L16.3274 18.1055C15.2516 18.8375 13.8626 19.252 12.2444 19.252C9.11376 19.252 6.45934 17.1399 5.50693 14.3003H1.51648V17.3912C3.55359 21.4434 7.70278 24.0008 12.24 24.0008Z" fill="#34A853"/>
                <path d="M5.50277 14.3003C5.00011 12.8099 5.00011 11.1961 5.50277 9.70575V6.61481H1.51674C-0.185266 10.0056 -0.185266 14.0004 1.51674 17.3912L5.50277 14.3003Z" fill="#FBBC04"/>
                <path d="M12.24 4.74966C13.9508 4.7232 15.6043 5.36697 16.8433 6.54867L20.2694 3.12262C18.1 1.0855 15.2207 -0.034466 12.24 0.000808666C7.70277 0.000808666 3.55359 2.55822 1.51648 6.61481L5.50252 9.70575C6.45052 6.86173 9.10935 4.74966 12.24 4.74966Z" fill="#EA4335"/>
              </g>
              <defs>
                <clipPath id="clip0_234_16">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <span style={{ color: 'var(--Text-Primary_on-brand, #131316)', fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on", fontFamily: 'var(--font-body)', fontSize: 'var(--Font-size-text-md, 16px)', fontStyle: 'normal', fontWeight: '600', lineHeight: 'var(--Line-height-text-md, 24px)' }}>Continue with Google</span>
          </button>
          <div className="relative mb-6" style={{ marginTop: '24px', marginBottom: '24px' }}>
            <div className="absolute inset-0 flex items-center">
              <div style={{ width: '420px', height: '0.5px', background: 'var(--Border-Secondary, #26272B)' }}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500" style={{ backgroundColor: 'var(--background)' }}/>
            </div>
          </div>
          
          <Input 
            type="email" 
            placeholder="Work email"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            aria-invalid={!!emailError}
          />
          
          {emailError && (
            <p className="text-xs" style={{ color: '#E88997' }}>{emailError}</p>
          )}

          <div className="relative" style={{ marginTop: '24px' }}>
            <Input 
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              aria-invalid={!!passwordError}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={(e) => e.preventDefault()}
              className="absolute right-3 top-3 text-gray-400 hover:text-white transition"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M1.08406 5.37604C1.4287 5.14627 1.89435 5.23941 2.12412 5.58406C2.14378 5.61214 2.19971 5.69183 2.2412 5.74805C2.32425 5.86056 2.44994 6.02463 2.61531 6.22306C2.94687 6.62094 3.43339 7.15153 4.05067 7.6806C5.29707 8.74897 7.00351 9.75008 9.00007 9.75008C10.9966 9.75008 12.7028 8.74897 13.9492 7.6806C14.5665 7.15153 15.053 6.62094 15.3846 6.22306C15.55 6.02463 15.6757 5.86056 15.7587 5.74805C15.8002 5.69183 15.8561 5.61214 15.8758 5.58406C16.1056 5.23941 16.5712 5.14627 16.9159 5.37604C17.2605 5.60581 17.3536 6.07146 17.1238 6.41611L17.1196 6.42212C17.0895 6.4652 17.0125 6.57522 16.9656 6.63883C16.867 6.77241 16.7231 6.9599 16.537 7.18334C16.1653 7.62923 15.6206 8.2236 14.9254 8.81955C13.5468 10.0012 11.5035 11.2501 9.00007 11.2501C6.49665 11.2501 4.45309 10.0012 3.07448 8.81955C2.37927 8.2236 1.83454 7.62923 1.46298 7.18334C1.27678 6.9599 1.13294 6.77241 1.03435 6.63883C0.985019 6.572 0.902527 6.45394 0.876044 6.41611C0.646277 6.07146 0.739407 5.60581 1.08406 5.37604Z" fill="white"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.53033 7.71967C3.82322 8.01255 3.82322 8.48745 3.53033 8.78032L2.03033 10.2803C1.73744 10.5732 1.26257 10.5732 0.969668 10.2803C0.676777 9.98745 0.676777 9.51255 0.969668 9.21967L2.46967 7.71967C2.76257 7.42678 3.23744 7.42678 3.53033 7.71967ZM14.4697 7.71967C14.7626 7.42678 15.2374 7.42678 15.5303 7.71967L17.0303 9.21967C17.3232 9.51255 17.3232 9.98745 17.0303 10.2803C16.7374 10.5732 16.2626 10.5732 15.9697 10.2803L14.4697 8.78032C14.1768 8.48745 14.1768 8.01255 14.4697 7.71967ZM7.13588 9.48187C7.49106 9.69502 7.6062 10.1557 7.39312 10.5109L6.26812 12.3859C6.05501 12.7411 5.59431 12.8562 5.23913 12.6431C4.88394 12.43 4.76877 11.9693 4.98188 11.6141L6.10688 9.73912C6.32 9.38392 6.78069 9.2688 7.13588 9.48187ZM10.8641 9.48187C11.2193 9.2688 11.68 9.38392 11.8931 9.73912L13.0181 11.6141C13.2312 11.9693 13.1161 12.43 12.7609 12.6431C12.4057 12.8562 11.945 12.7411 11.7319 12.3859L10.6069 10.5109C10.3938 10.1557 10.5089 9.69502 10.8641 9.48187Z" fill="white"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M4.14023 5.03473C5.41946 4.03606 7.07208 3.1875 9 3.1875C10.9279 3.1875 12.5805 4.03606 13.8598 5.03473C15.1402 6.03432 16.0865 7.21481 16.6159 7.95712L16.6558 8.01277C16.8457 8.27685 17.0625 8.57835 17.0625 9C17.0625 9.42165 16.8457 9.72315 16.6558 9.98723L16.6159 10.0429C16.0865 10.7852 15.1402 11.9657 13.8598 12.9653C12.5805 13.964 10.9279 14.8125 9 14.8125C7.07208 14.8125 5.41946 13.964 4.14023 12.9653C2.85985 11.9657 1.91344 10.7852 1.38406 10.0429L1.34414 9.98723C1.15428 9.72315 0.9375 9.42165 0.9375 9C0.9375 8.57835 1.15428 8.27685 1.34414 8.01277L1.38406 7.95712C1.91344 7.21481 2.85985 6.03432 4.14023 5.03473ZM6.375 9C6.375 10.4497 7.55025 11.625 9 11.625C10.4497 11.625 11.625 10.4497 11.625 9C11.625 7.55025 10.4497 6.375 9 6.375C7.55025 6.375 6.375 7.55025 6.375 9Z" fill="white"/>
                </svg>
              )}
            </button>
          </div>
          
          {passwordError && (
            <p className="text-xs" style={{ color: '#E88997' }}>{passwordError}</p>
          )}
          
          <Button 
            onClick={handleContinue}
            className="w-full"
            style={{ marginTop: '24px', marginBottom: '32px' }}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Continue' : 'Sign in')}
          </Button>
          <p style={{ color: 'var(--Text-Tertiary, #A0A0AB)', fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on", fontFamily: 'var(--font-body)', fontSize: 'var(--Font-size-text-sm, 14px)', fontStyle: 'normal', fontWeight: '400', lineHeight: 'var(--Line-height-text-sm, 20px)', marginBottom: '16px' }}>
            By signing up, you agree to the <span style={{ color: 'var(--Text-Tertiary, #A0A0AB)', fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on", fontFamily: 'var(--font-body)', fontSize: 'var(--Font-size-text-sm, 14px)', fontStyle: 'normal', fontWeight: '400', lineHeight: 'var(--Line-height-text-sm, 20px)', textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span> and{' '}
            <span style={{ color: 'var(--Text-Tertiary, #A0A0AB)', fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on", fontFamily: 'var(--font-body)', fontSize: 'var(--Font-size-text-sm, 14px)', fontStyle: 'normal', fontWeight: '400', lineHeight: 'var(--Line-height-text-sm, 20px)', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
          </p>
          <p style={{ color: 'var(--Text-Tertiary, #A0A0AB)', fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on", fontFamily: 'var(--font-body)', fontSize: 'var(--Font-size-text-sm, 14px)', fontStyle: 'normal', fontWeight: '400', lineHeight: 'var(--Line-height-text-sm, 20px)' }}>
            Need help? <span className="cursor-pointer" style={{ color: 'var(--active)' }}>Contact support</span>
          </p>
          </div>

          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 flex w-full px-10 justify-center'  >
          <svg xmlns="http://www.w3.org/2000/svg" width="707" height="239" viewBox="0 0 707 239" fill="none">
  <g opacity="0.2" filter="url(#filter0_f_206_1502)">
    <path d="M662.211 382.4V3.3999M623.81 382.4V3.3999M585.408 382.4V3.3999M547.007 382.4V3.3999M508.605 382.4V3.3999M470.204 382.4V3.3999M431.802 382.4V3.3999M393.4 382.4V3.3999M354.999 382.4V3.3999M316.597 382.4V3.3999M278.196 382.4V3.3999M239.794 382.4V3.3999M201.393 382.4V3.3999M162.991 382.4V3.3999M124.589 382.4V3.3999M86.1879 382.4V3.3999M47.7863 382.4V3.3999M9.38477 382.4V3.3999M703.4 380.35H3.3999M703.4 342.472H3.3999M703.4 307.963H3.3999M703.4 273.454H3.3999M703.4 238.945H3.3999M703.4 204.436H3.3999M703.4 169.926H3.3999M703.4 135.417H3.3999M703.4 100.908H3.3999M703.4 66.399H3.3999M703.4 31.8898H3.3999" stroke="url(#paint0_radial_206_1502)"/>
  </g>
  <defs>
    <filter id="filter0_f_206_1502" x="-9.77516e-05" y="-9.77516e-05" width="706.8" height="385.8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feGaussianBlur stdDeviation="1.7" result="effect1_foregroundBlur_206_1502"/>
    </filter>
    <radialGradient id="paint0_radial_206_1502" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(353.4 215.067) scale(108.684 197.665)">
      <stop stop-color="#A48AFB" stop-opacity="0"/>
      <stop offset="0.455" stop-color="#A48AFB" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#A48AFB" stop-opacity="0.05"/>
    </radialGradient>
  </defs>
</svg>
          </div>
        </div>
        
        
      </div>
      

     <div className="w-1/2 relative overflow-hidden m-5 rounded-2xl">
  <div 
    className="absolute inset-0 w-200 h-full"
    style={{ 
      backgroundImage: `url('/authbg.png')`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}
  />
  <div className="absolute inset-0 rounded-2xl bg-black/50" />
  <div 
    className="absolute inset-0 rounded-2xl opacity-30"
    style={{
      backgroundSize: '60px 60px'
    }}
  />
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex w-full px-10 justify-center">
    <img 
      src="/company.svg" 
      alt="Company logos"
      className="w-full grayscale-90"
    />
  </div>
</div>
    </div>
  );
}