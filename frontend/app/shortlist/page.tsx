'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import ProjectModal from '@/components/dashboard/ProjectModal'
import { ChevronDown } from 'lucide-react'

const socialIcons = {
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

  // Fetch shortlisted profiles
  useEffect(() => {
    const fetchShortlistedProfiles = async () => {
      try {
        setLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        
        let url = `${apiUrl}/api/shortlist/all`
        if (selectedProjectId) {
          url = `${apiUrl}/api/shortlist/project/${selectedProjectId}`
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
  }, [selectedProjectId])

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
          backgroundColor: '#131316'
        }}
      >
        <main 
          className="w-full p-[6px]"
          style={{
           
            flex: '1 0 0',
            alignSelf: 'stretch',
            borderRadius: '20px',
            border: '0.5px solid #26272B',
            background: '#161619'
          }}
        >
          {/* Header with Project Selector */}
          <div 
            style={{ 
              display: 'flex',
              width: '100%',
              padding: '12px 16px',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '16px',
              border: '0.5px solid #3F3F46',
              background: '#131316',
              marginBottom: '8px'
            }}
          >
            <button
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              style={{
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
            
            <span 
            className='ml-[12px]'
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
              lineHeight: '24px'
            }}>
              {shortlistedProfiles.length > 0 
                ? `${shortlistedProfiles.length} shortlisted profiles`
                : '2 shortlisted profiles'
              }
            </span>

          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="#A0A0AB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
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
              border: '0.5px solid #26272B',
              background: '#131316',
              boxShadow: '0 1px 2px 0 rgba(10, 13, 18, 0.05)',
              overflow: 'hidden'
            }}
          >
            <div className="flex items-center justify-between p-4 border-b w-full" style={{ borderColor: '#26272B' }}>
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

              <div className="flex items-center gap-3">
                <div 
                  style={{
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
                </div>

                <button
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
                  }}>Sort</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 6.00003C12 6.00003 9.05407 10 8 10C6.94587 10 4 6 4 6" stroke="#A48AFB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <button
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
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ 
                    display: 'flex',
                    height: '44px',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    borderBottom: '0.5px solid #26272B',
                    background: '#1A1A1E'
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
                    <th style={{ 
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
                      textAlign: 'left'
                    }}>
                      Name
                    </th>
                    <th style={{ 
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
                      textAlign: 'left'
                    }}>
                      Socials
                    </th>
                    <th style={{ 
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
                      textAlign: 'left'
                    }}>
                      Status
                    </th>
                    <th style={{ 
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
                      textAlign: 'left'
                    }}>
                      Date
                    </th>
                    <th style={{ 
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
                      textAlign: 'left'
                    }}>
                      Company
                    </th>
                    <th style={{ 
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
                      textAlign: 'left'
                    }}>
                      Location
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
                            background: '#131316'
                          }}
                          className="hover:bg-[#26272B] transition-colors cursor-pointer"
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
                                <div dangerouslySetInnerHTML={{ __html: socialIcons.whatsapp }} />
                              )}
                              <div dangerouslySetInnerHTML={{ __html: socialIcons.gmail }} />
                              {item.profileId?.socials?.linkedin && (
                                <div dangerouslySetInnerHTML={{ __html: socialIcons.linkedin }} />
                              )}
                              <div dangerouslySetInnerHTML={{ __html: socialIcons.x }} />
                              {item.profileId?.socials?.github && (
                                <div dangerouslySetInnerHTML={{ __html: socialIcons.github }} />
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
                            <button
                              className="flex items-center gap-2 px-3 py-1.5 rounded-md"
                              style={{
                                background: '#26272B',
                                border: '0.5px solid #3F3F46'
                              }}
                            >
                              <span style={{ color: '#FFF', fontSize: '12px' }}>Not Contacted</span>
                              <ChevronDown size={12} color="#70707B" />
                            </button>
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
      </div>

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
