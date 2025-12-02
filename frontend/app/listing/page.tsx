'use client'

import Sidebar from '@/components/dashboard/Sidebar'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

const socialIcons = [
  {
    name: "whatsapp",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 5.8C1 4.11984 1 3.27976 1.32698 2.63803C1.6146 2.07354 2.07354 1.6146 2.63803 1.32698C3.27976 1 4.11984 1 5.8 1H10.2C11.8802 1 12.7202 1 13.362 1.32698C13.9265 1.6146 14.3854 2.07354 14.673 2.63803C15 3.27976 15 4.11984 15 5.8V10.2C15 11.8802 15 12.7202 14.673 13.362C14.3854 13.9265 13.9265 14.3854 13.362 14.673C12.7202 15 11.8802 15 10.2 15H5.8C4.11984 15 3.27976 15 2.63803 14.673C2.07354 14.3854 1.6146 13.9265 1.32698 13.362C1 12.7202 1 11.8802 1 10.2V5.8Z" fill="url(#paint0_linear_3458_2975)"/>
      <path d="M8 11.5C10.4853 11.5 12.5 9.82107 12.5 7.75C12.5 5.67893 10.4853 4 8 4C5.51472 4 3.5 5.67893 3.5 7.75C3.5 9.06275 4.30944 10.2179 5.5351 10.8879C5.49407 11.2213 5.37074 11.6663 5 12C5.70106 11.8738 6.26057 11.6202 6.67853 11.3357C7.09639 11.4425 7.54014 11.5 8 11.5Z" fill="white"/>
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
  const [showModal, setShowModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [userProjects, setUserProjects] = useState<string[]>([])

  


  const candidatesData = [
    {
      id: 1,
      name: 'Srijan Reddy',
      position: 'Product Designer at Swiggy',
      education: 'Design, Delft University of Technology',
      location: 'Hyderabad, Telangana, India',
      description: 'Srijan is currently working as a UX/Product Designer contributing to end-to-end design for web and mobile products. Skilled in creating, Polished UI, User flows, Wireframes with a strong foundation in usability and accessibility.',
      highlights: ['UX/Product Designer', 'Polished UI', 'User flows', 'Wireframes'],
      availability: 'Immediately',
      salary: '10 - 15 LPA'
    },
    {
      id: 2,
      name: 'Ananya Sharma',
      position: 'Senior UX Designer at Flipkart',
      education: 'HCI, IIT Bombay',
      location: 'Bangalore, Karnataka, India',
      description: 'Ananya is currently working as a Senior UX Designer leading design systems and user research initiatives. Expert in Design Systems, Prototyping, User Research with extensive experience in e-commerce platforms.',
      highlights: ['Senior UX Designer', 'Design Systems', 'Prototyping', 'User Research'],
      availability: 'Immediately',
      salary: '15 - 20 LPA'
    },
    {
      id: 3,
      name: 'Rahul Verma',
      position: 'UI/UX Designer at Razorpay',
      education: 'Design, NID Ahmedabad',
      location: 'Mumbai, Maharashtra, India',
      description: 'Rahul is currently working as a UI/UX Designer specializing in fintech products and payment interfaces. Proficient in Visual Design, Interaction Design, Micro-interactions with a keen eye for detail and pixel-perfect execution.',
      highlights: ['UI/UX Designer', 'Visual Design', 'Interaction Design', 'Micro-interactions'],
      availability: '2 weeks notice',
      salary: '12 - 18 LPA'
    },
    {
      id: 4,
      name: 'Priya Nair',
      position: 'Product Designer at Zomato',
      education: 'Design, Srishti Institute',
      location: 'Pune, Maharashtra, India',
      description: 'Priya is currently working as a Product Designer focusing on mobile-first experiences and design strategy. Specialized in Mobile Design, Design Strategy, A/B Testing with proven track record of improving user engagement.',
      highlights: ['Product Designer', 'Mobile Design', 'Design Strategy', 'A/B Testing'],
      availability: 'Immediately',
      salary: '10 - 15 LPA'
    },
    {
      id: 5,
      name: 'Arjun Mehta',
      position: 'Lead Designer at PhonePe',
      education: 'Design, NIFT Delhi',
      location: 'Bangalore, Karnataka, India',
      description: 'Arjun is currently working as a Lead Designer managing cross-functional teams and driving design excellence. Expert in Design Leadership, Product Thinking, Design Ops with experience scaling design teams and processes.',
      highlights: ['Lead Designer', 'Design Leadership', 'Product Thinking', 'Design Ops'],
      availability: '1 month notice',
      salary: '18 - 25 LPA'
    }
  ]

  return (
    <div className="min-h-screen flex px-[16px] py-[12px] bg-[#131316]" style={{ backgroundColor: '#131316' }}>
      <div className=''>
      <Sidebar
        showModal={showModal}
        showFilterModal={showFilterModal}
        selectedProject={selectedProject}
        userProjects={userProjects}
        onNewProject={() => setShowModal(true)}
        onProjectSelect={setSelectedProject}
      />
      </div>

      <main className={`flex-1 relative overflow-hidden bg-[#161619] p-[16px] rounded-2xl transition-all duration-300 ${showModal || showFilterModal ? 'blur-[2px]' : ''}`}>
              <div className='p-[6px]'>
                {/* Header Section */}
                <div 
                  className='flex items-center justify-between px-[20px] py-[14px] rounded-xl mb-[24px]'
                  style={{
                    background: '#1C1C1F'
                  }}
                >
                  <div>

               
                  {/* Left side */}
                  <div className='flex items-center gap-[12px]'>
                    {/* Dropdown */}
                    <button 
                      className='flex items-center gap-[6px] px-[10px] py-[5px] rounded-md'
                      style={{
                        background: '#2A2A2E',
                        border: 'none',
                        color: '#FFF',
                        cursor: 'pointer'
                      }}
                    >
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M4.13187 1.31252C4.73236 1.31226 5.1475 1.31207 5.52018 1.45182C6.33422 1.75707 6.69139 2.47992 6.96678 3.03709C7.04921 3.20201 7.19918 3.50162 7.24113 3.5675C7.25396 3.58903 7.29456 3.63314 7.35406 3.63731C7.43176 3.64534 7.53699 3.64588 7.72138 3.64588H9.79478C10.3892 3.64587 10.8685 3.64587 11.2531 3.68499C11.6501 3.72538 11.9944 3.81104 12.299 4.01454C12.5379 4.17414 12.7429 4.37922 12.9025 4.61807C13.106 4.92263 13.1917 5.26692 13.2321 5.66391C13.2712 6.04851 13.2712 6.57614 13.2712 7.17055C13.2712 8.17371 13.2712 8.96016 13.2075 9.58631C13.1425 10.2249 13.0077 10.7452 12.7059 11.1968C12.4611 11.5631 12.1467 11.8775 11.7805 12.1223C11.3288 12.4241 10.8085 12.5589 10.1699 12.6238C9.54378 12.6875 8.75733 12.6875 7.75417 12.6875H6.96684C5.62029 12.6875 4.56502 12.6875 3.74166 12.5769C2.89889 12.4635 2.23388 12.2271 1.71191 11.7052C1.18993 11.1832 0.953487 10.5181 0.84018 9.67539C0.729481 8.85201 0.729487 7.79676 0.729492 6.4502V4.61393C0.729487 4.10133 0.729481 3.68791 0.758916 3.35404C0.789237 3.01002 0.853381 2.70898 1.00681 2.43405C1.20449 2.07983 1.49677 1.78754 1.851 1.58986C2.12592 1.43643 2.42697 1.3723 2.77098 1.34197C3.10486 1.31254 3.61927 1.31252 4.13187 1.31252Z" fill="#70707B"/>
</svg>
                      <span style={{
                        fontFamily: "Inter",
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#E5E7EB'
                      }}>
                        UX intern
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                  
                  </div>

                  {/* Right side */}
                  <div className='flex items-center gap-[10px] justify-between'>
                    {/* Candidate count */}
                    <div 
                      className='flex items-center gap-[6px] px-[10px] py-[5px] mt-[6px] rounded-md'
                      style={{
                        background: '#1F2937',
                        border: 'none'
                      }}
                    >

                    <h1 style={{
                      fontFamily: "Inter",
                      fontSize: '16px',
                      fontWeight: 500,
                      lineHeight: '24px',
                      margin: 0
                    }}>
                      UX Designer in London with 2+ years experience at top consulting firms
                    </h1>
                    <button 
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M11.3333 2.00004C11.5084 1.82494 11.7163 1.68605 11.9451 1.59129C12.1739 1.49653 12.419 1.44775 12.6667 1.44775C12.9143 1.44775 13.1594 1.49653 13.3882 1.59129C13.617 1.68605 13.8249 1.82494 14 2.00004C14.1751 2.17513 14.314 2.383 14.4088 2.61178C14.5036 2.84055 14.5523 3.08564 14.5523 3.33337C14.5523 3.58111 14.5036 3.8262 14.4088 4.05497C14.314 4.28375 14.1751 4.49162 14 4.66671L5 13.6667L1.33333 14.6667L2.33333 11L11.3333 2.00004Z" stroke="#6B7280" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                      <span style={{
                        fontFamily: "Inter",
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#FFFFFF'
                      }}>
                        12,000
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M11.6667 12.25V11.0833C11.6667 10.4645 11.4209 9.87104 10.983 9.43315C10.5451 8.99526 9.95163 8.74996 9.33333 8.74996H4.66667C4.04837 8.74996 3.45493 8.99526 3.01703 9.43315C2.57914 9.87104 2.33334 10.4645 2.33334 11.0833V12.25M9.33334 3.49996C9.33334 4.78263 8.28268 5.83329 7.00001 5.83329C5.71734 5.83329 4.66667 4.78263 4.66667 3.49996C4.66667 2.21729 5.71734 1.16663 7.00001 1.16663C8.28268 1.16663 9.33334 2.21729 9.33334 3.49996Z" stroke="#10B981" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    {/* Filter button */}
                    <button 
                      className='flex items-center gap-[6px] px-[10px] py-[5px] border-border rounded-md'
                      style={{
                        background: '#26272B',
                        border: 'none',
                        color: '#FFF',
                        cursor: 'pointer'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M12.25 1.75H1.75L5.83333 6.615V9.91667L8.16667 11.0833V6.615L12.25 1.75Z" stroke="#FFFFFF" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{
                        fontFamily: "Inter",
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#FFFFFF'
                      }}>
                        Filter
                      </span>
                    </button>
                  </div>
                     </div>
                </div>

                <div className='px-[18px]'>
                  {candidatesData.map((candidate) => (
                    <div
                      key={candidate.id}
                      style={{
                        display: 'flex',
                        minWidth: '560px',
                        padding: 'var(--spacing-3xl, 24px)',
                        flexDirection: 'column',
                        gap: 'var(--spacing-3xl, 24px)',
                        alignSelf: 'stretch',
                        borderRadius: 'var(--radius-3xl, 20px)',
                        border: '0.5px solid var(--Border-Secondary, #26272B)',
                        background: 'var(--Surface-Secondary, #1A1A1E)',
                        marginBottom: '16px'
                      }}
                    >
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
                          <Button 
                            className='px-[16px] py-[8px] rounded-lg'
                            style={{
                              background: '#8B5CF6',
                              color: '#FFF',
                              fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
                              fontSize: '14px',
                              fontWeight: 600,
                              border: 'none'
                            }}
                          >
                            Shortlist
                          </Button>
                          <button 
                            className='p-[8px] rounded-lg flex items-center justify-center'
                            style={{
                              background: 'transparent',
                              border: '1px solid #26272B'
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M17.5 5.83334H15.8333V4.16668C15.8333 3.50364 15.5699 2.86776 15.1011 2.39892C14.6323 1.93008 13.9964 1.66668 13.3333 1.66668H6.66667C6.00363 1.66668 5.36774 1.93008 4.8989 2.39892C4.43006 2.86776 4.16667 3.50364 4.16667 4.16668V5.83334H2.5C2.27899 5.83334 2.06702 5.92114 1.91074 6.07741C1.75446 6.23369 1.66667 6.44566 1.66667 6.66668C1.66667 6.88769 1.75446 7.09966 1.91074 7.25594C2.06702 7.41222 2.27899 7.50001 2.5 7.50001H3.33333V16.6667C3.33333 17.1087 3.50893 17.5326 3.82149 17.8452C4.13405 18.1577 4.55797 18.3333 5 18.3333H15C15.442 18.3333 15.8659 18.1577 16.1785 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V7.50001H17.5C17.721 7.50001 17.933 7.41222 18.0893 7.25594C18.2455 7.09966 18.3333 6.88769 18.3333 6.66668C18.3333 6.44566 18.2455 6.23369 18.0893 6.07741C17.933 5.92114 17.721 5.83334 17.5 5.83334ZM5.83333 4.16668C5.83333 3.94566 5.92113 3.73369 6.07741 3.57741C6.23369 3.42113 6.44565 3.33334 6.66667 3.33334H13.3333C13.5543 3.33334 13.7663 3.42113 13.9226 3.57741C14.0789 3.73369 14.1667 3.94566 14.1667 4.16668V5.83334H5.83333V4.16668ZM15 16.6667H5V7.50001H15V16.6667Z" fill="#9CA3AF"/>
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
                          <span style={{ color: '#8B5CF6' }}>🚀</span> {candidate.description.split(candidate.highlights[0])[0]}
                          <span style={{ 
                            color: '#FFF',
                            fontWeight: 600,
                            background: 'rgba(139, 92, 246, 0.1)',
                            padding: '2px 4px',
                            borderRadius: '4px'
                          }}>
                            {candidate.highlights[0]}
                          </span>
                          {candidate.description.split(candidate.highlights[0])[1].split(candidate.highlights[1])[0]}
                          <span style={{ 
                            color: '#FFF',
                            fontWeight: 600,
                            background: 'rgba(139, 92, 246, 0.1)',
                            padding: '2px 4px',
                            borderRadius: '4px'
                          }}>
                            {candidate.highlights[1]}
                          </span>
                          {candidate.highlights[2] && (
                            <>
                              {candidate.description.split(candidate.highlights[1])[1].split(candidate.highlights[2])[0]}
                              <span style={{ 
                                color: '#FFF',
                                fontWeight: 600,
                                background: 'rgba(139, 92, 246, 0.1)',
                                padding: '2px 4px',
                                borderRadius: '4px'
                              }}>
                                {candidate.highlights[2]}
                              </span>
                            </>
                          )}
                          {candidate.highlights[3] && (
                            <>
                              {candidate.description.split(candidate.highlights[2])[1].split(candidate.highlights[3])[0]}
                              <span style={{ 
                                color: '#FFF',
                                fontWeight: 600,
                                background: 'rgba(139, 92, 246, 0.1)',
                                padding: '2px 4px',
                                borderRadius: '4px'
                              }}>
                                {candidate.highlights[3]}
                              </span>
                              {candidate.description.split(candidate.highlights[3])[1]}
                            </>
                          )}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className='flex items-center gap-[8px] flex-wrap'>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#1E3A5F',
                          color: '#60A5FA',
                          fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
                          fontSize: '12px',
                          fontWeight: 500
                        }}>
                          {candidate.availability}
                        </span>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#1A1A1E',
                          border: '1px solid #26272B',
                          color: '#D1D5DB',
                          fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
                          fontSize: '12px',
                          fontWeight: 500
                        }}>
                          {candidate.salary}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
             
              
            </main>

    
    </div>
  )
}

export default Listing