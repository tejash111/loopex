'use client'

import Sidebar from '@/components/dashboard/Sidebar'
import ProjectModal from '@/components/dashboard/ProjectModal'
import { Button } from '@/components/ui/button'
import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader } from 'lucide-react'

const socialIcons = [
  {
    name: "whatsapp",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M1 5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H10.2C11.8802 1 12.7202 1 13.362 1.32698C13.9265 1.6146 14.3854 2.07354 14.673 2.63803C15 3.27976 15 4.11984 15 5.8V10.2C15 11.8802 15 12.7202 14.673 13.362C14.3854 13.9265 13.9265 14.3854 13.362 14.673C12.7202 15 11.8802 15 10.2 15H5.8C4.11984 15 3.27976 15 2.63803 14.673C2.07354 14.3854 1.6146 13.9265 1.32698 13.362C1 12.7202 1 11.8802 1 10.2V5.8Z" fill="url(#paint0_linear_3501_30884)"/>
  <path d="M8 11.5C10.4853 11.5 12.5 9.82107 12.5 7.75C12.5 5.67893 10.4853 4 8 4C5.51472 4 3.5 5.67893 3.5 7.75C3.5 9.06275 4.30944 10.2179 5.5351 10.8879C5.49407 11.2213 5.37074 11.6663 5 12C5.70106 11.8738 6.26057 11.6202 6.67853 11.3357C7.09639 11.4425 7.54014 11.5 8 11.5Z" fill="white"/>
  <defs>
    <linearGradient id="paint0_linear_3501_30884" x1="8" y1="1" x2="8" y2="15" gradientUnits="userSpaceOnUse">
      <stop stop-color="#09D72C"/>
      <stop offset="1" stop-color="#0F9622"/>
    </linearGradient>
  </defs>
</svg>`
  },
  {
    name: "drive",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M12.4043 4.79395L9.03654 7.42218L5.5918 4.79395V4.79466L5.59596 4.79821V8.47845L8.9977 11.1635L12.4043 8.58216V4.79395Z" fill="#EA4335"/>
      <path d="M13.2877 4.15484L12.4033 4.79414V8.58236L15.1863 6.44567V5.15854C15.1863 5.15854 14.8485 3.3202 13.2877 4.15484Z" fill="#FBBC05"/>
      <path d="M12.4033 8.582V13.4954H14.5363C14.5363 13.4954 15.1433 13.4329 15.187 12.741V6.44531L12.4033 8.582Z" fill="#34A853"/>
      <path d="M2.8125 6.4502V12.7459C2.85551 13.4385 3.46316 13.5003 3.46316 13.5003H5.59618L5.59133 8.47536L2.8125 6.4502Z" fill="#4285F4"/>
    </svg>`
  },
  {
    name: "linkedin",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
      <rect x="1.0625" y="1.0625" width="14.875" height="14.875" rx="7.4375" fill="#1275B1"/>
      <path d="M6.70361 5.14895C6.70361 5.64543 6.27327 6.04791 5.74243 6.04791C5.21158 6.04791 4.78125 5.64543 4.78125 5.14895C4.78125 4.65248 5.21158 4.25 5.74243 4.25C6.27327 4.25 6.70361 4.65248 6.70361 5.14895Z" fill="white"/>
      <path d="M4.91269 6.70868H6.55573V11.6875H4.91269V6.70868Z" fill="white"/>
      <path d="M9.20103 6.70868H7.55799V11.6875H9.20103C9.20103 11.6875 9.20103 10.1201 9.20103 9.14008C9.20103 8.55186 9.40188 7.96107 10.2033 7.96107C11.109 7.96107 11.1035 8.73084 11.0993 9.32721C11.0938 10.1067 11.107 10.9022 11.107 11.6875H12.75V9.05979C12.7361 7.38192 12.2989 6.60879 10.8605 6.60879C10.0063 6.60879 9.47682 6.99659 9.20103 7.34745V6.70868Z" fill="white"/>
    </svg>`
  },
  {
    name: "x",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.88364 11.25L5.23505 7.47482L1.91935 11.25H0.516602L4.61271 6.58757L0.516602 0.75H4.11808L6.61434 4.30808L9.74204 0.75H11.1448L7.23877 5.1965L11.4851 11.25H7.88364Z" fill="white"/>
    </svg>`
  },
  {
    name: "github",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7 0C3.1339 0 0 3.1388 0 7.0119C0 10.1094 2.0055 12.7379 4.7873 13.6647C5.1373 13.7291 5.2647 13.5128 5.2647 13.3266C5.2647 13.1607 5.2591 12.719 5.2556 12.1345C3.3082 12.558 2.8973 11.1944 2.8973 11.1944C2.5795 10.3838 2.1203 10.1682 2.1203 10.1682C1.4847 9.7342 2.1686 9.7426 2.1686 9.7426C2.8707 9.7916 3.2403 10.465 3.2403 10.465C3.8647 11.536 4.879 11.2266 5.2773 11.0474C5.3417 10.5945 5.5223 10.2858 5.7225 10.1108C4.1685 9.9337 2.534 9.3317 2.534 6.6451C2.534 5.88 2.807 5.2535 3.2543 4.7635C3.1822 4.5864 2.9421 3.8731 3.3229 2.9085C3.9109 2.7195 5.2479 3.6267 5.8189 3.4709C6.4081 3.3916 7 3.3908 7 3.3908C8.1935 3.4713 8.7528 3.6267 10.0891 2.7195C11.0579 3.8731 10.8171 4.5864 10.7457 4.7635C11.4653 5.88 11.4653 6.6451 11.4653 6.6451C11.4653 9.3387 9.828 9.9316 8.2691 10.1052C8.5204 10.3215 8.7437 10.7492 8.7437 11.4037C8.7437 12.3403 8.7353 13.097 8.7353 13.3266C8.8613 13.7326 9.2169 13.664 10.6108 13.1965C11.8225 12.3027 12.6808 11.109 13.5391 9.9154C14.0006 8.4821 14 3.1388 7 0Z" fill="white"/>
    </svg>`
  }
];

const Listing = () => {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('query') || ''
  
  const [showModal, setShowModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [userProjects, setUserProjects] = useState<string[]>([])
  const [projectName, setProjectName] = useState('')
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('Overview')

  // Fetch user projects and restore selected project on mount
  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const response = await fetch(`${apiUrl}/api/projects`, {
          credentials: 'include'
        })

        if (!response.ok) {
          console.error('Failed to fetch projects:', response.statusText)
          return
        }

        const data = await response.json()
        if (data.success && Array.isArray(data.data)) {
          const projectNames = data.data.map((project: { name: string }) => project.name)
          setUserProjects(projectNames)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }

    fetchUserProjects()
    
    // Restore selected project from localStorage
    const savedProject = localStorage.getItem('selectedProject')
    if (savedProject) {
      setSelectedProject(savedProject)
    }
    
    // Restore dropdown state from localStorage
    const showDropdown = localStorage.getItem('showProjectsDropdown') === 'true'
    if (showDropdown) {
      setShowProjectsDropdown(true)
    }
  }, [])

  // Auto-select first project if none selected
  useEffect(() => {
    if (userProjects.length > 0 && !selectedProject) {
      setSelectedProject(userProjects[0])
      localStorage.setItem('selectedProject', userProjects[0])
    }
  }, [userProjects.length, userProjects, selectedProject])

  // Persist selected project to localStorage
  useEffect(() => {
    if (selectedProject) {
      localStorage.setItem('selectedProject', selectedProject)
    }
  }, [selectedProject])

  // Persist dropdown state to localStorage
  useEffect(() => {
    localStorage.setItem('showProjectsDropdown', showProjectsDropdown.toString())
  }, [showProjectsDropdown])

  // Filter candidates based on search query
  // Note: When searchQuery is provided, server already returns filtered results via AI-powered search
  // We only apply client-side filtering when server-side search is not available
  const filteredCandidates = useMemo(() => {
    // Server-side search already handles filtering with fuzzy matching
    // Just return the candidates as-is since they're already filtered by the API
    return candidates
  }, [candidates])

  // Fetch profiles data from backend using natural language search
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true)

        let response;
        let data;

        // Use the AI-powered search endpoint if there's a search query
        if (searchQuery && searchQuery.trim()) {
          response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
              query: searchQuery.trim(),
              limit: 50,
              skip: 0
            })
          })
        } else {
          // Fallback to regular profile endpoint for no search query
          response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
            credentials: 'include'
          })
        }

        if (!response.ok) {
          if (response.status === 401) {
            setError('Not authenticated')
          } else {
            throw new Error('Failed to fetch candidates')
          }
          setLoading(false)
          return
        }

        data = await response.json()
        
        // Transform profile data to candidate card format
        if (data.success && Array.isArray(data.data)) {
          const transformedCandidates = data.data.map((profile: any) => ({
            id: profile._id,
            name: profile.name,
            position: profile.workExperience?.[0]?.title || 'Position not specified',
            company: profile.workExperience?.[0]?.company || '',
            education: profile.education?.[0]?.degree || 'Education not specified',
            institute: profile.education?.[0]?.institute || '',
            location: profile.location || 'Location not specified',
            description: profile.workExperience?.[0]?.description || 'No description available',
            highlights: profile.skills?.flatMap((s: any) => s.skills).slice(0, 4) || [],
            availability: 'Immediately',
            salary: '10 - 15 LPA',
            socials: profile.socials || {},
            score: profile.score || 0 // Include the relevance score from search
          }))
          setCandidates(transformedCandidates)
          
          // Log search metadata if available
          if (data.meta?.parsedFilters) {
            console.log('[Search] Parsed filters:', data.meta.parsedFilters)
          }
        } else {
          setCandidates([])
        }
      } catch (err) {
        console.error('Error fetching candidates:', err)
        setError('Failed to load candidates')
        setCandidates([])
      } finally {
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [searchQuery])

  const handleCreateProject = async () => {
    if (projectName.trim()) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ name: projectName.trim() })
        })

        const data = await response.json()

        if (data.success) {
          const newProject = projectName.trim()
          setUserProjects([...userProjects, newProject])
          setSelectedProject(newProject)
          setProjectName('')
          setShowModal(false)
        } else {
          alert(data.message || 'Failed to create project')
        }
      } catch (error) {
        console.error('Error creating project:', error)
        alert('Failed to create project. Please try again.')
      }
    }
  }


  const candidatesData = filteredCandidates.length > 0 ? filteredCandidates : []

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#131316' }}>
        <Loader className='animate-spin'/>
      </div>
    )
  }

  return (
    <>
      <Sidebar
        showModal={showModal}
        showFilterModal={showFilterModal}
        selectedProject={selectedProject}
        userProjects={userProjects}
        onNewProject={() => setShowModal(true)}
        onProjectSelect={setSelectedProject}
        showProjectsDropdown={showProjectsDropdown}
        onShowProjectsDropdownChange={setShowProjectsDropdown}
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div 
        className="min-h-screen rounded-[24px] flex px-[16px] py-[12px] bg-[#131316] transition-all duration-300" 
        style={{ backgroundColor: '#131316', marginLeft: sidebarCollapsed ? '88px' : '252px' }}
      >
      <main className={`flex-1 flex relative overflow-hidden bg-[#161619]  border border-[#26272B] rounded-[20px] transition-all duration-300 ${showModal || showFilterModal ? 'blur-[2px]' : ''}`}>
              {/* Left side - Candidate List */}
              <div className='flex-1 overflow-y-auto hide-scrollbar' style={{ maxHeight: 'calc(100vh - 48px)' }}>
              <div className='p-[6px]'>
                {/* Header Section */}
                <div 
                  className=' items-center justify-between px-[20px] py-[14px] border-[#3F3F46] border rounded-xl mb-[24px]'
                  style={{
                    background: '#131316'
                  }}
                >
                  {/* Left side */}
                  <div className='flex items-center gap-[12px] mb-[6px]'>
                    {/* Dropdown */}
                    <button 
                      className='flex items-center gap-[6px] px-[10px] border border-border py-[5px] rounded-md'
                      style={{
                        background: '#2A2A2E',
                        color: '#FFF',
                        cursor: 'pointer'
                      }}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M4.13187 1.31252C4.73236 1.31226 5.1475 1.31207 5.52018 1.45182C6.33422 1.75707 6.69139 2.47992 6.96678 3.03709C7.04921 3.20201 7.19918 3.50162 7.24113 3.5675C7.25396 3.58903 7.29456 3.63314 7.35406 3.63731C7.43176 3.64534 7.53699 3.64588 7.72138 3.64588H9.79478C10.3892 3.64587 10.8685 3.64587 11.2531 3.68499C11.6501 3.72538 11.9944 3.81104 12.299 4.01454C12.5379 4.17414 12.7429 4.37922 12.9025 4.61807C13.106 4.92263 13.1917 5.26692 13.2321 5.66391C13.2712 6.04851 13.2712 6.57614 13.2712 7.17055C13.2712 8.17371 13.2712 8.96016 13.2075 9.58631C13.1425 10.2249 13.0077 10.7452 12.7059 11.1968C12.4611 11.5631 12.1467 11.8775 11.7805 12.1223C11.3288 12.4241 10.8085 12.5589 10.1699 12.6238C9.54378 12.6875 8.75733 12.6875 7.75417 12.6875H6.96684C5.62029 12.6875 4.56502 12.6875 3.74166 12.5769C2.89889 12.4635 2.23388 12.2271 1.71191 11.7052C1.18993 11.1832 0.953487 10.5181 0.84018 9.67539C0.729481 8.85201 0.729487 7.79676 0.729492 6.4502V4.61393C0.729487 4.10133 0.729481 3.68791 0.758916 3.35404C0.789237 3.01002 0.853381 2.70898 1.00681 2.43405C1.20449 2.07983 1.49677 1.78754 1.851 1.58986C2.12592 1.43643 2.42697 1.3723 2.77098 1.34197C3.10486 1.31254 3.61927 1.31252 4.13187 1.31252Z" fill="#70707B"/>
</svg>
                      <span style={{
                        fontFamily: "--var(font-body)",
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#E5E7EB'
                      }}>
                        UX intern
                      </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M10.5 5.25003C10.5 5.25003 7.92231 8.75 7 8.75C6.07763 8.75 3.5 5.25 3.5 5.25" stroke="#70707B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                    </button>

                   
                  </div>

                  {/* Right side */}
                  <div className='flex items-center justify-between'>

                    <div className='flex items-center'>
                          {/* Title with edit icon */}
                    <h1 
                    className='font-body '
                    style={{
                      fontFamily : "--var(font-body)",
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#FFFFFF',
                      lineHeight: '24px',
                      margin: 0
                    }}>
                      {searchQuery || 'All Candidates'}
                    </h1>
                    <button 
                     className='ml-[4px] mr-[12px]'
                    >
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.6635 2.31358C13.4982 1.47881 14.8517 1.47881 15.6864 2.31358C16.5213 3.14835 16.5213 4.50178 15.6864 5.33655L15.3417 5.68129L12.3188 2.65832L12.6635 2.31358ZM11.5233 3.45381L14.5462 6.47678L9.94947 11.0735C9.49677 11.5263 8.92947 11.8475 8.3084 12.0027L6.13649 12.5457C5.9448 12.5936 5.74202 12.5375 5.60231 12.3977C5.4626 12.258 5.40643 12.0553 5.45435 11.8636L5.99733 9.69165C6.15261 9.07058 6.47378 8.50328 6.92649 8.05058L11.5233 3.45381ZM7.8854 3.1875H7.8392C6.67989 3.18749 5.74524 3.18747 5.00224 3.2753C4.23328 3.36619 3.57527 3.55975 3.02046 4.01505C2.83585 4.16657 2.66657 4.33584 2.51506 4.52046C2.05975 5.07526 1.86619 5.73327 1.7753 6.50222C1.68747 7.24523 1.68749 8.17988 1.6875 9.33915V9.80318C1.68748 11.1329 1.68746 12.2046 1.8008 13.0475C1.91846 13.9226 2.17017 14.6595 2.75536 15.2447C3.34056 15.8299 4.07738 16.0816 4.95248 16.1993C5.79536 16.3125 6.86707 16.3125 8.19665 16.3125H8.66082C9.8201 16.3125 10.7547 16.3125 11.4978 16.2247C12.2667 16.1338 12.9247 15.9403 13.4796 15.485C13.6641 15.3335 13.8334 15.1642 13.9849 14.9795C14.4402 14.4248 14.6338 13.7668 14.7247 12.9978C14.8125 12.2548 14.8125 11.3201 14.8125 10.1609V10.1146C14.8125 9.7119 14.4861 9.38543 14.0833 9.38543C13.6806 9.38543 13.3542 9.7119 13.3542 10.1146C13.3542 11.331 13.353 12.1793 13.2765 12.8266C13.2018 13.4579 13.0644 13.8025 12.8576 14.0544C12.7667 14.1652 12.6651 14.2667 12.5544 14.3576C12.3024 14.5644 11.9579 14.7018 11.3265 14.7764C10.6792 14.853 9.83097 14.8542 8.61455 14.8542H8.24997C6.85446 14.8542 5.88116 14.8526 5.1468 14.7539C4.43341 14.658 4.05563 14.4826 3.78656 14.2135C3.51749 13.9444 3.34205 13.5666 3.24613 12.8532C3.14739 12.1189 3.14584 11.1455 3.14584 9.75V9.38543C3.14584 8.169 3.14703 7.32078 3.22355 6.67341C3.29817 6.04214 3.43564 5.69752 3.64238 5.44561C3.73328 5.33484 3.83485 5.23327 3.94562 5.14237C4.19753 4.93563 4.54214 4.79817 5.17343 4.72355C5.8208 4.64703 6.669 4.64584 7.8854 4.64584C8.28815 4.64584 8.61462 4.31938 8.61462 3.91667C8.61462 3.51396 8.28815 3.1875 7.8854 3.1875Z" fill="#A0A0AB"/>
</svg>
                    </button>
                    <div 
                      style={{
                        display: 'flex',
                        padding: '2px 6px 2px 8px',
                        alignItems: 'center',
                        gap: '4px',
                        borderRadius: '6px',
                        border: '0.5px solid #315F45',
                        background: '#172820'
                      }}
                    >
                      <span style={{
                        textAlign: 'center',
                        fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                        fontFamily: "--var(font-body)",
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        lineHeight: '20px',
                        color: '#CAF7DA'
                      }}>
                        {filteredCandidates.length.toLocaleString()}
                      </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M4.12495 5.25C4.12495 4.21447 4.96442 3.375 5.99995 3.375C7.0355 3.375 7.87495 4.21447 7.87495 5.25C7.87495 6.0128 7.4194 6.66925 6.76555 6.9621C8.10245 7.27325 9.125 8.38075 9.125 9.7495C9.125 9.95665 8.9571 10.1245 8.75 10.1245H3.25C3.0429 10.1245 2.875 9.95665 2.875 9.7495C2.875 8.38075 3.89753 7.2733 5.2344 6.9621C4.58049 6.66925 4.12495 6.01285 4.12495 5.25Z" fill="#CAF7DA"/>
  <path d="M3.74995 1.87402C2.71442 1.87402 1.87495 2.71349 1.87495 3.74902C1.87495 4.51185 2.33049 5.1683 2.98439 5.4611C1.64753 5.77235 0.625 6.8798 0.625 8.24855C0.625 8.45565 0.792895 8.62355 1 8.62355H2.31264C2.58622 7.8333 3.13916 7.18015 3.83955 6.74035C3.54674 6.3171 3.37495 5.80335 3.37495 5.249C3.37495 4.0366 4.19693 3.01615 5.314 2.71455C4.97831 2.20802 4.40313 1.87402 3.74995 1.87402Z" fill="#CAF7DA"/>
  <path d="M9.687 8.62355C9.41345 7.83325 8.86045 7.1801 8.16005 6.7403C8.45285 6.31705 8.6246 5.8033 8.6246 5.249C8.6246 4.0366 7.80265 3.01615 6.68555 2.71455C7.02125 2.20802 7.59645 1.87402 8.2496 1.87402C9.28515 1.87402 10.1246 2.71349 10.1246 3.74902C10.1246 4.51184 9.6691 5.16825 9.0152 5.4611C10.3521 5.7723 11.3746 6.87975 11.3746 8.24855C11.3746 8.45565 11.2067 8.62355 10.9996 8.62355H9.687Z" fill="#CAF7DA"/>
</svg>
                    </div>
                    </div>
                  
                   

                    {/* Filter button */}
                    <button 
                      style={{
                        display: 'flex',
                        padding: 'var(--spacing-sm, 6px) var(--spacing-md, 8px)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs, 4px)',
                        borderRadius: 'var(--radius-md, 8px)',
                        border: '0.5px solid var(--Border-Tertiary, #3F3F46)',
                        background: 'var(--Surface-Tertiary, #26272B)',
                        color: 'var(--Text-Primary, #FFF)',
                        fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                        fontFamily: "--var(font-body)",
                        fontSize: 'var(--Font-size-text-xs, 12px)',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: 'var(--Line-height-text-xs, 18px)',
                        cursor: 'pointer'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.33301 4.66667C1.33301 4.29848 1.63149 4 1.99967 4H3.99967C4.36786 4 4.66634 4.29848 4.66634 4.66667C4.66634 5.03485 4.36786 5.33333 3.99967 5.33333H1.99967C1.63149 5.33333 1.33301 5.03485 1.33301 4.66667Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.33301 11.3337C1.33301 10.9655 1.63149 10.667 1.99967 10.667H5.99967C6.36786 10.667 6.66634 10.9655 6.66634 11.3337C6.66634 11.7019 6.36786 12.0003 5.99967 12.0003H1.99967C1.63149 12.0003 1.33301 11.7019 1.33301 11.3337Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.333 11.3337C11.333 10.9655 11.6315 10.667 11.9997 10.667H13.9997C14.3679 10.667 14.6663 10.9655 14.6663 11.3337C14.6663 11.7019 14.3679 12.0003 13.9997 12.0003H11.9997C11.6315 12.0003 11.333 11.7019 11.333 11.3337Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.33301 4.66667C9.33301 4.29848 9.63147 4 9.99967 4H13.9997C14.3679 4 14.6663 4.29848 14.6663 4.66667C14.6663 5.03486 14.3679 5.33333 13.9997 5.33333H9.99967C9.63147 5.33333 9.33301 5.03485 9.33301 4.66667Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.98317 2.16699H6.01683C6.31314 2.16699 6.5605 2.16699 6.7636 2.18084C6.975 2.19527 7.17467 2.22636 7.36827 2.30655C7.81747 2.49262 8.1744 2.84952 8.36047 3.29874C8.44067 3.49233 8.47173 3.69202 8.48613 3.90342C8.5 4.10649 8.5 4.35385 8.5 4.65015V4.68383C8.5 4.98014 8.5 5.22749 8.48613 5.43057C8.47173 5.64197 8.44067 5.84165 8.36047 6.03525C8.1744 6.48447 7.81747 6.84139 7.36827 7.02746C7.17467 7.10766 6.975 7.13873 6.7636 7.15313C6.5605 7.16699 6.31315 7.16699 6.01684 7.16699H5.98316C5.68685 7.16699 5.4395 7.16699 5.23643 7.15313C5.02503 7.13873 4.82534 7.10766 4.63175 7.02746C4.18253 6.84139 3.82563 6.48447 3.63955 6.03525C3.55937 5.84165 3.52827 5.64197 3.51385 5.43057C3.49999 5.22749 3.49999 4.98013 3.5 4.68383V4.65016C3.49999 4.35385 3.49999 4.10649 3.51385 3.90342C3.52827 3.69202 3.55937 3.49233 3.63955 3.29874C3.82563 2.84952 4.18253 2.49262 4.63175 2.30655C4.82534 2.22636 5.02503 2.19527 5.23643 2.18084C5.4395 2.16699 5.68686 2.16699 5.98317 2.16699Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.98313 8.83301H10.0169C10.3131 8.83301 10.5605 8.83301 10.7636 8.84687C10.975 8.86127 11.1747 8.89234 11.3683 8.97254C11.8175 9.15861 12.1744 9.51554 12.3605 9.96474C12.4407 10.1583 12.4717 10.358 12.4861 10.5694C12.5 10.7725 12.5 11.0199 12.5 11.3161V11.3499C12.5 11.6461 12.5 11.8935 12.4861 12.0966C12.4717 12.308 12.4407 12.5077 12.3605 12.7013C12.1744 13.1505 11.8175 13.5074 11.3683 13.6935C11.1747 13.7737 10.975 13.8047 10.7636 13.8191C10.5605 13.833 10.3131 13.833 10.0169 13.833H9.98313C9.68687 13.833 9.43947 13.833 9.2364 13.8191C9.025 13.8047 8.82533 13.7737 8.63173 13.6935C8.18253 13.5074 7.8256 13.1505 7.63953 12.7013C7.55933 12.5077 7.52827 12.308 7.51387 12.0966C7.5 11.8935 7.5 11.6461 7.5 11.3499V11.3161C7.5 11.0199 7.5 10.7725 7.51387 10.5694C7.52827 10.358 7.55933 10.1583 7.63953 9.96474C7.8256 9.51554 8.18253 9.15861 8.63173 8.97254C8.82533 8.89234 9.025 8.86127 9.2364 8.84687C9.43947 8.83301 9.68687 8.83301 9.98313 8.83301Z" fill="white"/>
                      </svg>
                      <span>
                        Filter
                      </span>
                    </button>
                  </div>
                </div>

                <div className='px-[18px]'>
                  {candidatesData.length > 0 ? (
                    candidatesData.map((candidate) => (
                    <div
                      key={candidate.id}
                      onClick={() => setSelectedCandidate(candidate)}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        minWidth: '560px',
                        padding: 'var(--spacing-3xl, 24px)',
                        flexDirection: 'column',
                        gap: 'var(--spacing-3xl, 24px)',
                        alignSelf: 'stretch',
                        borderRadius: 'var(--radius-3xl, 20px)',
                        border: selectedCandidate?.id === candidate.id 
                          ? '1px solid var(--Surface-Brand-Primary, #875BF7)' 
                          : '0.5px solid var(--Border-Secondary, #26272B)',
                        background: 'var(--Surface-Secondary, #1A1A1E)',
                        marginBottom: '16px',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease'
                      }}
                    >
                      {/* Top-left corner checkbox */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '-4px',
                          top: '-4px',
                          width: '20px',
                          height: '20px',
                          borderRadius: 'var(--radius-sm, 6px)',
                          border: '1px solid var(--Border-Secondary, #26272B)',
                          background: 'var(--Surface-Primary, #131316)',
                          cursor: 'pointer'
                        }}
                      />
                      {/* Header Row */}
                      <div className='flex justify-between items-start w-full'>
                        {/* Left side - Name and icons */}
                        <div className='flex items-center gap-[12px]'>
                          <h1 
                            style={{
                              color: 'var(--Text-Primary, #FFF)',
                              fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                              fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
                              fontSize: 'var(--Font-size-text-md, 16px)',
                              fontStyle: 'normal',
                              fontWeight: 600,
                              lineHeight: 'var(--Line-height-text-md, 24px)'
                            }}
                          >
                            {candidate.name}
                          </h1>
                          
                          {/* Icons */}
                          <div className='flex items-center gap-[8px]'>
                            {socialIcons.map((icon) => (
                              <button
                                key={icon.name}
                                style={{
                                  display: 'flex',
                                  padding: 'var(--spacing-xs, 4px)',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderRadius: 'var(--radius-sm, 6px)',
                                  border: '0.5px solid var(--Border-Tertiary, #3F3F46)',
                                  background: 'var(--Surface-Secondary, #1A1A1E)',
                                  cursor: 'pointer'
                                }}
                                dangerouslySetInnerHTML={{ __html: icon.svg }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Right side - Buttons */}
                        <div className='flex items-center gap-[12px]'>
                          <button 
                            style={{
                              display: 'flex',
                              padding: 'var(--spacing-sm, 6px) var(--spacing-md, 8px)',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: 'var(--spacing-xs, 4px)',
                              borderRadius: 'var(--radius-md, 8px)',
                              background: 'var(--Surface-Brand-Primary, #875BF7)',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <span style={{
                              color: 'var(--Text-Primary, #FFF)',
                              fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                              fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
                              fontSize: 'var(--Font-size-text-xs, 12px)',
                              fontStyle: 'normal',
                              fontWeight: 600,
                              lineHeight: 'var(--Line-height-text-xs, 18px)'
                            }}>Shortlist</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M2 14.0003L5.33333 10.667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8.83867 12.5809C6.34311 12.0143 3.9853 9.65653 3.41869 7.161C3.329 6.76593 3.28415 6.56844 3.41408 6.24798C3.54401 5.92753 3.70272 5.82837 4.02015 5.63006C4.73771 5.18177 5.5147 5.03925 6.32107 5.11057C7.45254 5.21065 8.01827 5.26069 8.30047 5.11365C8.58274 4.96661 8.77447 4.62278 9.15807 3.93513L9.64394 3.06403C9.96401 2.49019 10.1241 2.20327 10.5005 2.06801C10.877 1.93275 11.1035 2.01466 11.5567 2.17847C12.6163 2.56157 13.4381 3.38337 13.8212 4.44299C13.985 4.89611 14.0669 5.12267 13.9317 5.49913C13.7964 5.8756 13.5095 6.03564 12.9356 6.35572L12.0445 6.8528C11.3581 7.2356 11.0149 7.42707 10.8679 7.712C10.7209 7.997 10.7743 8.5504 10.8811 9.65727C10.9596 10.4712 10.8243 11.2533 10.37 11.9798C10.1715 12.2972 10.0722 12.4559 9.75187 12.5857C9.43147 12.7155 9.23387 12.6707 8.83867 12.5809Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button 
                            style={{
                              display: 'flex',
                              padding: 'var(--spacing-sm, 6px)',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: 'var(--radius-md, 8px)',
                              border: '0.5px solid var(--Border-Tertiary, #3F3F46)',
                              background: 'var(--Surface-Tertiary, #26272B)',
                              cursor: 'pointer'
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                              <path d="M3 13.4856V7.28065C3 4.55562 3 3.19311 3.87868 2.34656C4.75736 1.5 6.17157 1.5 9 1.5C11.8284 1.5 13.2427 1.5 14.1213 2.34656C15 3.19311 15 4.55562 15 7.28065V13.4856C15 15.215 15 16.0797 14.4204 16.3892C13.2979 16.9886 11.1924 14.9889 10.1925 14.3868C9.6126 14.0376 9.32265 13.863 9 13.863C8.67735 13.863 8.3874 14.0376 7.8075 14.3868C6.8076 14.9889 4.7021 16.9886 3.57964 16.3892C3 16.0797 3 15.215 3 13.4856Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M3 5.25H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Info Text */}
                      <div>
                        <p style={{
                          color: '#D1D5DB',
                          fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: '20px'
                        }}>
                          {candidate.position} • {candidate.education} • {candidate.location}
                        </p>
                      </div>

                      {/* Description with highlighting */}
                      <div>
                        <p style={{
                          color: '#9CA3AF',
                          fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: '20px'
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }}>
                            <g clipPath="url(#clip0_3448_30823)">
                              <path d="M7 1.3125C7.24162 1.3125 7.4375 1.50838 7.4375 1.75C7.4375 2.92021 8.02702 4.12704 8.94997 5.05002C9.87297 5.97298 11.0798 6.5625 12.25 6.5625C12.4916 6.5625 12.6875 6.75838 12.6875 7C12.6875 7.24162 12.4916 7.4375 12.25 7.4375C11.0798 7.4375 9.87297 8.02702 8.94997 8.94997C8.02702 9.87297 7.4375 11.0798 7.4375 12.25C7.4375 12.4916 7.24162 12.6875 7 12.6875C6.75838 12.6875 6.5625 12.4916 6.5625 12.25C6.5625 11.0798 5.97298 9.87297 5.05002 8.94997C4.12704 8.02702 2.92021 7.4375 1.75 7.4375C1.50838 7.4375 1.3125 7.24162 1.3125 7C1.3125 6.75838 1.50838 6.5625 1.75 6.5625C2.92021 6.5625 4.12704 5.97298 5.05002 5.05002C5.97298 4.12704 6.5625 2.92021 6.5625 1.75C6.5625 1.50838 6.75838 1.3125 7 1.3125Z" fill="#A48AFB"/>
                              <path d="M11.2292 0.728516C11.3537 0.728516 11.4616 0.814814 11.489 0.936299L11.6256 1.54285C11.7189 1.95702 12.0423 2.28046 12.4565 2.37375L13.0631 2.51039C13.1846 2.53775 13.2708 2.64565 13.2708 2.77018C13.2708 2.89471 13.1846 3.00261 13.0631 3.02998L12.4565 3.16661C12.0423 3.25991 11.7189 3.58334 11.6256 3.9975L11.489 4.60407C11.4616 4.72555 11.3537 4.81185 11.2292 4.81185C11.1046 4.81185 10.9968 4.72555 10.9693 4.60407L10.8327 3.9975C10.7395 3.58334 10.416 3.25991 10.0018 3.16661L9.39528 3.02998C9.27377 3.00261 9.1875 2.89471 9.1875 2.77018C9.1875 2.64565 9.27377 2.53775 9.39528 2.51039L10.0018 2.37375C10.416 2.28046 10.7395 1.95703 10.8327 1.54285L10.9693 0.936299C10.9968 0.814814 11.1046 0.728516 11.2292 0.728516Z" fill="#A48AFB"/>
                              <path d="M2.77116 9.1875C2.89569 9.1875 3.00359 9.27377 3.03095 9.39528L3.16759 10.0018C3.26089 10.416 3.58431 10.7395 3.99848 10.8327L4.60504 10.9693C4.72653 10.9968 4.81283 11.1046 4.81283 11.2292C4.81283 11.3537 4.72653 11.4616 4.60504 11.489L3.99848 11.6256C3.58431 11.7189 3.26089 12.0423 3.16759 12.4565L3.03095 13.0631C3.00359 13.1846 2.89569 13.2708 2.77116 13.2708C2.64663 13.2708 2.53873 13.1846 2.51137 13.0631L2.37473 12.4565C2.28143 12.0423 1.958 11.7189 1.54383 11.6256L0.937276 11.489C0.815791 11.4616 0.729492 11.3537 0.729492 11.2292C0.729492 11.1046 0.815791 10.9968 0.937276 10.9693L1.54383 10.8327C1.958 10.7395 2.28143 10.416 2.37473 10.0018L2.51137 9.39528C2.53873 9.27377 2.64663 9.1875 2.77116 9.1875Z" fill="#A48AFB"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_3448_30823">
                                <rect width="14" height="14" fill="white"/>
                              </clipPath>
                            </defs>
                          </svg>
                          {candidate.description}
                          {candidate.highlights && candidate.highlights.length > 0 && (
                            <span style={{ marginLeft: '8px' }}>
                              {candidate.highlights.map((skill: string, index: number) => (
                                <span 
                                  key={index}
                                  style={{ 
                                    color: '#FFF',
                                    fontWeight: 600,
                                    background: 'rgba(139, 92, 246, 0.1)',
                                    padding: '2px 4px',
                                    borderRadius: '4px',
                                    marginRight: '4px'
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className='flex items-center gap-[8px] flex-wrap'>
                        <span style={{
                          display: 'flex',
                          padding: 'var(--spacing-052-px, 2px) var(--spacing-156-px, 6px)',
                          alignItems: 'center',
                          borderRadius: 'var(--spacing-156-px, 6px)',
                          border: '0.5px solid var(--Colors-Blue-light-700, #026AA2)',
                          background: 'var(--Colors-Blue-light-950, #062C41)',
                          color: 'var(--Colors-Blue-light-300, #7CD4FD)',
                          textAlign: 'center',
                          fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                          fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
                          fontSize: 'var(--Font-size-text-xs, 12px)',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          lineHeight: 'var(--Line-height-text-xs, 18px)'
                        }}>
                          {candidate.availability}
                        </span>
                        <span style={{
                          display: 'flex',
                          padding: 'var(--spacing-052-px, 2px) var(--spacing-156-px, 6px)',
                          alignItems: 'center',
                          borderRadius: 'var(--spacing-156-px, 6px)',
                          border: '0.5px solid var(--Border-Success, #315F45)',
                          background: 'var(--Colors-Semantic-colors-Success-900, #172820)',
                          color: 'var(--Colors-Semantic-colors-Success-200, #CAF7DA)',
                          textAlign: 'center',
                          fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                          fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
                          fontSize: 'var(--Font-size-text-xs, 12px)',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          lineHeight: 'var(--Line-height-text-xs, 18px)'
                        }}>
                          {candidate.salary}
                        </span>
                      </div>
                    </div>
                  ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#A0A0AB' }}>
                      {searchQuery ? (
                        <p>No candidates found matching &ldquo;{searchQuery}&rdquo;. Try a different search query.</p>
                      ) : (
                        <p>No candidates found. Create a profile to get started.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              </div>

      {/* Detail Profile Panel */}
      {selectedCandidate && (
        <aside
          style={{
            display: 'flex',
            minWidth: '287px',
            maxWidth: '500px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            flex: '1 0 0',
            borderRadius: '0',
            background: '#161619',
            borderLeft: '1px solid #26272B',
            height: '100vh',
            position: 'sticky',
            top: 0,
            overflow: 'hidden'
          }}
        >
          {/* Fixed Header Section */}
          <div
        className=''
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
           
            width: '100%',
            background: '#161718',
            borderBottom: '1px solid #26272B',
            padding : '16px',
            flexShrink: 0
          }}>
            {/* Top row: Close button and navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <button
                onClick={() => setSelectedCandidate(null)}
                style={{
                  display: 'flex',
                  padding: '6px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '8px',
                  border: '0.5px solid #26272B',
                  background: '#1A1A1E',
                  cursor: 'pointer'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M13.5 4.5L4.50061 13.4994M13.4994 13.5L4.5 4.50064" stroke="#A48AFB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {/* Navigation arrows */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button style={{
                  display: 'flex',
                  padding: '6px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '8px',
                  border: '0.5px solid #26272B',
                  background: '#1A1A1E',
                  cursor: 'pointer'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M15.5625 12.3125C15.7006 12.3125 15.8125 12.4245 15.8125 12.5625C15.8125 13.2409 15.815 13.6334 15.7275 13.96C15.4963 14.8224 14.8223 15.4953 13.96 15.7266C13.6334 15.8141 13.241 15.8125 12.5625 15.8125H5.4375C4.75921 15.8125 4.36749 15.814 4.04102 15.7266C3.17849 15.4955 2.50474 14.8225 2.27344 13.96C2.18594 13.6334 2.1875 13.241 2.1875 12.5625C2.1875 12.4245 2.29949 12.3125 2.4375 12.3125C2.57555 12.3125 2.6875 12.4245 2.6875 12.5625C2.6875 13.2726 2.68968 13.5831 2.75586 13.8301C2.94078 14.5202 3.47973 15.0592 4.16992 15.2441C4.41685 15.3102 4.72747 15.3125 5.4375 15.3125H12.5645L13.0332 15.3115H13.0361C13.4134 15.3077 13.6344 15.2966 13.8301 15.2441C14.5202 15.0592 15.0592 14.5203 15.2441 13.8301C15.3104 13.583 15.3125 13.2725 15.3125 12.5625C15.3125 12.4245 15.4245 12.3125 15.5625 12.3125Z" fill="#A48AFB" stroke="#A48AFB"/>
  <path d="M9.00009 1.6875C8.58587 1.6875 8.25009 2.02328 8.25009 2.4375V10.3946C8.02202 10.1657 7.78074 9.90451 7.54547 9.63353C7.19064 9.22486 6.86099 8.81356 6.61898 8.50343C6.49828 8.34878 6.297 8.08253 6.22933 7.99291C5.98376 7.65946 5.51401 7.58783 5.1805 7.83323C4.84707 8.07878 4.77545 8.54858 5.02083 8.88211C5.09256 8.97706 5.3099 9.26453 5.43611 9.42623C5.68788 9.74888 6.03488 10.1816 6.41243 10.6165C6.78686 11.0477 7.20656 11.4983 7.60119 11.8469C7.79762 12.0205 8.00567 12.185 8.21274 12.3098C8.39927 12.4223 8.68014 12.5625 9.00009 12.5625C9.32004 12.5625 9.60092 12.4223 9.78744 12.3098C9.99452 12.185 10.2026 12.0205 10.399 11.8469C10.7936 11.4983 11.2133 11.0477 11.5877 10.6165C11.9653 10.1816 12.3122 9.74888 12.564 9.42623C12.6902 9.26453 12.9076 8.97706 12.9793 8.88211C13.2247 8.54858 13.1531 8.07953 12.8197 7.83398C12.4862 7.58836 12.0164 7.65938 11.7708 7.99291C11.7032 8.08253 11.5019 8.34878 11.3812 8.50343C11.1392 8.81348 10.8095 9.22486 10.4546 9.63353C10.2194 9.90443 9.97817 10.1657 9.75009 10.3946V2.4375C9.75009 2.02329 9.41432 1.68752 9.00009 1.6875Z" fill="#A48AFB"/>
</svg>
                </button>
                <button style={{
                  display: 'flex',
                  padding: '6px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '8px',
                  border: '0.5px solid #26272B',
                  background: '#1A1A1E',
                  cursor: 'pointer'
                }}>
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M11.25 4.5C11.25 4.5 6.75001 7.81418 6.75 9C6.74999 10.1859 11.25 13.5 11.25 13.5" stroke="#A48AFB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                </button>
                <button style={{
                  display: 'flex',
                  padding: '6px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '8px',
                  border: '0.5px solid #26272B',
                  background: '#1A1A1E',
                  cursor: 'pointer'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M6.75004 4.5C6.75004 4.5 11.25 7.81418 11.25 9C11.25 10.1859 6.75 13.5 6.75 13.5" stroke="#A48AFB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                </button>
              </div>
            </div>

            {/* Profile name and social icons row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{
                  color: '#FFF',
                  fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
                  fontSize: '18px',
                  fontWeight: 600,
                  lineHeight: '28px',
                  margin: 0
                }}>
                  {selectedCandidate.name}
                </h2>
                {/* Social Icons */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {socialIcons.map((icon) => (
                    <button
                      key={icon.name}
                      style={{
                        display: 'flex',
                        padding: '4px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '6px',
                        border: '0.5px solid #3F3F46',
                        background: '#1A1A1E',
                        cursor: 'pointer'
                      }}
                      dangerouslySetInnerHTML={{ __html: icon.svg }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Full Profile Button */}
              <button
                style={{
                  display: 'flex',
                  padding: '8px 12px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '8px',
                  background: '#875BF7',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span style={{
                  color: '#FFF',
                  fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
                  fontSize: '13px',
                  fontWeight: 500
                }}>Full Profile</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5.25 10.5L8.75 7L5.25 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Location */}
            <p style={{
              color: '#A0A0AB',
              fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '20px',
              margin: 0
            }}>
              {selectedCandidate.location}
            </p>

            {/* Tabs */}
            <div style={{ 
              display: 'flex', 
              gap: '0',
              width: '100%'
            }}>
              {['Overview', 'Experience', 'Education', 'Skill'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    display: 'flex',
                    height: '36px',
                    padding: '8px 12px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    flex: '1 0 0',
                    borderRadius: activeTab === tab ? '10px' : '0',
                    border: activeTab === tab ? '0.5px solid #26272B' : 'none',
                    background: activeTab === tab ? '#1A1A1E' : 'transparent',
                    color: activeTab === tab ? '#FFF' : '#70707B',
                    fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '20px',
                    cursor: 'pointer'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content Section */}
          <div 
            className="hide-scrollbar"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '16px',
              width: '100%',
              overflowY: 'auto',
              flex: 1,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
          {/* Manage Profile Section */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px', 
            width: '100%',
            padding: '16px',
            background: '#1A1A1E',
            borderRadius: '12px'
          }}>
            <p style={{
              color: '#70707B',
              fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
              fontSize: '12px',
              fontWeight: 500,
              margin: 0
            }}>Manage profile</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{
                display: 'flex',
                padding: '8px 12px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '8px',
                background: '#875BF7',
                border: 'none',
                cursor: 'pointer',
                flex: 1
              }}>
                <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 500 }}>Shortlist</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M2 13.9993L5.33333 10.666" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8.83867 12.5809C6.34311 12.0143 3.9853 9.65653 3.41869 7.161C3.329 6.76593 3.28415 6.56844 3.41408 6.24798C3.54401 5.92753 3.70272 5.82837 4.02015 5.63006C4.73771 5.18177 5.5147 5.03925 6.32107 5.11057C7.45254 5.21065 8.01827 5.26069 8.30047 5.11365C8.58274 4.96661 8.77447 4.62278 9.15807 3.93513L9.64394 3.06403C9.96401 2.49019 10.1241 2.20327 10.5005 2.06801C10.877 1.93275 11.1035 2.01466 11.5567 2.17847C12.6163 2.56157 13.4381 3.38337 13.8212 4.44299C13.985 4.89611 14.0669 5.12267 13.9317 5.49913C13.7964 5.8756 13.5095 6.03564 12.9356 6.35572L12.0445 6.8528C11.3581 7.2356 11.0149 7.42707 10.8679 7.712C10.7209 7.997 10.7743 8.5504 10.8811 9.65727C10.9596 10.4712 10.8243 11.2533 10.37 11.9798C10.1715 12.2972 10.0722 12.4559 9.75187 12.5857C9.43147 12.7155 9.23387 12.6707 8.83867 12.5809Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
              </button>
              <button style={{
                display: 'flex',
                padding: '8px 12px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '8px',
                background: '#26272B',
                border: '0.5px solid #3F3F46',
                cursor: 'pointer',
                flex: 1
              }}>
                <div className='flex  justify-between'>
      <div className='flex gap-2'>
            <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 500 }}>Bookmark</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M2.66699 11.9879V6.47234C2.66699 4.05009 2.66699 2.83897 3.44804 2.08648C4.22909 1.33398 5.48617 1.33398 8.00033 1.33398C10.5145 1.33398 11.7716 1.33398 12.5526 2.08648C13.3337 2.83897 13.3337 4.05009 13.3337 6.47234V11.9879C13.3337 13.5251 13.3337 14.2937 12.8185 14.5689C11.8207 15.1016 9.94913 13.3241 9.06033 12.7889C8.54486 12.4785 8.28713 12.3233 8.00033 12.3233C7.71353 12.3233 7.45579 12.4785 6.94033 12.7889C6.05153 13.3241 4.17997 15.1016 3.18223 14.5689C2.66699 14.2937 2.66699 13.5251 2.66699 11.9879Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2.66699 4.66602H13.3337" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M15 7.50004C15 7.50004 11.3176 12.5 10 12.5C8.68233 12.5 5 7.5 5 7.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                </div>
      
              </button>
            </div>
          </div>

          {/* Work Experience Section */}
          <div 
          className='p-[16px] bg-[#131316] border-[0.5px] border-[#26272B] rounded-[16px]'
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px', 
            width: '100%'
          }}>
            <h3 style={{
              color: '#FFF',
              fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
              fontSize: '14px',
              fontWeight: 600,
              margin: 0
            }}>Work experience</h3>

            {/* Experience Stats */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: '#70707B', fontSize: '12px' }}>Average tenure</span>
                <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 500 }}>
                  {selectedCandidate.workExperience?.[0]?.duration || '3 yrs 1 mos'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: '#70707B', fontSize: '12px' }}>Current tenure</span>
                <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 500 }}>
                  {selectedCandidate.currentTenure || '7 yrs 2 mos'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: '#70707B', fontSize: '12px' }}>Total experience</span>
                <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 500 }}>
                  {selectedCandidate.totalExperience || '24 yrs 8 mos'}
                </span>
              </div>
            </div>

            {/* Experience Item */}
            <div style={{ 
              display: 'flex', 
              gap: '12px',
              padding: '12px',
              background: '#131316',
              borderRadius: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#26272B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ color: '#875BF7', fontSize: '16px', fontWeight: 600 }}>
                  {selectedCandidate.company?.charAt(0) || 'C'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 500 }}>
                    {selectedCandidate.position || 'Lead Product Designer'}
                  </span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: '#172820',
                    border: '0.5px solid #315F45',
                    color: '#CAF7DA',
                    fontSize: '12px'
                  }}>Promoted</span>
                </div>
                <span style={{ color: '#A0A0AB', fontSize: '13px' }}>
                  {selectedCandidate.company || 'Company'}
                </span>
                <span style={{ color: '#70707B', fontSize: '12px' }}>
                  May 2020 - Present
                </span>
                <p style={{ 
                  color: '#9CA3AF', 
                  fontSize: '13px', 
                  lineHeight: '20px',
                  margin: '8px 0 0 0'
                }}>
                  {selectedCandidate.description?.slice(0, 150) || 'Designing tailored user experiences for high-net-worth clients in the financial sector, enhancing int...'}
                  {selectedCandidate.description?.length > 150 && (
                    <button style={{
                      color: '#875BF7',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                      marginLeft: '4px'
                    }}>Show more</button>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div 
          className='p-[16px] bg-[#131316] border-[0.5px] border-[#26272B] rounded-[16px]'
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px', 
            width: '100%'
          }}>
            <h3 style={{
              color: '#FFF',
              fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
              fontSize: '14px',
              fontWeight: 600,
              margin: 0
            }}>Education</h3>

            <div style={{ 
              display: 'flex', 
              gap: '12px',
              padding: '12px',
              background: '#1A1A1E',
              borderRadius: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#26272B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ color: '#875BF7', fontSize: '16px', fontWeight: 600 }}>U</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 500 }}>
                  {selectedCandidate.education || 'University'}
                </span>
                <span style={{ color: '#A0A0AB', fontSize: '13px' }}>
                  Bachelor&apos;s Degree
                </span>
                <span style={{ color: '#70707B', fontSize: '12px' }}>
                  Nov 2016 - May 2018
                </span>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div 
          className='p-[16px] bg-[#131316] border-[0.5px] border-[#26272B] rounded-[16px]'
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px', 
            width: '100%'
          }}>
            <h3 style={{
              color: '#FFF',
              fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
              fontSize: '14px',
              fontWeight: 600,
              margin: 0
            }}>Skills</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ color: '#70707B', fontSize: '12px' }}>Front-end</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(selectedCandidate.highlights || ['Wireframing', 'User Research', 'Prototyping', 'Usability Testing']).slice(0, 6).map((skill: string, index: number) => (
                  <span
                    key={index}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      background: index < 2 ? '#26272B' : '#2D1F54',
                      border: index < 2 ? '0.5px solid #3F3F46' : '0.5px solid #5B21B6',
                      color: index < 2 ? '#FFF' : '#C4B5FD',
                      fontSize: '12px',
                      fontWeight: 500
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ color: '#70707B', fontSize: '12px' }}>Additional Skills</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Prototyping', 'User Research', 'Usability Testing', 'Information Architecture', 'A/B Testing', 'Visual Design'].map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      background: '#26272B',
                      border: '0.5px solid #3F3F46',
                      color: '#FFF',
                      fontSize: '12px',
                      fontWeight: 500
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Languages Section */}
          <div 
          className='p-[16px] bg-[#131316] border-[0.5px] border-[#26272B] rounded-[16px]'
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px', 
            width: '100%'
          }}>
            <h3 style={{
              color: '#FFF',
              fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
              fontSize: '14px',
              fontWeight: 600,
              margin: 0
            }}>Language</h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Telugu', 'Hindi', 'English'].map((lang, index) => (
                <span
                  key={index}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    background: '#26272B',
                    border: '0.5px solid #3F3F46',
                    color: '#FFF',
                    fontSize: '12px',
                    fontWeight: 500
                  }}
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
          </div>
        </aside>
      )}
            </main>

      </div>

      {/* Modal - outside of blurred content */}
      <ProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        projectName={projectName}
        setProjectName={setProjectName}
        onCreateProject={handleCreateProject}
      />
    </>
  )
}

export default Listing