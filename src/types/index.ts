export interface TaxBracket {
  threshold: number;
  rate: number;
}

export interface ExpandedState {
  tips: boolean;
  deductions: boolean;
  breakdown: boolean;
}

export interface SalariedCalculationResult {
  gross: number;
  standardDeduction: number;
  taxableIncome: number;
  tax: number;
  taxRelief: number;
  medicalCredit: number;
  netIncome: number;
  effectiveRate: string;
  monthlyNet: string;
}

export interface BusinessCalculationResult {
  revenue: number;
  expenses: number;
  deductions: number;
  totalDeductions: number;
  profit: number;
  tax: number;
  netProfit: number;
  effectiveRate: string | number;
  deductionsSaved: string;
}

export interface SalariedTabProps {
  grossIncome: number;
  setGrossIncome: (value: number) => void;
  age: number;
  setAge: (value: number) => void;
  medicalScheme: boolean;
  setMedicalScheme: (value: boolean) => void;
  expanded: ExpandedState;
  setExpanded: (value: ExpandedState) => void;
  salariedCalc: SalariedCalculationResult;
  formatCurrency: (value: number | string) => string;
}

export interface BusinessTabProps {
  businessRevenue: number;
  setBusinessRevenue: (value: number) => void;
  businessExpenses: number;
  setBusinessExpenses: (value: number) => void;
  deductions: number;
  setDeductions: (value: number) => void;
  businessType: 'sbc' | 'company';
  setBusinessType: (value: 'sbc' | 'company') => void;
  expanded: ExpandedState;
  setExpanded: (value: ExpandedState) => void;
  businessCalc: BusinessCalculationResult;
  formatCurrency: (value: number | string) => string;
}
