import React from 'react';
import { ChevronDown, TrendingDown, Calculator, Info } from 'lucide-react';
import type { SalariedTabProps } from '@/types';

export const SalariedTab: React.FC<SalariedTabProps> = ({
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
