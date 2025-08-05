'use client'

import React, { useState, useEffect } from 'react'

interface PercentageInputProps {
  id?: string
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  min?: number
  max?: number
  className?: string
}

export const PercentageInput: React.FC<PercentageInputProps> = ({
  id,
  value,
  onChange,
  disabled = false,
  min = 0,
  max = 100,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState<string>('')

  // Initialize display value
  useEffect(() => {
    const stringValue = value.toString();
    // Only update if the current display value doesn't match the string value
    // This prevents interrupting user input
    if (displayValue !== stringValue) {
      setDisplayValue(stringValue);
    }
  }, [value, displayValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setDisplayValue(inputValue)
    
    const numericValue = parseFloat(inputValue)
    
    // Handle empty input
    if (inputValue === '') {
      onChange(0)
      return
    }
    
    // Validate the input
    if (isNaN(numericValue)) {
      onChange(0)
    } else if (numericValue < min || numericValue > max) {
      // We still call onChange with the value even if it's out of bounds
      // The parent component can decide how to handle this
      onChange(numericValue)
    } else {
      onChange(numericValue)
    }
  }

  return (
    <input
      id={id}
      type="text"
      min={min}
      max={max}
      step={0.1}
      value={displayValue}
      onChange={handleChange}
      disabled={disabled}
      className={className}
    />
  )
}
