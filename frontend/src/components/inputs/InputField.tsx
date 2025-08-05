'use client'

import React from 'react'
import { InputConfig } from '@/types/inputs'
import { INPUT_CONFIGS } from '@/config/inputConfig'
import { CurrencyInput } from './CurrencyInput'
import { PercentageInput } from './PercentageInput'
import { TextInput } from './TextInput'

interface InputFieldProps {
  name: string
  value: any
  onChange: (name: string, value: any) => void
  disabled?: boolean
}

export const InputField: React.FC<InputFieldProps> = ({
  name,
  value,
  onChange,
  disabled = false
}) => {
  const config: InputConfig | undefined = INPUT_CONFIGS[name]
  
  if (!config) {
    // Fallback for fields not in config (like misc income fields)
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        disabled={disabled}
        className="border px-2 w-24 rounded bg-white"
      />
    )
  }

  const handleChange = (newValue: any) => {
    onChange(name, newValue)
  }

  const commonProps = {
    id: name,
    disabled,
    className: "border px-2 w-24 rounded bg-white"
  }

  switch (config.type) {
    case 'currency':
      return (
        <CurrencyInput
          {...commonProps}
          value={value}
          onChange={handleChange}
        />
      )
    case 'percentage':
      return (
        <PercentageInput
          {...commonProps}
          value={value}
          onChange={handleChange}
          min={0}
          max={100}
        />
      )
    case 'text':
      return (
        <TextInput
          {...commonProps}
          value={value}
          onChange={handleChange}
        />
      )
    default:
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
          className="border px-2 w-24 rounded bg-white"
        />
      )
  }
}
