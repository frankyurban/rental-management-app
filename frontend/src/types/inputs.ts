export type Inputs = {
  scenarioName: string
  vacancy: number
  repairs: number
  capex: number
  propManagement: number
  rentalIncome: number
  laundry: number
  storage: number
  parking: number
  miscIncomes: string[]
  miscIncomeVals: number[]
  taxes: number
  insurance: number
  water: number
  garbage: number
  electric: number
  gas: number
  hoa: number
  lawn: number
  mortgage: number
  downPayment: number
  closingCosts: number
  rehab: number
  cashMisc: string[]
  cashMiscVals: number[]
}

export type InputValue = string | number | readonly string[] | undefined;

export type InputType = 'currency' | 'percentage' | 'text' | 'number';

export type InputCategory = 'income' | 'expense' | 'investment' | 'general';

export interface InputConfig {
  label: string;
  type: InputType;
  category: InputCategory;
  info?: string;
  placeholder?: string;
}
