'use client'

import { useState } from 'react'

interface InputFormProps {
  onSubmit: (value: number) => Promise<void>
  initialValue?: number
  isLoading?: boolean
}

export default function InputForm({ onSubmit, initialValue, isLoading }: InputFormProps) {
  const [value, setValue] = useState(initialValue ?? 50)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)
    
    try {
      await onSubmit(value)
      setMessage('OK')
    } catch {
      setMessage('Error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <div className="slider-container">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="slider"
          disabled={submitting || isLoading}
        />
        <div className="value-display">{value}</div>
      </div>
      
      <button 
        type="submit" 
        disabled={submitting || isLoading}
        className="submit-btn"
      >
        {submitting ? '...' : '→'}
      </button>
      
      {message && (
        <div className={`message ${message === 'OK' ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </form>
  )
}
