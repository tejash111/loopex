'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import ProjectModal from '@/components/dashboard/ProjectModal'
import EditQueryModal from '@/components/dashboard/EditQueryModal'
import { Input } from '@/components/ui/input'
import { ChevronDown } from 'lucide-react'

interface ShortlistFilterData {
  status: string[]
  location: string[]
  company: string[]
  jobTitle: string[]
  profiles: string[]
}

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

const socialIconsOld = {
  whatsapp: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1 5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H10.2C11.8802 1 12.7202 1 13.362 1.32698C13.9265 1.6146 14.3854 2.07354 14.673 2.63803C15 3.27976 15 4.11984 15 5.8V10.2C15 11.8802 15 12.7202 14.673 13.362C14.3854 13.9265 13.9265 14.3854 13.362 14.673C12.7202 15 11.8802 15 10.2 15H5.8C4.11984 15 3.27976 15 2.63803 14.673C2.07354 14.3854 1.6146 13.9265 1.32698 13.362C1 12.7202 1 11.8802 1 10.2V5.8Z" fill="url(#paint0_linear_whatsapp)"/>
    <path d="M8 11.5C10.4853 11.5 12.5 9.82107 12.5 7.75C12.5 5.67893 10.4853 4 8 4C5.51472 4 3.5 5.67893 3.5 7.75C3.5 9.06275 4.30944 10.2179 5.5351 10.8879C5.49407 11.2213 5.37074 11.6663 5 12C5.70106 11.8738 6.26057 11.6202 6.67853 11.3357C7.09639 11.4425 7.54014 11.5 8 11.5Z" fill="white"/>
    <defs><linearGradient id="paint0_linear_whatsapp" x1="8" y1="1" x2="8" y2="15" gradientUnits="userSpaceOnUse"><stop stop-color="#09D72C"/><stop offset="1" stop-color="#0F9622"/></linearGradient></defs>
  </svg>`,
  gmail: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="10" rx="2" fill="#EA4335"/>
    <path d="M1 5L8 9L15 5" stroke="white" stroke-width="1.5"/>
  </svg>`,
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="14" height="14" rx="2" fill="#1275B1"/>
    <path d="M5.5 6.5V11M5.5 4.5V4.51M10.5 11V8.5C10.5 7.5 10 6.5 8.5 6.5C7 6.5 6.5 7.5 6.5 8.5V11V6.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="14" height="14" rx="2" fill="#000"/>
    <path d="M4 4L12 12M12 4L4 12" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  github: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="14" height="14" rx="7" fill="#333"/>
    <path d="M8 4C5.79 4 4 5.79 4 8C4 9.86 5.25 11.43 7 11.9V10.5C6.5 10.7 6 10.5 5.75 10C5.5 9.5 5.25 9.25 5 9.25C5.25 9.25 5.75 9.5 6 10C6.25 10.5 6.75 10.5 7 10.5V9.5C6 9.25 5.5 8.5 5.5 7.75C5.5 7.25 5.75 6.75 6 6.5C6 6.25 5.75 5.5 6 5C6.5 5 7 5.5 7.25 5.75C7.5 5.5 8 5.5 8.5 5.5C9 5.5 9.5 5.5 9.75 5.75C10 5.5 10.5 5 11 5C11.25 5.5 11 6.25 11 6.5C11.25 6.75 11.5 7.25 11.5 7.75C11.5 8.5 11 9.25 10 9.5V11.9C11.75 11.43 13 9.86 13 8C13 5.79 11.21 4 8 4Z" fill="white"/>
  </svg>`
}

interface ShortlistedProfile {
  _id: string
  profileId: {
    _id: string
    name: string
    location?: string
    workExperience?: Array<{ company?: string }>
    socials?: {
      whatsapp?: string
      linkedin?: string
      github?: string
      mail?: string
    }
  }
  projectId: {
    _id: string
    name: string
  }
  projectName: string
  createdAt: string
}

export default function ShortlistPage() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [userProjects, setUserProjects] = useState<string[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [shortlistedProfiles, setShortlistedProfiles] = useState<ShortlistedProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All Profiles')
  const [searchQuery, setSearchQuery] = useState('')
  const [projectsData, setProjectsData] = useState<{_id: string, name: string}[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [showProjectDropdown, setShowProjectDropdown] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [showShortlistDropdown, setShowShortlistDropdown] = useState(false)
  const [selectedShortlistOption, setSelectedShortlistOption] = useState<'shortlisted' | 'not-interested'>('shortlisted')
  const [showEditQueryModal, setShowEditQueryModal] = useState(false)
  const [savedSearches, setSavedSearches] = useState<{_id: string, query: string, createdAt: string}[]>([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [selectedSavedSearchId, setSelectedSavedSearchId] = useState<string | null>(null)
  const [showSavedSearchesDropdown, setShowSavedSearchesDropdown] = useState(false)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<{[key: string]: boolean}>({})
  const [profileStatus, setProfileStatus] = useState<{[key: string]: string}>({})
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [selectedSort, setSelectedSort] = useState<string>('Sort by Date')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [activeFilterCategory, setActiveFilterCategory] = useState<string | null>(null)
  const [appliedFilters, setAppliedFilters] = useState<ShortlistFilterData>({
    status: [],
    location: [],
    company: [],
    jobTitle: [],
    profiles: []
  })
  
  // Search inputs for each filter category
  const [locationSearchInput, setLocationSearchInput] = useState('')
  const [companySearchInput, setCompanySearchInput] = useState('')
  const [jobTitleSearchInput, setJobTitleSearchInput] = useState('')
  const [statusSearchInput, setStatusSearchInput] = useState('')
  const [profileSearchInput, setProfileSearchInput] = useState('')

  const sortButtonRef = useRef<HTMLButtonElement>(null)
  const sortDropdownRef = useRef<HTMLDivElement>(null)
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const filterDropdownRef = useRef<HTMLDivElement>(null)

  const [selectedProfile, setSelectedProfile] = useState<ShortlistedProfile | null>(null)
  const [profileActiveTab, setProfileActiveTab] = useState('Overview')
  const overviewSectionRef = useRef<HTMLDivElement>(null)
  const experienceSectionRef = useRef<HTMLDivElement>(null)
  const educationSectionRef = useRef<HTMLDivElement>(null)
  const skillSectionRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedItems.size === shortlistedProfiles.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(shortlistedProfiles.map(item => item._id)))
    }
  }

  // Toggle single item
  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortButtonRef.current && sortDropdownRef.current) {
        if (!sortButtonRef.current.contains(event.target as Node) && !sortDropdownRef.current.contains(event.target as Node)) {
          setShowSortDropdown(false)
        }
      }
      
      if (filterButtonRef.current && filterDropdownRef.current) {
        if (!filterButtonRef.current.contains(event.target as Node) && !filterDropdownRef.current.contains(event.target as Node)) {
          setShowFilterDropdown(false)
          setActiveFilterCategory(null)
        }
      }
      
      // Close status dropdowns when clicking outside
      const target = event.target as HTMLElement
      if (!target.closest('[data-status-dropdown]')) {
        setStatusDropdownOpen({})
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch user projects
  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const response = await fetch(`${apiUrl}/api/projects`, {
          credentials: 'include'
        })

        if (!response.ok) return

        const data = await response.json()
        if (data.success && Array.isArray(data.projects)) {
          const projectNames = data.projects.map((project: { name: string }) => project.name)
          setUserProjects(projectNames)
          setProjectsData(data.projects.map((p: {id: string, name: string}) => ({ _id: p.id, name: p.name })))
          
          const savedProject = localStorage.getItem('selectedProject')
          if (savedProject) {
            setSelectedProject(savedProject)
            const project = data.projects.find((p: {name: string, id: string}) => p.name === savedProject)
            if (project) {
              setSelectedProjectId(project.id)
            }
          } else if (data.projects.length > 0) {
            setSelectedProject(data.projects[0].name)
            setSelectedProjectId(data.projects[0].id)
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }

    fetchUserProjects()
  }, [])

  // Fetch saved searches for the selected project
  const fetchSavedSearches = async (projectId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/projects/${projectId}/saved-searches`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSavedSearches(data.savedSearches || [])
        }
      }
    } catch (error) {
      console.error('Error fetching saved searches:', error)
    }
  }

  // Fetch saved searches when project changes
  useEffect(() => {
    if (selectedProjectId) {
      fetchSavedSearches(selectedProjectId)
    }
  }, [selectedProjectId])

  // Fetch shortlisted profiles
  useEffect(() => {
    const fetchShortlistedProfiles = async () => {
      try {
        setLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        
        let url = `${apiUrl}/api/shortlist/all`
        if (selectedProjectId) {
          url = `${apiUrl}/api/shortlist/project/${selectedProjectId}`
          // Add saved search filter if selected
          if (selectedSavedSearchId) {
            url += `?savedSearchId=${selectedSavedSearchId}`
          }
        }
        
        const response = await fetch(url, {
          credentials: 'include'
        })

        if (!response.ok) {
          setShortlistedProfiles([])
          return
        }

        const data = await response.json()
        if (data.success) {
          setShortlistedProfiles(data.shortlists || [])
        }
      } catch (error) {
        console.error('Error fetching shortlisted profiles:', error)
        setShortlistedProfiles([])
      } finally {
        setLoading(false)
      }
    }

    fetchShortlistedProfiles()
  }, [selectedProjectId, selectedSavedSearchId])

  const handleCreateProject = async () => {
    if (projectName.trim()) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name: projectName.trim() })
        })

        const data = await response.json()

        if (data.success) {
          setUserProjects([...userProjects, projectName.trim()])
          setSelectedProject(projectName.trim())
          setProjectName('')
          setShowModal(false)
        }
      } catch (error) {
        console.error('Error creating project:', error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const handleSavedSearchClick = (query: string) => {
    // Set the search query to the saved search
    setSearchQuery(query)
  }

  const tabs = ['All Profiles', 'Career Page', 'In house']

  return (
    <>
      <Sidebar
        showModal={showModal}
        showFilterModal={showFilterModal}
        selectedProject={selectedProject}
        userProjects={userProjects}
        onNewProject={() => setShowModal(true)}
        onProjectSelect={(project) => {
          setSelectedProject(project)
          const projectData = projectsData.find(p => p.name === project)
          if (projectData) {
            setSelectedProjectId(projectData._id)
          }
          localStorage.setItem('selectedProject', project)
        }}
        showProjectsDropdown={showProjectsDropdown}
        onShowProjectsDropdownChange={setShowProjectsDropdown}
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        savedSearches={savedSearches}
        onSavedSearchClick={handleSavedSearchClick}
        selectedProjectId={selectedProjectId}
        currentSearchQuery={searchQuery}
        selectedSavedSearchId={selectedSavedSearchId}
        onSavedSearchSelect={setSelectedSavedSearchId}
      />

      <div 
        className="min-h-screen transition-all duration-300" 
        style={{ 
          display: 'flex',
          padding: '16px',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flex: '1 0 0',
          alignSelf: 'stretch',
          borderRadius: '24px 0 0 24px',
          marginLeft: sidebarCollapsed ? '72px' : '256px',
          backgroundColor: '#0E0E10'
        }}
      >
        <main 
          className="p-[6px]"
          style={{
           
            flex: '1 0 0',
            alignSelf: 'stretch',
            borderRadius: '20px',
            border: '0.5px solid #1A1A1E',
            background: '#131315'
          }}
        >
          {/* Header with Project Selector */}
          <div 
            style={{ 
              display: 'flex',
              padding: '16px',
              alignItems: 'center',
              position: 'relative',
              zIndex : 3000,
              gap: '12px',
              alignSelf: 'stretch',
              borderRadius: '12px',
              border: '0.5px solid #26272B',
              background: '#0E0E10',
              marginBottom: '8px'
            }}
          >
            <button
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              style={{
                position: 'relative',
                zIndex: 4000,
                display: 'flex',
                padding: '4px 8px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '6px',
                borderRadius: '8px',
                border: '0.5px solid #26272B',
                background: '#1A1A1E',
                boxShadow: '0 0 0 1px rgba(10, 13, 18, 0.18) inset, 0 -2px 0 0 rgba(10, 13, 18, 0.05) inset, 0 1px 2px 0 rgba(10, 13, 18, 0.05)',
                cursor: 'pointer'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4.13187 1.31252C4.73236 1.31226 5.1475 1.31207 5.52018 1.45182C6.33422 1.75707 6.69139 2.47992 6.96678 3.03709C7.04921 3.20201 7.19918 3.50162 7.24113 3.5675C7.25396 3.58903 7.29456 3.63314 7.35406 3.63731C7.43176 3.64534 7.53699 3.64588 7.72138 3.64588H9.79478C10.3892 3.64587 10.8685 3.64587 11.2531 3.68499C11.6501 3.72538 11.9944 3.81104 12.299 4.01454C12.5379 4.17414 12.7429 4.37922 12.9025 4.61807C13.106 4.92263 13.1917 5.26692 13.2321 5.66391C13.2712 6.04851 13.2712 6.57614 13.2712 7.17055C13.2712 8.17371 13.2712 8.96016 13.2075 9.58631C13.1425 10.2249 13.0077 10.7452 12.7059 11.1968C12.4611 11.5631 12.1467 11.8775 11.7805 12.1223C11.3288 12.4241 10.8085 12.5589 10.1699 12.6238C9.54378 12.6875 8.75733 12.6875 7.75417 12.6875H6.96684C5.62029 12.6875 4.56502 12.6875 3.74166 12.5769C2.89889 12.4635 2.23388 12.2271 1.71191 11.7052C1.18993 11.1832 0.953487 10.5181 0.84018 9.67539C0.729481 8.85201 0.729487 7.79676 0.729492 6.4502V4.61393C0.729487 4.10133 0.729481 3.68791 0.758916 3.35404C0.789237 3.01002 0.853381 2.70898 1.00681 2.43405C1.20449 2.07983 1.49677 1.78754 1.851 1.58986C2.12592 1.43643 2.42697 1.3723 2.77098 1.34197C3.10486 1.31254 3.61927 1.31252 4.13187 1.31252Z" fill="#70707B"/>
              </svg>
              <span style={{ 
                color: '#FFF', 
                fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                fontSize: '12px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '18px'
              }}>
                {selectedProject || 'Select Project'}
              </span>
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M10.5 5.25003C10.5 5.25003 7.92231 8.75 7 8.75C6.07763 8.75 3.5 5.25 3.5 5.25" stroke="#70707B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
            </button>
            
            <div style={{ position: 'relative', flex: '1 0 0', marginLeft: '12px' }}>
              <button
                onClick={() => setShowSavedSearchesDropdown(!showSavedSearchesDropdown)}
                style={{
                  position: 'relative',
                  zIndex: 400,
                  display: 'flex',
                  padding: '0',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span 
                  style={{ 
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 1,
                    flex: '1 0 0',
                    overflow: 'hidden',
                    color: '#FFF',
                    fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                    textOverflow: 'ellipsis',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '24px',
                    textAlign: 'left'
                  }}>
                  {selectedSavedSearchId 
                    ? savedSearches.find(s => s._id === selectedSavedSearchId)?.query || `${shortlistedProfiles.length} shortlisted profiles`
                    : `${shortlistedProfiles.length > 0 ? shortlistedProfiles.length : 2} shortlisted profiles`
                  }
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    transition: 'transform 0.18s ease',
                    transform: showSavedSearchesDropdown ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                >
                  <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="#A0A0AB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Saved Searches Dropdown */}
              {showSavedSearchesDropdown && savedSearches.length > 0 && (
                <div
                className='absolute top-8 right-0 -left-30'
                  style={{
                  
                    marginTop: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '0.5px solid #26272B',
                    background: '#121214',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.45)',
                    zIndex: 100,
                    width : '1290px',
                    maxHeight: '420px',
                    overflowY: 'auto'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {[...savedSearches]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((search) => (
                      <button
                        key={search._id}
                        onClick={() => {
                          setSelectedSavedSearchId(selectedSavedSearchId === search._id ? null : search._id)
                          setSearchQuery(search.query)
                          setShowSavedSearchesDropdown(false)
                        }}
                        style={{
                          display: 'flex',
                          padding: '12px 14px',
                          alignItems: 'center',
                          gap: '10px',
                          borderRadius: '8px',
                          border: 'none',
                          background: selectedSavedSearchId === search._id ? '#1F1F22' : 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedSavedSearchId !== search._id) {
                            e.currentTarget.style.background = '#1C1C20'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedSavedSearchId !== search._id) {
                            e.currentTarget.style.background = 'transparent'
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8C3 5.239 5.239 3 8 3C9.38071 3 10.6261 3.6789 11.3858 4.72632M13 8C13 10.761 10.761 13 8 13C6.3934 13 5.04799 12.2237 4.27671 11.0021M10 5.5L13 2.5M3 13.5L5 11.5" stroke="#A48AFB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span style={{
                          color: '#FFF',
                          fontFamily: '"Inter Display", sans-serif',
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: '20px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          flex: 1
                        }}>
                          {search.query}
                        </span>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabs and Search */}
          <div 
            style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              alignSelf: 'stretch',
              width: '100%',
              borderRadius: '12px',
              border: '0.5px solid #1a1a1a',
              background: '#0E0E10',
              boxShadow: '0 1px 2px 0 rgba(10, 13, 18, 0.05)',
              overflow: 'visible',
              position: 'relative'
            }}
          >
            <div className="flex items-center justify-between p-4 border-b w-full" style={{ borderColor: '#6272B' }}>
              <div className="flex items-center gap-3">
                <div 
                  style={{
                    position: 'relative',
                    display: 'flex',
                    padding: '8px 12px',
                    alignItems: 'center',
                    gap: '8px',
                    alignSelf: 'stretch',
                    borderRadius: '12px',
                    border: '0.5px solid #26272B',
                    background: '#1A1A1E',
                    boxShadow: '0 1px 2px 0 rgba(10, 13, 18, 0.05)'
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search name, company, etc."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSearchDropdown(true)}
                    onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                    style={{ 
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 1,
                      flex: '1 0 0',
                      overflow: 'hidden',
                      color: '#70707B',
                      fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                      textOverflow: 'ellipsis',
                      fontFamily: '"Inter Display", sans-serif',
                      fontSize: '16px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '24px',
                      width: '200px',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none'
                    }}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 6.00003C12 6.00003 9.05407 10 8 10C6.94587 10 4 6 4 6" stroke="#70707B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>

                  {/* Recent searches dropdown */}
                  {showSearchDropdown && savedSearches.length > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '4px',
                        borderRadius: '12px',
                        border: '0.5px solid #26272B',
                        background: '#1A1A1E',
                        boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.16)',
                        zIndex: 10,
                        maxHeight: '200px',
                        overflowY: 'auto'
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <div style={{ padding: '8px' }}>
                        <span style={{ 
                          display: 'block',
                          padding: '8px 12px',
                          color: '#70707B',
                          fontSize: '12px',
                          fontWeight: 600,
                          lineHeight: '18px',
                          textTransform: 'uppercase'
                        }}>
                          Recent Searches
                        </span>
                        {[...savedSearches].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5).map((search) => (
                          <button
                            key={search._id}
                            onClick={() => {
                              setSearchQuery(search.query)
                              setShowSearchDropdown(false)
                            }}
                            style={{
                              display: 'flex',
                              width: '100%',
                              padding: '8px 12px',
                              alignItems: 'center',
                              gap: '8px',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#A0A0AB',
                              fontSize: '14px',
                              fontWeight: 500,
                              lineHeight: '20px',
                              textAlign: 'left',
                              borderRadius: '8px',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#26272B'
                              e.currentTarget.style.color = '#FFFFFF'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                              e.currentTarget.style.color = '#A0A0AB'
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M3 8C3 5.239 5.239 3 8 3C9.38071 3 10.6261 3.6789 11.3858 4.72632M13 8C13 10.761 10.761 13 8 13C6.3934 13 5.04799 12.2237 4.27671 11.0021M10 5.5L13 2.5M3 13.5L5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span style={{ 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1
                            }}>
                              {search.query}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  ref={sortButtonRef}
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    padding: '10px 14px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '4px',
                    borderRadius: '12px',
                    border: '0.5px solid #26272B',
                    background: '#1A1A1E',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{
                    color: '#A48AFB',
                    fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                    fontFamily: '"Inter Display", sans-serif',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: '20px'
                  }}>Sort</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 6.00003C12 6.00003 9.05407 10 8 10C6.94587 10 4 6 4 6" stroke="#A48AFB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>

                  {/* Sort Dropdown */}
                  {showSortDropdown && (
                    <div
                      ref={sortDropdownRef}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        padding: '8px',
                        borderRadius: '8px',
                        border: '0.5px solid #26272B',
                        background: '#1A1A1E',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 1000,
                        minWidth: '140px'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {['Sort by Date', 'Sort by Availability'].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSelectedSort(option)
                            setShowSortDropdown(false)
                          }}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            background: selectedSort === option ? '#26272B' : 'transparent',
                            color: '#FFF',
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedSort !== option) {
                              e.currentTarget.style.background = '#26272B'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedSort !== option) {
                              e.currentTarget.style.background = 'transparent'
                            }
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </button>

                <div style={{ position: 'relative' }}>
                  <button
                    ref={filterButtonRef}
                    onClick={() => {
                      setShowFilterDropdown(!showFilterDropdown)
                      if (!showFilterDropdown) {
                        setActiveFilterCategory(null)
                      }
                    }}
                    style={{
                      display: 'flex',
                      padding: '10px 14px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '4px',
                      borderRadius: '12px',
                      border: '0.5px solid #26272B',
                      background: '#1A1A1E',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{
                      color: '#A48AFB',
                      fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                      fontFamily: '"Inter Display", sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      lineHeight: '20px'
                    }}>Filter</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M1.33301 4.66667C1.33301 4.29848 1.63149 4 1.99967 4H3.99967C4.36786 4 4.66634 4.29848 4.66634 4.66667C4.66634 5.03485 4.36786 5.33333 3.99967 5.33333H1.99967C1.63149 5.33333 1.33301 5.03485 1.33301 4.66667Z" fill="#A48AFB"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M1.33301 11.3346C1.33301 10.9664 1.63149 10.668 1.99967 10.668H5.99967C6.36786 10.668 6.66634 10.9664 6.66634 11.3346C6.66634 11.7028 6.36786 12.0013 5.99967 12.0013H1.99967C1.63149 12.0013 1.33301 11.7028 1.33301 11.3346Z" fill="#A48AFB"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M11.333 11.3346C11.333 10.9664 11.6315 10.668 11.9997 10.668H13.9997C14.3679 10.668 14.6663 10.9664 14.6663 11.3346C14.6663 11.7028 14.3679 12.0013 13.9997 12.0013H11.9997C11.6315 12.0013 11.333 11.7028 11.333 11.3346Z" fill="#A48AFB"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M9.33301 4.66667C9.33301 4.29848 9.63147 4 9.99967 4H13.9997C14.3679 4 14.6663 4.29848 14.6663 4.66667C14.6663 5.03486 14.3679 5.33333 13.9997 5.33333H9.99967C9.63147 5.33333 9.33301 5.03485 9.33301 4.66667Z" fill="#A48AFB"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M5.98317 2.16797H6.01683C6.31314 2.16796 6.5605 2.16796 6.7636 2.18182C6.975 2.19624 7.17467 2.22734 7.36827 2.30752C7.81747 2.4936 8.1744 2.8505 8.36047 3.29972C8.44067 3.49331 8.47173 3.693 8.48613 3.9044C8.5 4.10747 8.5 4.35482 8.5 4.65113V4.68481C8.5 4.98112 8.5 5.22847 8.48613 5.43155C8.47173 5.64295 8.44067 5.84263 8.36047 6.03622C8.1744 6.48544 7.81747 6.84237 7.36827 7.02844C7.17467 7.10864 6.975 7.1397 6.7636 7.1541C6.5605 7.16797 6.31315 7.16797 6.01684 7.16797H5.98316C5.68685 7.16797 5.4395 7.16797 5.23643 7.1541C5.02503 7.1397 4.82534 7.10864 4.63175 7.02844C4.18253 6.84237 3.82563 6.48544 3.63955 6.03622C3.55937 5.84263 3.52827 5.64295 3.51385 5.43155C3.49999 5.22847 3.49999 4.98111 3.5 4.6848V4.65114C3.49999 4.35483 3.49999 4.10747 3.51385 3.9044C3.52827 3.693 3.55937 3.49331 3.63955 3.29972C3.82563 2.8505 4.18253 2.4936 4.63175 2.30752C4.82534 2.22734 5.02503 2.19624 5.23643 2.18182C5.4395 2.16796 5.68686 2.16796 5.98317 2.16797Z" fill="#A48AFB"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M9.98313 8.83203H10.0169C10.3131 8.83203 10.5605 8.83203 10.7636 8.8459C10.975 8.8603 11.1747 8.89136 11.3683 8.97156C11.8175 9.15763 12.1744 9.51456 12.3605 9.96376C12.4407 10.1574 12.4717 10.357 12.4861 10.5684C12.5 10.7715 12.5 11.0189 12.5 11.3152V11.3489C12.5 11.6452 12.5 11.8926 12.4861 12.0956C12.4717 12.307 12.4407 12.5067 12.3605 12.7003C12.1744 13.1495 11.8175 13.5064 11.3683 13.6925C11.1747 13.7727 10.975 13.8038 10.7636 13.8182C10.5605 13.832 10.3131 13.832 10.0169 13.832H9.98313C9.68687 13.832 9.43947 13.832 9.2364 13.8182C9.025 13.8038 8.82533 13.7727 8.63173 13.6925C8.18253 13.5064 7.8256 13.1495 7.63953 12.7003C7.55933 12.5067 7.52827 12.307 7.51387 12.0956C7.5 11.8926 7.5 11.6452 7.5 11.3489V11.3152C7.5 11.0189 7.5 10.7715 7.51387 10.5684C7.52827 10.357 7.55933 10.1574 7.63953 9.96376C7.8256 9.51456 8.18253 9.15763 8.63173 8.97156C8.82533 8.89136 9.025 8.8603 9.2364 8.8459C9.43947 8.83203 9.68687 8.83203 9.98313 8.83203Z" fill="#A48AFB"/>
                    </svg>
                  </button>

                  {/* Filter Dropdown */}
                  {showFilterDropdown && (
                    <div
                      ref={filterDropdownRef}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        width: '304px',
                        borderRadius: '16px',
                        border: '0.5px solid #26272B',
                        background: '#1A1A1E',
                        boxShadow: '0px 4px 28.8px 0px rgba(0, 0, 0, 0.13)',
                        zIndex: 1000,
                        overflow: 'hidden'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {!activeFilterCategory ? (
                        // Main filter menu
                        <div style={{ padding: '12px' }}>
                          {[
                            { key: 'status', label: 'Status', count: appliedFilters.status.length },
                            { key: 'location', label: 'Location', count: appliedFilters.location.length },
                            { key: 'company', label: 'Company', count: appliedFilters.company.length },
                            { key: 'jobTitle', label: 'Job title', count: appliedFilters.jobTitle.length },
                            { key: 'profiles', label: 'Profiles', count: appliedFilters.profiles.length }
                          ].map((category) => (
                            <button
                              key={category.key}
                              onClick={() => setActiveFilterCategory(category.key)}
                              style={{
                                display: 'flex',
                                width: '100%',
                                padding: '12px',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                marginBottom: '4px'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#26272B'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <span style={{
                                color: '#FFF',
                                fontFamily: '"Inter Display", sans-serif',
                                fontSize: '14px',
                                fontWeight: 500,
                                lineHeight: '20px'
                              }}>
                                {category.label}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {category.count > 0 && (
                                  <div style={{
                                    display: 'flex',
                                    width: '20px',
                                    height: '20px',
                                    padding: '2px 6px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '100px',
                                    background: '#875BF7'
                                  }}>
                                    <span style={{
                                      color: '#FFF',
                                      fontFamily: '"Inter Display", sans-serif',
                                      fontSize: '12px',
                                      fontWeight: 600,
                                      lineHeight: '16px'
                                    }}>
                                      {category.count}
                                    </span>
                                  </div>
                                )}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M6 12L10 8L6 4" stroke="#A0A0AB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </button>
                          ))}
                          
                          <button
                            onClick={() => {
                              setAppliedFilters({
                                status: [],
                                location: [],
                                company: [],
                                jobTitle: [],
                                profiles: []
                              })
                            }}
                            style={{
                              display: 'flex',
                              width: '100%',
                              padding: '12px',
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginTop: '8px',
                              borderRadius: '8px',
                              border: 'none',
                              background: '#26272B',
                              cursor: 'pointer',
                              color: '#FFF',
                              fontFamily: '"Inter Display", sans-serif',
                              fontSize: '14px',
                              fontWeight: 600,
                              lineHeight: '20px'
                            }}
                          >
                            Clear filter
                          </button>
                        </div>
                      ) : (
                        // Category-specific filter view
                        <div>
                          {/* Header */}
                          <div style={{
                            display: 'flex',
                            padding: '16px',
                            alignItems: 'center',
                            gap: '8px',
                            borderBottom: '0.5px solid #26272B'
                          }}>
                            <button
                              onClick={() => setActiveFilterCategory(null)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px'
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M10 12L6 8L10 4" stroke="#A0A0AB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                            <span style={{
                              color: '#FFF',
                              fontFamily: '"Inter Display", sans-serif',
                              fontSize: '16px',
                              fontWeight: 600,
                              lineHeight: '24px'
                            }}>
                              {activeFilterCategory === 'status' && 'Status'}
                              {activeFilterCategory === 'location' && 'Location'}
                              {activeFilterCategory === 'company' && 'Company'}
                              {activeFilterCategory === 'jobTitle' && 'Job title'}
                              {activeFilterCategory === 'profiles' && 'Profiles'}
                            </span>
                          </div>
                          
                          {/* Content */}
                          <div style={{ padding: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                            {activeFilterCategory === 'status' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {['Not Contacted', 'Email Sent', 'Interviewing', 'Hired', 'Rejected'].map((status) => (
                                  <div
                                    key={status}
                                    onClick={() => {
                                      setAppliedFilters(prev => ({
                                        ...prev,
                                        status: prev.status.includes(status)
                                          ? prev.status.filter(s => s !== status)
                                          : [...prev.status, status]
                                      }))
                                    }}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '12px',
                                      cursor: 'pointer',
                                      padding: '8px'
                                    }}
                                  >
                                    <CustomCheckbox
                                      checked={appliedFilters.status.includes(status)}
                                      onChange={() => {}}
                                    />
                                    <span style={{
                                      color: '#FFF',
                                      fontFamily: '"Inter Display", sans-serif',
                                      fontSize: '14px',
                                      fontWeight: 500,
                                      lineHeight: '20px'
                                    }}>
                                      {status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {activeFilterCategory === 'profiles' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {['Database', 'Career Page', 'In house'].map((profile) => (
                                  <div
                                    key={profile}
                                    onClick={() => {
                                      setAppliedFilters(prev => ({
                                        ...prev,
                                        profiles: prev.profiles.includes(profile)
                                          ? prev.profiles.filter(p => p !== profile)
                                          : [...prev.profiles, profile]
                                      }))
                                    }}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '12px',
                                      cursor: 'pointer',
                                      padding: '8px'
                                    }}
                                  >
                                    <CustomCheckbox
                                      checked={appliedFilters.profiles.includes(profile)}
                                      onChange={() => {}}
                                    />
                                    <span style={{
                                      color: '#FFF',
                                      fontFamily: '"Inter Display", sans-serif',
                                      fontSize: '14px',
                                      fontWeight: 500,
                                      lineHeight: '20px'
                                    }}>
                                      {profile}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {activeFilterCategory === 'location' && (
                              <div>
                                {/* Search bar */}
                                <div style={{ marginBottom: '12px', position: 'relative' }}>
                                  <Input
                                    value={locationSearchInput}
                                    onChange={(e) => setLocationSearchInput(e.target.value)}
                                    placeholder="eg. Chennai, Tamil Nadu, India"
                                    style={{
                                      display: 'flex',
                                      padding: '8px 12px',
                                      alignItems: 'center',
                                      gap: '8px',
                                      alignSelf: 'stretch',
                                      borderRadius: '12px',
                                      border: '0.5px solid #26272B',
                                      background: '#1A1A1E',
                                      boxShadow: '0 1px 2px 0 rgba(10, 13, 18, 0.05)',
                                      overflow: 'hidden',
                                      color: '#70707B',
                                      fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                                      textOverflow: 'ellipsis',
                                      fontFamily: '"Inter Display"',
                                      fontSize: '16px',
                                      fontStyle: 'normal',
                                      fontWeight: 400,
                                      lineHeight: '24px',
                                      width: '100%'
                                    }}
                                  />
                                  <svg
                                    style={{
                                      position: 'absolute',
                                      right: '12px',
                                      top: '50%',
                                      transform: 'translateY(-50%)',
                                      pointerEvents: 'none'
                                    }}
                                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M7.33301 1.83203C10.3706 1.83203 12.833 4.29447 12.833 7.33203C12.833 8.63099 12.3834 9.82367 11.6309 10.7646L11.3506 11.1143L14.1172 13.8809C14.1823 13.9459 14.1823 14.0511 14.1172 14.1162C14.0521 14.1813 13.9469 14.1813 13.8818 14.1162L11.1152 11.3496L10.7656 11.6299C9.82464 12.3825 8.63196 12.832 7.33301 12.832C4.29544 12.832 1.83301 10.3696 1.83301 7.33203C1.83301 4.29447 4.29544 1.83203 7.33301 1.83203ZM7.33301 2.16504C4.47954 2.16504 2.16602 4.47856 2.16602 7.33203C2.16602 10.1855 4.47954 12.499 7.33301 12.499C10.1865 12.499 12.5 10.1855 12.5 7.33203C12.5 4.47856 10.1865 2.16504 7.33301 2.16504Z" fill="black" stroke="#70707B"/>
                                  </svg>
                                </div>
                                {/* Location suggestions */}
                                {locationSearchInput && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {[
                                      'Bangalore, Karnataka, India',
                                      'Chennai, Tamil Nadu, India',
                                      'Mumbai, Maharashtra, India',
                                      'Delhi, India',
                                      'Hyderabad, Telangana, India',
                                      'Pune, Maharashtra, India'
                                    ]
                                      .filter(loc => loc.toLowerCase().includes(locationSearchInput.toLowerCase()))
                                      .map((location) => (
                                        <button
                                          key={location}
                                          onClick={() => {
                                            if (!appliedFilters.location.includes(location)) {
                                              setAppliedFilters(prev => ({
                                                ...prev,
                                                location: [...prev.location, location]
                                              }))
                                            }
                                            setLocationSearchInput('')
                                          }}
                                          style={{
                                            display: 'flex',
                                            padding: '8px 12px',
                                            alignItems: 'center',
                                            width: '100%',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            color: '#FFF',
                                            fontFamily: '"Inter Display", sans-serif',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            lineHeight: '20px',
                                            textAlign: 'left'
                                          }}
                                          onMouseEnter={(e) => e.currentTarget.style.background = '#26272B'}
                                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                          {location}
                                        </button>
                                      ))}
                                  </div>
                                )}
                                {/* Selected locations */}
                                {appliedFilters.location.length > 0 && (
                                  <div style={{ marginTop: '12px' }}>
                                    <div style={{ color: '#70707B', fontSize: '12px', marginBottom: '8px' }}>Selected:</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      {appliedFilters.location.map((loc, idx) => (
                                        <div
                                          key={idx}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '6px 8px',
                                            borderRadius: '6px',
                                            background: '#26272B'
                                          }}
                                        >
                                          <span style={{
                                            color: '#FFF',
                                            fontSize: '14px',
                                            fontWeight: 500
                                          }}>
                                            {loc}
                                          </span>
                                          <button
                                            onClick={() => {
                                              setAppliedFilters(prev => ({
                                                ...prev,
                                                location: prev.location.filter((_, i) => i !== idx)
                                              }))
                                            }}
                                            style={{
                                              background: 'transparent',
                                              border: 'none',
                                              cursor: 'pointer',
                                              padding: '4px',
                                              display: 'flex',
                                              alignItems: 'center'
                                            }}
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                              <path d="M10.5 3.5L3.50041 10.4996M10.4996 10.5L3.5 3.50043" stroke="#A0A0AB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {activeFilterCategory === 'company' && (
                              <div>
                                {/* Search bar */}
                                <div style={{ marginBottom: '12px', position: 'relative' }}>
                                  <Input
                                    value={companySearchInput}
                                    onChange={(e) => setCompanySearchInput(e.target.value)}
                                    placeholder="eg. Google, Amazon, Microsoft"
                                    style={{
                                      display: 'flex',
                                      padding: '8px 12px',
                                      alignItems: 'center',
                                      gap: '8px',
                                      alignSelf: 'stretch',
                                      borderRadius: '12px',
                                      border: '0.5px solid #26272B',
                                      background: '#1A1A1E',
                                      boxShadow: '0 1px 2px 0 rgba(10, 13, 18, 0.05)',
                                      overflow: 'hidden',
                                      color: '#70707B',
                                      fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                                      textOverflow: 'ellipsis',
                                      fontFamily: '"Inter Display"',
                                      fontSize: '16px',
                                      fontStyle: 'normal',
                                      fontWeight: 400,
                                      lineHeight: '24px',
                                      width: '100%'
                                    }}
                                  />
                                  <svg
                                    style={{
                                      position: 'absolute',
                                      right: '12px',
                                      top: '50%',
                                      transform: 'translateY(-50%)',
                                      pointerEvents: 'none'
                                    }}
                                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M7.33301 1.83203C10.3706 1.83203 12.833 4.29447 12.833 7.33203C12.833 8.63099 12.3834 9.82367 11.6309 10.7646L11.3506 11.1143L14.1172 13.8809C14.1823 13.9459 14.1823 14.0511 14.1172 14.1162C14.0521 14.1813 13.9469 14.1813 13.8818 14.1162L11.1152 11.3496L10.7656 11.6299C9.82464 12.3825 8.63196 12.832 7.33301 12.832C4.29544 12.832 1.83301 10.3696 1.83301 7.33203C1.83301 4.29447 4.29544 1.83203 7.33301 1.83203ZM7.33301 2.16504C4.47954 2.16504 2.16602 4.47856 2.16602 7.33203C2.16602 10.1855 4.47954 12.499 7.33301 12.499C10.1865 12.499 12.5 10.1855 12.5 7.33203C12.5 4.47856 10.1865 2.16504 7.33301 2.16504Z" fill="black" stroke="#70707B"/>
                                  </svg>
                                </div>
                                {/* Company suggestions */}
                                {companySearchInput && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {[
                                      'Google',
                                      'Amazon',
                                      'Microsoft',
                                      'Meta',
                                      'Apple',
                                      'Netflix',
                                      'Tesla',
                                      'Adobe',
                                      'Salesforce',
                                      'Oracle'
                                    ]
                                      .filter(comp => comp.toLowerCase().includes(companySearchInput.toLowerCase()))
                                      .map((company) => (
                                        <button
                                          key={company}
                                          onClick={() => {
                                            if (!appliedFilters.company.includes(company)) {
                                              setAppliedFilters(prev => ({
                                                ...prev,
                                                company: [...prev.company, company]
                                              }))
                                            }
                                            setCompanySearchInput('')
                                          }}
                                          style={{
                                            display: 'flex',
                                            padding: '8px 12px',
                                            alignItems: 'center',
                                            width: '100%',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            color: '#FFF',
                                            fontFamily: '"Inter Display", sans-serif',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            lineHeight: '20px',
                                            textAlign: 'left'
                                          }}
                                          onMouseEnter={(e) => e.currentTarget.style.background = '#26272B'}
                                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                          {company}
                                        </button>
                                      ))}
                                  </div>
                                )}
                                {/* Selected companies */}
                                {appliedFilters.company.length > 0 && (
                                  <div style={{ marginTop: '12px' }}>
                                    <div style={{ color: '#70707B', fontSize: '12px', marginBottom: '8px' }}>Selected:</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      {appliedFilters.company.map((comp, idx) => (
                                        <div
                                          key={idx}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '6px 8px',
                                            borderRadius: '6px',
                                            background: '#26272B'
                                          }}
                                        >
                                          <span style={{
                                            color: '#FFF',
                                            fontSize: '14px',
                                            fontWeight: 500
                                          }}>
                                            {comp}
                                          </span>
                                          <button
                                            onClick={() => {
                                              setAppliedFilters(prev => ({
                                                ...prev,
                                                company: prev.company.filter((_, i) => i !== idx)
                                              }))
                                            }}
                                            style={{
                                              background: 'transparent',
                                              border: 'none',
                                              cursor: 'pointer',
                                              padding: '4px',
                                              display: 'flex',
                                              alignItems: 'center'
                                            }}
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                              <path d="M10.5 3.5L3.50041 10.4996M10.4996 10.5L3.5 3.50043" stroke="#A0A0AB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {activeFilterCategory === 'jobTitle' && (
                              <div>
                                {/* Search bar */}
                                <div style={{ marginBottom: '12px', position: 'relative' }}>
                                  <Input
                                    value={jobTitleSearchInput}
                                    onChange={(e) => setJobTitleSearchInput(e.target.value)}
                                    placeholder="eg. UX Designer, Product Manager"
                                    style={{
                                      display: 'flex',
                                      padding: '8px 12px',
                                      alignItems: 'center',
                                      gap: '8px',
                                      alignSelf: 'stretch',
                                      borderRadius: '12px',
                                      border: '0.5px solid #26272B',
                                      background: '#1A1A1E',
                                      boxShadow: '0 1px 2px 0 rgba(10, 13, 18, 0.05)',
                                      overflow: 'hidden',
                                      color: '#70707B',
                                      fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                                      textOverflow: 'ellipsis',
                                      fontFamily: '"Inter Display"',
                                      fontSize: '16px',
                                      fontStyle: 'normal',
                                      fontWeight: 400,
                                      lineHeight: '24px',
                                      width: '100%'
                                    }}
                                  />
                                  <svg
                                    style={{
                                      position: 'absolute',
                                      right: '12px',
                                      top: '50%',
                                      transform: 'translateY(-50%)',
                                      pointerEvents: 'none'
                                    }}
                                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M7.33301 1.83203C10.3706 1.83203 12.833 4.29447 12.833 7.33203C12.833 8.63099 12.3834 9.82367 11.6309 10.7646L11.3506 11.1143L14.1172 13.8809C14.1823 13.9459 14.1823 14.0511 14.1172 14.1162C14.0521 14.1813 13.9469 14.1813 13.8818 14.1162L11.1152 11.3496L10.7656 11.6299C9.82464 12.3825 8.63196 12.832 7.33301 12.832C4.29544 12.832 1.83301 10.3696 1.83301 7.33203C1.83301 4.29447 4.29544 1.83203 7.33301 1.83203ZM7.33301 2.16504C4.47954 2.16504 2.16602 4.47856 2.16602 7.33203C2.16602 10.1855 4.47954 12.499 7.33301 12.499C10.1865 12.499 12.5 10.1855 12.5 7.33203C12.5 4.47856 10.1865 2.16504 7.33301 2.16504Z" fill="black" stroke="#70707B"/>
                                  </svg>
                                </div>
                                {/* Job title suggestions */}
                                {jobTitleSearchInput && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {[
                                      'UX Designer',
                                      'UI Designer',
                                      'Product Designer',
                                      'Product Manager',
                                      'Software Engineer',
                                      'Frontend Developer',
                                      'Backend Developer',
                                      'Full Stack Developer',
                                      'Data Scientist',
                                      'DevOps Engineer'
                                    ]
                                      .filter(title => title.toLowerCase().includes(jobTitleSearchInput.toLowerCase()))
                                      .map((jobTitle) => (
                                        <button
                                          key={jobTitle}
                                          onClick={() => {
                                            if (!appliedFilters.jobTitle.includes(jobTitle)) {
                                              setAppliedFilters(prev => ({
                                                ...prev,
                                                jobTitle: [...prev.jobTitle, jobTitle]
                                              }))
                                            }
                                            setJobTitleSearchInput('')
                                          }}
                                          style={{
                                            display: 'flex',
                                            padding: '8px 12px',
                                            alignItems: 'center',
                                            width: '100%',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            color: '#FFF',
                                            fontFamily: '"Inter Display", sans-serif',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            lineHeight: '20px',
                                            textAlign: 'left'
                                          }}
                                          onMouseEnter={(e) => e.currentTarget.style.background = '#26272B'}
                                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                          {jobTitle}
                                        </button>
                                      ))}
                                  </div>
                                )}
                                {/* Selected job titles */}
                                {appliedFilters.jobTitle.length > 0 && (
                                  <div style={{ marginTop: '12px' }}>
                                    <div style={{ color: '#70707B', fontSize: '12px', marginBottom: '8px' }}>Selected:</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      {appliedFilters.jobTitle.map((title, idx) => (
                                        <div
                                          key={idx}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '6px 8px',
                                            borderRadius: '6px',
                                            background: '#26272B'
                                          }}
                                        >
                                          <span style={{
                                            color: '#FFF',
                                            fontSize: '14px',
                                            fontWeight: 500
                                          }}>
                                            {title}
                                          </span>
                                          <button
                                            onClick={() => {
                                              setAppliedFilters(prev => ({
                                                ...prev,
                                                jobTitle: prev.jobTitle.filter((_, i) => i !== idx)
                                              }))
                                            }}
                                            style={{
                                              background: 'transparent',
                                              border: 'none',
                                              cursor: 'pointer',
                                              padding: '4px',
                                              display: 'flex',
                                              alignItems: 'center'
                                            }}
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                              <path d="M10.5 3.5L3.50041 10.4996M10.4996 10.5L3.5 3.50043" stroke="#A0A0AB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      display: 'flex',
                      padding: '10px 12px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '8px',
                      borderRadius: activeTab === tab ? '10px' : '0',
                      border: activeTab === tab ? '0.5px solid #26272B' : 'none',
                      background: activeTab === tab ? '#1A1A1E' : 'transparent',
                      color: activeTab === tab ? '#FFF' : '#70707B',
                      fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                      fontFamily: '"Inter Display", sans-serif',
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

            {/* Table */}
            <div className="w-full" style={{ position: 'relative' }}>
              <table className="w-full" style={{ borderCollapse: 'collapse', position: 'relative' }}>
                <thead>
                  <tr style={{ 
                    display: 'flex',
                    height: '44px',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    borderBottom: '0.5px solid #26272B',
                    background: '#131316'
                  }}>
                    <th style={{ 
                      width: '60px', 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      borderRight: '0.5px solid #26272B'
                    }}>
                      <CustomCheckbox 
                        checked={selectedItems.size === shortlistedProfiles.length && shortlistedProfiles.length > 0} 
                        onChange={toggleSelectAll} 
                      />
                    </th>
                    <th 
                      className="group"
                      style={{ 
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 24px',
                        height: '100%',
                        borderRight: '0.5px solid #26272B',
                        color: '#70707B', 
                        fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                        fontFamily: '"Inter Display", sans-serif',
                        fontSize: '12px', 
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: '18px',
                        textAlign: 'left',
                        position: 'relative'
                      }}>
                      Name
                      <div 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '2px',
                          height: '16px',
                          flexShrink: 0,
                          borderRadius: '9999px',
                          background: '#51525C',
                          cursor: 'col-resize'
                        }}
                      />
                    </th>
                    <th 
                      className="group"
                      style={{ 
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 24px',
                        height: '100%',
                        borderRight: '0.5px solid #26272B',
                        color: '#70707B', 
                        fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                        fontFamily: '"Inter Display", sans-serif',
                        fontSize: '12px', 
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: '18px',
                        textAlign: 'left',
                        position: 'relative'
                      }}>
                      Socials
                      <div 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '2px',
                          height: '16px',
                          flexShrink: 0,
                          borderRadius: '9999px',
                          background: '#51525C',
                          cursor: 'col-resize'
                        }}
                      />
                    </th>
                    <th 
                      className="group"
                      style={{ 
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 24px',
                        height: '100%',
                        borderRight: '0.5px solid #26272B',
                        color: '#70707B', 
                        fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                        fontFamily: '"Inter Display", sans-serif',
                        fontSize: '12px', 
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: '18px',
                        textAlign: 'left',
                        position: 'relative'
                      }}>
                      Status
                      <div 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '2px',
                          height: '16px',
                          flexShrink: 0,
                          borderRadius: '9999px',
                          background: '#51525C',
                          cursor: 'col-resize'
                        }}
                      />
                    </th>
                    <th 
                      className="group"
                      style={{ 
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 24px',
                        height: '100%',
                        borderRight: '0.5px solid #26272B',
                        color: '#70707B', 
                        fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                        fontFamily: '"Inter Display", sans-serif',
                        fontSize: '12px', 
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: '18px',
                        textAlign: 'left',
                        position: 'relative'
                      }}>
                      Date
                      <div 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '2px',
                          height: '16px',
                          flexShrink: 0,
                          borderRadius: '9999px',
                          background: '#51525C',
                          cursor: 'col-resize'
                        }}
                      />
                    </th>
                    <th 
                      className="group"
                      style={{ 
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 24px',
                        height: '100%',
                        borderRight: '0.5px solid #26272B',
                        color: '#70707B', 
                        fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                        fontFamily: '"Inter Display", sans-serif',
                        fontSize: '12px', 
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: '18px',
                        textAlign: 'left',
                        position: 'relative'
                      }}>
                      Company
                      <div 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '2px',
                          height: '16px',
                          flexShrink: 0,
                          borderRadius: '9999px',
                          background: '#51525C',
                          cursor: 'col-resize'
                        }}
                      />
                    </th>
                    <th 
                      className="group"
                      style={{ 
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 24px',
                        height: '100%',
                        color: '#70707B', 
                        fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                        fontFamily: '"Inter Display", sans-serif',
                        fontSize: '12px', 
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: '18px',
                        textAlign: 'left',
                        position: 'relative'
                      }}>
                      Location
                      <div 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '2px',
                          height: '16px',
                          flexShrink: 0,
                          borderRadius: '9999px',
                          background: '#51525C',
                          cursor: 'col-resize'
                        }}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center" style={{ color: '#70707B' }}>
                        Loading...
                      </td>
                    </tr>
                  ) : shortlistedProfiles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center" style={{ color: '#70707B' }}>
                        No shortlisted profiles found
                      </td>
                    </tr>
                  ) : (
                    shortlistedProfiles
                      .filter(item => 
                        !searchQuery || 
                        item.profileId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.profileId?.workExperience?.[0]?.company?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((item, index, filteredArray) => (
                        <tr 
                          key={item._id} 
                          style={{ 
                            display: 'flex',
                            height: '72px',
                            alignItems: 'center',
                            alignSelf: 'stretch',
                            borderBottom: index === filteredArray.length - 1 ? 'none' : '0.5px solid #26272B',
                            background: '#0E0E10',
                            position: 'relative',
                            overflow: 'visible',
                            zIndex: statusDropdownOpen[item._id] ? 1000 : 1
                          }}
                          className="hover:bg-[#131316] transition-colors"
                        >
                          <td style={{ 
                            width: '60px', 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                            borderRight: '0.5px solid #26272B'
                          }}>
                            <CustomCheckbox 
                              checked={selectedItems.has(item._id)} 
                              onChange={() => toggleSelectItem(item._id)} 
                            />
                          </td>
                          <td style={{ 
                            flex: 1, 
                            display: 'flex', 
                            alignItems: 'center',
                            padding: '16px 24px',
                            height: '100%',
                            borderRight: '0.5px solid #26272B',
                            cursor: 'pointer'
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedProfile(item)
                          }}>
                            <span style={{ 
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1,
                              flex: '1 0 0',
                              overflow: 'hidden',
                              color: '#FFF',
                              fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                              textOverflow: 'ellipsis',
                              fontFamily: '"Inter Display", sans-serif',
                              fontSize: '14px', 
                              fontStyle: 'normal',
                              fontWeight: 500,
                              lineHeight: '20px'
                            }}>
                              {item.profileId?.name || 'Unknown'}
                            </span>
                          </td>
                          <td style={{ 
                            flex: 1, 
                            display: 'flex', 
                            alignItems: 'center',
                            padding: '16px 24px',
                            height: '100%',
                            borderRight: '0.5px solid #26272B'
                          }}>
                            <div className="flex items-center gap-2">
                              {item.profileId?.socials?.whatsapp && (
                                <div dangerouslySetInnerHTML={{ __html: socialIconsOld.whatsapp }} />
                              )}
                              <div dangerouslySetInnerHTML={{ __html: socialIconsOld.gmail }} />
                              {item.profileId?.socials?.linkedin && (
                                <div dangerouslySetInnerHTML={{ __html: socialIconsOld.linkedin }} />
                              )}
                              <div dangerouslySetInnerHTML={{ __html: socialIconsOld.x }} />
                              {item.profileId?.socials?.github && (
                                <div dangerouslySetInnerHTML={{ __html: socialIconsOld.github }} />
                              )}
                            </div>
                          </td>
                          <td style={{ 
                            flex: 1, 
                            display: 'flex', 
                            alignItems: 'center',
                            padding: '16px 24px',
                            height: '100%',
                            borderRight: '0.5px solid #26272B',
                            position: 'relative',
                            overflow: 'visible'
                          }}>
                            <div data-status-dropdown style={{ position: 'relative', width: '100%' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setStatusDropdownOpen(prev => {
                                    const isCurrentlyOpen = prev[item._id]
                                    // Close all dropdowns
                                    const allClosed = Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {})
                                    // Toggle current one
                                    return { ...allClosed, [item._id]: !isCurrentlyOpen }
                                  })
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-md"
                                style={{
                                  background: '#26272B',
                                  border: '0.5px solid #3F3F46',
                                  width: '100%',
                                  justifyContent: 'space-between',
                                  position: 'relative',
                                  zIndex: 1
                                }}
                              >
                                <span style={{ color: '#FFF', fontSize: '12px' }}>
                                  {profileStatus[item._id] || 'Not Contacted'}
                                </span>
                                <ChevronDown size={12} color="#70707B" />
                              </button>

                              {/* Status Dropdown */}
                              {statusDropdownOpen[item._id] && (
                                <div
                                  data-status-dropdown
                                  style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    marginTop: '4px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    border: '0.5px solid #26272B',
                                    background: '#1A1A1E',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                                    zIndex: 1001,
                                    minWidth: '140px'
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {['Not Contacted', 'Email Sent', 'Interviewing', 'Hired', 'Rejected'].map((status) => (
                                    <button
                                      key={status}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setProfileStatus(prev => ({ ...prev, [item._id]: status }))
                                        setStatusDropdownOpen(prev => ({ ...prev, [item._id]: false }))
                                      }}
                                      style={{
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: profileStatus[item._id] === status ? '#26272B' : 'transparent',
                                        color: '#FFF',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'background 0.2s'
                                      }}
                                      onMouseEnter={(e) => {
                                        if (profileStatus[item._id] !== status) {
                                          e.currentTarget.style.background = '#26272B'
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        if (profileStatus[item._id] !== status) {
                                          e.currentTarget.style.background = 'transparent'
                                        }
                                      }}
                                    >
                                      {status}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td style={{ 
                            flex: 1, 
                            display: 'flex', 
                            alignItems: 'center',
                            padding: '16px 24px',
                            height: '100%',
                            borderRight: '0.5px solid #26272B'
                          }}>
                            <span style={{ 
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1,
                              flex: '1 0 0',
                              overflow: 'hidden',
                              color: '#A0A0AB',
                              fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                              textOverflow: 'ellipsis',
                              fontFamily: '"Inter Display", sans-serif',
                              fontSize: '14px', 
                              fontStyle: 'normal',
                              fontWeight: 500,
                              lineHeight: '20px'
                            }}>
                              {formatDate(item.createdAt)}
                            </span>
                          </td>
                          <td style={{ 
                            flex: 1, 
                            display: 'flex', 
                            alignItems: 'center',
                            padding: '16px 24px',
                            height: '100%',
                            borderRight: '0.5px solid #26272B'
                          }}>
                            <span style={{ 
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1,
                              flex: '1 0 0',
                              overflow: 'hidden',
                              color: '#FFF',
                              fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                              textOverflow: 'ellipsis',
                              fontFamily: '"Inter Display", sans-serif',
                              fontSize: '14px', 
                              fontStyle: 'normal',
                              fontWeight: 500,
                              lineHeight: '20px'
                            }}>
                              {item.profileId?.workExperience?.[0]?.company || 'N/A'}
                            </span>
                          </td>
                          <td style={{ 
                            flex: 1, 
                            display: 'flex', 
                            alignItems: 'center',
                            padding: '16px 24px',
                            height: '100%'
                          }}>
                            <span style={{ 
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1,
                              flex: '1 0 0',
                              overflow: 'hidden',
                              color: '#A0A0AB',
                              fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                              textOverflow: 'ellipsis',
                              fontFamily: '"Inter Display", sans-serif',
                              fontSize: '14px', 
                              fontStyle: 'normal',
                              fontWeight: 500,
                              lineHeight: '20px'
                            }}>
                              {item.profileId?.location || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Profile Detail Sidebar */}
        {selectedProfile && (
          <aside
            style={{
              display: 'flex',
              minWidth: '287px',
              maxWidth: '500px',
              flexDirection: 'column',
              alignItems: 'flex-start',
              flex: '1 0 0',
              borderRadius: '0',
              background: '#0E0E10',
              borderLeft: '1px solid #26272B',
              height: '100vh',
              position: 'sticky',
              top: 0,
              overflow: 'hidden'
            }}
          >
            {/* Fixed Header Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '100%',
                background: '#0E0E10',
                borderBottom: '1px solid #26272B',
                padding: '16px',
                flexShrink: 0
              }}>
              {/* Top row: Close button and navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <button
                  onClick={() => setSelectedProfile(null)}
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
                      <path d="M11.25 4.5C11.25 4.5 6.75001 7.81418 6.75 9C6.74999 10.1859 11.25 13.5 11.25 13.5" stroke="#A48AFB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                      <path d="M6.75004 4.5C6.75004 4.5 11.25 7.81418 11.25 9C11.25 10.1859 6.75 13.5 6.75 13.5" stroke="#A48AFB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                    {selectedProfile.profileId?.name || 'Unknown'}
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
                
                {/* Message Button */}
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.51944 1.2145C7.49094 1.14992 8.50641 1.14979 9.47994 1.2145C12.5243 1.41687 14.9399 3.8744 15.1385 6.94761C15.1756 7.52255 15.1756 8.11721 15.1385 8.69215C14.9399 11.7653 12.5243 14.2229 9.47994 14.4253C8.50641 14.4899 7.49094 14.4898 6.51944 14.4253C6.14282 14.4002 5.73286 14.3111 5.37193 14.1625C5.21321 14.0971 5.10546 14.0529 5.02661 14.024C4.9724 14.0613 4.90039 14.1142 4.79554 14.1915C4.26725 14.5811 3.60029 14.8543 2.65379 14.8313L2.6233 14.8306C2.44071 14.8262 2.24608 14.8216 2.08735 14.7909C1.89617 14.7539 1.65965 14.6614 1.51161 14.409C1.35049 14.1343 1.41509 13.8565 1.47759 13.6816C1.53658 13.5165 1.63883 13.3228 1.74329 13.125L1.75761 13.0979C2.06849 12.5087 2.1551 12.0273 1.98888 11.7063C1.43399 10.8687 0.934819 9.83641 0.860873 8.69215C0.823719 8.11721 0.823719 7.52255 0.860873 6.94761C1.05949 3.8744 3.47501 1.41687 6.51944 1.2145ZM5.16634 6.33268C5.16634 6.60882 5.3902 6.83268 5.66634 6.83268H7.99967C8.27581 6.83268 8.49967 6.60882 8.49967 6.33268C8.49967 6.05654 8.27581 5.83268 7.99967 5.83268H5.66634C5.3902 5.83268 5.16634 6.05654 5.16634 6.33268ZM5.16634 9.66601C5.16634 9.94215 5.3902 10.166 5.66634 10.166H10.333C10.6091 10.166 10.833 9.94215 10.833 9.66601C10.833 9.38988 10.6091 9.16601 10.333 9.16601H5.66634C5.3902 9.16601 5.16634 9.38988 5.16634 9.66601Z" fill="white"/>
                  </svg>
                  <span
                    className='font-bold'
                    style={{
                      color: '#FFF',
                      fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
                      fontSize: '13px',
                    }}>Message</span>
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
                {selectedProfile.profileId?.location || 'Location not available'}
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
                    onClick={() => {
                      setProfileActiveTab(tab)
                      const sectionMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
                        'Overview': overviewSectionRef,
                        'Experience': experienceSectionRef,
                        'Education': educationSectionRef,
                        'Skill': skillSectionRef
                      }
                      const targetRef = sectionMap[tab]
                      if (targetRef.current && scrollContainerRef.current) {
                        const containerTop = scrollContainerRef.current.getBoundingClientRect().top
                        const sectionTop = targetRef.current.getBoundingClientRect().top
                        const scrollPosition = scrollContainerRef.current.scrollTop + (sectionTop - containerTop) - 20
                        scrollContainerRef.current.scrollTo({ top: scrollPosition, behavior: 'smooth' })
                      }
                    }}
                    style={{
                      display: 'flex',
                      height: '36px',
                      padding: '8px 12px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '8px',
                      flex: '1 0 0',
                      borderRadius: profileActiveTab === tab ? '10px' : '0',
                      border: profileActiveTab === tab ? '0.5px solid #26272B' : 'none',
                      background: profileActiveTab === tab ? '#1A1A1E' : 'transparent',
                      color: profileActiveTab === tab ? '#FFF' : '#70707B',
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
              ref={scrollContainerRef}
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
              {/* Manage Profile Section - Overview */}
              <div ref={overviewSectionRef}></div>
              <div 
                className='border-[0.5px] border-[#1A1A1E]'
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px', 
                  width: '100%',
                  padding: '16px',
                  background: '#0E0E10',
                  borderRadius: '12px',
                }}>
                <p style={{
                  color: '#70707B',
                  fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
                  fontSize: '12px',
                  fontWeight: 500,
                  margin: 0
                }}>Manage profile</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{
                    display: 'flex',
                    padding: '8px 12px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: '8px',
                    background: '#875BF7',
                    border: 'none',
                    cursor: 'pointer',
                    flex: 1
                  }}>
                    <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 500 }}>Shortlist</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 13.9993L5.33333 10.666" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.83867 12.5809C6.34311 12.0143 3.9853 9.65653 3.41869 7.161C3.329 6.76593 3.28415 6.56844 3.41408 6.24798C3.54401 5.92753 3.70272 5.82837 4.02015 5.63006C4.73771 5.18177 5.5147 5.03925 6.32107 5.11057C7.45254 5.21065 8.01827 5.26069 8.30047 5.11365C8.58274 4.96661 8.77447 4.62278 9.15807 3.93513L9.64394 3.06403C9.96401 2.49019 10.1241 2.20327 10.5005 2.06801C10.877 1.93275 11.1035 2.01466 11.5567 2.17847C12.6163 2.56157 13.4381 3.38337 13.8212 4.44299C13.985 4.89611 14.0669 5.12267 13.9317 5.49913C13.7964 5.8756 13.5095 6.03564 12.9356 6.35572L12.0445 6.8528C11.3581 7.2356 11.0149 7.42707 10.8679 7.712C10.7209 7.997 10.7743 8.5504 10.8811 9.65727C10.9596 10.4712 10.8243 11.2533 10.37 11.9798C10.1715 12.2972 10.0722 12.4559 9.75187 12.5857C9.43147 12.7155 9.23387 12.6707 8.83867 12.5809Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button style={{
                    display: 'flex',
                    padding: '8px 12px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: '8px',
                    background: '#26272B',
                    border: '0.5px solid #3F3F46',
                    cursor: 'pointer',
                    flex: 1
                  }}>
                    <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 500 }}>Not Interested</span>
                  </button>
                </div>
              </div>

              {/* Work Experience Section */}
              <div 
                ref={experienceSectionRef}
                className='p-[16px] bg-[#0E0E10] border-[0.5px] border-[#1A1A1E] rounded-[16px]'
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
                  <div style={{ 
                    display: 'flex', 
                    padding: '12px',
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    gap: '6px',
                    flex: '1 0 0',
                    borderRadius: '12px',
                    border: '0.5px solid #26272B',
                    background: '#1A1A1E'
                  }}>
                    <span style={{ 
                      color: '#70707B', 
                      fontSize: '12px',
                      fontWeight: 500,
                      lineHeight: '18px'
                    }}>Average tenure</span>
                    <span style={{ 
                      color: '#FFF', 
                      fontSize: '14px',
                      fontWeight: 600,
                      lineHeight: '20px'
                    }}>
                      3 yrs 1 mos
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    padding: '12px',
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    gap: '6px',
                    flex: '1 0 0',
                    borderRadius: '12px',
                    border: '0.5px solid #26272B',
                    background: '#1A1A1E'
                  }}>
                    <span style={{ 
                      color: '#70707B', 
                      fontSize: '12px',
                      fontWeight: 500,
                      lineHeight: '18px'
                    }}>Current tenure</span>
                    <span style={{ 
                      color: '#FFF', 
                      fontSize: '14px',
                      fontWeight: 600,
                      lineHeight: '20px'
                    }}>
                      7 yrs 2 mos
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    padding: '12px',
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    gap: '6px',
                    flex: '1 0 0',
                    borderRadius: '12px',
                    border: '0.5px solid #26272B',
                    background: '#1A1A1E'
                  }}>
                    <span style={{ 
                      color: '#70707B', 
                      fontSize: '12px',
                      fontWeight: 500,
                      lineHeight: '18px'
                    }}>Total experience</span>
                    <span style={{ 
                      color: '#FFF', 
                      fontSize: '14px',
                      fontWeight: 600,
                      lineHeight: '20px'
                    }}>
                      24 yrs 8 mos
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
                      {selectedProfile.profileId?.workExperience?.[0]?.company?.charAt(0) || 'C'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 500 }}>
                        Lead Product Designer
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
                      {selectedProfile.profileId?.workExperience?.[0]?.company || 'Company'}
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
                      Designing tailored user experiences for high-net-worth clients in the financial sector, enhancing int...
                      <button style={{
                        color: '#875BF7',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        marginLeft: '4px'
                      }}>Show more</button>
                    </p>
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div 
                ref={educationSectionRef}
                className='p-[16px] bg-[#0E0E10] border-[0.5px] border-[#1A1A1E] rounded-[16px]'
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
                      University
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
                ref={skillSectionRef}
                className='p-[16px] bg-[#0E0E10] border-[0.5px] border-[#1A1A1E] rounded-[16px]'
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
                    {['Wireframing', 'User Research', 'Prototyping', 'Usability Testing'].map((skill, index) => (
                      <span
                        key={index}
                        style={{
                          display: 'flex',
                          padding: '2px 6px',
                          alignItems: 'center',
                          borderRadius: '6px',
                          border: '0.5px solid #3F3F46',
                          background: '#26272B',
                          color: '#FFF',
                          fontSize: '12px',
                          fontWeight: 500,
                          lineHeight: '18px'
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
                          display: 'flex',
                          padding: '2px 6px',
                          alignItems: 'center',
                          borderRadius: '6px',
                          border: '0.5px solid #3F3F46',
                          background: '#26272B',
                          color: '#FFF',
                          fontSize: '12px',
                          fontWeight: 500,
                          lineHeight: '18px'
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
                className='p-[16px] bg-[#0E0E10] border-[0.5px] border-[#1A1A1E] rounded-[16px]'
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
                        display: 'flex',
                        padding: '2px 6px',
                        alignItems: 'center',
                        borderRadius: '6px',
                        border: '0.5px solid #3F3F46',
                        background: '#26272B',
                        color: '#FFF',
                        fontSize: '12px',
                        fontWeight: 500,
                        lineHeight: '18px'
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
      </div>

      {/* Fixed Action Buttons */}
      {selectedItems.size > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            padding: '0px',
            alignItems: 'flex-start',
            gap: '6px',
            zIndex: 1000
          }}
        >
          {/* Shortlist Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowShortlistDropdown(!showShortlistDropdown)}
              style={{
                display: 'flex',
                height: '56px',
                padding: '16px 24px',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '100px',
                background: '#875BF7',
                border: 'none',
                cursor: 'pointer',
                color: '#FFF',
                fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                fontFamily: '"Inter Display", sans-serif',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '24px',
                minWidth: '200px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                Shortlist
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15.8337 8.50008C15.8337 8.50008 11.7793 14.1667 10.0003 14.1667C8.22136 14.1667 4.16699 8.5 4.16699 8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
                <path d="M10.75 0.750041C10.75 0.750041 7.06758 5.75 5.75 5.75C4.43233 5.75 0.75 0.75 0.75 0.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Dropdown */}
            {showShortlistDropdown && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '64px',
                  left: 0,
                  display: 'flex',
                  padding: '8px',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '4px',
                  borderRadius: '12px',
                  border: '0.5px solid #26272B',
                  background: '#1A1A1E',
                  boxShadow: '0 4px 28.8px 0 rgba(0, 0, 0, 0.13)',
                  minWidth: '200px',
                  zIndex: 1001
                }}
              >
                <button
                  onClick={() => {
                    setSelectedShortlistOption('shortlisted')
                    setShowShortlistDropdown(false)
                  }}
                  style={{
                    display: 'flex',
                    padding: '8px 12px',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    borderRadius: '8px',
                    background: selectedShortlistOption === 'shortlisted' ? '#26272B' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#FFF',
                    fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                    fontFamily: '"Inter Display", sans-serif',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '20px',
                    textAlign: 'left',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedShortlistOption !== 'shortlisted') {
                      e.currentTarget.style.background = '#26272B'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedShortlistOption !== 'shortlisted') {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  Shortlisted
                </button>
                <button
                  onClick={async () => {
                    setSelectedShortlistOption('not-interested')
                    setShowShortlistDropdown(false)
                    
                    // Remove selected items from shortlist
                    try {
                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
                      const deletePromises = Array.from(selectedItems).map(shortlistId =>
                        fetch(`${apiUrl}/api/shortlist/${shortlistId}`, {
                          method: 'DELETE',
                          credentials: 'include'
                        })
                      )
                      
                      await Promise.all(deletePromises)
                      
                      // Remove from local state
                      setShortlistedProfiles(prev => prev.filter(profile => !selectedItems.has(profile._id)))
                      setSelectedItems(new Set())
                    } catch (error) {
                      console.error('Error removing from shortlist:', error)
                    }
                  }}
                  style={{
                    display: 'flex',
                    padding: '8px 12px',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    borderRadius: '8px',
                    background: selectedShortlistOption === 'not-interested' ? '#26272B' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#FFF',
                    fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                    fontFamily: '"Inter Display", sans-serif',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '20px',
                    textAlign: 'left',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedShortlistOption !== 'not-interested') {
                      e.currentTarget.style.background = '#26272B'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedShortlistOption !== 'not-interested') {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  Not Interested
                </button>
              </div>
            )}
          </div>

          {/* Not Interested Button - Hidden when dropdown is shown */}
          {!showShortlistDropdown && (
            <button
              style={{
                display: 'flex',
                height: '56px',
                padding: '16px 24px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '6px',
                borderRadius: '100px',
                background: '#26272B',
                border: 'none',
                cursor: 'pointer',
                color: '#FFF',
                fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                fontFamily: '"Inter Display", sans-serif',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '24px'
              }}
            >
              Not Interested
            </button>
          )}
        </div>
      )}

      <ProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        projectName={projectName}
        setProjectName={setProjectName}
        onCreateProject={handleCreateProject}
      />
      
      <EditQueryModal
        isOpen={showEditQueryModal}
        onClose={() => setShowEditQueryModal(false)}
        currentQuery={searchQuery}
        onSave={setSearchQuery}
      />
    </>
  )
}
