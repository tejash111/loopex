'use client'

import { useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { detectCategories, getBorderColor } from '@/utils/inputDetector'

interface SearchBarProps {
  searchInput: string
  setSearchInput: (value: string) => void
  onFilterClick: () => void
  onUploadJDClick: () => void
  onSearch?: (query: string) => void
  filterCount?: number
}

export default function SearchBar({
  searchInput,
  setSearchInput,
  onFilterClick,
  onUploadJDClick,
  onSearch,
  filterCount = 0
}: SearchBarProps) {
  const handleSearch = () => {
    if (searchInput.trim() && onSearch) {
      onSearch(searchInput.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim() && onSearch) {
      onSearch(searchInput.trim())
    }
  }
  const detectedCategories = useMemo(() => detectCategories(searchInput), [searchInput])
  const borderColor = useMemo(() => getBorderColor(searchInput), [searchInput])

  return (
    <div 
      className="mx-auto w-full max-w-[640px] rounded-3xl bg-[#131316] border-x-[0.5px] border-b-[0.5px] transition-all duration-300"
      style={{
        boxShadow: searchInput.trim() ? '0 0 47px 0 rgba(135, 91, 247, 0.10)' : 'none'
      }}
    >
      <div 
        className="max-w-[640px] mx-auto p-4 bg-[#1A1A1E] rounded-2xl border-[0.5px] transition-colors duration-300"
      >
        <div className="mb-4">
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-none bg-transparent font-body text-[14px] text-white"
            placeholder="Ask loopx for UX Designer in Mumbai with 2+ years experience at top consulting firms"
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={onFilterClick}
            className="flex items-center justify-center gap-1.5 font-body"
            style={{
              padding: '6px 8px',
              borderRadius: '8px',
              border: '0.5px solid #3F3F46',
              background: '#26272B',
              color: '#FFFFFF',
              fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
              fontSize: '12px',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: '18px',
              position: 'relative'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M1.33301 4.66667C1.33301 4.29848 1.63149 4 1.99967 4H3.99967C4.36786 4 4.66634 4.29848 4.66634 4.66667C4.66634 5.03485 4.36786 5.33333 3.99967 5.33333H1.99967C1.63149 5.33333 1.33301 5.03485 1.33301 4.66667Z" fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M1.33301 11.3333C1.33301 10.9651 1.63149 10.6667 1.99967 10.6667H5.99967C6.36786 10.6667 6.66634 10.9651 6.66634 11.3333C6.66634 11.7015 6.36786 12 5.99967 12H1.99967C1.63149 12 1.33301 11.7015 1.33301 11.3333Z" fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M11.333 11.3333C11.333 10.9651 11.6315 10.6667 11.9997 10.6667H13.9997C14.3679 10.6667 14.6663 10.9651 14.6663 11.3333C14.6663 11.7015 14.3679 12 13.9997 12H11.9997C11.6315 12 11.333 11.7015 11.333 11.3333Z" fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M9.33301 4.66667C9.33301 4.29848 9.63147 4 9.99967 4H13.9997C14.3679 4 14.6663 4.29848 14.6663 4.66667C14.6663 5.03486 14.3679 5.33333 13.9997 5.33333H9.99967C9.63147 5.33333 9.33301 5.03485 9.33301 4.66667Z" fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M5.98317 2.16666H6.01683C6.31314 2.16665 6.5605 2.16665 6.7636 2.1805C6.975 2.19493 7.17467 2.22602 7.36827 2.30621C7.81747 2.49228 8.1744 2.84918 8.36047 3.2984C8.44067 3.492 8.47173 3.69168 8.48613 3.90308C8.5 4.10616 8.5 4.35351 8.5 4.64982V4.6835C8.5 4.9798 8.5 5.22716 8.48613 5.43024C8.47173 5.64164 8.44067 5.84132 8.36047 6.03491C8.1744 6.48413 7.81747 6.84106 7.36827 7.02712C7.17467 7.10732 6.975 7.13839 6.7636 7.15279C6.5605 7.16666 6.31315 7.16666 6.01684 7.16666H5.98316C5.68685 7.16666 5.4395 7.16666 5.23643 7.15279C5.02503 7.13839 4.82534 7.10732 4.63175 7.02712C4.18253 6.84106 3.82563 6.48413 3.63955 6.03491C3.55937 5.84132 3.52827 5.64164 3.51385 5.43024C3.49999 5.22716 3.49999 4.9798 3.5 4.68349V4.64982C3.49999 4.35352 3.49999 4.10616 3.51385 3.90308C3.52827 3.69168 3.55937 3.492 3.63955 3.2984C3.82563 2.84918 4.18253 2.49228 4.63175 2.30621C4.82534 2.22602 5.02503 2.19493 5.23643 2.1805C5.4395 2.16665 5.68686 2.16665 5.98317 2.16666Z" fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M9.98313 8.83334H10.0169C10.3131 8.83334 10.5605 8.83334 10.7636 8.84721C10.975 8.86161 11.1747 8.89268 11.3683 8.97288C11.8175 9.15894 12.1744 9.51588 12.3605 9.96508C12.4407 10.1587 12.4717 10.3583 12.4861 10.5697C12.5 10.7728 12.5 11.0202 12.5 11.3165V11.3502C12.5 11.6465 12.5 11.8939 12.4861 12.0969C12.4717 12.3083 12.4407 12.508 12.3605 12.7016C12.1744 13.1508 11.8175 13.5077 11.3683 13.6938C11.1747 13.774 10.975 13.8051 10.7636 13.8195C10.5605 13.8333 10.3131 13.8333 10.0169 13.8333H9.98313C9.68687 13.8333 9.43947 13.8333 9.2364 13.8195C9.025 13.8051 8.82533 13.774 8.63173 13.6938C8.18253 13.5077 7.8256 13.1508 7.63953 12.7016C7.55933 12.508 7.52827 12.3083 7.51387 12.0969C7.5 11.8939 7.5 11.6465 7.5 11.3502V11.3165C7.5 11.0202 7.5 10.7728 7.51387 10.5697C7.52827 10.3583 7.55933 10.1587 7.63953 9.96508C7.8256 9.51588 8.18253 9.15894 8.63173 8.97288C8.82533 8.89268 9.025 8.86161 9.2364 8.84721C9.43947 8.83334 9.68687 8.83334 9.98313 8.83334Z" fill="white"/>
            </svg>
            Filters
            {filterCount > 0 && (
              <div style={{
                display: 'flex',
                width: '16px',
                height: '16px',
                padding: '0 6px',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '720px',
                background: '#7839EE',
                color: '#FFF',
                textAlign: 'center',
                fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                fontFamily: 'var(--Font-family-font-family-text, "Inter Display")',
                fontSize: '10px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '16px'
              }}>
                {filterCount}
              </div>
            )}
          </button>

          <div className="flex items-center gap-[12px]">
            <button
              onClick={onUploadJDClick}
              className="flex items-center justify-center gap-1.5 font-body"
              style={{
                padding: '6px 8px',
                borderRadius: '8px',
                border: '0.5px solid #3F3F46',
                background: '#26272B',
                color: '#FFFFFF',
                fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                fontSize: '12px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '18px',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.38235 2.79999C4.95291 2.79999 3.79412 3.96405 3.79412 5.39999V8.975C3.79412 11.3084 5.67715 13.2 8 13.2C10.3229 13.2 12.2059 11.3084 12.2059 8.975V8C12.2059 7.64107 12.4956 7.35 12.8529 7.35C13.2103 7.35 13.5 7.64107 13.5 8V8.975C13.5 12.0264 11.0375 14.5 8 14.5C4.96243 14.5 2.5 12.0264 2.5 8.975V5.39999C2.5 3.24609 4.23819 1.5 6.38235 1.5C8.52653 1.5 10.2647 3.24609 10.2647 5.39999V8.975C10.2647 10.2314 9.25073 11.25 8 11.25C6.74927 11.25 5.73529 10.2314 5.73529 8.975V6.37499C5.73529 6.016 6.02499 5.72499 6.38235 5.72499C6.73973 5.72499 7.0294 6.016 7.0294 6.37499V8.975C7.0294 9.51347 7.46393 9.95 8 9.95C8.53607 9.95 8.9706 9.51347 8.9706 8.975V5.39999C8.9706 3.96405 7.8118 2.79999 6.38235 2.79999Z" fill="white"/>
              </svg>
              Job description
            </button>

            <button
              onClick={handleSearch}
              className="flex items-center justify-center font-body"
              style={{
                padding: '6px 8px',
                borderRadius: '8px',
                border: '0.5px solid #3F3F46',
                background: '#26272B',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3.75 8.25023C3.33578 8.25023 3 8.586 3 9.00023C3.00005 9.41438 3.33582 9.75023 3.75 9.75023H12.9455C12.5597 10.1804 12.0434 10.6643 11.5085 11.1287C10.9592 11.6056 10.4073 12.048 9.99172 12.3723C9.78442 12.5341 9.36645 12.8542 9.24608 12.9451C8.96438 13.2002 8.9157 13.6322 9.14572 13.9448C9.39135 14.2782 9.86107 14.3498 10.1946 14.1045C10.3203 14.0096 10.7001 13.7225 10.9145 13.5552C11.3427 13.2211 11.9158 12.7607 12.4915 12.261C13.0633 11.7645 13.6545 11.2141 14.1086 10.7002C14.3349 10.4441 14.5434 10.1797 14.6989 9.9216C14.8422 9.68408 15 9.3573 15 9.00023L14.9927 8.8677C14.9605 8.56298 14.8242 8.28735 14.6989 8.0796C14.5434 7.82145 14.3349 7.5564 14.1086 7.30028C13.6546 6.78636 13.0633 6.23597 12.4915 5.7395C11.9158 5.23976 11.3427 4.77943 10.9145 4.4453C10.7001 4.27796 10.3203 3.99095 10.1946 3.89599C9.86107 3.65063 9.39202 3.72227 9.14647 4.05566C8.91622 4.36836 8.9643 4.80023 9.24608 5.05541C9.24608 5.05541 9.43132 5.19822 9.49148 5.24364C9.61177 5.33455 9.78442 5.4664 9.99172 5.62817C10.4073 5.95249 10.9592 6.39487 11.5085 6.87182C12.0434 7.33623 12.5597 7.8201 12.9455 8.25023H3.75Z" fill="white"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 p-[16px] justify-center">
        {[
          { label: 'Location', key: 'location' },
          { label: 'Job title', key: 'jobTitle' },
          { label: 'Years of experience', key: 'experience' },
          { label: 'Expected salary', key: 'salary' },
          { label: 'Skills', key: 'skills' },
          { label: 'Industry', key: 'industry' }
        ].map(({ label, key }) => {
          const isHighlighted = detectedCategories[key as keyof typeof detectedCategories];
          return (
            <button
              key={label}
              className="flex items-center font-body transition-all duration-300"
              style={{
                padding: '2px 8px 2px 6px',
                alignItems: 'center',
                gap: '2px',
                borderRadius: '6px',
                border: `1px solid ${isHighlighted ? '#315f45' : '#26272B'}`,
                background: isHighlighted ? '#172820' : '#131316',
                color: isHighlighted ? '#caf7da' : '#A0A0AB',
                textAlign: 'center',
                fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
                fontSize: '12px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '18px',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                style={{ flexShrink: 0 }}
              >
                <g clipPath="url(#clip0_3193_6463)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6 11.375C3.03147 11.375 0.625 8.96855 0.625 6C0.625 3.03147 3.03147 0.625 6 0.625C8.96855 0.625 11.375 3.03147 11.375 6C11.375 8.96855 8.96855 11.375 6 11.375ZM8.24 4.68878C8.48225 4.55628 8.57125 4.25247 8.43875 4.01019C8.30625 3.76791 8.00245 3.67891 7.7602 3.81141C6.84585 4.31143 6.0898 5.27645 5.58145 6.0548C5.3936 6.3425 5.2331 6.61485 5.1047 6.84555C4.98492 6.72935 4.86629 6.6285 4.76019 6.5446C4.62135 6.43485 4.49641 6.34825 4.40531 6.2886L4.2478 6.19075C4.00793 6.05395 3.70256 6.1375 3.56576 6.3774C3.42898 6.6172 3.51247 6.92245 3.75221 7.05935L3.85736 7.1251C3.92876 7.17185 4.02882 7.24115 4.13999 7.32905C4.36877 7.5099 4.61563 7.747 4.77099 8.00675C4.86633 8.16615 5.0422 8.25955 5.22765 8.24935C5.41305 8.2391 5.57755 8.1268 5.6548 7.95795L5.70395 7.85525C5.7378 7.78605 5.7885 7.68485 5.8545 7.5602C5.98675 7.31035 6.17905 6.9686 6.4187 6.6016C6.9104 5.84875 7.5543 5.06375 8.24 4.68878Z"
                    fill={isHighlighted ? '#caf7da' : '#70707B'}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3193_6463">
                    <rect width="12" height="12" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  )
}
