import { InputConfig } from '@/types/inputs';

export const INPUT_INFO = {
  vacancy: "Typical is 5% of monthly rent. Represents expected vacant time.",
  repairs: "Industry standard is 10%. Funds for repairs and maintenance.",
  capex: "Industry standard is 10%. Long-term improvements.",
  propManagement: "8-10% if using a property manager.",
};

export const INPUT_CONFIGS: Record<string, InputConfig> = {
  scenarioName: {
    label: 'Scenario Name',
    type: 'text',
    category: 'general'
  },
  vacancy: {
    label: 'Vacancy (%)',
    type: 'percentage',
    category: 'expense',
    info: INPUT_INFO.vacancy
  },
  repairs: {
    label: 'Repairs (%)',
    type: 'percentage',
    category: 'expense',
    info: INPUT_INFO.repairs
  },
  capex: {
    label: 'CapEx (%)',
    type: 'percentage',
    category: 'expense',
    info: INPUT_INFO.capex
  },
  propManagement: {
    label: 'Property Management (%)',
    type: 'percentage',
    category: 'expense',
    info: INPUT_INFO.propManagement
  },
  rentalIncome: {
    label: 'Rental Income',
    type: 'currency',
    category: 'income'
  },
  laundry: {
    label: 'Laundry',
    type: 'currency',
    category: 'income'
  },
  storage: {
    label: 'Storage',
    type: 'currency',
    category: 'income'
  },
  parking: {
    label: 'Parking',
    type: 'currency',
    category: 'income'
  },
  taxes: {
    label: 'Taxes',
    type: 'currency',
    category: 'expense'
  },
  insurance: {
    label: 'Insurance',
    type: 'currency',
    category: 'expense'
  },
  water: {
    label: 'Water/Sewer',
    type: 'currency',
    category: 'expense'
  },
  garbage: {
    label: 'Garbage',
    type: 'currency',
    category: 'expense'
  },
  electric: {
    label: 'Electric',
    type: 'currency',
    category: 'expense'
  },
  gas: {
    label: 'Gas',
    type: 'currency',
    category: 'expense'
  },
  hoa: {
    label: 'HOA Fees',
    type: 'currency',
    category: 'expense'
  },
  lawn: {
    label: 'Lawn/Snow',
    type: 'currency',
    category: 'expense'
  },
  mortgage: {
    label: 'Mortgage',
    type: 'currency',
    category: 'expense'
  },
  downPayment: {
    label: 'Down Payment',
    type: 'currency',
    category: 'investment'
  },
  closingCosts: {
    label: 'Closing Costs',
    type: 'currency',
    category: 'investment'
  },
  rehab: {
    label: 'Rehab Budget',
    type: 'currency',
    category: 'investment'
  },
  testCurrency: {
    label: 'Test Currency',
    type: 'currency',
    category: 'general'
  },
  testPercentage: {
    label: 'Test Percentage',
    type: 'percentage',
    category: 'general'
  },
  testText: {
    label: 'Test Text',
    type: 'text',
    category: 'general'
  }
};
