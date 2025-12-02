'use client'

import { useMemo } from 'react'

export default function EmptyState() {
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }, [])

  return (
    <div className="text-center max-w-3xl mx-auto">
      <h1 
        className="mb-3" 
        style={{ 
          color: '#FFF',
          fontFamily: '"Denton Test"',
          fontSize: '30px',
          fontStyle: 'normal',
          fontWeight: 540,
          lineHeight: '38px'
        }}
      >
        {greeting}, Tejash!
      </h1>
      <p 
        className="mb-8 font-body" 
        style={{ 
          color: '#70707B',
          textAlign: 'center',
          fontFeatureSettings: "'case' on, 'cv01' on, 'cv08' on, 'cv09' on, 'cv11' on, 'cv13' on",
          fontSize: '14px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: '20px'
        }}
      >
        Find the perfect match in seconds
      </p>
    </div>
  )
}
