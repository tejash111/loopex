'use client'

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
  setProjectName: (name: string) => void
  onCreateProject: () => void
}

export default function ProjectModal({
  isOpen,
  onClose,
  projectName,
  setProjectName,
  onCreateProject
}: ProjectModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed w- inset-0 flex items-center justify-center bg-black/50 z-50">
      <div 
        className="text-left relative"
        style={{
          display: 'flex',
          width: '400px',
          maxWidth: '400px',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-3xl, 24px)',
          flexShrink: 0,
          borderRadius: 'var(--radius-2xl, 16px)',
          background: 'var(--Surface-Primary, #131316)',
          padding: '32px'
        }}
      >
        <div className="flex justify-between items-start w-full">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
            <img src="/foldericon.svg" alt="" className="w-full h-full" />
          </div>
          <div onClick={onClose} className='absolute right-[10px] top-[10px] p-[6px] px-[12px] bg-[#1a1a1e] border rounded-lg border-[#26272B]'>
            <button className="text-[#70707B] hover:text-white text-[18px] leading-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M9.75 0.75L0.750608 9.7494M9.7494 9.75L0.75 0.750638" stroke="#A48AFB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="w-full">
          <h2 className="text-[16px] font-normal text-white leading-tight" style={{ fontFamily: 'var(--font-body)' }}>Create new project</h2>
          <p className="text-[14px] leading-relaxed" style={{ color: '#65656f' }}>Please enter a name for this project.</p>
        </div>
        <Input
          type="text"
          placeholder="Project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className='w-full rounded-2xl px-4 py-3.5 text-[16px] focus:outline-none placeholder:text-[#70707B]'
          style={{
            backgroundColor: '#1A1A1E',
            color: '#d1d1d6',
            border: '2px solid #875BF7'
          }}
        />
        <Button
          disabled={!projectName.trim()}
          onClick={onCreateProject}
          className="w-full rounded-2xl py-3.5 text-[16px] font-normal flex items-center justify-center gap-2 text-white transition hover:opacity-90 disabled:opacity-100"
          style={{ backgroundColor: projectName.trim() ? '#875BF7' : '#51525c' }}
        >
          Create Project <ArrowRight width={"20px"} />
        </Button>
      </div>
    </div>
  )
}
