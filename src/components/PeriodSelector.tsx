'use client'

import { useState } from 'react'

type Period = 7 | 30 | 365

interface PeriodSelectorProps {
  value: Period
  onChange: (period: Period) => void
}

export default function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const periods: Period[] = [7, 30, 365]
  const currentIndex = periods.indexOf(value)

  const handleZoomIn = () => {
    if (currentIndex > 0) {
      onChange(periods[currentIndex - 1])
    }
  }

  const handleZoomOut = () => {
    if (currentIndex < periods.length - 1) {
      onChange(periods[currentIndex + 1])
    }
  }

  return (
    <div className="period-selector">
      <button 
        onClick={handleZoomIn} 
        disabled={currentIndex === 0}
        className="period-btn"
        aria-label="Zoom in"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <path d="M8 11h6" />
          <path d="M11 8v6" />
        </svg>
      </button>
      <button 
        onClick={handleZoomOut} 
        disabled={currentIndex === periods.length - 1}
        className="period-btn"
        aria-label="Zoom out"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <path d="M8 11h6" />
        </svg>
      </button>
    </div>
  )
}

export type { Period }
