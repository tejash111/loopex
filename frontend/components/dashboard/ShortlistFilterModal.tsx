'use client'

import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'

export interface ShortlistFilterData {
  status: string[]
  location: string[]
  company: string[]
  jobTitle: string[]
  profiles: string[]
}

interface ShortlistFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: ShortlistFilterData) => void
  initialFilters?: ShortlistFilterData
}

export default function ShortlistFilterModal({ isOpen, onClose, onApply, initialFilters }: ShortlistFilterModalProps) {
  const [activeFilterCategory, setActiveFilterCategory] = useState('status')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)
  const companyRef = useRef<HTMLDivElement>(null)
  const jobTitleRef = useRef<HTMLDivElement>(null)
  const profilesRef = useRef<HTMLDivElement>(null)

  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<string[]>(initialFilters?.status || [])
  const [locationInput, setLocationInput] = useState('')
  const [selectedLocations, setSelectedLocations] = useState<string[]>(initialFilters?.location || [])
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  
  const [companyInput, setCompanyInput] = useState('')
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(initialFilters?.company || [])
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false)
  
  const [jobTitleInput, setJobTitleInput] = useState('')
  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>(initialFilters?.jobTitle || [])
  const [showJobTitleDropdown, setShowJobTitleDropdown] = useState(false)
  
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>(initialFilters?.profiles || [])

  const statusOptions = ['Not Contacted', 'Email Sent', 'Interviewing', 'Hired', 'Rejected']
  const profileOptions = ['Database', 'Career Page', 'In house']

  const handleApply = () => {
    const filters: ShortlistFilterData = {
      status: selectedStatus,
      location: selectedLocations,
      company: selectedCompanies,
      jobTitle: selectedJobTitles,
      profiles: selectedProfiles
    }
    onApply(filters)
    onClose()
  }

  const handleClearAll = () => {
    setSelectedStatus([])
    setSelectedLocations([])
    setLocationInput('')
    setSelectedCompanies([])
    setCompanyInput('')
    setSelectedJobTitles([])
    setJobTitleInput('')
    setSelectedProfiles([])
  }

  // Location suggestions
  const locationSuggestions: { [key: string]: string[] } = {
    'chennai': ['Chennai, Tamil Nadu, India'],
    'chen': ['Chennai, Tamil Nadu, India'],
    'bangalore': ['Bangalore, Karnataka, India'],
    'bang': ['Bangalore, Karnataka, India'],
    'mumbai': ['Mumbai, Maharashtra, India'],
    'mum': ['Mumbai, Maharashtra, India'],
    'delhi': ['Delhi, India'],
    'del': ['Delhi, India'],
    'hyderabad': ['Hyderabad, Telangana, India'],
    'hyd': ['Hyderabad, Telangana, India'],
    'pune': ['Pune, Maharashtra, India'],
    'pun': ['Pune, Maharashtra, India']
  }

  // Company suggestions
  const companySuggestions: { [key: string]: string[] } = {
    'google': ['Google', 'Google Cloud', 'Google India'],
    'amazon': ['Amazon', 'Amazon Web Services', 'Amazon India'],
    'microsoft': ['Microsoft', 'Microsoft Azure', 'Microsoft India'],
    'meta': ['Meta', 'Facebook', 'Instagram'],
    'apple': ['Apple', 'Apple Inc'],
    'netflix': ['Netflix', 'Netflix India'],
    'tesla': ['Tesla', 'Tesla Motors']
  }

  // Job title suggestions
  const jobTitleSuggestions: { [key: string]: string[] } = {
    'designer': ['UX Designer', 'UI Designer', 'Product Designer', 'Graphic Designer'],
    'ux': ['UX Designer', 'UX Researcher', 'UX/UI Designer'],
    'ui': ['UI Designer', 'UX/UI Designer'],
    'product': ['Product Designer', 'Product Manager', 'Product Owner'],
    'developer': ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
    'engineer': ['Software Engineer', 'Data Engineer', 'DevOps Engineer'],
    'manager': ['Product Manager', 'Engineering Manager', 'Project Manager']
  }

  const getLocationSuggestions = (input: string) => {
    if (!input) return []
    const lowerInput = input.toLowerCase()
    return Object.entries(locationSuggestions)
      .filter(([key]) => key.includes(lowerInput))
      .flatMap(([_, values]) => values)
      .filter((value, index, self) => self.indexOf(value) === index)
  }

  const getCompanySuggestions = (input: string) => {
    if (!input) return []
    const lowerInput = input.toLowerCase()
    return Object.entries(companySuggestions)
      .filter(([key]) => key.includes(lowerInput))
      .flatMap(([_, values]) => values)
      .filter((value, index, self) => self.indexOf(value) === index)
  }

  const getJobTitleSuggestions = (input: string) => {
    if (!input) return []
    const lowerInput = input.toLowerCase()
    return Object.entries(jobTitleSuggestions)
      .filter(([key]) => key.includes(lowerInput))
      .flatMap(([_, values]) => values)
      .filter((value, index, self) => self.indexOf(value) === index)
  }

  const addLocation = (location: string) => {
    if (!selectedLocations.includes(location)) {
      setSelectedLocations([...selectedLocations, location])
    }
    setLocationInput('')
    setShowLocationDropdown(false)
  }

  const addCompany = (company: string) => {
    if (!selectedCompanies.includes(company)) {
      setSelectedCompanies([...selectedCompanies, company])
    }
    setCompanyInput('')
    setShowCompanyDropdown(false)
  }

  const addJobTitle = (jobTitle: string) => {
    if (!selectedJobTitles.includes(jobTitle)) {
      setSelectedJobTitles([...selectedJobTitles, jobTitle])
    }
    setJobTitleInput('')
    setShowJobTitleDropdown(false)
  }

  const toggleStatus = (status: string) => {
    if (selectedStatus.includes(status)) {
      setSelectedStatus(selectedStatus.filter(s => s !== status))
    } else {
      setSelectedStatus([...selectedStatus, status])
    }
  }

  const toggleProfile = (profile: string) => {
    if (selectedProfiles.includes(profile)) {
      setSelectedProfiles(selectedProfiles.filter(p => p !== profile))
    } else {
      setSelectedProfiles([...selectedProfiles, profile])
    }
  }

  // Custom Checkbox Component
  const CustomCheckbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <div
      onClick={onChange}
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '6px',
        border: checked ? 'none' : '1px solid #26272B',
        background: checked ? '#875BF7' : '#131316',
        display: 'flex',
        padding: checked ? '3px' : '0',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer'
      }}
    >
      {checked && (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M11.6663 3.5L5.24967 9.91667L2.33301 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  )

  if (!isOpen) return null

  // Handle scroll to update active section
  const handleScroll = () => {
    if (!scrollContainerRef.current) return

    const scrollContainer = scrollContainerRef.current
    const scrollTop = scrollContainer.scrollTop
    const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight
    const scrollPercentage = (scrollTop / scrollHeight) * 100

    if (scrollPercentage < 20) {
      setActiveFilterCategory('status')
    } else if (scrollPercentage < 40) {
      setActiveFilterCategory('location')
    } else if (scrollPercentage < 60) {
      setActiveFilterCategory('company')
    } else if (scrollPercentage < 80) {
      setActiveFilterCategory('jobTitle')
    } else {
      setActiveFilterCategory('profiles')
    }
  }

  // Scroll to section when clicking sidebar
  const scrollToSection = (key: string) => {
    const refs: { [key: string]: React.RefObject<HTMLDivElement | null> } = {
      status: statusRef,
      location: locationRef,
      company: companyRef,
      jobTitle: jobTitleRef,
      profiles: profilesRef
    }
    
    const ref = refs[key]
    if (ref.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: ref.current.offsetTop - 20,
        behavior: 'smooth'
      })
    }
  }

  const filterCategories = [
    { 
      key: 'status', 
      label: 'Status',
      count: selectedStatus.length,
      icon: (color: string) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7" stroke={color} strokeWidth="1.5"/>
          <circle cx="9" cy="9" r="3" fill={color}/>
        </svg>
      )
    },
    { 
      key: 'location', 
      label: 'Location',
      count: selectedLocations.length,
      icon: (color: string) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 15C9 15 14 11 14 7C14 4.23858 11.7614 2 9 2C6.23858 2 4 4.23858 4 7C4 11 9 15 9 15Z" stroke={color} strokeWidth="1.5"/>
          <circle cx="9" cy="7" r="2" fill={color}/>
        </svg>
      )
    },
    { 
      key: 'company', 
      label: 'Company',
      count: selectedCompanies.length,
      icon: (color: string) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="3" y="2" width="12" height="14" rx="1" stroke={color} strokeWidth="1.5"/>
          <path d="M6 5H12M6 8H12M6 11H9" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    },
    { 
      key: 'jobTitle', 
      label: 'Job title',
      count: selectedJobTitles.length,
      icon: (color: string) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M6 5V3C6 2.44772 6.44772 2 7 2H11C11.5523 2 12 2.44772 12 3V5" stroke={color} strokeWidth="1.5"/>
          <rect x="2" y="5" width="14" height="11" rx="1" stroke={color} strokeWidth="1.5"/>
          <path d="M2 8H16" stroke={color} strokeWidth="1.5"/>
        </svg>
      )
    },
    { 
      key: 'profiles', 
      label: 'Profiles',
      count: selectedProfiles.length,
      icon: (color: string) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="6" r="3" stroke={color} strokeWidth="1.5"/>
          <path d="M15 15C15 12.2386 12.3137 10 9 10C5.68629 10 3 12.2386 3 15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    }
  ]

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div 
        className="relative flex flex-col"
        style={{
          width: '900px',
          height: '600px',
          borderRadius: '16px',
          background: '#1a1a1e',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-[68px] py-[16px] px-[20px] border-b-[0.5px] border-[#26272b]">
          <h2 className="text-[20px] font-medium text-white" style={{ fontFamily: 'var(--font-body)' }}>
            Add your search filters
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleClearAll}
              style={{
                display: 'flex',
                padding: '8px 12px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px',
                color: '#A48AFB',
                fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                fontFamily: 'var(--Font-family-font-family-text, "Inter Display")',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '20px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              Clear filter
            </button>
            <button
              onClick={handleApply}
              style={{
                display: 'flex',
                padding: '8px 12px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px',
                borderRadius: '10px',
                background: '#875BF7',
                color: '#FFF',
                fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                fontFamily: 'var(--Font-family-font-family-text, "Inter Display")',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '20px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Show results
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div 
            className="flex flex-col px-[16px] pb-[16px] pt-[6px] w-[220px]"
            style={{
              background: '#1a1a1e',
              borderRight: '0.5px solid #26272b'
            }}
          >
            {filterCategories.map(({ key, label, icon, count }) => {
              const isActive = activeFilterCategory === key
              const color = isActive ? '#A48AFB' : '#6B6B76'
              
              return (
                <button
                  key={key}
                  onClick={() => scrollToSection(key)}
                  className="flex justify-between font-body h-[40px] mb-[2px] items-center gap-2 py-[8px] px-[12px] transition-all"
                  style={{
                    borderRadius: '2px',
                    borderLeft: isActive ? '2px solid #875BF7' : '2px solid transparent'
                  }}
                >
                  <div className='flex gap-2 items-center'>
                    <div className="flex items-center justify-center w-[18px] rounded-lg transition-all">
                      {icon(color)}
                    </div>
                    <span 
                      style={{ 
                        overflow: 'hidden',
                        color: isActive ? '#A48AFB' : color,
                        fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                        textOverflow: 'ellipsis',
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: '20px'
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  {count > 0 && (
                    <div
                      style={{
                        borderRadius: '100px',
                        background: isActive ? '#875BF7' : '#26272B',
                        padding: '2px 6px',
                        color: '#FFF',
                        fontSize: '10px',
                        fontWeight: 600,
                        minWidth: '20px',
                        textAlign: 'center'
                      }}
                    >
                      {count}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Scrollable Content */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="filter-modal-scroll flex-1 overflow-y-auto p-[16px] space-y-8 bg-[#1a1a1e]"
          >
            {/* Status Section */}
            <div ref={statusRef} className="bg-[#131316] p-[20px] rounded-[16px] font-body">
              <h3 className="text-[16px] font-medium text-white mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                Status
              </h3>
              <div className="flex flex-col gap-3">
                {statusOptions.map((status) => (
                  <label
                    key={status}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      padding: '8px 0'
                    }}
                  >
                    <CustomCheckbox
                      checked={selectedStatus.includes(status)}
                      onChange={() => toggleStatus(status)}
                    />
                    <span style={{
                      color: '#FFF',
                      fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: '20px'
                    }}>
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Section */}
            <div ref={locationRef} className="bg-[#131316] p-[20px] rounded-[16px] font-body">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-medium text-white" style={{ fontFamily: 'var(--font-body)' }}>
                  Location
                </h3>
                {selectedLocations.length > 0 && (
                  <button 
                    onClick={() => setSelectedLocations([])}
                    className="text-[12px] text-[#875BF7] hover:text-[#A48AFB] transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="relative mb-2">
                <Input
                  value={locationInput}
                  onChange={(e) => {
                    setLocationInput(e.target.value)
                    setShowLocationDropdown(true)
                  }}
                  onFocus={() => setShowLocationDropdown(true)}
                  placeholder="eg. Chennai, Tamil Nadu, India"
                  className="w-full rounded-[12px] border-[0.5px]"
                  style={{
                    padding: '10px 40px 10px 14px',
                    border: '0.5px solid #26272B',
                    background: '#1A1A1E',
                    color: '#FFF',
                    fontSize: '16px'
                  }}
                />
                <svg
                  className='absolute right-3 top-1/2 -translate-y-1/2'
                  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M9.16699 2.16675C13.033 2.16675 16.167 5.30076 16.167 9.16675C16.167 10.82 15.5947 12.3383 14.6367 13.5359L14.3564 13.8855L14.6738 14.2019L17.7363 17.2644C17.8663 17.3946 17.8664 17.606 17.7363 17.7361C17.6062 17.8662 17.3948 17.8661 17.2646 17.7361L14.2021 14.6736L13.8857 14.3562L13.5361 14.6365C12.3385 15.5944 10.8202 16.1667 9.16699 16.1667C5.301 16.1667 2.16699 13.0328 2.16699 9.16675C2.16699 5.30076 5.301 2.16675 9.16699 2.16675ZM9.16699 2.83374C5.66919 2.83374 2.83398 5.66895 2.83398 9.16675C2.83398 12.6646 5.66919 15.4998 9.16699 15.4998C12.6648 15.4998 15.5 12.6646 15.5 9.16675C15.5 5.66895 12.6648 2.83374 9.16699 2.83374Z" fill="black" stroke="#70707B"/>
                </svg>
                {showLocationDropdown && getLocationSuggestions(locationInput).length > 0 && (
                  <div 
                    style={{
                      display: 'flex',
                      padding: '4px',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      flex: '1 0 0',
                      borderRadius: '12px',
                      border: '0.5px solid #26272B',
                      background: '#1A1A1E',
                      boxShadow: '0 4px 28.8px 0 rgba(0, 0, 0, 0.13)',
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      marginTop: '4px',
                      zIndex: 50
                    }}
                  >
                    {getLocationSuggestions(locationInput).map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => addLocation(suggestion)}
                        style={{
                          display: 'flex',
                          padding: '8px 12px',
                          alignItems: 'center',
                          alignSelf: 'stretch',
                          cursor: 'pointer',
                          color: '#FFF',
                          fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                          fontFamily: 'var(--Font-family-font-family-text, "Inter Display")',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          lineHeight: '20px',
                          borderRadius: '8px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#26272B'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedLocations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedLocations.map((tag, index) => (
                    <div 
                      key={index} 
                      style={{
                        display: 'flex',
                        height: '32px',
                        padding: '6px 8px 6px 12px',
                        alignItems: 'center',
                        gap: '8px',
                        borderRadius: '8px',
                        border: '0.5px solid #26272B',
                        background: '#1A1A1E'
                      }}
                    >
                      <span 
                        style={{
                          overflow: 'hidden',
                          color: '#FFF',
                          fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                          textOverflow: 'ellipsis',
                          fontFamily: 'var(--Font-family-font-family-text, "Inter Display")',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          lineHeight: '20px'
                        }}
                      >
                        {tag}
                      </span>
                      <button onClick={() => setSelectedLocations(selectedLocations.filter((_, i) => i !== index))}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M10.5 3.5L3.50041 10.4996M10.4996 10.5L3.5 3.50043" stroke="#A0A0AB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Company Section */}
            <div ref={companyRef} className="bg-[#131316] p-[20px] rounded-[16px] font-body">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-medium text-white" style={{ fontFamily: 'var(--font-body)' }}>
                  Company
                </h3>
                {selectedCompanies.length > 0 && (
                  <button 
                    onClick={() => setSelectedCompanies([])}
                    className="text-[12px] text-[#875BF7] hover:text-[#A48AFB] transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="relative mb-2">
                <Input
                  value={companyInput}
                  onChange={(e) => {
                    setCompanyInput(e.target.value)
                    setShowCompanyDropdown(true)
                  }}
                  onFocus={() => setShowCompanyDropdown(true)}
                  placeholder="eg. Google, Amazon, Microsoft"
                  className="w-full rounded-[12px] border-[0.5px]"
                  style={{
                    padding: '10px 40px 10px 14px',
                    border: '0.5px solid #26272B',
                    background: '#1A1A1E',
                    color: '#FFF',
                    fontSize: '16px'
                  }}
                />
                <svg
                  className='absolute right-3 top-1/2 -translate-y-1/2'
                  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M9.16699 2.16675C13.033 2.16675 16.167 5.30076 16.167 9.16675C16.167 10.82 15.5947 12.3383 14.6367 13.5359L14.3564 13.8855L14.6738 14.2019L17.7363 17.2644C17.8663 17.3946 17.8664 17.606 17.7363 17.7361C17.6062 17.8662 17.3948 17.8661 17.2646 17.7361L14.2021 14.6736L13.8857 14.3562L13.5361 14.6365C12.3385 15.5944 10.8202 16.1667 9.16699 16.1667C5.301 16.1667 2.16699 13.0328 2.16699 9.16675C2.16699 5.30076 5.301 2.16675 9.16699 2.16675ZM9.16699 2.83374C5.66919 2.83374 2.83398 5.66895 2.83398 9.16675C2.83398 12.6646 5.66919 15.4998 9.16699 15.4998C12.6648 15.4998 15.5 12.6646 15.5 9.16675C15.5 5.66895 12.6648 2.83374 9.16699 2.83374Z" fill="black" stroke="#70707B"/>
                </svg>
                {showCompanyDropdown && getCompanySuggestions(companyInput).length > 0 && (
                  <div 
                    style={{
                      display: 'flex',
                      padding: '4px',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      flex: '1 0 0',
                      borderRadius: '12px',
                      border: '0.5px solid #26272B',
                      background: '#1A1A1E',
                      boxShadow: '0 4px 28.8px 0 rgba(0, 0, 0, 0.13)',
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      marginTop: '4px',
                      zIndex: 50
                    }}
                  >
                    {getCompanySuggestions(companyInput).map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => addCompany(suggestion)}
                        style={{
                          display: 'flex',
                          padding: '8px 12px',
                          alignItems: 'center',
                          alignSelf: 'stretch',
                          cursor: 'pointer',
                          color: '#FFF',
                          fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                          fontFamily: 'var(--Font-family-font-family-text, "Inter Display")',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          lineHeight: '20px',
                          borderRadius: '8px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#26272B'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedCompanies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedCompanies.map((tag, index) => (
                    <div 
                      key={index} 
                      style={{
                        display: 'flex',
                        height: '32px',
                        padding: '6px 8px 6px 12px',
                        alignItems: 'center',
                        gap: '8px',
                        borderRadius: '8px',
                        border: '0.5px solid #26272B',
                        background: '#1A1A1E'
                      }}
                    >
                      <span 
                        style={{
                          overflow: 'hidden',
                          color: '#FFF',
                          fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                          textOverflow: 'ellipsis',
                          fontFamily: 'var(--Font-family-font-family-text, "Inter Display")',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          lineHeight: '20px'
                        }}
                      >
                        {tag}
                      </span>
                      <button onClick={() => setSelectedCompanies(selectedCompanies.filter((_, i) => i !== index))}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M10.5 3.5L3.50041 10.4996M10.4996 10.5L3.5 3.50043" stroke="#A0A0AB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Job Title Section */}
            <div ref={jobTitleRef} className="bg-[#131316] p-[20px] rounded-[16px] font-body">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-medium text-white" style={{ fontFamily: 'var(--font-body)' }}>
                  Job title
                </h3>
                {selectedJobTitles.length > 0 && (
                  <button 
                    onClick={() => setSelectedJobTitles([])}
                    className="text-[12px] text-[#875BF7] hover:text-[#A48AFB] transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="relative mb-2">
                <Input
                  value={jobTitleInput}
                  onChange={(e) => {
                    setJobTitleInput(e.target.value)
                    setShowJobTitleDropdown(true)
                  }}
                  onFocus={() => setShowJobTitleDropdown(true)}
                  placeholder="eg. UX Designer, Product Manager"
                  className="w-full rounded-[12px] border-[0.5px]"
                  style={{
                    padding: '10px 40px 10px 14px',
                    border: '0.5px solid #26272B',
                    background: '#1A1A1E',
                    color: '#FFF',
                    fontSize: '16px'
                  }}
                />
                <svg
                  className='absolute right-3 top-1/2 -translate-y-1/2'
                  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M9.16699 2.16675C13.033 2.16675 16.167 5.30076 16.167 9.16675C16.167 10.82 15.5947 12.3383 14.6367 13.5359L14.3564 13.8855L14.6738 14.2019L17.7363 17.2644C17.8663 17.3946 17.8664 17.606 17.7363 17.7361C17.6062 17.8662 17.3948 17.8661 17.2646 17.7361L14.2021 14.6736L13.8857 14.3562L13.5361 14.6365C12.3385 15.5944 10.8202 16.1667 9.16699 16.1667C5.301 16.1667 2.16699 13.0328 2.16699 9.16675C2.16699 5.30076 5.301 2.16675 9.16699 2.16675ZM9.16699 2.83374C5.66919 2.83374 2.83398 5.66895 2.83398 9.16675C2.83398 12.6646 5.66919 15.4998 9.16699 15.4998C12.6648 15.4998 15.5 12.6646 15.5 9.16675C15.5 5.66895 12.6648 2.83374 9.16699 2.83374Z" fill="black" stroke="#70707B"/>
                </svg>
                {showJobTitleDropdown && getJobTitleSuggestions(jobTitleInput).length > 0 && (
                  <div 
                    style={{
                      display: 'flex',
                      padding: '4px',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      flex: '1 0 0',
                      borderRadius: '12px',
                      border: '0.5px solid #26272B',
                      background: '#1A1A1E',
                      boxShadow: '0 4px 28.8px 0 rgba(0, 0, 0, 0.13)',
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      marginTop: '4px',
                      zIndex: 50
                    }}
                  >
                    {getJobTitleSuggestions(jobTitleInput).map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => addJobTitle(suggestion)}
                        style={{
                          display: 'flex',
                          padding: '8px 12px',
                          alignItems: 'center',
                          alignSelf: 'stretch',
                          cursor: 'pointer',
                          color: '#FFF',
                          fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                          fontFamily: 'var(--Font-family-font-family-text, "Inter Display")',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          lineHeight: '20px',
                          borderRadius: '8px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#26272B'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedJobTitles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedJobTitles.map((tag, index) => (
                    <div 
                      key={index} 
                      style={{
                        display: 'flex',
                        height: '32px',
                        padding: '6px 8px 6px 12px',
                        alignItems: 'center',
                        gap: '8px',
                        borderRadius: '8px',
                        border: '0.5px solid #26272B',
                        background: '#1A1A1E'
                      }}
                    >
                      <span 
                        style={{
                          overflow: 'hidden',
                          color: '#FFF',
                          fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                          textOverflow: 'ellipsis',
                          fontFamily: 'var(--Font-family-font-family-text, "Inter Display")',
                          fontSize: '14px',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          lineHeight: '20px'
                        }}
                      >
                        {tag}
                      </span>
                      <button onClick={() => setSelectedJobTitles(selectedJobTitles.filter((_, i) => i !== index))}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M10.5 3.5L3.50041 10.4996M10.4996 10.5L3.5 3.50043" stroke="#A0A0AB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profiles Section */}
            <div ref={profilesRef} className="bg-[#131316] p-[20px] rounded-[16px] font-body">
              <h3 className="text-[16px] font-medium text-white mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                Profiles
              </h3>
              <div className="flex flex-col gap-3">
                {profileOptions.map((profile) => (
                  <label
                    key={profile}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      padding: '8px 0'
                    }}
                  >
                    <CustomCheckbox
                      checked={selectedProfiles.includes(profile)}
                      onChange={() => toggleProfile(profile)}
                    />
                    <span style={{
                      color: '#FFF',
                      fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: '20px'
                    }}>
                      {profile}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
