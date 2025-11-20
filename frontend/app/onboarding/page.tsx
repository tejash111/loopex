'use client'

import { useEffect, useMemo, useState } from 'react'

export default function Onboarding() {
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

  // Mock company data - in real app, this would come from an API
  const companies = useMemo(() => [
    'Red Bull',
    'Red Hat', 
    'Redfin',
    'Reddit'
  ], [])

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
    // Reset founded year when company changes to ensure flow order
    setFoundedYear('')
  }, [selectedCompany])

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company)
    setSearchQuery(company)
    setShowDropdown(false)
  }

  const handleAddCompany = () => {
    if (!searchQuery.trim()) return
    const value = searchQuery.trim()
    setSelectedCompany(value)
    setSearchQuery(value)
    setShowDropdown(false)
  }

  const handleNextFromStepOne = () => {
    if (!selectedCompany || !foundedYear) return
    setStep(2)
  }

  const handleSubmitStepTwo = () => {
    if (!(fundingStage && industry && businessCategory)) return
    setStep(3)
  }

  const isStepOneValid = Boolean(selectedCompany && foundedYear)
  const isStepTwoValid = Boolean(fundingStage && industry && businessCategory)
  const isStepThreeValid = Boolean(fullName.trim() && role)

  const fundingStages = ['Bootstrapped', 'Pre-Seed', 'Seed', 'Series A', 'Series B+', 'Public']
  const industries = ['Fintech', 'Healthtech', 'SaaS', 'AI/ML', 'E-commerce', 'Manufacturing']
  const businessCategories = ['B2B', 'B2C', 'Marketplace', 'Enterprise', 'SMB']

  const renderStepOne = () => (
    <>
      <div className="mb-2">
        <p className="text-gray-400 text-sm">Step 1 of 3</p>
      </div>

      <h2 className="text-white text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
        Start Hiring with Loopx
      </h2>

      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer relative overflow-hidden"
            style={{ backgroundColor: 'var(--active)' }}
            onClick={() => document.getElementById('logo-upload')?.click()}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <button 
            className="text-sm px-4 py-2 rounded-lg transition"
            style={{ color: 'var(--active)' }}
            onClick={() => document.getElementById('logo-upload')?.click()}
          >
            Replace logo
          </button>
          <input id="logo-upload" type="file" accept="image/*" className="hidden" />
        </div>
      </div>

      <div className="mb-6 relative" onBlur={() => setTimeout(() => setShowDropdown(false), 120)}>
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
            className="w-full text-white rounded-xl py-3.5 px-4 pr-12 focus:outline-none transition"
            style={{ 
              backgroundColor: showDropdown ? 'transparent' : '#1b1b1f',
              border: showDropdown ? '2px solid var(--active)' : '2px solid #2b2b33'
            }}
          />
          <svg 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: '#b0b0b9' }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {showDropdown && (
          <div 
            className="absolute w-full mt-2 rounded-xl overflow-hidden z-10 border border-[#2b2b33]"
            style={{ backgroundColor: '#131318', boxShadow: '0 20px 45px rgba(0,0,0,0.4)' }}
          >
            {filteredCompanies.map((company) => (
              <div
                key={company}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleCompanySelect(company)}
                className="px-4 py-3 cursor-pointer text-white hover:bg-[#1f1f26] transition"
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

      <div className="mb-8">
        <div className="relative">
          <select
            value={foundedYear}
            onChange={(e) => setFoundedYear(e.target.value)}
            disabled={!selectedCompany}
            className="w-full rounded-xl py-3.5 px-4 focus:outline-none transition appearance-none cursor-pointer"
            style={{ 
              backgroundColor: selectedCompany ? '#1b1b1f' : 'transparent',
              border: selectedCompany ? '2px solid var(--active)' : '2px solid #2b2b33',
              color: foundedYear ? 'white' : '#9CA3AF'
            }}
          >
            <option value="" disabled>Founded year</option>
            {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year} style={{ backgroundColor: '#1b1b1f' }}>
                {year}
              </option>
            ))}
          </select>
          <svg 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: '#6B7280' }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <button 
        onClick={handleNextFromStepOne}
        className="w-full text-white rounded-xl py-3.5 px-4 mb-6 transition"
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
    options: string[]
  ) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl py-3.5 px-4 focus:outline-none transition appearance-none cursor-pointer"
        style={{ backgroundColor: '#1b1b1f', border: '2px solid #2b2b33', color: value ? 'white' : '#9CA3AF' }}
      >
        <option value="" disabled>
          {label}
        </option>
        {options.map((option) => (
          <option key={option} value={option} style={{ backgroundColor: '#1b1b1f' }}>
            {option}
          </option>
        ))}
      </select>
      <svg 
        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
        style={{ color: '#6B7280' }}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )

  const renderStepTwo = () => (
    <>
      <button className="text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--active)' }} onClick={() => setStep(1)}>
        <span>←</span> Back
      </button>

      <div className="mb-2">
        <p className="text-gray-400 text-sm">Step 2 of 3</p>
      </div>

      <h2 className="text-white text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
        Start Hiring with Loopx
      </h2>

      <div className="flex flex-col gap-4 mb-8">
        {renderSelect('Funding Stage', fundingStage, setFundingStage, fundingStages)}
        {renderSelect('Industry you operate in', industry, setIndustry, industries)}
        {renderSelect('Your business category', businessCategory, setBusinessCategory, businessCategories)}
      </div>

      <button 
        onClick={handleSubmitStepTwo}
        className="w-full text-white rounded-xl py-3.5 px-4 mb-6 transition"
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
      <button className="text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--active)' }} onClick={() => setStep(2)}>
        <span>←</span> Back
      </button>

      <div className="mb-2">
        <p className="text-gray-400 text-sm">Step 3 of 3</p>
      </div>

      <h2 className="text-white text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
        Start Hiring with Loopx
      </h2>

      <div className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          placeholder="Your name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full text-white rounded-xl py-3.5 px-4 focus:outline-none transition"
          style={{ backgroundColor: '#1b1b1f', border: '2px solid #2b2b33' }}
        />

        <div className="relative">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl py-3.5 px-4 focus:outline-none transition appearance-none cursor-pointer"
            style={{ backgroundColor: '#1b1b1f', border: '2px solid #2b2b33', color: role ? 'white' : '#9CA3AF' }}
          >
            <option value="" disabled>
              Your role
            </option>
            {roleOptions.map((option) => (
              <option key={option} value={option} style={{ backgroundColor: '#1b1b1f' }}>
                {option}
              </option>
            ))}
          </select>
          <svg 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: '#6B7280' }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
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
            const response = await fetch('http://localhost:5000/api/onboarding/submit', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: email || 'user@example.com', // TODO: Get from auth context
                company: selectedCompany,
                foundedYear,
                fundingStage,
                industry,
                businessCategory,
                fullName,
                role
              }),
            })

            const data = await response.json()

            if (data.success) {
              console.log('Onboarding completed:', data)
              // TODO: Redirect to dashboard or home
              alert('Onboarding completed successfully!')
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
        className="w-full text-white rounded-xl py-3.5 px-4 mb-6 transition"
        style={{ backgroundColor: (isStepThreeValid && !isSubmitting) ? 'var(--active)' : 'var(--disabled)' }}
        disabled={!isStepThreeValid || isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Finish'}
      </button>
    </>
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--primary)' }}>
      <div className="p-8">
        <h1 className="text-white text-4xl font-normal" style={{ fontFamily: 'var(--font-playfair)' }}>
          Loopx
        </h1>
      </div>

      <div className="flex items-center justify-center px-8" style={{ minHeight: 'calc(100vh - 120px)' }}>
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
    </div>
  )
}
