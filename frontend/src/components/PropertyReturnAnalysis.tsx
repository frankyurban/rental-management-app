'use client'

import { useEffect, useState } from 'react'
import { usePropertyStore } from '@/store/propertyStore'
import { Inputs } from '@/types/inputs'
import { INPUT_CONFIGS, INPUT_INFO } from '@/config/inputConfig'
import { InputField } from '@/components/inputs/InputField'
import { ArrayInputField } from '@/components/inputs/ArrayInputField'

const DEFAULTS: Inputs = {
  scenarioName: 'Scenario 1',
  vacancy: 5,
  repairs: 10,
  capex: 10,
  propManagement: 8.6,
  rentalIncome: 0,
  laundry: 0,
  storage: 0,
  parking: 0,
  miscIncomes: ['', '', ''],
  miscIncomeVals: [0, 0, 0],
  taxes: 0,
  insurance: 0,
  water: 0,
  garbage: 0,
  electric: 0,
  gas: 0,
  hoa: 0,
  lawn: 0,
  mortgage: 0,
  downPayment: 0,
  closingCosts: 0,
  rehab: 0,
  cashMisc: ['', '', ''],
  cashMiscVals: [0, 0, 0],
}

function formatCurrency(num: number | string) {
  const n = Number(num)
  if (isNaN(n)) return ''
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
}

interface PropertyReturnAnalysisProps {
  propertyId: number
}

export default function PropertyReturnAnalysis({ propertyId }: PropertyReturnAnalysisProps) {
  const properties = usePropertyStore((s) => s.properties)
  const [inputs, setInputs] = useState({ ...DEFAULTS })
  const [scenarioName, setScenarioName] = useState(DEFAULTS.scenarioName)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Load scenario from API when property changes
  useEffect(() => {
    if (propertyId) {
      setLoading(true)
      setMessage('')
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please log in to view analysis.')
        return;
      }
      
      fetch(`/api/properties/${propertyId}/analysis`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && typeof data === 'object') {
            // Handle the case where miscIncomes and miscIncomeVals might be stored as strings
            const processedData = { ...data };
            if (typeof data.miscIncomes === 'string') {
              try {
                processedData.miscIncomes = JSON.parse(data.miscIncomes);
              } catch (e) {
                processedData.miscIncomes = DEFAULTS.miscIncomes;
              }
            }
            if (typeof data.miscIncomeVals === 'string') {
              try {
                processedData.miscIncomeVals = JSON.parse(data.miscIncomeVals);
              } catch (e) {
                processedData.miscIncomeVals = DEFAULTS.miscIncomeVals;
              }
            }
            if (typeof data.cashMisc === 'string') {
              try {
                processedData.cashMisc = JSON.parse(data.cashMisc);
              } catch (e) {
                processedData.cashMisc = DEFAULTS.cashMisc;
              }
            }
            if (typeof data.cashMiscVals === 'string') {
              try {
                processedData.cashMiscVals = JSON.parse(data.cashMiscVals);
              } catch (e) {
                processedData.cashMiscVals = DEFAULTS.cashMiscVals;
              }
            }
            
            setInputs({ ...DEFAULTS, ...processedData })
            setScenarioName(data.scenarioName || DEFAULTS.scenarioName)
            setMessage('Loaded saved scenario.')
          } else {
            // No saved scenario, reset to defaults but load rent from property
            const selected = properties.find(p => p.id === propertyId)
            setInputs({ ...DEFAULTS, rentalIncome: selected?.rent ?? 0 })
            setScenarioName(DEFAULTS.scenarioName)
            setMessage('No saved scenario, using defaults.')
          }
        })
        .catch(() => {
          setMessage('Failed to load scenario data.')
        })
        .finally(() => setLoading(false))
    } else {
      setInputs({ ...DEFAULTS })
      setScenarioName(DEFAULTS.scenarioName)
      setMessage('')
    }
    // eslint-disable-next-line
  }, [propertyId, properties])

  function restoreDefaults() {
    const selected = properties.find(p => p.id === propertyId)
    setInputs({ ...DEFAULTS, rentalIncome: selected?.rent ?? 0 })
    setScenarioName(DEFAULTS.scenarioName)
    setMessage('Restored to defaults.')
  }
  function handlePrint() {
    window.print()
  }

  // Save analysis scenario for the selected property
  async function handleSave() {
    if (!propertyId) {
      setMessage('Property ID is required to save analysis.')
      return
    }
    setSaving(true)
    setMessage('Saving...')
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please log in to save analysis.')
        setSaving(false)
        return;
      }
      
      // Prepare data for saving - convert arrays to strings
      const dataToSave = {
        ...inputs,
        scenarioName,
        miscIncomes: JSON.stringify(inputs.miscIncomes),
        miscIncomeVals: JSON.stringify(inputs.miscIncomeVals),
        cashMisc: JSON.stringify(inputs.cashMisc),
        cashMiscVals: JSON.stringify(inputs.cashMiscVals)
      };
      
      const res = await fetch(`/api/properties/${propertyId}/analysis`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSave),
      })
      if (res.ok) {
        setMessage('✅ Analysis saved!')
      } else {
        setMessage('❌ Error saving analysis.')
      }
    } catch (err) {
      setMessage('❌ Error saving analysis.')
    }
    setSaving(false)
  }

  // --- Calculations
  const totalIncome = [
    Number(inputs.rentalIncome || 0),
    Number(inputs.laundry || 0),
    Number(inputs.storage || 0),
    Number(inputs.parking || 0),
    ...inputs.miscIncomeVals.map(v => Number(v || 0)),
  ].reduce((a, b) => a + b, 0)

  const vacancyAmt = (totalIncome * Number(inputs.vacancy || 0)) / 100
  const repairsAmt = (totalIncome * Number(inputs.repairs || 0)) / 100
  const capexAmt = (totalIncome * Number(inputs.capex || 0)) / 100
  const propMgmtAmt = (totalIncome * Number(inputs.propManagement || 0)) / 100

  const totalExpenses = [
    Number(inputs.taxes || 0),
    Number(inputs.insurance || 0),
    Number(inputs.water || 0),
    Number(inputs.garbage || 0),
    Number(inputs.electric || 0),
    Number(inputs.gas || 0),
    Number(inputs.hoa || 0),
    Number(inputs.lawn || 0),
    vacancyAmt,
    repairsAmt,
    capexAmt,
    propMgmtAmt,
    Number(inputs.mortgage || 0)
  ].reduce((a, b) => a + b, 0)

  const cashFlow = totalIncome - totalExpenses
  const annualCashFlow = cashFlow * 12

  const totalInvestment = [
    Number(inputs.downPayment || 0),
    Number(inputs.closingCosts || 0),
    Number(inputs.rehab || 0),
    ...inputs.cashMiscVals.map(v => Number(v || 0)),
  ].reduce((a, b) => a + b, 0)

  const cashOnCash = totalInvestment ? annualCashFlow / totalInvestment : 0

  return (
    <div className="max-w-4xl mx-auto py-6 px-2 print:bg-white print:text-black">
      <div className="flex flex-wrap gap-4 items-end mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2 font-semibold hover:bg-blue-700 transition"
          onClick={handlePrint}
          type="button"
          disabled={loading || saving}
        >
          Export / Print PDF
        </button>
        <button
          className="bg-green-700 text-white px-4 py-2 rounded mt-2 font-semibold hover:bg-green-800 transition"
          onClick={handleSave}
          type="button"
          disabled={loading || saving}
        >
          {saving ? "Saving..." : "Save Scenario"}
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded mt-2 font-semibold hover:bg-gray-700 transition"
          onClick={restoreDefaults}
          type="button"
          disabled={loading || saving}
        >
          Restore Defaults
        </button>
      </div>
      {message && (
        <div className="mb-4 text-sm font-medium text-gray-600">{message}</div>
      )}

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 p-4 rounded flex flex-col items-center">
          <div className="text-xs text-gray-700 font-medium mb-1">Monthly Cash Flow</div>
          <div className={`text-2xl font-bold ${cashFlow >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            {formatCurrency(cashFlow)}
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded flex flex-col items-center">
          <div className="text-xs text-gray-700 font-medium mb-1">Total Investment</div>
          <div className="text-2xl font-bold text-yellow-700">
            {formatCurrency(totalInvestment)}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded flex flex-col items-center">
          <div className="text-xs text-gray-700 font-medium mb-1">Cash on Cash Return</div>
          <div className={`text-2xl font-bold ${cashOnCash >= 0.1 ? 'text-green-700' : 'text-blue-600'}`}>
            {(cashOnCash * 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}%
          </div>
        </div>
      </div>
      {/* Four-square table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-0 border print:border-0 bg-white print:bg-white p-6 print:p-0 rounded print:rounded-none shadow print:shadow-none">
        {/* Income */}
        <div className="p-4 bg-green-50 rounded border border-green-200 mb-2">
          <div className="font-bold text-lg mb-2 text-green-800">Income</div>
          <table className="w-full">
            <tbody>
              {[
                { label: 'Rental Income', name: 'rentalIncome' },
                { label: 'Laundry', name: 'laundry' },
                { label: 'Storage', name: 'storage' },
                { label: 'Parking', name: 'parking' },
              ].map(field => (
                <tr key={field.name} className="pb-2">
                  <td><label htmlFor={field.name}>{field.label}</label></td>
                  <td className="text-right">
                    <InputField
                      name={field.name}
                      value={inputs[field.name as keyof Inputs]}
                      onChange={(name, value) => setInputs(prev => ({ ...prev, [name]: value }))}
                      disabled={loading || saving}
                    />
                  </td>
                </tr>
              ))}
              <ArrayInputField
                labels={inputs.miscIncomes}
                values={inputs.miscIncomeVals}
                onLabelChange={(i, value) => {
                  const newLabels = [...inputs.miscIncomes];
                  newLabels[i] = value;
                  setInputs(prev => ({ ...prev, miscIncomes: newLabels }));
                }}
                onValueChange={(i, value) => {
                  const newValues = [...inputs.miscIncomeVals];
                  newValues[i] = value;
                  setInputs(prev => ({ ...prev, miscIncomeVals: newValues }));
                }}
                disabled={loading || saving}
                labelPlaceholder="Misc income (desc)"
                valuePlaceholder="0.00"
              />
              <tr className="font-bold">
                <td>Total Monthly Income</td>
                <td className="text-green-800">{formatCurrency(totalIncome)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Cash Flow */}
        <div className="p-4 bg-blue-50 rounded border border-blue-200 mb-2">
          <div className="font-bold text-lg mb-2 text-blue-800">Cash Flow</div>
          <table className="w-full">
            <tbody>
              <tr>
                <td>Total Monthly Income</td>
                <td>{formatCurrency(totalIncome)}</td>
              </tr>
              <tr>
                <td>Total Monthly Expenses</td>
                <td>{formatCurrency(totalExpenses)}</td>
              </tr>
              <tr className="font-bold">
                <td>Total Monthly Cash Flow</td>
                <td className={`${cashFlow >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                  {formatCurrency(cashFlow)}
                </td>
              </tr>
              <tr>
                <td>Total Annual Cash Flow</td>
                <td>{formatCurrency(annualCashFlow)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Expenses */}
        <div className="p-4 bg-red-50 rounded border border-red-200 mb-2">
          <div className="font-bold text-lg mb-2 text-red-800">Expenses</div>
          <table className="w-full">
            <tbody>
              {[
                { label: 'Taxes', name: 'taxes' },
                { label: 'Insurance', name: 'insurance' },
                { label: 'Water/Sewer', name: 'water' },
                { label: 'Garbage', name: 'garbage' },
                { label: 'Electric', name: 'electric' },
                { label: 'Gas', name: 'gas' },
                { label: 'HOA Fees', name: 'hoa' },
                { label: 'Lawn/Snow', name: 'lawn' },
              ].map(field => (
                <tr key={field.name} className="pb-2">
                  <td><label htmlFor={field.name}>{field.label}</label></td>
                  <td className="text-right">
                    <InputField
                      name={field.name}
                      value={inputs[field.name as keyof Inputs]}
                      onChange={(name, value) => setInputs(prev => ({ ...prev, [name]: value }))}
                      disabled={loading || saving}
                    />
                  </td>
                </tr>
              ))}
              {[
                { label: 'Vacancy (%)', name: 'vacancy', info: INPUT_INFO.vacancy },
                { label: 'Repairs (%)', name: 'repairs', info: INPUT_INFO.repairs },
                { label: 'CapEx (%)', name: 'capex', info: INPUT_INFO.capex },
                { label: 'Prop. Management (%)', name: 'propManagement', info: INPUT_INFO.propManagement },
              ].map(field => (
                <tr key={field.name}>
                  <td>
                    <label htmlFor={field.name}>
                      {field.label}
                      <span className="ml-1 text-xs text-gray-400" title={field.info}>ⓘ</span>
                    </label>
                  </td>
                  <td>
                    <InputField
                      name={field.name}
                      value={inputs[field.name as keyof Inputs]}
                      onChange={(name, value) => setInputs(prev => ({ ...prev, [name]: value }))}
                      disabled={loading || saving}
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td>Mortgage</td>
                  <td className="text-right">
                    <InputField
                      name="mortgage"
                      value={inputs.mortgage}
                      onChange={(name, value) => setInputs(prev => ({ ...prev, [name]: value }))}
                      disabled={loading || saving}
                    />
                </td>
              </tr>
              <tr className="font-bold">
                <td>Total Monthly Expenses</td>
                <td className="text-red-800">{formatCurrency(totalExpenses)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Cash on Cash Return */}
        <div className="p-4 bg-yellow-50 rounded border border-yellow-200 mb-2">
          <div className="font-bold text-lg mb-2 text-yellow-800">Cash on Cash Return</div>
          <table className="w-full">
            <tbody>
              {[
                { label: 'Down Payment', name: 'downPayment' },
                { label: 'Closing Costs', name: 'closingCosts' },
                { label: 'Rehab Budget', name: 'rehab' },
              ].map(field => (
                <tr key={field.name} className="pb-2">
                  <td><label htmlFor={field.name}>{field.label}</label></td>
                  <td className="text-right">
                    <InputField
                      name={field.name}
                      value={inputs[field.name as keyof Inputs]}
                      onChange={(name, value) => setInputs(prev => ({ ...prev, [name]: value }))}
                      disabled={loading || saving}
                    />
                  </td>
                </tr>
              ))}
              <ArrayInputField
                labels={inputs.cashMisc}
                values={inputs.cashMiscVals}
                onLabelChange={(i, value) => {
                  const newLabels = [...inputs.cashMisc];
                  newLabels[i] = value;
                  setInputs(prev => ({ ...prev, cashMisc: newLabels }));
                }}
                onValueChange={(i, value) => {
                  const newValues = [...inputs.cashMiscVals];
                  newValues[i] = value;
                  setInputs(prev => ({ ...prev, cashMiscVals: newValues }));
                }}
                disabled={loading || saving}
                labelPlaceholder="Misc investment (desc)"
                valuePlaceholder="0.00"
              />
              <tr className="font-bold">
                <td>Total Investment</td>
                <td className="text-yellow-800">{formatCurrency(totalInvestment)}</td>
              </tr>
              <tr>
                <td>Annual Cash Flow / Total Investment</td>
                <td>{(cashOnCash * 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}%</td>
              </tr>
              <tr className="font-bold" style={{ color: cashOnCash >= 0.1 ? '#22c55e' : '#ca8a04' }}>
                <td>Cash on Cash Return</td>
                <td>{(cashOnCash * 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <style jsx>{`
        @media print {
          .bg-green-50, .bg-blue-50, .bg-red-50, .bg-yellow-50 { background: white !important; }
          .border-green-200, .border-blue-200, .border-red-200, .border-yellow-200 { border-color: #ccc !important; }
        }
      `}</style>
    </div>
  )
}
