'use client'

import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { isBusinessEmail, getEmailErrorMessage } from '@/utils/emailValidator'

export default function LoopxHiring() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      console.log('User signed in:', user)
      // Redirect to home or dashboard after successful login
      router.push('/')
    } catch (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    
    // Clear error while typing
    if (emailError) {
      setEmailError('')
    }
  }

  const handleEmailBlur = () => {
    if (email.trim()) {
      const errorMessage = getEmailErrorMessage(email)
      setEmailError(errorMessage)
    }
  }

  const isEmailValid = email.trim() !== '' && isBusinessEmail(email)

  const handleContinue = async () => {
    if (!isEmailValid) return

    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        router.push(`/auth/verify?email=${encodeURIComponent(email)}`)
      } else {
        setEmailError(data.message || 'Failed to send verification email')
      }
    } catch (error) {
      console.error('Error sending magic link:', error)
      setEmailError('Failed to send verification email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--primary)' }}>
 
      <div className="w-1/2 px-8 pt-4 flex flex-col justify-between relative ">

        <div className="text-white text-4xl font-normal" style={{ fontFamily: 'var(--font-playfair)' }}>Loopx</div>
        
   
        <div className="absolute inset-0 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
          <div className="max-w-md flex flex-col gap-2" style={{ pointerEvents: 'auto' }}>

          <h1 className="text-white text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Start Hiring with Loopx
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Already have an account? <span className="cursor-pointer" style={{ color: 'var(--active)' }}>Sign in →</span>
          </p>
          
     
          <button 
            onClick={handleGoogleSignIn}
            className="w-full bg-white rounded-2xl hover:bg-gray-100 py-3 px-4 flex items-center justify-center gap-3 mb-6  transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </button>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500" style={{ backgroundColor: 'var(--primary)' }}/>
            </div>
          </div>
          
  
          <input 
            type="email" 
            placeholder="Work email"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            className="w-full text-white rounded-lg py-3 px-4 mb-1 border focus:outline-none transition"
            style={{ 
              backgroundColor: 'var(--placeholder)',
              color: 'white',
              borderColor: emailError ? '#ef4444' : (email ? 'var(--active)' : '#374151')
            }}
            onFocus={(e) => {
              if (!emailError) {
                e.target.style.borderColor = 'var(--active)'
              }
            }}
          />
          
          {emailError && (
            <p className="text-red-500 text-xs mb-3 mt-1">{emailError}</p>
          )}
          
          {!emailError && email && (
            <div className="mb-3"></div>
          )}
          
      
          <button 
            onClick={handleContinue}
            className="w-full text-white rounded-lg  py-3 px-4 mb-6 mt-2 transition"
            style={{ backgroundColor: isEmailValid && !isLoading ? 'var(--active)' : 'var(--disabled)' }}
            disabled={!isEmailValid || isLoading}
          >
            {isLoading ? 'Sending...' : 'Continue'}
          </button>
          
     
          <p className="text-gray-500 text-sm mb-4">
            By signing up, you agree to the <span className="text-gray-400 underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="text-gray-400 underline cursor-pointer">Privacy Policy</span>.
          </p>
          
       
          <p className="text-gray-500 text-sm">
            Need help? <span className="cursor-pointer" style={{ color: 'var(--active)' }}>Contact support</span>
          </p>
          </div>

          <img className='absolute bottom-0 left-1/2 -translate-x-1/2 flex w-full px-10 justify-center' src="/authoverlay.png" alt="" />
        </div>
        
        
      </div>
      

      <div className="w-1/2 relative overflow-hidden  m-5 rounded-2xl">
        <div 
          className="absolute inset-0  w-full"
          style={{ 
            backgroundImage: `url('/authbg.png')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }}
        />
        <div className="absolute inset-0 rounded-2xl bg-black/50" />
        <div 
          className="absolute inset-0 rounded-2xl opacity-30"
          style={{
            backgroundSize: '60px 60px'
          }}
        />
        <div className="absolute  bottom-8 left-1/2 -translate-x-1/2 flex w-full px-10 justify-center">
          <img 
            src="/company.png" 
            alt="Company logos"
            className="w-full   grayscale-90"
          />
        </div>
      </div>
    </div>
  );
}