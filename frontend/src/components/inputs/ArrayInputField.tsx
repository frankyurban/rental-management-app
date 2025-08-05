'use client'

import React from 'react'
import { CurrencyInput } from './CurrencyInput'
import { TextInput } from './TextInput'

interface ArrayInputFieldProps {
  labels: string[]
  values: number[]
  onLabelChange: (index: number, value: string) => void
  onValueChange: (index: number, value: number) => void
  disabled?: boolean
  labelPlaceholder?: string
  valuePlaceholder?: string
}

export const ArrayInputField: React.FC<ArrayInputFieldProps> = ({
  labels,
  values,
  onLabelChange,
  onValueChange,
  disabled = false,
  labelPlaceholder = 'Description',
  valuePlaceholder = '0.00'
}) => {
  return (
    <>
      {labels.map((label, i) => (
        <tr key={i} className="pb-2">
          <td>
            <TextInput
              value={label}
              onChange={(value) => onLabelChange(i, value)}
              disabled={disabled}
              placeholder={labelPlaceholder}
              className="border px-2 w-28 rounded bg-white"
            />
          </td>
          <td className="text-right">
            <CurrencyInput
              value={values[i] || 0}
              onChange={(value) => onValueChange(i, value)}
              disabled={disabled}
              placeholder={valuePlaceholder}
              className="border px-2 w-24 rounded bg-white text-right"
            />
          </td>
        </tr>
      ))}
    </>
  )
}
