'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import ProjectModal from '@/components/dashboard/ProjectModal'
import { getSocket, connectSocket, disconnectSocket } from '@/lib/socket'

interface Message {
  id: string
  content: string
  timestamp: string
  isOwn: boolean
  hasLinkPreview?: boolean
  linkPreview?: {
    title: string
    description: string
    url: string
  }
  attachment?: {
    url: string
    publicId: string
    fileName: string
    fileType: string
    mimeType: string
    size: number
  }
}

interface User {
  _id: string
  name: string
  email: string
  lastMessage?: string
  timestamp?: string
  unreadCount?: number
  isOnline?: boolean
}

interface Conversation {
  _id: string
  name: string
  email: string
  messages: Message[]
}

export default function MessagePage() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [userProjects, setUserProjects] = useState<string[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [projectsData, setProjectsData] = useState<{_id: string, name: string}[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [savedSearches, setSavedSearches] = useState<{_id: string, query: string, createdAt: string}[]>([])
  const [selectedSavedSearchId, setSelectedSavedSearchId] = useState<string | null>(null)
  const [showProjectDropdown, setShowProjectDropdown] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [users, setUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch current user and initialize socket
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        
        // First get the current user info from auth
        const authResponse = await fetch(`${apiUrl}/api/auth/me`, {
          credentials: 'include'
        })

        console.log('Auth response status:', authResponse.status)
        if (authResponse.ok) {
          const authData = await authResponse.json()
          console.log('Auth data received:', authData)
          if (authData.success && authData.user) {
            const userId = authData.user._id || authData.user.userId
            console.log('Current user ID:', userId)
            setCurrentUserId(userId)
            connectSocket(userId)
          } else {
            console.error('Auth data invalid:', authData)
          }
        } else {
          const errorText = await authResponse.text()
          console.error('Failed to fetch current user:', authResponse.status, errorText)
        }
      } catch (error) {
        console.error('Error fetching current user:', error)
      }
    }

    fetchCurrentUser()

    return () => {
      disconnectSocket()
    }
  }, [])

  // Setup socket listeners
  useEffect(() => {
    if (!currentUserId) return

    const socket = getSocket()

    // Add connection event listeners
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
      setSocketConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
      setSocketConnected(false)
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      setSocketConnected(false)
    })

    socket.on('message_error', (error) => {
      console.error('Message error:', error)
      alert('Failed to send message: ' + error.message)
    })

    socket.on('receive_message', (data) => {
      console.log('Received message:', data)
      // Add message to current conversation if it's from the selected user
      if (selectedUser && data.sender._id === selectedUser._id) {
        setMessages(prev => [...prev, {
          id: data.id,
          content: data.content,
          timestamp: data.timestamp,
          isOwn: false,
          linkPreview: data.linkPreview,
          attachment: data.attachment
        }])
      }
      
      // Update user list
      fetchUsers()
    })

    socket.on('message_sent', (data) => {
      console.log('Message sent confirmation:', data)
      // Message sent confirmation
      setMessages(prev => [...prev, {
        id: data.id,
        content: data.content,
        timestamp: data.timestamp,
        isOwn: true,
        linkPreview: data.linkPreview,
        attachment: data.attachment
      }])
      
      // Update user list
      fetchUsers()
    })

    socket.on('user_typing', (data) => {
      if (selectedUser && data.userId === selectedUser._id) {
        setIsTyping(true)
      }
    })

    socket.on('user_stop_typing', (data) => {
      if (selectedUser && data.userId === selectedUser._id) {
        setIsTyping(false)
      }
    })
socket.on('user_online', (data) => {
      console.log('User came online:', data.userId)
      // Update user list to reflect online status
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === data.userId ? { ...user, isOnline: true } : user
        )
      )
    })
  socket.off('user_online')
      socket.off('user_offline')
    
    socket.on('user_offline', (data) => {
      console.log('User went offline:', data.userId)
      // Update user list to reflect offline status
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === data.userId ? { ...user, isOnline: false } : user
        )
      )
    })

    
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connect_error')
      socket.off('message_error')
      socket.off('receive_message')
      socket.off('message_sent')
      socket.off('user_typing')
      socket.off('user_stop_typing')
    }
  }, [currentUserId, selectedUser])

  // Fetch users
  const fetchUsers = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/messages/users`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUsers(data.users)
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Fetch conversation when user is selected
  const handleUserSelect = async (user: User) => {
    setSelectedUser(user)
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiUrl}/api/messages/conversation/${user._id}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Loaded conversation:', data.messages)
        console.log('Current user ID:', currentUserId)
        if (data.success) {
          setMessages(data.messages)
        }
      }
    } catch (error) {
      console.error('Error fetching conversation:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const getInitials = (name: string) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB')
      return
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'audio/mpeg', 'audio/mp3',
      'video/mp4', 'video/mpeg'
    ]

    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Allowed: images, PDF, DOCX, MP3, MP4')
      return
    }

    setSelectedFile(file)

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setFilePreview(null)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSendMessage = async () => {
    if ((!messageInput.trim() && !selectedFile) || !selectedUser || !currentUserId) {
      return
    }

    // If there's a file, send via API
    if (selectedFile) {
      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append('receiverId', selectedUser._id)
        if (messageInput.trim()) {
          formData.append('content', messageInput.trim())
        }
        formData.append('file', selectedFile)

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const response = await fetch(`${apiUrl}/api/messages/send`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        })

        const data = await response.json()

        if (data.success) {
          // Add message to UI
          setMessages(prev => [...prev, {
            id: data.message.id,
            content: data.message.content,
            timestamp: data.message.timestamp,
            isOwn: true,
            attachment: data.message.attachment
          }])

          setMessageInput('')
          handleRemoveFile()
          fetchUsers()
        } else {
          alert('Failed to send file: ' + data.message)
        }
      } catch (error) {
        console.error('Error sending file:', error)
        alert('Failed to send file')
      } finally {
        setIsUploading(false)
      }
      return
    }

    // Text-only message via socket
    if (messageInput.trim() && selectedUser && currentUserId) {
      const socket = getSocket()
      
      // Ensure socket is connected
      if (!socket.connected) {
        console.error('Socket not connected')
        connectSocket(currentUserId)
        return
      }

      console.log('Sending message:', {
        senderId: currentUserId,
        receiverId: selectedUser._id,
        content: messageInput.trim()
      })
      
      socket.emit('send_message', {
        senderId: currentUserId,
        receiverId: selectedUser._id,
        content: messageInput.trim()
      })

      setMessageInput('')
    } else {
      console.log('Cannot send message:', {
        hasInput: !!messageInput.trim(),
        hasSelectedUser: !!selectedUser,
        hasCurrentUserId: !!currentUserId
      })
    }
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

  const handleSavedSearchClick = (query: string) => {
    setSearchQuery(query)
  }

  const totalUnread = users.reduce((acc, user) => acc + (user.unreadCount || 0), 0)

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
        className="h-screen transition-all duration-300 overflow-hidden" 
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
          className="p-[0px]"
          style={{
            flex: '1 0 0',
            alignSelf: 'stretch',
            borderRadius: '20px',
            border: '0.5px solid #1A1A1E',
            background: '#131315',
            display: 'flex',
            overflow: 'hidden'
          }}
        >
          {/* Left Panel - Conversations List */}
          <div
            style={{
              display: 'flex',
              width: '360px',
              minWidth: '360px',
              maxWidth: '360px',
              padding: '0',
              flexDirection: 'column',
              alignItems: 'flex-start',
              alignSelf: 'stretch',
              borderRight: '1px solid #1A1A1E',
              background: '#131316'
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                height: '76px',
                padding: '16px 20px',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: '20px',
                alignSelf: 'stretch',
                borderBottom: '0.5px solid #26272B'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  className='bg-[#1A1A1E] flex gap-[4px] px-[12px] py-[8px] rounded-[12px] border-[0.5px] border-[#26272B]'
                  onClick={() => router.back()}
                  style={{}}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10 4C10 4 6.00001 6.94593 6 8C5.99999 9.05413 10 12 10 12" stroke="#A48AFB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{
                    color: '#A48AFB',
                    fontFamily: '"Inter Display", sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    lineHeight: '20px'
                  }}>Back</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    color: '#FFF',
                    fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                    fontFamily: '"Inter Display", sans-serif',
                    fontSize: '20px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    lineHeight: '30px'
                  }}>Messages</span>

                  <span style={{
                    display: 'flex',
                    padding: '2px 8px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    border: '0.5px solid #315F45',
                    background: '#172820',
                    color: '#CAF7DA',
                    textAlign: 'center',
                    fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                    fontFamily: '"Inter Display", sans-serif',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '20px'
                  }}>{totalUnread}</span>
                </div>
              </div>
            </div>

            {/* Project Filter */}
            <div style={{ padding: '12px 16px' }}>
              <button
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                style={{
                  display: 'flex',
                  padding: '7px 12px',
                  alignItems: 'center',
                  gap: '8px',
                  alignSelf: 'stretch',
                  borderRadius: '12px',
                  border: '0.5px solid #26272B',
                  background: '#1A1A1E',
                  boxShadow: '0 1px 2px 0 rgba(10, 13, 18, 0.05)',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
              
                <div style={{
                  display: 'flex',
                  padding: '4px 8px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '8px',
                  border: '0.5px solid #3F3F46',
                  background: '#26272B',
                  boxShadow: '0 0 0 1px rgba(10, 13, 18, 0.18) inset, 0 -2px 0 0 rgba(10, 13, 18, 0.05) inset, 0 1px 2px 0 rgba(10, 13, 18, 0.05)'
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                  <path d="M3.40237 2.23227e-05C4.00286 -0.000240177 4.41801 -0.00042682 4.79068 0.139322C5.60473 0.444575 5.9619 1.16742 6.23729 1.72459C6.31972 1.88951 6.46969 2.18912 6.51163 2.255C6.52447 2.27653 6.56507 2.32064 6.62457 2.32481C6.70227 2.33284 6.8075 2.33338 6.99189 2.33338H9.06529C9.65971 2.33337 10.139 2.33337 10.5236 2.37249C10.9206 2.41288 11.2649 2.49854 11.5695 2.70204C11.8084 2.86164 12.0134 3.06672 12.173 3.30557C12.3765 3.61013 12.4622 3.95442 12.5026 4.35141C12.5417 4.73601 12.5417 5.26364 12.5417 5.85805C12.5417 6.86121 12.5417 7.64766 12.478 8.27381C12.413 8.91239 12.2782 9.43266 11.9764 9.88434C11.7317 10.2506 11.4172 10.565 11.051 10.8098C10.5993 11.1116 10.079 11.2464 9.44043 11.3113C8.81428 11.375 8.02783 11.375 7.02468 11.375H6.23735C4.8908 11.375 3.83553 11.375 3.01216 11.2644C2.1694 11.151 1.50439 10.9146 0.982415 10.3927C0.460443 9.87069 0.223994 9.20563 0.110688 8.36289C-1.1526e-05 7.53951 -5.6691e-06 6.48426 1.64237e-07 5.1377V3.30143C-5.6691e-06 2.78883 -1.15282e-05 2.37541 0.0294235 2.04154C0.0597451 1.69752 0.123888 1.39648 0.277317 1.12155C0.474997 0.767327 0.767276 0.475042 1.12151 0.277362C1.39643 0.123934 1.69748 0.0597966 2.04149 0.0294691C2.37536 3.98957e-05 2.88978 1.64894e-05 3.40237 2.23227e-05Z" fill="#70707B"/>
                </svg>
                  <span style={{
                    color: '#FFF',
                    fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                    fontFamily: '"Inter Display", sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    lineHeight: '18px'
                  }}>Projects</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 8.74997C3.5 8.74997 6.07769 5.25 7 5.25C7.92237 5.25 10.5 8.75 10.5 8.75" stroke="#70707B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div style={{ flex: 1 }} />

                <span style={{
                  overflow: 'hidden',
                  color: '#FFF',
                  fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                  textOverflow: 'ellipsis',
                  fontFamily: '"Inter Display", sans-serif',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '24px'
                }}>UX Designer in Lond...</span>

                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 6.00003C12 6.00003 9.05407 10 8 10C6.94587 10 4 6 4 6" stroke="#70707B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

           

            {/* Conversations List */}
            <div
              className="hide-scrollbar"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0 12px'
              }}
            >
              {users.filter(user => !showOnlineOnly || user.isOnline).map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  style={{
                    width : '100%',
                    display: 'flex',
                    padding: '12px',
                    alignItems: 'flex-start',
                    gap: '12px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: selectedUser?._id === user._id ? '#1A1A1E' : 'transparent',
                    marginBottom: '4px',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedUser?._id !== user._id) {
                      e.currentTarget.style.background = '#1A1A1E'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedUser?._id !== user._id) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #EC4899 0%, #F97316 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      position: 'relative'
                    }}
                  >
                    <span style={{
                      color: '#FFF',
                      fontFamily: '"Inter Display", sans-serif',
                      fontSize: '14px',
                      fontWeight: 600
                    }}>
                      {getInitials(user.name)}
                    </span>
                    {/* Online indicator */}
                    {user.isOnline && (
                      <div style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#4ADE80',
                        border: '2px solid #131316'
                      }} />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px', width: '100%' }}>
                      <span style={{
                        color: '#FFF',
                        fontFamily: '"Inter Display", sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '20px'
                      }}>{user.name}</span>
                      {user.timestamp && (
                        <span style={{
                          color: '#70707B',
                          fontFamily: '"Inter Display", sans-serif',
                          fontSize: '12px',
                          fontWeight: 400,
                          lineHeight: '18px'
                        }}>{formatTimestamp(user.timestamp)}</span>
                      )}
                    </div>
                    <span style={{
                      color: '#70707B',
                      fontFamily: '"Inter Display", sans-serif',
                      fontSize: '12px',
                      fontWeight: 400,
                      lineHeight: '18px',
                      marginBottom: '4px',
                      display: 'block'
                    }}>{user.email}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <span style={{
                        flex: 1,
                        overflow: 'hidden',
                        color: '#A0A0AB',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontFamily: '"Inter Display", sans-serif',
                        fontSize: '13px',
                        fontWeight: 400,
                        lineHeight: '20px'
                      }}>{user.lastMessage || 'No messages yet'}</span>
                      {user.unreadCount && user.unreadCount > 0 && (
                        <span style={{
                          display: 'flex',
                          padding: '2px 6px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: '10px',
                          background: '#875BF7',
                          color: '#FFF',
                          fontFamily: '"Inter Display", sans-serif',
                          fontSize: '11px',
                          fontWeight: 600,
                          lineHeight: '16px',
                          flexShrink: 0
                        }}>{user.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Chat Area */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              background: '#131315'
            }}
          >
            {/* Chat Header */}
            <div
              style={{
                display: 'flex',
                height: '76px',
                padding: '16px 20px',
                alignItems: 'center',
                gap: '16px',
                alignSelf: 'stretch',
                justifyContent: 'space-between',
                borderBottom: '0.5px solid #26272B',
                background: '#131316'
              }}
            >
              {selectedUser ? (
                <>
                  <div  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Avatar */}
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <span style={{
                        color: '#FFF',
                        fontFamily: '"Inter Display", sans-serif',
                        fontSize: '14px',
                        fontWeight: 600
                      }}>{getInitials(selectedUser.name)}</span>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          color: '#FFF',
                          fontFamily: '"Inter Display", sans-serif',
                          fontSize: '16px',
                          fontWeight: 500,
                          lineHeight: '24px',
                          display: 'block'
                        }}>{selectedUser.email}</span>
                       
                      </div>
                      <span style={{
                        color: '#70707B',
                        fontFamily: '"Inter Display", sans-serif',
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '20px'
                      }}>{selectedUser.name}</span>
                    </div>
                  </div>

                  <button
                    style={{
                      display: 'flex',
                      padding: '8px 12px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '4px',
                      borderRadius: '10px',
                      border: '0.5px solid #26272B',
                      background: '#1A1A1E',
                      cursor: 'pointer'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4.5 5.33203C4.5 3.39903 6.067 1.83203 8 1.83203C9.933 1.83203 11.5 3.39903 11.5 5.33203C11.5 7.26503 9.933 8.83203 8 8.83203C6.067 8.83203 4.5 7.26503 4.5 5.33203Z" fill="#A48AFB"/>
                      <path d="M2.83301 13.6667C2.83301 10.8132 5.1462 8.5 7.99967 8.5C10.8531 8.5 13.1663 10.8132 13.1663 13.6667C13.1663 13.9428 12.9425 14.1667 12.6663 14.1667H3.33301C3.05687 14.1667 2.83301 13.9428 2.83301 13.6667Z" fill="#A48AFB"/>
                    </svg>
                    <span style={{
                      color: '#A48AFB',
                      fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                      fontFamily: '"Inter Display", sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      lineHeight: '20px'
                    }}>View Profile</span>
                  </button>
                </>
              ) : (
                <span style={{
                  color: '#70707B',
                  fontFamily: '"Inter Display", sans-serif',
                  fontSize: '14px',
                  fontWeight: 400
                }}>Select a user to start messaging</span>
              )}
            </div>

            {/* Messages Area */}
            <div
              className="hide-scrollbar"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              {!selectedUser ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  gap: '12px'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" stroke="#70707B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 24H32" stroke="#70707B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24 16V32" stroke="#70707B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{
                    color: '#70707B',
                    fontFamily: '"Inter Display", sans-serif',
                    fontSize: '16px',
                    fontWeight: 500,
                    textAlign: 'center'
                  }}>Select a user to start messaging</span>
                </div>
              ) : messages.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  gap: '12px'
                }}>
                  <span style={{
                    color: '#70707B',
                    fontFamily: '"Inter Display", sans-serif',
                    fontSize: '16px',
                    fontWeight: 500,
                    textAlign: 'center'
                  }}>No messages yet. Start a conversation!</span>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
                        flexDirection: 'column',
                        alignItems: msg.isOwn ? 'flex-end' : 'flex-start',
                        gap: '4px'
                      }}
                    >
                      <span style={{
                        color: '#70707B',
                        fontFamily: '"Inter Display", sans-serif',
                        fontSize: '12px',
                        fontWeight: 400,
                        lineHeight: '18px'
                      }}>{formatTimestamp(msg.timestamp)}</span>
                      
                      {msg.attachment ? (
                        <div
                          style={{
                            display: 'flex',
                            padding: '12px',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '8px',
                            maxWidth: '400px',
                            borderRadius: msg.isOwn ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                            border: msg.isOwn ? '0.5px solid #5720B7' : '1px solid #26272B',
                            background: msg.isOwn ? '#2E125E' : '#1A1A1E'
                          }}
                        >
                          {msg.attachment.fileType === 'image' && (
                            <img 
                              src={msg.attachment.url} 
                              alt={msg.attachment.fileName}
                              style={{
                                maxWidth: '100%',
                                maxHeight: '300px',
                                borderRadius: '8px',
                                objectFit: 'cover'
                              }}
                            />
                          )}
                          {msg.attachment.fileType === 'video' && (
                            <video 
                              controls
                              style={{
                                maxWidth: '100%',
                                maxHeight: '300px',
                                borderRadius: '8px'
                              }}
                            >
                              <source src={msg.attachment.url} type={msg.attachment.mimeType} />
                            </video>
                          )}
                          {msg.attachment.fileType === 'audio' && (
                            <audio 
                              controls
                              style={{ width: '100%' }}
                            >
                              <source src={msg.attachment.url} type={msg.attachment.mimeType} />
                            </audio>
                          )}
                          {msg.attachment.fileType === 'document' && (
                            <a
                              href={msg.attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px',
                                borderRadius: '8px',
                                background: '#3A3A3F',
                                textDecoration: 'none',
                                width: '100%'
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#A48AFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14 2V8H20" stroke="#A48AFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <span style={{
                                  color: '#FFF',
                                  fontFamily: '"Inter Display", sans-serif',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  display: 'block',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>{msg.attachment.fileName}</span>
                                <span style={{
                                  color: '#70707B',
                                  fontFamily: '"Inter Display", sans-serif',
                                  fontSize: '12px',
                                  fontWeight: 400
                                }}>{(msg.attachment.size / 1024 / 1024).toFixed(2)} MB</span>
                              </div>
                            </a>
                          )}
                          {msg.content && (
                            <span style={{
                              color: '#FFF',
                              fontFamily: '"Inter Display", sans-serif',
                              fontSize: '14px',
                              fontWeight: 400,
                              lineHeight: '20px',
                              wordBreak: 'break-word'
                            }}>{msg.content}</span>
                          )}
                        </div>
                      ) : msg.linkPreview && msg.linkPreview.url ? (
                        <div
                          style={{
                            display: 'flex',
                            padding: '12px',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '6px',
                            maxWidth: '320px',
                            borderRadius: msg.isOwn ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                            border: msg.isOwn ? '0.5px solid #6927DA' : '1px solid #26272B',
                            background: msg.isOwn ? '#2E125E' : '#1A1A1E'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            padding: '8px 12px 8px 8px',
                            alignItems: 'flex-start',
                            gap: '6px',
                            width: '100%'
                          }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path fillRule="evenodd" clipRule="evenodd" d="M8.68175 2.94956C9.89821 1.68348 11.882 1.68348 13.0985 2.94955C14.3006 4.20063 14.3006 6.21843 13.0985 7.46953L10.9389 9.71713C10.7506 9.91307 10.5427 10.0797 10.3209 10.2161C9.11968 10.9544 7.54668 10.7834 6.52215 9.71713C6.35851 9.5468 6.21701 9.362 6.09779 9.16673C5.9059 8.85253 6.00509 8.4422 6.31933 8.25033C6.63357 8.05847 7.04388 8.15767 7.23575 8.47187C7.72741 9.27707 8.79948 9.5862 9.62275 9.08013C9.74808 9.00313 9.86748 8.9078 9.97748 8.79333L12.1371 6.54571C12.8433 5.81069 12.8433 4.60837 12.1371 3.87335C11.4452 3.15333 10.335 3.15333 9.64321 3.87335L9.16748 4.36842C8.91241 4.63391 8.49035 4.64235 8.22488 4.38725C7.95941 4.13215 7.95095 3.71012 8.20608 3.44462L8.68175 2.94956Z" fill="white"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M5.06119 6.28159C6.2777 5.01551 8.26153 5.01551 9.478 6.28159C9.6416 6.45185 9.78307 6.63661 9.90227 6.83177C10.0942 7.14603 9.995 7.5563 9.6808 7.74823C9.3666 7.9401 8.95627 7.84097 8.7644 7.5267C8.6948 7.41277 8.6122 7.30497 8.5166 7.20537C7.82473 6.48536 6.71447 6.48536 6.02263 7.20537L3.86302 9.45297C3.15677 10.188 3.15677 11.3903 3.86302 12.1254C4.55486 12.8454 5.66512 12.8454 6.35696 12.1254L6.8328 11.6301C7.08793 11.3646 7.50993 11.3562 7.77547 11.6113C8.04093 11.8664 8.04933 12.2884 7.79427 12.5539L7.3184 13.0492C6.10189 14.3152 4.11809 14.3152 2.90158 13.0492C1.69947 11.798 1.69947 9.7803 2.90158 8.52917L5.06119 6.28159Z" fill="white"/>
                            </svg>
                            <div style={{ flex: 1 }}>
                              <span style={{
                                color: '#FFF',
                                fontFamily: '"Inter Display", sans-serif',
                                fontSize: '14px',
                                fontWeight: 500,
                                lineHeight: '20px',
                                display: 'block'
                              }}>{msg.linkPreview.title}</span>
                              <span style={{
                                color: '#D1D1D6',
                                fontFamily: '"Inter Display", sans-serif',
                                fontSize: '12px',
                                fontWeight: 400,
                                lineHeight: '18px',
                                display: 'block'
                              }}>{msg.linkPreview.description}</span>
                            </div>
                          </div>
                          <span style={{
                            color: '#FFF',
                            fontFamily: '"Inter Display", sans-serif',
                            fontSize: '14px',
                            fontWeight: 400,
                            lineHeight: '20px',
                            textDecoration: 'underline'
                          }}>{msg.linkPreview.url}</span>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            padding: '8px 12px',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '6px',
                            maxWidth: '320px',
                            borderRadius: msg.isOwn ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                            border: msg.isOwn ? '0.5px solid #5720B7' : '1px solid #26272B',
                            background: msg.isOwn ? '#2E125E' : '#1A1A1E'
                          }}
                        >
                          <span style={{
                            color: '#FFF',
                            fontFamily: '"Inter Display", sans-serif',
                            fontSize: '16px',
                            fontWeight: 400,
                            lineHeight: '24px',
                            wordBreak: 'break-word'
                          }}>{msg.content}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '8px' }}>
                      <div
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1px solid #26272B',
                          background: '#1A1A1E',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#875BF7',
                          animation: 'pulse 1.4s infinite ease-in-out'
                        }} />
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#875BF7',
                          animation: 'pulse 1.4s infinite ease-in-out 0.2s'
                        }} />
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#875BF7',
                          animation: 'pulse 1.4s infinite ease-in-out 0.4s'
                        }} />
                      </div>
                    </div>
                  )}
                </>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div
              style={{
                display: 'flex',
                maxHeight: '194px',
                padding: '16px',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                gap: '12px',
                alignSelf: 'stretch',
                
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '0.5px solid #26272B',
                  background: '#1A1A1E',
                  width: '100%'
                }}
              >
                {/* File Preview */}
                {selectedFile && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    borderRadius: '8px',
                    background: '#26272B',
                    position: 'relative'
                  }}>
                    {filePreview ? (
                      <img src={filePreview} alt="Preview" style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '4px',
                        objectFit: 'cover'
                      }} />
                    ) : (
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '4px',
                        background: '#3A3A3F',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#A48AFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2V8H20" stroke="#A48AFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{
                        color: '#FFF',
                        fontFamily: '"Inter Display", sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>{selectedFile.name}</span>
                      <span style={{
                        color: '#70707B',
                        fontFamily: '"Inter Display", sans-serif',
                        fontSize: '12px',
                        fontWeight: 400
                      }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12 4L4 12M4 4L12 12" stroke="#70707B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}
                
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={!selectedUser || isUploading}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: selectedUser ? '#FFF' : '#70707B',
                    fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                    fontFamily: '"Inter Display", sans-serif',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '24px'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      disabled={!selectedUser || isUploading}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={!selectedUser || isUploading}
                      style={{
                        display: 'flex',
                        padding: '6px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: 'none',
                        background: 'transparent',
                        cursor: (!selectedUser || isUploading) ? 'not-allowed' : 'pointer',
                        opacity: (!selectedUser || isUploading) ? 0.5 : 1
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M7.18015 3.14999C5.57203 3.14999 4.26839 4.45956 4.26839 6.07499V10.0969C4.26839 12.7219 6.3868 14.85 9 14.85C11.6132 14.85 13.7316 12.7219 13.7316 10.0969V9C13.7316 8.5962 14.0575 8.26875 14.4595 8.26875C14.8616 8.26875 15.1875 8.5962 15.1875 9V10.0969C15.1875 13.5297 12.4172 16.3125 9 16.3125C5.58274 16.3125 2.8125 13.5297 2.8125 10.0969V6.07499C2.8125 3.65185 4.76796 1.6875 7.18015 1.6875C9.59235 1.6875 11.5478 3.65185 11.5478 6.07499V10.0969C11.5478 11.5103 10.4071 12.6562 9 12.6562C7.59293 12.6562 6.4522 11.5103 6.4522 10.0969V7.17186C6.4522 6.768 6.77812 6.44061 7.18015 6.44061C7.5822 6.44061 7.90807 6.768 7.90807 7.17186V10.0969C7.90807 10.7027 8.39692 11.1938 9 11.1938C9.60308 11.1938 10.0919 10.7027 10.0919 10.0969V6.07499C10.0919 4.45956 8.78828 3.14999 7.18015 3.14999Z" fill="white"/>
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={(!selectedUser || (!messageInput.trim() && !selectedFile)) || isUploading}
                    style={{
                      display: 'flex',
                      padding: '6px',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '8px',
                      border: 'none',
                      background: ((!selectedUser || (!messageInput.trim() && !selectedFile)) || isUploading) ? '#3A3A3F' : '#51525C',
                      cursor: ((!selectedUser || (!messageInput.trim() && !selectedFile)) || isUploading) ? 'not-allowed' : 'pointer',
                      opacity: ((!selectedUser || (!messageInput.trim() && !selectedFile)) || isUploading) ? 0.5 : 1
                    }}
                  >
                    {isUploading ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" fill="none" strokeDasharray="60" strokeDashoffset="15" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M16.198 1.90693C15.8474 1.52939 15.2978 1.38797 14.7726 1.33736C14.2208 1.28417 13.56 1.31954 12.8485 1.41287C11.4216 1.60003 9.69765 2.03327 8.04165 2.56632C6.38461 3.09971 4.76936 3.74149 3.5597 4.35635C2.95767 4.66236 2.43551 4.97199 2.05591 5.2694C1.8669 5.41748 1.69442 5.577 1.56468 5.74678C1.44093 5.90872 1.31073 6.13912 1.31252 6.41687C1.31722 7.14593 1.81372 7.66118 2.34246 8.007C2.88213 8.36003 3.58499 8.62605 4.28371 8.8344C4.98993 9.045 5.7326 9.2082 6.37105 9.3405C6.41289 9.34913 6.49653 9.36645 6.59901 9.3876C6.98493 9.46733 7.17789 9.50723 7.35928 9.45293C7.54065 9.39863 7.68015 9.2592 7.959 8.98028L10.7197 6.21967C11.0126 5.92678 11.4875 5.92678 11.7803 6.21967C12.0732 6.51257 12.0732 6.98744 11.7803 7.28033L9.20588 9.85478C8.92155 10.1391 8.77943 10.2812 8.72565 10.4657C8.6718 10.6502 8.71523 10.8461 8.802 11.2378C9.1383 12.7563 9.43035 14.0111 9.72173 14.8553C9.8919 15.3484 10.0834 15.7752 10.3259 16.09C10.5789 16.4185 10.9232 16.6667 11.3762 16.6867C11.6583 16.6991 11.8928 16.5704 12.0536 16.4508C12.2231 16.325 12.3825 16.1561 12.5303 15.9715C12.8273 15.6004 13.1394 15.0869 13.4499 14.4935C14.0739 13.301 14.7347 11.7021 15.2938 10.0572C15.8526 8.41298 16.3183 6.69795 16.5426 5.27258C16.6545 4.56173 16.7099 3.90155 16.6791 3.34858C16.6499 2.82417 16.5382 2.2733 16.198 1.90693Z" fill="white"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <ProjectModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          projectName={projectName}
          setProjectName={setProjectName}
          onCreateProject={() => {}}
        />
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  )
}
