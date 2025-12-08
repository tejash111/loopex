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
          marginLeft: sidebarCollapsed ? '72px' : '256px',
          backgroundColor: '#131316'
        }}
      >
        <main className="p-4">
          {/* Header with Project Selector */}
          <div 
            className="flex items-center gap-3 p-4 rounded-xl mb-4"
            style={{ 
              background: '#1A1A1E',
              border: '0.5px solid #26272B'
            }}
          >
            <button
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                background: '#26272B',
                border: '0.5px solid #3F3F46'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 17 15" fill="none">
                <path d="M4.37448 2.87006e-05C5.14654 -0.000308799 5.6803 -0.000548769 6.15945 0.179129C7.20607 0.571596 7.6653 1.50097 8.01937 2.21733C8.12535 2.42938 8.31818 2.81458 8.3721 2.89928C8.3886 2.92697 8.4408 2.98369 8.5173 2.98904C8.6172 2.99937 8.7525 3.00006 8.98958 3.00006H11.6554C12.4196 3.00005 13.0359 3.00004 13.5304 3.05035C14.0408 3.10227 14.4835 3.21241 14.8751 3.47405C15.1822 3.67925 15.4458 3.94292 15.651 4.25002C15.9127 4.6416 16.0228 5.08426 16.0748 5.59468C16.125 6.08916 16.125 6.76753 16.125 7.53178C16.125 8.82156 16.125 9.83271 16.0431 10.6378C15.9596 11.4588 15.7862 12.1277 15.3983 12.7084C15.0836 13.1794 14.6793 13.5836 14.2084 13.8983C13.6277 14.2863 12.9587 14.4597 12.1377 14.5432C11.3326 14.6251 10.3215 14.6251 9.03172 14.6251H8.01945C6.28817 14.6251 4.93139 14.6251 3.87278 14.4828C2.78923 14.3371 1.93421 14.0331 1.26311 13.362C0.591998 12.6909 0.287993 11.8358 0.142313 10.7523C-1.48192e-05 9.69366 -7.28884e-06 8.33691 2.11162e-07 6.60561V4.24469C-7.28884e-06 3.58564 -1.4822e-05 3.0541 0.0378302 2.62483C0.0768152 2.18253 0.159285 1.79547 0.35655 1.44199C0.61071 0.986564 0.986498 0.610769 1.44194 0.356609C1.79541 0.159344 2.18247 0.0768813 2.62478 0.0378888C3.05404 5.12945e-05 3.71543 2.12006e-05 4.37448 2.87006e-05Z" fill="#A48AFB"/>
              </svg>
              <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 500 }}>
                {selectedProject || 'Select Project'}
              </span>
              <ChevronDown size={16} color="#A48AFB" />
            </button>
            
            <span style={{ 
              color: '#FFF', 
              fontSize: '14px',
              fontWeight: 400,
              flex: 1
            }}>
              {shortlistedProfiles.length > 0 
                ? `${shortlistedProfiles.length} shortlisted profiles`
                : 'No shortlisted profiles yet'
              }
            </span>

            <ChevronDown size={20} color="#70707B" />
          </div>

          {/* Tabs and Search */}
          <div 
            className="rounded-xl overflow-hidden"
            style={{ 
              background: '#1A1A1E',
              border: '0.5px solid #26272B'
            }}
          >
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#26272B' }}>
              <div className="flex items-center gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="pb-2"
                    style={{
                      color: activeTab === tab ? '#FFF' : '#70707B',
                      fontSize: '14px',
                      fontWeight: 500,
                      borderBottom: activeTab === tab ? '2px solid #875BF7' : '2px solid transparent',
                      marginBottom: '-17px',
                      paddingBottom: '17px'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{
                    background: '#131316',
                    border: '0.5px solid #26272B'
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search name, company, etc."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-white text-sm"
                    style={{ width: '200px' }}
                  />
                  <ChevronDown size={16} color="#70707B" />
                </div>

                <button
                  className="p-2 rounded-lg"
                  style={{
                    background: '#26272B',
                    border: '0.5px solid #3F3F46'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M2.25 4.5H15.75M4.5 9H13.5M6.75 13.5H11.25" stroke="#70707B" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>

                <button
                  className="p-2 rounded-lg"
                  style={{
                    background: '#26272B',
                    border: '0.5px solid #3F3F46'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M6.75 2.25V15.75M11.25 2.25V15.75M2.25 6.75H15.75M2.25 11.25H15.75" stroke="#70707B" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '0.5px solid #26272B' }}>
                    <th className="p-4 text-left" style={{ width: '40px' }}>
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="p-4 text-left" style={{ color: '#70707B', fontSize: '12px', fontWeight: 500 }}>
                      Name
                    </th>
                    <th className="p-4 text-left" style={{ color: '#70707B', fontSize: '12px', fontWeight: 500 }}>
                      Socials
                    </th>
                    <th className="p-4 text-left" style={{ color: '#70707B', fontSize: '12px', fontWeight: 500 }}>
                      Status
                    </th>
                    <th className="p-4 text-left" style={{ color: '#70707B', fontSize: '12px', fontWeight: 500 }}>
                      Date
                    </th>
                    <th className="p-4 text-left" style={{ color: '#70707B', fontSize: '12px', fontWeight: 500 }}>
                      Company
                    </th>
                    <th className="p-4 text-left" style={{ color: '#70707B', fontSize: '12px', fontWeight: 500 }}>
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
                      .map((item) => (
                        <tr 
                          key={item._id} 
                          style={{ borderBottom: '0.5px solid #26272B' }}
                          className="hover:bg-[#26272B] transition-colors cursor-pointer"
                        >
                          <td className="p-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="p-4">
                            <span style={{ color: '#FFF', fontSize: '14px', fontWeight: 500 }}>
                              {item.profileId?.name || 'Unknown'}
                            </span>
                          </td>
                          <td className="p-4">
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
                          <td className="p-4">
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
                          <td className="p-4">
                            <span style={{ color: '#A0A0AB', fontSize: '14px' }}>
                              {formatDate(item.createdAt)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span style={{ color: '#FFF', fontSize: '14px' }}>
                              {item.profileId?.workExperience?.[0]?.company || 'N/A'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span style={{ color: '#A0A0AB', fontSize: '14px' }}>
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
