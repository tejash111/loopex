'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function VerifyEmail() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const token = searchParams.get('token') || ''
  const [verifying, setVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // If token is present in URL, verify it
    if (token) {
      verifyToken(token)
    }
  }, [token])

  const verifyToken = async (tokenToVerify: string) => {
    setVerifying(true)
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: tokenToVerify }),
      })

      const data = await response.json()

      if (data.success) {
        setVerificationStatus('success')
        // Redirect to dashboard or home after 2 seconds
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setVerificationStatus('error')
        setErrorMessage(data.message || 'Verification failed')
      }
    } catch (error) {
      console.error('Error verifying token:', error)
      setVerificationStatus('error')
      setErrorMessage('Failed to verify email. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--primary)' }}>
 
      <div className="w-1/2 px-8 pt-4 flex flex-col justify-between relative ">

        <div className="text-white text-4xl font-normal" style={{ fontFamily: 'var(--font-playfair)' }}>Loopx</div>
        
   
        <div className="absolute inset-0 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
          <div className="max-w-md flex flex-col gap-4" style={{ pointerEvents: 'auto' }}>

            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                {verificationStatus === 'success' ? (
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : verificationStatus === 'error' ? (
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              <h1 className="text-white text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                {verificationStatus === 'success' 
                  ? 'Email Verified!' 
                  : verificationStatus === 'error'
                  ? 'Verification Failed'
                  : "Let's verify your email"}
              </h1>
              
              <p className="text-gray-400 text-sm mb-2">
                {verificationStatus === 'success' ? (
                  <>
                    Your email has been verified successfully. Redirecting you to the dashboard...
                  </>
                ) : verificationStatus === 'error' ? (
                  <>
                    <span className="text-red-400">{errorMessage}</span>
                  </>
                ) : (
                  <>
                    Check <span className="text-white font-medium">{email}</span> to verify your account and get started.
                  </>
                )}
              </p>
            </div>
          
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
