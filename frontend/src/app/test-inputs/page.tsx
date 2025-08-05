'use client'

import React, { useState } from 'react'
import { InputField } from '@/components/inputs/InputField'

export default function TestInputsPage() {
  const [testValue, setTestValue] = useState(0)
  const [testPercentage, setTestPercentage] = useState(5.5)
  const [testText, setTestText] = useState('')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test Input Components</h1>
      
      <div className="mb-6">
        <label className="block mb-2">Currency Input Test:</label>
        <InputField
          name="testCurrency"
          value={testValue}
          onChange={(name, value) => setTestValue(value)}
        />
        <p className="mt-2">Value: {testValue}</p>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2">Percentage Input Test:</label>
        <InputField
          name="testPercentage"
          value={testPercentage}
          onChange={(name, value) => setTestPercentage(value)}
        />
        <p className="mt-2">Value: {testPercentage}</p>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2">Text Input Test:</label>
        <InputField
          name="testText"
          value={testText}
          onChange={(name, value) => setTestText(value)}
        />
        <p className="mt-2">Value: {testText}</p>
      </div>
    </div>
  )
}
