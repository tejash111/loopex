'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface UploadJDModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function UploadJDModal({ isOpen, onClose }: UploadJDModalProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    }
  }, [isOpen])

  if (!isOpen && !isAnimating) return null

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onClose()
    }, 200) // Match animation duration
  }

  const handleSave = () => {
    // Handle save logic here
    console.log('Job Description:', jobDescription)
    handleClose()
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file')
      return
    }

    setIsLoading(true)
    try {
      // Using a PDF parsing library approach
      const text = await extractTextFromPDF(file)
      setJobDescription(text)
    } catch (error) {
      console.error('Error parsing PDF:', error)
      alert('Error parsing PDF file. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      // Dynamic import of pdfjs-dist
      const pdfjsLib = await import('pdfjs-dist')
      
      // Set up worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdfDoc = await loadingTask.promise

      let extractedText = ''

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
        extractedText += pageText + '\n'
      }

      return extractedText.trim()
    } catch (error) {
      console.error('PDF parsing error:', error)
      throw new Error('Failed to parse PDF')
    }
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs z-50 transition-opacity duration-200"
      style={{
        opacity: isAnimating ? 1 : 0
      }}
      onClick={handleClose}
    >
      <div 
        className="relative transition-all duration-200"
        style={{
          display: 'flex',
          width: '740px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          borderRadius: '16px',
          background: '#131316',
          padding: '24px',
          transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
          opacity: isAnimating ? 1 : 0
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        {/* Header with Icon */}
        <div className="flex items-start gap-4 w-full mb-[16px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <path d="M11.3164 2.83887C19.8344 2.22169 28.3863 2.22795 36.9033 2.8584H36.9043C41.2923 3.18014 44.7971 6.69878 45.1611 11.0723V11.0732C45.4404 15.2429 45.6006 19.572 45.6006 24C45.6006 26.0537 45.5602 28.1873 45.4805 30.2607V30.2871C45.4207 32.5581 45.3009 34.7509 45.1611 36.9277C45.0475 38.4694 44.5019 39.9069 43.7227 41.125C42.729 42.6331 41.2838 43.8124 39.6035 44.5176L39.2715 44.6494C38.5348 44.9139 37.74 45.0848 36.9062 45.1416H36.9053C34.3706 45.3212 31.8169 45.4603 29.2646 45.54C23.1997 45.7208 17.1294 45.588 11.0781 45.1416H11.0791C8.95369 44.9775 6.95663 44.0591 5.44922 42.5518C4.03594 41.1385 3.14004 39.2947 2.89844 37.3184L2.85938 36.9219C2.54052 32.7568 2.40039 28.4297 2.40039 24C2.40039 19.6506 2.53987 15.4027 2.83887 11.3164V11.3154C3.16133 6.763 6.74467 3.16136 11.3154 2.83887H11.3164Z" fill="url(#paint0_linear_3180_12495)" stroke="url(#paint1_linear_3180_12495)"/>
  <path d="M19.174 38.5282C16.78 38.5282 14.528 37.5942 12.834 35.9022C11.14 34.2102 10.208 31.9562 10.208 29.5622C10.2155 27.1852 11.1589 24.9067 12.834 23.2202L24.658 11.3962C27.072 8.98221 31.282 8.98021 33.698 11.3962C34.906 12.6042 35.57 14.2102 35.57 15.9162C35.57 17.6222 34.904 19.2302 33.698 20.4382L21.862 32.2622C20.432 33.6942 17.894 33.6922 16.462 32.2622C16.1065 31.9088 15.8246 31.4883 15.6327 31.0252C15.4408 30.5621 15.3427 30.0655 15.344 29.5642C15.344 28.5582 15.752 27.5742 16.462 26.8642L27.386 15.9522C27.622 15.7336 27.9335 15.6149 28.2552 15.621C28.5768 15.6271 28.8836 15.7577 29.1111 15.9851C29.3386 16.2126 29.4691 16.5194 29.4752 16.841C29.4813 17.1627 29.3626 17.4742 29.144 17.7102L18.22 28.6202C17.9721 28.871 17.833 29.2095 17.833 29.5622C17.833 29.9149 17.9721 30.2534 18.22 30.5042C18.716 31.0002 19.604 31.0042 20.104 30.5042L31.94 18.6782C32.678 17.9422 33.084 16.9602 33.084 15.9162C33.084 14.8722 32.678 13.8922 31.94 13.1542C30.462 11.6782 27.89 11.6802 26.416 13.1542L14.592 24.9782C13.3809 26.197 12.699 27.844 12.694 29.5622C12.694 31.2922 13.368 32.9202 14.592 34.1442C15.1925 34.7476 15.9066 35.226 16.693 35.5518C17.4795 35.8776 18.3227 36.0443 19.174 36.0422C20.88 36.0422 22.55 35.3502 23.758 34.1442L35.582 22.3202C35.6974 22.2048 35.8345 22.1132 35.9853 22.0507C36.1361 21.9883 36.2978 21.9561 36.461 21.9561C36.6243 21.9561 36.7859 21.9883 36.9367 22.0507C37.0875 22.1132 37.2246 22.2048 37.34 22.3202C37.4554 22.4356 37.547 22.5727 37.6095 22.7235C37.6719 22.8743 37.7041 23.036 37.7041 23.1992C37.7041 23.3625 37.6719 23.5241 37.6095 23.6749C37.547 23.8257 37.4554 23.9628 37.34 24.0782L25.516 35.9022C23.8305 37.5788 21.5514 38.5225 19.174 38.5282Z" fill="white"/>
  <defs>
    <linearGradient id="paint0_linear_3180_12495" x1="-0.885609" y1="-0.881885" x2="47.9824" y2="47.9861" gradientUnits="userSpaceOnUse">
      <stop stop-color="#7839EE"/>
      <stop offset="0.422" stop-color="#875BF7"/>
    </linearGradient>
    <linearGradient id="paint1_linear_3180_12495" x1="24.0004" y1="1.88086" x2="24.0004" y2="46.1184" gradientUnits="userSpaceOnUse">
      <stop stop-color="white" stop-opacity="0.12"/>
      <stop offset="1" stop-color="white" stop-opacity="0"/>
    </linearGradient>
  </defs>
</svg>

          {/* Close button */}
          <button 
            onClick={handleClose}
            style={{
              display: 'flex',
              padding: 'var(--spacing-sm, 6px)',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              right: '10px',
              top: '10px',
              borderRadius: 'var(--radius-md, 8px)',
              border: '0.5px solid var(--Border-Secondary, #26272B)',
              background: 'var(--Surface-Secondary, #1A1A1E)',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#26272B'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--Surface-Secondary, #1A1A1E)'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13.5 4.5L4.50061 13.4994M13.4994 13.5L4.5 4.50064" stroke="#A48AFB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Title and Description */}
        <div className="w-full mb-[20px]">
          <h2 
            className="text-[20px] font-medium text-white mb-1"
            style={{ fontFamily: 'var(--font-body)', lineHeight: '28px' }}
          >
            Paste job description
          </h2>
          <p 
            className="text-[14px]"
            style={{ color: '#70707B', lineHeight: '20px' }}
          >
            Describe the role so we can help match the right talent.
          </p>
        </div>

        {/* Textarea */}
        <textarea
          placeholder={isLoading ? "Parsing PDF..." : "Start typing or paste your JD - we'll handle the formatting"}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isLoading}
          className="w-full rounded-xl p-[16px] text-[14px] focus:outline-none placeholder:text-[#70707B] disabled:opacity-50"
          style={{
            minHeight: '176px',
            maxHeight: '250px',
            backgroundColor: '#1a1a1e',
            color: '#d1d1d6',
            border: '1px solid #26272B',
            fontFamily: 'var(--font-body)',
            cursor: isLoading ? 'not-allowed' : 'text'
          }}
        />

        <div style={{
          width: 'calc(100% + 48px)',
          height: '0.5px',
          background: 'var(--Border-Secondary, #26272B)',
          margin: 'var(--spacing-md, 20px) calc(-24px) var(--spacing-md, 20px) calc(-24px)'
        }}/>

        {/* Action Buttons */}
        <div className="flex items-center justify-between w-full mb-[">
          <button
            onClick={handleFileUpload}
            className='bg-[#26272b]'
            style={{
              display: 'flex',
              padding: '10px 14px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'var(--spacing-xs, 4px)',
              borderRadius: 'var(--radius-lg, 12px)',
              border: '0.5px solid var(--Border-Secondary, #26272B)',
              background: '#26272b',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#2e2f34'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#26272b'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M6.38235 2.79999C4.95291 2.79999 3.79412 3.96405 3.79412 5.39999V8.975C3.79412 11.3084 5.67715 13.2 8 13.2C10.3229 13.2 12.2059 11.3084 12.2059 8.975V8C12.2059 7.64107 12.4956 7.35 12.8529 7.35C13.2103 7.35 13.5 7.64107 13.5 8V8.975C13.5 12.0264 11.0375 14.5 8 14.5C4.96243 14.5 2.5 12.0264 2.5 8.975V5.39999C2.5 3.24609 4.23819 1.5 6.38235 1.5C8.52653 1.5 10.2647 3.24609 10.2647 5.39999V8.975C10.2647 10.2314 9.25073 11.25 8 11.25C6.74927 11.25 5.73529 10.2314 5.73529 8.975V6.37499C5.73529 6.016 6.02499 5.72499 6.38235 5.72499C6.73973 5.72499 7.0294 6.016 7.0294 6.37499V8.975C7.0294 9.51347 7.46393 9.95 8 9.95C8.53607 9.95 8.9706 9.51347 8.9706 8.975V5.39999C8.9706 3.96405 7.8118 2.79999 6.38235 2.79999Z" fill="white"/>
            </svg>
            <span style={{
              color: 'var(--Text-Primary, #FFF)',
              fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
              fontFamily: "var(--font-body, 'Inter Display')",
              fontSize: 'var(--Font-size-text-sm, 14px)',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: 'var(--Line-height-text-sm, 20px)'
            }}>
              Upload job description
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              style={{
                display: 'flex',
                padding: '10px 14px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 'var(--spacing-xs, 4px)',
                borderRadius: 'var(--radius-xl, 12px)',
                border: '0.5px solid var(--Border-Secondary, #26272B)',
                background: 'var(--Surface-Secondary, #1A1A1E)',
                color: 'var(--Text-Brand-primary, #A48AFB)',
                fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                fontFamily: "var(--font-body, 'Inter Display')",
                fontSize: 'var(--Font-size-text-sm, 14px)',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: 'var(--Line-height-text-sm, 20px)',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#26272B'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--Surface-Secondary, #1A1A1E)'}
            >
              Cancel
            </button>
            <Button
              onClick={handleSave}
              disabled={!jobDescription.trim()}
              style={{
                display: 'flex',
                padding: '10px 14px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 'var(--spacing-xs, 4px)',
                borderRadius: 'var(--radius-xl, 12px)',
                background: !jobDescription.trim() ? 'var(--Surface-Disabled, #51525C)' : 'var(--Surface-Brand-Primary, #875BF7)',
                border: 'none',
                color: 'var(--Text-Primary, #FFF)',
                fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                fontFamily: "var(--font-body, 'Inter Display')",
                fontSize: 'var(--Font-size-text-sm, 14px)',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: 'var(--Line-height-text-sm, 20px)',
                cursor: !jobDescription.trim() ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                opacity: !jobDescription.trim() ? 0.5 : 1
              }}
            >
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
