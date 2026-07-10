import React from 'react';
import { ChevronDown, DollarSign, Calculator, Info } from 'lucide-react';
import type { BusinessTabProps } from '@/types';

export const BusinessTab: React.FC<BusinessTabProps> = ({
  businessRevenue,
  setBusinessRevenue,
  businessExpenses,
  setBusinessExpenses,
  deductions,
  setDeductions,
  businessType,
  setBusinessType,
  expanded,
  setExpanded,
  businessCalc,
  formatCurrency,
}) => (
  <div className="space-y-6">
    {/* Input Section */}
    <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-gray-100">
      <div className="space-y-4">
        {/* Business Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Type
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setBusinessType('sbc')}
              className={`flex-1 px-4 py-3 rounded-xl transition font-medium ${
                businessType === 'sbc'
                  ? 'bg-[#062C2E] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Small Business (SBC)
            </button>
            <button
              onClick={() => setBusinessType('company')}
              className={`flex-1 px-4 py-3 rounded-xl transition font-medium ${
                businessType === 'company'
                  ? 'bg-[#062C2E] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Standard Company
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {businessType === 'sbc'
              ? 'Progressive rates: 0%-27% (max revenue R20M)'
              : 'Flat 27% corporate tax rate'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Revenue (Turnover)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">R</span>
            <input
              type="number"
              value={businessRevenue || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || value === '-') {
                  setBusinessRevenue(0);
                } else {
                  setBusinessRevenue(Math.max(0, Number(value)));
                }
              }}
              placeholder="0"
              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8FF3F] focus:border-[#062C2E] text-gray-900 font-medium placeholder:text-gray-400 transition-all"
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
                value={businessExpenses || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || value === '-') {
                    setBusinessExpenses(0);
                  } else {
                    setBusinessExpenses(Math.max(0, Number(value)));
                  }
                }}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8FF3F] focus:border-[#062C2E] text-gray-900 font-medium placeholder:text-gray-400 transition-all"
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
                value={deductions || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || value === '-') {
                    setDeductions(0);
                  } else {
                    setDeductions(Math.max(0, Number(value)));
                  }
                }}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8FF3F] focus:border-[#062C2E] text-gray-900 font-medium placeholder:text-gray-400 transition-all"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Travel, equipment, training, etc.</p>
          </div>
        </div>
      </div>
    </div>

    {/* Key Results */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white border-2 border-red-200 rounded-2xl p-5 hover:border-red-300 transition-colors">
        <div className="text-sm text-gray-600 mb-1">Business Tax</div>
        <div className="text-2xl font-bold text-red-600">
          {formatCurrency(businessCalc.tax)}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {businessCalc.effectiveRate}% effective rate
        </div>
      </div>

      <div className="bg-white border-2 border-green-200 rounded-2xl p-5 hover:border-green-300 transition-colors">
        <div className="text-sm text-gray-600 mb-1">Net Profit After Tax</div>
        <div className="text-2xl font-bold text-green-600">
          {formatCurrency(businessCalc.netProfit)}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {((businessCalc.netProfit / businessCalc.revenue) * 100).toFixed(1)}% profit margin
        </div>
      </div>

      <div className="bg-white border-2 border-[#E8FF3F] rounded-2xl p-5 hover:shadow-lg transition-all">
        <div className="text-sm text-gray-600 mb-1">Tax Saved by Deductions</div>
        <div className="text-2xl font-bold text-[#062C2E]">
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
        className="w-full bg-[#E8FF3F]/10 border border-[#E8FF3F]/30 rounded-2xl p-4 flex justify-between items-center hover:bg-[#E8FF3F]/20 transition"
      >
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#062C2E]" />
          <span className="font-medium text-[#062C2E]">Business Deductions Guide</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-[#062C2E] transition transform ${
            expanded.deductions ? 'rotate-180' : ''
          }`}
        />
      </button>
      {expanded.deductions && (
        <div className="bg-[#E8FF3F]/5 border border-[#E8FF3F]/20 rounded-2xl p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <h5 className="font-semibold text-[#062C2E] mb-1">Travel & Accommodation</h5>
              <p className="text-gray-600 text-xs">Business travel, client site visits, accommodation for work purposes, client entertainment</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <h5 className="font-semibold text-[#062C2E] mb-1">Equipment & Technology</h5>
              <p className="text-gray-600 text-xs">Software licenses, computers, machinery, tools. Claim depreciation over useful life.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <h5 className="font-semibold text-[#062C2E] mb-1">Professional Development</h5>
              <p className="text-gray-600 text-xs">Training, certifications, conference attendance, industry events, professional memberships</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <h5 className="font-semibold text-[#062C2E] mb-1">Licenses & Compliance</h5>
              <p className="text-gray-600 text-xs">Business licenses, industry permits, regulatory compliance, professional registrations</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <h5 className="font-semibold text-[#062C2E] mb-1">Subcontracting & Services</h5>
              <p className="text-gray-600 text-xs">Freelancers, specialized services, outsourced work, temporary labor, agency fees</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <h5 className="font-semibold text-[#062C2E] mb-1">Operating Supplies</h5>
              <p className="text-gray-600 text-xs">Office supplies, consumables, materials, maintenance, repairs, utilities</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#E8FF3F]/30">
            <p className="text-xs text-gray-600 flex gap-2">
              <Info className="w-4 h-4 text-[#062C2E] flex-shrink-0 mt-0.5" />
              <span><strong>Pro Tip:</strong> Keep detailed records & receipts. Underclaimed deductions = overpaid taxes. Review all categories above.</span>
            </p>
          </div>
        </div>
      )}

      {/* Breakdown */}
      <button
        onClick={() => setExpanded({ ...expanded, breakdown: !expanded.breakdown })}
        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-2xl p-4 flex justify-between items-center hover:bg-gray-100 transition"
      >
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Profit & Tax Breakdown</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition transform ${
            expanded.breakdown ? 'rotate-180' : ''
          }`}
        />
      </button>
      {expanded.breakdown && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Annual Revenue</span>
            <span className="font-medium text-gray-900">{formatCurrency(businessCalc.revenue)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span className="text-gray-600">Operating Expenses</span>
            <span className="font-medium">- {formatCurrency(businessCalc.expenses)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span className="text-gray-600">Other Valid Deductions</span>
            <span className="font-medium">- {formatCurrency(businessCalc.deductions)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-bold">
            <span className="text-gray-900">Taxable Business Profit</span>
            <span className="text-green-600">{formatCurrency(businessCalc.profit)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span className="text-gray-600">Corporate Income Tax (on profit)</span>
            <span className="font-medium">- {formatCurrency(businessCalc.tax)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-bold">
            <span className="text-gray-900">Net Profit After Tax</span>
            <span className="text-green-600">{formatCurrency(businessCalc.netProfit)}</span>
          </div>
        </div>
      )}
    </div>
  </div>
);
