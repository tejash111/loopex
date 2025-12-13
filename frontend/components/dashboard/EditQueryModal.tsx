'use client'

import React, { useState, useEffect } from 'react'

interface EditQueryModalProps {
  isOpen: boolean
  onClose: () => void
  currentQuery: string
  onSave: (query: string) => void
}

export default function EditQueryModal({ isOpen, onClose, currentQuery, onSave }: EditQueryModalProps) {
  const [query, setQuery] = useState(currentQuery)

  useEffect(() => {
    setQuery(currentQuery)
  }, [currentQuery])

  const handleSave = () => {
    onSave(query)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '600px',
          borderRadius: 'var(--radius-2xl, 16px)',
          border: '0.5px solid var(--Border-Secondary, #26272B)',
          background: 'var(--Surface-Primary, #1A1A1E)',
          boxShadow: '0px 20px 24px -4px rgba(16, 24, 40, 0.10), 0px 8px 8px -4px rgba(16, 24, 40, 0.04)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            padding: 'var(--spacing-3xl, 24px) var(--spacing-3xl, 24px) 0 var(--spacing-3xl, 24px)',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 'var(--spacing-xl, 16px)',
            alignSelf: 'stretch'
          }}
        >
          <h2
            style={{
              color: 'var(--Text-Primary, #FFF)',
              fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
              fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
              fontSize: 'var(--Font-size-text-lg, 18px)',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: 'var(--Line-height-text-lg, 28px)',
              margin: 0
            }}
          >
            Edit your filter query
          </h2>

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              padding: 'var(--spacing-sm, 6px)',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              right: '10px',
              top: '10px',
              borderRadius: 'var(--radius-md, 8px)',
              border: '0.5px solid var(--Border-Tertiary, #26272B)',
              background: 'var(--Surface-Tertiary, #1A1A1E)',
              cursor: 'pointer'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M13.5 4.5L4.50061 13.4994M13.4994 13.5L4.5 4.50064" stroke="#A48AFB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Input Field */}
        <div style={{ padding: '20px 24px' }}>
          <textarea
          className='border-border'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query..."
            style={{
              display: 'flex',
              minHeight: '84px',
              maxHeight: '84px',
              width: '100%',
              padding: 'var(--spacing-xl, 16px)',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 'var(--spacing-md, 8px)',
              alignSelf: 'stretch',
              borderRadius: 'var(--radius-xl, 12px)',
              border: '0.5px solid var(--Border-Secondary, #1A1A1E)',
              background: 'var(--Surface-Secondary, #131316)',
              color: 'var(--Text-Primary, #FFF)',
              fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
              fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
              fontSize: 'var(--Font-size-text-sm, 14px)',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: 'var(--Line-height-text-sm, 20px)',
              resize: 'none',
              outline: 'none'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '0 24px 24px 24px'
          }}
        >
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              padding: '10px 14px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'var(--spacing-xs, 4px)',
              color: 'var(--Text-Brand-primary, #A48AFB)',
              fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
              fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
              fontSize: 'var(--Font-size-text-sm, 14px)',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: 'var(--Line-height-text-sm, 20px)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            style={{
              display: 'flex',
              padding: '10px 14px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'var(--spacing-xs, 4px)',
              borderRadius: 'var(--radius-xl, 12px)',
              background: 'var(--Surface-Brand-Primary, #875BF7)',
              color: 'var(--Text-Primary, #FFF)',
              fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
              fontFamily: "var(--Font-family-font-family-text, 'Inter Display')",
              fontSize: 'var(--Font-size-text-sm, 14px)',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: 'var(--Line-height-text-sm, 20px)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Save and Search
          </button>
        </div>
      </div>
    </div>
  )
}
