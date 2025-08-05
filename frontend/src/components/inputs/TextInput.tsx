'use client'

import React from 'react'

interface TextInputProps {
  id?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export const TextInput: React.FC<TextInputProps> = ({
  id,
  value,
  onChange,
  disabled = false,
  placeholder = '',
  className = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={handleChange}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
    />
  )
}
