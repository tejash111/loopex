'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { uploadToCloudinary } from '@/utils/cloudinary'

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState('')
  const [foundedYear, setFoundedYear] = useState('')
  const [fundingStage, setFundingStage] = useState('')
  const [industry, setIndustry] = useState('')
  const [businessCategory, setBusinessCategory] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showFoundedYearDropdown, setShowFoundedYearDropdown] = useState(false)
  const [showFundingStageDropdown, setShowFundingStageDropdown] = useState(false)
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false)
  const [showBusinessCategoryDropdown, setShowBusinessCategoryDropdown] = useState(false)
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [logoUploadError, setLogoUploadError] = useState('')

  // Check if user is authenticated and hasn't completed onboarding
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userId = localStorage.getItem('userId')
    
    if (!token || !userId) {
      // Not authenticated, redirect to auth
      router.push('/auth')
      return
    }

    // Check if onboarding is already completed
    const checkOnboardingStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/onboarding/status/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        
        if (data.success && data.onboardingCompleted) {
          // Already completed onboarding, redirect to dashboard
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error)
      }
    }

    checkOnboardingStatus()
  }, [router])

  // Get user data from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail')
    const storedUserId = localStorage.getItem('userId')
    if (storedEmail) setEmail(storedEmail)
  }, [])

  // Mock company data - in real app, this would come from an API
  const companyData: Record<string, { foundedYear: string; fundingStage: string; industry: string; businessCategory: string; logoUrl: string }> = useMemo(() => ({
    'Red Bull': { foundedYear: '1987', fundingStage: 'Public', industry: 'E-commerce', businessCategory: 'B2C', logoUrl: '' },
    'Red Hat': { foundedYear: '1993', fundingStage: 'Public', industry: 'SaaS', businessCategory: 'Enterprise', logoUrl: '' },
    'Redfin': { foundedYear: '2004', fundingStage: 'Public', industry: 'E-commerce', businessCategory: 'B2C', logoUrl: '' },
    'Reddit': { foundedYear: '2005', fundingStage: 'Public', industry: 'SaaS', businessCategory: 'B2C', logoUrl: '' }
  }), [])

  const companies = useMemo(() => Object.keys(companyData), [companyData])
  
  // Check if selected company exists in our database
  const isExistingCompany = useMemo(() => {
    return companies.some(c => c.toLowerCase() === selectedCompany.toLowerCase())
  }, [companies, selectedCompany])

  const filteredCompanies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return companies
    const matches = companies.filter(company =>
      company.toLowerCase().includes(query)
    )
    return matches.length ? matches : companies
  }, [companies, searchQuery])

  const shouldShowAddRow = useMemo(() => {
    if (!searchQuery.trim()) return false
    return !companies.some(company => company.toLowerCase() === searchQuery.trim().toLowerCase())
  }, [companies, searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // If the click is NOT inside a dropdown container, close all dropdowns
      if (!target.closest('.dropdown-container')) {
        setShowDropdown(false)
        setShowFoundedYearDropdown(false)
        setShowFundingStageDropdown(false)
        setShowIndustryDropdown(false)
        setShowBusinessCategoryDropdown(false)
        setShowRoleDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCompanySelect = (company : string) => {
    setSelectedCompany(company)
    setSearchQuery(company)
    setShowDropdown(false)
    
    // If company exists in our database, auto-fill data and go to step 3
    const existingData = companyData[company]
    if (existingData) {
      setFoundedYear(existingData.foundedYear)
      setFundingStage(existingData.fundingStage)
      setIndustry(existingData.industry)
      setBusinessCategory(existingData.businessCategory)
      if (existingData.logoUrl) {
        setLogoUrl(existingData.logoUrl)
      }
      // Skip directly to step 3
      setStep(3)
    } else {
      setFoundedYear('')
    }
  }

  const handleAddCompany = () => {
    if (!searchQuery.trim()) return
    const value = searchQuery.trim()
    setSelectedCompany(value)
    setSearchQuery(value)
    setShowDropdown(false)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setLogoUploadError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setLogoUploadError('Image size should be less than 5MB')
      return
    }

    setIsUploadingLogo(true)
    setLogoUploadError('')

    try {
      const result = await uploadToCloudinary(file)
      setLogoUrl(result.secure_url)
    } catch (error) {
      console.error('Error uploading logo:', error)
      setLogoUploadError(error instanceof Error ? error.message : 'Failed to upload logo')
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleNextFromStepOne = () => {
    // Basic validation check before proceeding
    if (!selectedCompany) {
      return
    }
    setStep(2)
  }

  const handleSubmitStepTwo = () => {
    if (!(foundedYear && fundingStage && industry && businessCategory)) return
    setStep(3)
  }

  const isStepOneValid = Boolean(selectedCompany)
  const isStepTwoValid = Boolean(foundedYear && fundingStage && industry && businessCategory)
  const isStepThreeValid = Boolean(fullName.trim() && role)

  const fundingStages = ['Bootstrapped', 'Pre-Seed', 'Seed', 'Series A', 'Series B+', 'Public']
  const industries = ['Fintech', 'Healthtech', 'SaaS', 'AI/ML', 'E-commerce', 'Manufacturing']
  const businessCategories = ['B2B', 'B2C', 'Marketplace', 'Enterprise', 'SMB']

  const renderStepOne = () => (
    <>
      <div className="mb-2">
        <p style={{ color: 'var(--Text-Tertiary, #A0A0AB)', fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on", fontFamily: 'var(--Font-family-font-family-text, "Inter Display")', fontSize: 'var(--Font-size-text-md, 16px)', fontStyle: 'normal', fontWeight: '400', lineHeight: 'var(--Line-height-text-md, 24px)' }}>Step 1 of 3</p>
      </div>

      <h2 style={{ color: 'var(--Text-Primary, #FFF)', fontFamily: 'var(--Font-family-font-family-display, "Denton Test")', fontSize: 'var(--Font-size-display-xs, 24px)', fontStyle: 'normal', fontWeight: '500', lineHeight: 'var(--Line-height-display-xs, 32px)', marginBottom: '32px' }}>
        Start Hiring with Loopx
      </h2>

      <div className="mb-6 relative dropdown-container">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for your company"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full text-white rounded-xl py-3.5 px-4 pr-12 focus:outline-none transition placeholder:text-[#8d8d8f]"
            style={{ 
              backgroundColor: '#1b1b1f',
              border: showDropdown ? '2px solid var(--active)' : '2px solid #2b2b33'
            }}
          />
          <ChevronDown  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#70707b]"/>
        </div>

        {showDropdown && (
          <div 
            className="absolute w-full mt-2 rounded-xl overflow-hidden z-20"
            style={{ 
              backgroundColor: '#131318', 
              boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '12px 0'
            }}
          >
            {filteredCompanies.map((company) => (
              <div
                key={company}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleCompanySelect(company)}
                className="px-6 py-3 cursor-pointer text-white hover:bg-[#1f1f26] transition"
                style={{ color: '#FFFFFF', fontSize: '16px' }}
              >
                {company}
              </div>
            ))}

            {shouldShowAddRow && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleAddCompany}
                className="w-full flex items-center gap-2 px-4 py-3 text-left text-white/80 hover:bg-[#1f1f26] transition"
                style={{ borderTop: '1px solid #2b2b33' }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--active)' }}>
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                Add '{searchQuery.trim()}'
              </button>
            )}
          </div>
        )}
      </div>

      <button 
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          handleNextFromStepOne()
        }}
        className="w-full text-white rounded-xl py-3.5 px-4 mb-6 transition relative z-10"
        style={{ backgroundColor: isStepOneValid ? 'var(--active)' : 'var(--disabled)' }}
        disabled={!isStepOneValid}
      >
        Next
      </button>
    </>
  )

  const renderSelect = (
    label: string,
    value: string,
    setValue: (value: string) => void,
    options: string[],
    showDropdown: boolean,
    setShowDropdown: (show: boolean) => void
  ) => (
    <div className="relative dropdown-container">
      <div className="relative">
        <input
          type="text"
          placeholder={label}
          value={value}
          readOnly
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full text-white rounded-xl py-3.5 px-4 pr-12 focus:outline-none transition placeholder:text-[#8d8d8f] cursor-pointer"
          style={{ 
            backgroundColor: '#1b1b1f', 
            border: showDropdown ? '2px solid var(--active)' : '2px solid #2b2b33'
          }}
        />
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#70707b]" />
      </div>

      {showDropdown && (
        <div 
          className="absolute w-full mt-2 rounded-xl overflow-hidden z-20"
          style={{ 
            backgroundColor: '#131318', 
            boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '12px 0'
          }}
        >
          {options.map((option) => (
            <div
              key={option}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setValue(option)
                setShowDropdown(false)
              }}
              className="px-6 py-3 cursor-pointer text-white hover:bg-[#1f1f26] transition"
              style={{ color: '#FFFFFF', fontSize: '16px' }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderStepTwo = () => (
    <>
      <button className="text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--active)' }} onClick={() => setStep(1)}>
        <span>←</span> Back
      </button>

      <div className="mb-2">
        <p style={{ color: 'var(--Text-Tertiary, #A0A0AB)', fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on", fontFamily: 'var(--Font-family-font-family-text, "Inter Display")', fontSize: 'var(--Font-size-text-md, 16px)', fontStyle: 'normal', fontWeight: '400', lineHeight: 'var(--Line-height-text-md, 24px)' }}>Step 2 of 3</p>
      </div>

      <h2 style={{ color: 'var(--Text-Primary, #FFF)', fontFamily: 'var(--Font-family-font-family-display, "Denton Test")', fontSize: 'var(--Font-size-display-xs, 24px)', fontStyle: 'normal', fontWeight: '500', lineHeight: 'var(--Line-height-display-xs, 32px)' }}>
        Start Hiring with Loopx
      </h2>

      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 mt-8 rounded-2xl flex items-center justify-center cursor-pointer relative overflow-hidden"
            style={{ backgroundColor: 'var(--active)' }}
            onClick={() => !isUploadingLogo && document.getElementById('logo-upload')?.click()}
          >
            {isUploadingLogo ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <img src={logoUrl || "/avatar.jpg"} alt="" className="w-full h-full object-cover" />
            )}
          </div>
          <button 
            style={{
              display: 'flex',
              padding: 'var(--spacing-md, 8px) var(--spacing-lg, 12px)',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'var(--spacing-xs, 4px)',
              borderRadius: 'var(--radius-lg, 10px)',
              border: '0.5px solid var(--Border-Secondary, #26272B)',
              background: 'var(--Surface-Secondary, #1A1A1E)',
              color: 'var(--Text-Brand-primary, #A48AFB)',
              fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
              fontFamily: 'var(--body)',
              fontSize: 'var(--Font-size-text-sm, 14px)',
              fontStyle: 'normal',
              fontWeight: '600',
              lineHeight: 'var(--Line-height-text-sm, 20px)',
              cursor: isUploadingLogo ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: isUploadingLogo ? 0.6 : 1
            }}
            onClick={() => !isUploadingLogo && document.getElementById('logo-upload')?.click()}
            className='mt-6'
            disabled={isUploadingLogo}
          >
            {isUploadingLogo ? 'Uploading...' : 'Replace logo'}
          </button>
          <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        </div>
        {logoUploadError && (
          <p className="text-red-400 text-sm mt-2">{logoUploadError}</p>
        )}
      </div>

      <div className="mb-4 relative dropdown-container">
        <div className="relative">
          <input
            type="text"
            placeholder="Founded year"
            value={foundedYear}
            readOnly
            onClick={() => setShowFoundedYearDropdown(!showFoundedYearDropdown)}
            className="w-full text-white rounded-xl py-3.5 px-4 pr-12 focus:outline-none transition placeholder:text-[#8d8d8f] cursor-pointer"
            style={{ 
              backgroundColor: '#1b1b1f',
              border: showFoundedYearDropdown ? '2px solid var(--active)' : '2px solid #2b2b33'
            }}
          />
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#70707b]" />
        </div>

        {showFoundedYearDropdown && (
          <div 
            className="absolute w-full mt-2 rounded-xl overflow-hidden z-20 max-h-60 overflow-y-auto"
            style={{ 
              backgroundColor: '#131318', 
              boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '12px 0'
            }}
          >
            {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <div
                key={year}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setFoundedYear(year.toString())
                  setShowFoundedYearDropdown(false)
                }}
                className="px-6 py-3 cursor-pointer text-white hover:bg-[#1f1f26] transition"
                style={{ color: '#FFFFFF', fontSize: '16px' }}
              >
                {year}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 mb-8">
        {renderSelect('Funding Stage', fundingStage, setFundingStage, fundingStages, showFundingStageDropdown, setShowFundingStageDropdown)}
        {renderSelect('Industry you operate in', industry, setIndustry, industries, showIndustryDropdown, setShowIndustryDropdown)}
        {renderSelect('Your business category', businessCategory, setBusinessCategory, businessCategories, showBusinessCategoryDropdown, setShowBusinessCategoryDropdown)}
      </div>

      <button 
        onClick={handleSubmitStepTwo}
        className="w-full text-white rounded-xl py-3.5 px-4 mb-6 transition relative z-10"
        style={{ backgroundColor: isStepTwoValid ? 'var(--active)' : 'var(--disabled)' }}
        disabled={!isStepTwoValid}
      >
        Next
      </button>
    </>
  )

  const roleOptions = ['Founder', 'Recruiter', 'HR Lead', 'People Ops', 'Hiring Manager']

  const renderStepThree = () => (
    <>
      <button className="text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--active)' }} onClick={() => setStep(isExistingCompany ? 1 : 2)}>
        <span>←</span> Back
      </button>

      <div className="mb-2">
        <p style={{ color: 'var(--Text-Tertiary, #A0A0AB)', fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on", fontFamily: 'var(--Font-family-font-family-text, "Inter Display")', fontSize: 'var(--Font-size-text-md, 16px)', fontStyle: 'normal', fontWeight: '400', lineHeight: 'var(--Line-height-text-md, 24px)' }}>Step 3 of 3</p>
      </div>

      <h2 style={{ color: 'var(--Text-Primary, #FFF)', fontFamily: 'var(--Font-family-font-family-display, "Denton Test")', fontSize: 'var(--Font-size-display-xs, 24px)', fontStyle: 'normal', fontWeight: '500', lineHeight: 'var(--Line-height-display-xs, 32px)', marginBottom: '32px' }}>
        Start Hiring with Loopx
      </h2>

      <div className="mb-8 flex justify-center">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden"
          style={{
            border: '1px solid rgba(0, 0, 0, 0.08)',
            backgroundColor: logoUrl ? 'transparent' : 'var(--active)'
          }}
        >
          <img src={logoUrl || "/avatar.jpg"} alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          placeholder="Your name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full text-white rounded-xl py-3.5 px-4 focus:outline-none transition placeholder:text-[#8d8d8f] focus:border-[var(--active)]"
          style={{ backgroundColor: '#1b1b1f', border: '2px solid #2b2b33' }}
        />

        {renderSelect('Your role', role, setRole, roleOptions, showRoleDropdown, setShowRoleDropdown)}
      </div>

      {submitError && (
        <div className="mb-4 p-3 rounded-lg text-sm text-red-400 bg-red-900/20 border border-red-800">
          {submitError}
        </div>
      )}

      <button 
        onClick={async () => {
          if (!isStepThreeValid || isSubmitting) return
          
          setIsSubmitting(true)
          setSubmitError('')
          
          try {
            const userId = localStorage.getItem('userId')
            const userEmail = localStorage.getItem('userEmail')
            
            if (!userId || !userEmail) {
              setSubmitError('User session expired. Please login again.')
              setIsSubmitting(false)
              return
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/onboarding/submit`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId,
                email: userEmail,
                company: selectedCompany,
                foundedYear,
                fundingStage,
                industry,
                businessCategory,
                fullName,
                role,
                logoUrl: logoUrl || null
              }),
            })

            const data = await response.json()

            if (data.success) {
              console.log('Onboarding completed:', data)
              // Redirect to dashboard
              window.location.href = '/dashboard'
            } else {
              setSubmitError(data.message || 'Failed to submit onboarding')
            }
          } catch (error) {
            console.error('Error submitting onboarding:', error)
            setSubmitError('Failed to connect to server. Please try again.')
          } finally {
            setIsSubmitting(false)
          }
        }}
        className="w-full text-white rounded-xl py-3.5 px-4 mb-6 transition relative z-10"
        style={{ backgroundColor: (isStepThreeValid && !isSubmitting) ? 'var(--active)' : 'var(--disabled)' }}
        disabled={!isStepThreeValid || isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Finish'}
      </button>
    </>
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="p-8">
        <h1 className="text-white text-4xl font-normal" style={{ fontFamily: 'var(--font-heading)' }}>
          Loopx
        </h1>
      </div>

      <div style={{ display: 'flex', minWidth: 'var(--width-sm, 480px)', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: '1 0 0', alignSelf: 'stretch', minHeight: 'calc(100vh - 120px)' }}>
        <div className="w-full max-w-md">
          {step === 1 && renderStepOne()}
          {step === 2 && renderStepTwo()}
          {step === 3 && renderStepThree()}

          <div className="text-center">
            <p className="text-gray-500 text-sm mb-4">
              By signing up, you agree to the{' '}
              <span className="text-gray-400 underline cursor-pointer">Terms of Service</span> and{' '}
              <span className="text-gray-400 underline cursor-pointer">Privacy Policy</span>.
            </p>

            <p className="text-gray-500 text-sm">
              Need help? <span className="cursor-pointer" style={{ color: 'var(--active)' }}>Contact support</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* FIXED: Added pointer-events-none to prevent overlay from blocking clicks */}
      <div className='absolute bottom-0 left-1/2 -translate-x-1/2 flex w-full px-10 justify-center pointer-events-none' >
        <svg xmlns="http://www.w3.org/2000/svg" width="707" height="239" viewBox="0 0 707 239" fill="none">
          <g opacity="0.2" filter="url(#filter0_f_206_1502)">
            <path d="M662.211 382.4V3.3999M623.81 382.4V3.3999M585.408 382.4V3.3999M547.007 382.4V3.3999M508.605 382.4V3.3999M470.204 382.4V3.3999M431.802 382.4V3.3999M393.4 382.4V3.3999M354.999 382.4V3.3999M316.597 382.4V3.3999M278.196 382.4V3.3999M239.794 382.4V3.3999M201.393 382.4V3.3999M162.991 382.4V3.3999M124.589 382.4V3.3999M86.1879 382.4V3.3999M47.7863 382.4V3.3999M9.38477 382.4V3.3999M703.4 380.35H3.3999M703.4 342.472H3.3999M703.4 307.963H3.3999M703.4 273.454H3.3999M703.4 238.945H3.3999M703.4 204.436H3.3999M703.4 169.926H3.3999M703.4 135.417H3.3999M703.4 100.908H3.3999M703.4 66.399H3.3999M703.4 31.8898H3.3999" stroke="url(#paint0_radial_206_1502)"/>
          </g>
          <defs>
            <filter id="filter0_f_206_1502" x="-9.77516e-05" y="-9.77516e-05" width="706.8" height="385.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur stdDeviation="1.7" result="effect1_foregroundBlur_206_1502"/>
            </filter>
            <radialGradient id="paint0_radial_206_1502" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(353.4 215.067) scale(108.684 197.665)">
              <stop stopColor="#A48AFB" stopOpacity="0"/>
              <stop offset="0.455" stopColor="#A48AFB" stopOpacity="0.5"/>
              <stop offset="1" stopColor="#A48AFB" stopOpacity="0.05"/>
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}