'use client'

import React, { useState, useEffect } from 'react'

interface CurrencyInputProps {
  id?: string
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  value,
  onChange,
  disabled = false,
  placeholder = '0.00',
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState<string>('')

  // Initialize display value
  useEffect(() => {
    // Only update display value if it doesn't match the formatted value
    const formattedValue = value === 0 ? '' : value.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
    
    // Only update if the current display value doesn't match the formatted value
    // This prevents interrupting user input
    if (displayValue !== formattedValue) {
      setDisplayValue(formattedValue);
    }
  }, [value, displayValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setDisplayValue(inputValue)
    
    // Remove any non-numeric characters except decimal point
    const numericValue = inputValue.replace(/[^0-9.]/g, '')
    
    // Handle empty input
    if (numericValue === '') {
      onChange(0)
      return
    }
    
    // Handle decimal point placement to prevent multiple decimals
    const parts = numericValue.split('.')
    if (parts.length > 2) {
      // If there are multiple decimal points, only keep the first one
      const corrected = parts[0] + '.' + parts.slice(1).join('')
      const parsedValue = parseFloat(corrected)
      if (!isNaN(parsedValue)) {
        onChange(parsedValue)
      }
      return
    }
    
    const parsedValue = parseFloat(numericValue)
    
    // Only update parent if the value is valid
    if (!isNaN(parsedValue)) {
      onChange(parsedValue)
    }
  }

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
    />
  )
}
