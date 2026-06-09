import React from 'react'
export function PureframeLogo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M2 22h20" />
      <path d="M5 22V9" />
      <path d="M19 22V9" />
      <path d="M2 11l10-8 10 8" />
      <path d="M16 6V3h2v4.6" />
      <circle cx="12" cy="11.5" r="2.5" />
      <path d="M8 22v-3a4 4 0 0 1 8 0v3" />
    </svg>
  )
}
