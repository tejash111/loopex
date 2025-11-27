'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [verifying, setVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [errorMessage, setErrorMessage] = useState('')
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  useEffect(() => {
    // Countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all digits are entered
    if (value && index === 5 && newOtp.every(digit => digit !== '')) {
      verifyOTP(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char
      }
    })
    setOtp(newOtp)

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5)
    inputRefs.current[lastIndex]?.focus()

    // Auto-submit if complete
    if (newOtp.every(digit => digit !== '')) {
      verifyOTP(newOtp.join(''))
    }
  }

  const verifyOTP = async (otpCode: string) => {
    setVerifying(true)
    setErrorMessage('')
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpCode }),
      })

      const data = await response.json()

      if (data.success) {
        setVerificationStatus('success')
        // Store token and user data
        localStorage.setItem('authToken', data.token)
        if (data.user) {
          localStorage.setItem('userId', data.user.userId)
          localStorage.setItem('userEmail', data.user.email)
        }
        // Redirect to onboarding if not completed, otherwise dashboard
        setTimeout(() => {
          if (data.user && data.user.onboardingCompleted) {
            router.push('/dashboard')
          } else {
            router.push('/onboarding')
          }
        }, 2000)
      } else {
        setErrorMessage(data.message || 'Invalid verification code')
        // Clear OTP inputs
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      setErrorMessage('Failed to verify code. Please try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setVerifying(false)
    }
  }

  const handleResendOTP = async () => {
    setResending(true)
    setErrorMessage('')
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setVerificationStatus('pending')
        setOtp(['', '', '', '', '', ''])
        setCountdown(30)
        inputRefs.current[0]?.focus()
      } else {
        setErrorMessage(data.message || 'Failed to resend code')
      }
    } catch (error) {
      console.error('Error resending OTP:', error)
      setErrorMessage('Failed to resend code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  const handleVerify = () => {
    const otpCode = otp.join('')
    if (otpCode.length === 6) {
      verifyOTP(otpCode)
    }
  }

  const isOtpComplete = otp.every(digit => digit !== '')

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#131316' }}>
 
      <div className="w-1/2 px-8 pt-4 flex flex-col relative">

        <div className="text-white mb-32" style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: '400' }}>Loopx</div>
        
        <div className="flex flex-col mx-auto" style={{ maxWidth: '360px' }}>
          <h1 className="mb-2" style={{ alignSelf: 'stretch', color: 'var(--Text-Primary, #FFF)', fontFamily: 'var(--Font-family-font-family-display, "Denton Test")', fontSize: 'var(--Font-size-display-xs, 24px)', fontStyle: 'normal', fontWeight: '500', lineHeight: 'var(--Line-height-display-xs, 32px)' }}>
            {verificationStatus === 'success' 
              ? 'Email Verified!' 
              : 'Verification code sent'}
          </h1>
          
          <p className="mb-[32px]" style={{ color: 'var(--Text-Tertiary, #A0A0AB)', fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on", fontFamily: 'var(--font-body)', fontSize: 'var(--Font-size-text-sm, 14px)', fontStyle: 'normal', fontWeight: '400', lineHeight: 'var(--Line-height-text-sm, 20px)' }}>
            {verificationStatus === 'success' ? (
              <>
                Your email has been verified successfully. Redirecting you to the dashboard...
              </>
            ) : countdown > 0 ? (
              <>
                <span style={{ 
                  color: '#A0A0AB', 
                  fontFamily: 'var(--font-body)', 
                  fontSize: '14px',
                  fontWeight: 400, 
                  lineHeight: '20px',
                  fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on"
                }}>
                  Resend code in 
                </span>
                <span style={{ 
                  color: '#A48AFB', 
                  fontFamily: 'var(--font-body)', 
                  fontSize: '14px',
                  fontWeight: 600, 
                  lineHeight: '20px',
                  fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                  marginLeft: '4px'
                }}>
                  {countdown}s
                </span>
              </>
            ) : (
              <>
                Check Your Email for the OTP <button
                  onClick={handleResendOTP}
                  disabled={resending}
                  className="inline-flex items-center gap-1"
                  style={{ 
                    color: '#A48AFB', 
                    fontFamily: 'var(--font-body)', 
                    fontSize: '14px',
                    fontWeight: 600, 
                    lineHeight: '20px',
                    fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    padding: 0 
                  }}
                >
                  {resending ? 'Resending...' : (
                    <>
                      Resend Code
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3.33317 7.33353C2.96498 7.33353 2.6665 7.632 2.6665 8.0002C2.66655 8.36833 2.96501 8.66687 3.33317 8.66687H11.507C11.164 9.0492 10.7051 9.47933 10.2296 9.89213C9.74137 10.3161 9.25077 10.7093 8.88137 10.9976C8.6971 11.1414 8.32557 11.4259 8.21857 11.5067C7.96817 11.7335 7.9249 12.1175 8.12937 12.3954C8.3477 12.6917 8.76524 12.7554 9.0617 12.5373C9.17344 12.4529 9.51104 12.1978 9.70164 12.0491C10.0822 11.7521 10.5917 11.3429 11.1034 10.8987C11.6116 10.4573 12.1372 9.96807 12.5408 9.51127C12.742 9.28367 12.9273 9.0486 13.0656 8.8192C13.1929 8.60807 13.3332 8.3176 13.3332 8.0002L13.3266 7.8824C13.298 7.61153 13.1769 7.36653 13.0656 7.18187C12.9273 6.9524 12.742 6.7168 12.5408 6.48914C12.1372 6.03232 11.6116 5.54309 11.1034 5.10177C10.5917 4.65756 10.0822 4.24838 9.70164 3.95138C9.51104 3.80263 9.17344 3.54751 9.0617 3.4631C8.76524 3.24501 8.3483 3.30869 8.13004 3.60503C7.92537 3.88299 7.9681 4.26687 8.21857 4.4937C8.21857 4.4937 8.38324 4.62064 8.4367 4.66101C8.54364 4.74182 8.6971 4.85902 8.88137 5.00281C9.25077 5.2911 9.74137 5.68433 10.2296 6.10828C10.7051 6.52109 11.164 6.9512 11.507 7.33353H3.33317Z" fill="#A48AFB"/>
                      </svg>
                    </>
                  )}
                </button>
              </>
            )}
          </p>

          {verificationStatus === 'pending' && (
            <>
              <div className="mb-[24px] flex gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    placeholder="-"
                    className="focus:outline-none"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      border: errorMessage ? '1px solid #E88997' : (digit ? '1px solid #875BF7' : '1px solid #26272B'),
                      background: '#1A1A1E',
                      boxShadow: digit ? 'none' : '0 1px 2px 0 rgba(10, 13, 18, 0.05)',
                      color: digit ? '#FFFFFF' : '#70707B',
                      fontFamily: 'var(--font-body)',
                      fontSize: digit ? '24px' : '20px',
                      fontWeight: digit ? '500' : '400',
                      lineHeight: digit ? 'normal' : '24px',
                      fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                      textAlign: 'center',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s ease'
                    }}
                    disabled={verifying}
                  />
                ))}
              </div>

              {errorMessage && (
                <p className="mb-4" style={{ color: '#E88997', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: '400' }}>
                  {errorMessage}
                </p>
              )}

              <Button
                onClick={handleVerify}
                style={{ width: '360px', marginBottom: '24px', background: '#875BF7', height: '44px', borderRadius: '12px' }}
                disabled={!isOtpComplete || verifying}
              >
                {verifying ? <Loader className="animate-spin" size={20} /> : 'Verify'}
              </Button>

              <p className="mb-[32px]" style={{ color: 'var(--Text-Tertiary, #A0A0AB)', fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on", fontFamily: 'var(--font-body)', fontSize: '14px', fontStyle: 'normal', fontWeight: '400', lineHeight: '20px' }}>
                By signing up, you agree to the <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span> and{' '}
                <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
              </p>
            </>
          )}
        
          <p style={{ color: 'var(--Text-Tertiary, #A0A0AB)', fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on", fontFamily: 'var(--font-body)', fontSize: '14px', fontStyle: 'normal', fontWeight: '400', lineHeight: '20px' }}>
            Need help? <span className="inline-flex items-center justify-center gap-1 cursor-pointer" style={{ color: '#A48AFB', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, lineHeight: '20px', fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",  }}>Contact support</span>
          </p>
        </div>
        
          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 flex w-full px-10 justify-center' 
          
          >
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
      

      <div className="w-1/2 relative overflow-hidden  m-5 rounded-2xl">
        <div 
          className="absolute inset-0  w-200"
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
            src="/company.svg" 
            alt="Company logos"
            className="w-full   grayscale-90"
          />
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center"><Loader className="animate-spin" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
