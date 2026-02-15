'use client';

import React, { useState } from 'react';
import { ChevronDown, DollarSign, TrendingDown, Calculator, Info } from 'lucide-react';

interface TaxBracket {
  threshold: number;
  rate: number;
}

interface ExpandedState {
  tips: boolean;
  deductions: boolean;
  breakdown: boolean;
}

interface SalariedCalculationResult {
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

interface BusinessCalculationResult {
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

interface SalariedTabProps {
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

interface BusinessTabProps {
  businessRevenue: number;
  setBusinessRevenue: (value: number) => void;
  businessExpenses: number;
  setBusinessExpenses: (value: number) => void;
  deductions: number;
  setDeductions: (value: number) => void;
  expanded: ExpandedState;
  setExpanded: (value: ExpandedState) => void;
  businessCalc: BusinessCalculationResult;
  formatCurrency: (value: number | string) => string;
}

const SalariedTab: React.FC<SalariedTabProps> = ({
  grossIncome,
  setGrossIncome,
  age,
  setAge,
  medicalScheme,
  setMedicalScheme,
  expanded,
  setExpanded,
  salariedCalc,
  formatCurrency,
}) => (
  <div className="space-y-6">
    {/* Input Section */}
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Gross Income (Salary)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">R</span>
            <input
              type="number"
              value={grossIncome}
              onChange={(e) => setGrossIncome(Math.max(0, Number(e.target.value)))}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Your total salary before tax and deductions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <select
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value={35}>Under 65</option>
              <option value={70}>65 - 74</option>
              <option value={80}>75+</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Affects your tax rebate</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical Aid
            </label>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setMedicalScheme(true)}
                className={`px-4 py-2 rounded-lg transition ${
                  medicalScheme
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setMedicalScheme(false)}
                className={`px-4 py-2 rounded-lg transition ${
                  !medicalScheme
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                No
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Tax credit for medical scheme</p>
          </div>
        </div>
      </div>
    </div>

    {/* Key Results */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white border-2 border-red-500 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-1">Total Tax</div>
        <div className="text-2xl font-bold text-red-600">
          {formatCurrency(salariedCalc.tax)}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {salariedCalc.effectiveRate}% effective rate
        </div>
      </div>

      <div className="bg-white border-2 border-green-500 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-1">Net Annual Income</div>
        <div className="text-2xl font-bold text-green-600">
          {formatCurrency(salariedCalc.netIncome)}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {salariedCalc.monthlyNet}/month
        </div>
      </div>

      <div className="bg-white border-2 border-orange-500 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-1">Tax Rebate</div>
        <div className="text-2xl font-bold text-orange-600">
          {formatCurrency(salariedCalc.taxRelief + salariedCalc.medicalCredit)}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Age + medical relief
        </div>
      </div>
    </div>

    {/* Expandable Sections */}
    <div className="space-y-3">
      {/* Tax Saving Tips */}
      <button
        onClick={() => setExpanded({ ...expanded, tips: !expanded.tips })}
        className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center hover:bg-blue-100 transition"
      >
        <div className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-700">Ways to Save on Tax</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 transition transform ${
            expanded.tips ? 'rotate-180' : ''
          }`}
        />
      </button>
      {expanded.tips && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white p-3 rounded border border-blue-100">
              <h5 className="font-semibold text-blue-900 mb-1">Retirement Annuity</h5>
              <p className="text-gray-700 text-xs">Contribute up to 27.5% of taxable income (max R350,000). Tax-deductible + compounds tax-free.</p>
            </div>
            <div className="bg-white p-3 rounded border border-blue-100">
              <h5 className="font-semibold text-blue-900 mb-1">Tax-Free Savings (TFSA)</h5>
              <p className="text-gray-700 text-xs">R36,000/year (R500,000 lifetime). Investment growth completely tax-free.</p>
            </div>
            <div className="bg-white p-3 rounded border border-blue-100">
              <h5 className="font-semibold text-blue-900 mb-1">Medical Aid Tax Credit</h5>
              <p className="text-gray-700 text-xs">R364/month for you + R364 for first dependent + R246 for each additional.</p>
            </div>
            <div className="bg-white p-3 rounded border border-blue-100">
              <h5 className="font-semibold text-blue-900 mb-1">Section 18A Donations</h5>
              <p className="text-gray-700 text-xs">Donate to registered PBOs (charities). Tax-deductible up to 10% of taxable income.</p>
            </div>
          </div>

          <div className="bg-white rounded p-3 border border-blue-200">
            <p className="text-xs text-gray-600 flex gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span><strong>Pro Tip:</strong> Maximize RA contributions before tax year-end (Feb 28). Every R10k saved = R4.5k tax reduction at top bracket.</span>
            </p>
          </div>
        </div>
      )}

      {/* Breakdown */}
      <button
        onClick={() => setExpanded({ ...expanded, breakdown: !expanded.breakdown })}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-100 transition"
      >
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Tax Calculation Breakdown</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 transition transform ${
            expanded.breakdown ? 'rotate-180' : ''
          }`}
        />
      </button>
      {expanded.breakdown && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Gross Income</span>
            <span className="font-medium">{formatCurrency(salariedCalc.gross)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span className="text-gray-600">Standard Deduction (from age)</span>
            <span className="font-medium">- {formatCurrency(salariedCalc.standardDeduction)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Taxable Income</span>
            <span>{formatCurrency(salariedCalc.taxableIncome)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span className="text-gray-600">Tax on Brackets</span>
            <span className="font-medium">- {formatCurrency(salariedCalc.tax + salariedCalc.taxRelief + salariedCalc.medicalCredit)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span className="text-gray-600">Tax Rebate (Age)</span>
            <span className="font-medium">+ {formatCurrency(salariedCalc.taxRelief)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span className="text-gray-600">Medical Credit</span>
            <span className="font-medium">+ {formatCurrency(salariedCalc.medicalCredit)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Final Tax</span>
            <span className="text-red-600">{formatCurrency(salariedCalc.tax)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Net Income (After Tax)</span>
            <span className="text-green-600">{formatCurrency(salariedCalc.netIncome)}</span>
          </div>
        </div>
      )}
    </div>
  </div>
);

const BusinessTab: React.FC<BusinessTabProps> = ({
  businessRevenue,
  setBusinessRevenue,
  businessExpenses,
  setBusinessExpenses,
  deductions,
  setDeductions,
  expanded,
  setExpanded,
  businessCalc,
  formatCurrency,
}) => (
  <div className="space-y-6">
    {/* Input Section */}
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Revenue (Turnover)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">R</span>
            <input
              type="number"
              value={businessRevenue}
              onChange={(e) => setBusinessRevenue(Math.max(0, Number(e.target.value)))}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Total income before expenses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operating Expenses
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">R</span>
              <input
                type="number"
                value={businessExpenses}
                onChange={(e) => setBusinessExpenses(Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Salaries, rent, utilities, etc.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Other Valid Deductions
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">R</span>
              <input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Travel, equipment, training, etc.</p>
          </div>
        </div>
      </div>
    </div>

    {/* Key Results */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white border-2 border-red-500 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-1">Business Tax</div>
        <div className="text-2xl font-bold text-red-600">
          {formatCurrency(businessCalc.tax)}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {businessCalc.effectiveRate}% effective rate
        </div>
      </div>

      <div className="bg-white border-2 border-green-500 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-1">Net Profit After Tax</div>
        <div className="text-2xl font-bold text-green-600">
          {formatCurrency(businessCalc.netProfit)}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {((businessCalc.netProfit / businessCalc.revenue) * 100).toFixed(1)}% profit margin
        </div>
      </div>

      <div className="bg-white border-2 border-orange-500 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-1">Tax Saved by Deductions</div>
        <div className="text-2xl font-bold text-orange-600">
          {formatCurrency(businessCalc.deductionsSaved)}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          From {formatCurrency(businessCalc.deductions)} claimed
        </div>
      </div>
    </div>

    {/* Expandable Sections */}
    <div className="space-y-3">
      {/* Deductions */}
      <button
        onClick={() => setExpanded({ ...expanded, deductions: !expanded.deductions })}
        className="w-full bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center hover:bg-green-100 transition"
      >
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-700">Business Deductions Guide</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 transition transform ${
            expanded.deductions ? 'rotate-180' : ''
          }`}
        />
      </button>
      {expanded.deductions && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white p-3 rounded border border-green-100">
              <h5 className="font-semibold text-green-900 mb-1">Travel & Accommodation</h5>
              <p className="text-gray-700 text-xs">Business travel, client site visits, accommodation for work purposes, client entertainment</p>
            </div>
            <div className="bg-white p-3 rounded border border-green-100">
              <h5 className="font-semibold text-green-900 mb-1">Equipment & Technology</h5>
              <p className="text-gray-700 text-xs">Software licenses, computers, machinery, tools. Claim depreciation over useful life.</p>
            </div>
            <div className="bg-white p-3 rounded border border-green-100">
              <h5 className="font-semibold text-green-900 mb-1">Professional Development</h5>
              <p className="text-gray-700 text-xs">Training, certifications, conference attendance, industry events, professional memberships</p>
            </div>
            <div className="bg-white p-3 rounded border border-green-100">
              <h5 className="font-semibold text-green-900 mb-1">Licenses & Compliance</h5>
              <p className="text-gray-700 text-xs">Business licenses, industry permits, regulatory compliance, professional registrations</p>
            </div>
            <div className="bg-white p-3 rounded border border-green-100">
              <h5 className="font-semibold text-green-900 mb-1">Subcontracting & Services</h5>
              <p className="text-gray-700 text-xs">Freelancers, specialized services, outsourced work, temporary labor, agency fees</p>
            </div>
            <div className="bg-white p-3 rounded border border-green-100">
              <h5 className="font-semibold text-green-900 mb-1">Operating Supplies</h5>
              <p className="text-gray-700 text-xs">Office supplies, consumables, materials, maintenance, repairs, utilities</p>
            </div>
          </div>

          <div className="bg-white rounded p-3 border border-green-200">
            <p className="text-xs text-gray-600 flex gap-2">
              <Info className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Pro Tip:</strong> Keep detailed records & receipts. Underclaimed deductions = overpaid taxes. Review all categories above.</span>
            </p>
          </div>
        </div>
      )}

      {/* Breakdown */}
      <button
        onClick={() => setExpanded({ ...expanded, breakdown: !expanded.breakdown })}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:bg-gray-100 transition"
      >
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Profit & Tax Breakdown</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 transition transform ${
            expanded.breakdown ? 'rotate-180' : ''
          }`}
        />
      </button>
      {expanded.breakdown && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Annual Revenue</span>
            <span className="font-medium">{formatCurrency(businessCalc.revenue)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span className="text-gray-600">Operating Expenses</span>
            <span className="font-medium">- {formatCurrency(businessCalc.expenses)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span className="text-gray-600">Other Valid Deductions</span>
            <span className="font-medium">- {formatCurrency(businessCalc.deductions)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Taxable Business Profit</span>
            <span className="text-green-600">{formatCurrency(businessCalc.profit)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span className="text-gray-600">Corporate Income Tax (on profit)</span>
            <span className="font-medium">- {formatCurrency(businessCalc.tax)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Net Profit After Tax</span>
            <span className="text-green-600">{formatCurrency(businessCalc.netProfit)}</span>
          </div>
        </div>
      )}
    </div>
  </div>
);

const SATaxCalculator: React.FC = () => {
  const [calculatorType, setCalculatorType] = useState<'salaried' | 'business'>('salaried');
  const [grossIncome, setGrossIncome] = useState<number>(850000);
  const [age, setAge] = useState<number>(35);
  const [medicalScheme, setMedicalScheme] = useState<boolean>(false);
  const [businessRevenue, setBusinessRevenue] = useState<number>(2000000);
  const [businessExpenses, setBusinessExpenses] = useState<number>(600000);
  const [deductions, setDeductions] = useState<number>(150000);
  const [expanded, setExpanded] = useState<ExpandedState>({
    tips: false,
    deductions: false,
    breakdown: false,
  });

  // SA Tax Brackets 2025/26
  const TAX_BRACKETS: TaxBracket[] = [
    { threshold: 237100, rate: 0.18 },
    { threshold: 370500, rate: 0.26 },
    { threshold: 512800, rate: 0.31 },
    { threshold: 673000, rate: 0.36 },
    { threshold: 859000, rate: 0.39 },
    { threshold: 1817000, rate: 0.41 },
    { threshold: Infinity, rate: 0.45 },
  ];

  const STANDARD_DEDUCTION = 87300;
  const THRESHOLD_UNDER_65 = 87300;
  const TAX_RELIEF_UNDER_65 = 17235;
  const TAX_RELIEF_65_75 = 29940;
  const TAX_RELIEF_75_PLUS = 36360;
  const MEDICAL_SCHEME_CREDIT = 0.33;

  // Calculate tax for salaried individuals
  const calculateSalariedTax = (): SalariedCalculationResult => {
    const taxableIncome = Math.max(0, grossIncome - STANDARD_DEDUCTION);
    
    let tax = 0;
    let previousThreshold = 0;

    for (const bracket of TAX_BRACKETS) {
      if (taxableIncome <= previousThreshold) break;
      
      const taxableInThisBracket = Math.min(
        taxableIncome - previousThreshold,
        bracket.threshold - previousThreshold
      );
      tax += taxableInThisBracket * bracket.rate;
      previousThreshold = bracket.threshold;
    }

    // Apply tax relief
    let taxRelief = TAX_RELIEF_UNDER_65;
    if (age >= 75) {
      taxRelief = TAX_RELIEF_75_PLUS;
    } else if (age >= 65) {
      taxRelief = TAX_RELIEF_65_75;
    }

    tax = Math.max(0, tax - taxRelief);

    // Medical scheme tax credit
    let medicalCredit = 0;
    if (medicalScheme) {
      medicalCredit = Math.min(tax, 348 * 12 * MEDICAL_SCHEME_CREDIT);
    }

    const finalTax = Math.max(0, tax - medicalCredit);
    const netIncome = grossIncome - finalTax;

    return {
      gross: grossIncome,
      standardDeduction: STANDARD_DEDUCTION,
      taxableIncome: taxableIncome,
      tax: finalTax,
      taxRelief: taxRelief,
      medicalCredit: medicalCredit,
      netIncome: netIncome,
      effectiveRate: (finalTax / grossIncome * 100).toFixed(2),
      monthlyNet: (netIncome / 12).toFixed(0),
    };
  };

  // Calculate tax for businesses
  const calculateBusinessTax = (): BusinessCalculationResult => {
    const totalDeductions = businessExpenses + deductions;
    const businessProfit = businessRevenue - totalDeductions;
    const taxableIncome = Math.max(0, businessProfit);

    let tax = 0;
    let previousThreshold = 0;

    for (const bracket of TAX_BRACKETS) {
      if (taxableIncome <= previousThreshold) break;
      
      const taxableInThisBracket = Math.min(
        taxableIncome - previousThreshold,
        bracket.threshold - previousThreshold
      );
      tax += taxableInThisBracket * bracket.rate;
      previousThreshold = bracket.threshold;
    }

    const netProfit = businessProfit - tax;

    return {
      revenue: businessRevenue,
      expenses: businessExpenses,
      deductions: deductions,
      totalDeductions: totalDeductions,
      profit: businessProfit,
      tax: tax,
      netProfit: netProfit,
      effectiveRate: businessProfit > 0 ? (tax / businessProfit * 100).toFixed(2) : 0,
      deductionsSaved: (deductions * 0.39).toFixed(0),
    };
  };

  const formatCurrency = (value: number | string): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  const salariedCalc = calculateSalariedTax();
  const businessCalc = calculateBusinessTax();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            South African Tax Calculator
          </h1>
          <p className="text-gray-300">
            Calculate your tax and find ways to save. For salaried professionals and business owners.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-700 rounded-lg p-1 w-fit mx-auto">
          <button
            onClick={() => setCalculatorType('salaried')}
            className={`px-6 py-2 rounded-md font-medium transition ${
              calculatorType === 'salaried'
                ? 'bg-red-500 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Salaried Employee
          </button>
          <button
            onClick={() => setCalculatorType('business')}
            className={`px-6 py-2 rounded-md font-medium transition ${
              calculatorType === 'business'
                ? 'bg-red-500 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Business Owner
          </button>
        </div>

        {/* Calculator Content */}
        <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8">
          {calculatorType === 'salaried' ? (
            <SalariedTab
              grossIncome={grossIncome}
              setGrossIncome={setGrossIncome}
              age={age}
              setAge={setAge}
              medicalScheme={medicalScheme}
              setMedicalScheme={setMedicalScheme}
              expanded={expanded}
              setExpanded={setExpanded}
              salariedCalc={salariedCalc}
              formatCurrency={formatCurrency}
            />
          ) : (
            <BusinessTab
              businessRevenue={businessRevenue}
              setBusinessRevenue={setBusinessRevenue}
              businessExpenses={businessExpenses}
              setBusinessExpenses={setBusinessExpenses}
              deductions={deductions}
              setDeductions={setDeductions}
              expanded={expanded}
              setExpanded={setExpanded}
              businessCalc={businessCalc}
              formatCurrency={formatCurrency}
            />
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>
            ⚠️ This calculator provides estimates based on 2025/26 SA tax year. Consult a tax professional for accurate calculations.
          </p>
          <p className="mt-2 text-gray-500">
            Powered by The Process Enterprise | tax.processx.co.za
          </p>
        </div>
      </div>
    </div>
  );
};

export default SATaxCalculator;