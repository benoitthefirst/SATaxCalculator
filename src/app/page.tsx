'use client';

import React, { useState } from 'react';
import { SalariedTab } from '@/components/SalariedTab';
import { BusinessTab } from '@/components/BusinessTab';
import type {
  TaxBracket,
  ExpandedState,
  SalariedCalculationResult,
  BusinessCalculationResult
} from '@/types';

const SATaxCalculator: React.FC = () => {
  const [calculatorType, setCalculatorType] = useState<'salaried' | 'business'>('salaried');
  const [grossIncome, setGrossIncome] = useState<number>(0);
  const [age, setAge] = useState<number>(35);
  const [medicalScheme, setMedicalScheme] = useState<boolean>(false);
  const [businessRevenue, setBusinessRevenue] = useState<number>(0);
  const [businessExpenses, setBusinessExpenses] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [businessType, setBusinessType] = useState<'sbc' | 'company'>('sbc');
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

    if (businessType === 'sbc') {
      // Small Business Corporation tax brackets 2025/26
      if (taxableIncome <= 95750) {
        tax = 0;
      } else if (taxableIncome <= 365000) {
        tax = (taxableIncome - 95750) * 0.07;
      } else if (taxableIncome <= 550000) {
        tax = 18848 + (taxableIncome - 365000) * 0.21;
      } else {
        tax = 57698 + (taxableIncome - 550000) * 0.27;
      }
    } else {
      // Standard company - flat 27% rate
      tax = taxableIncome * 0.27;
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "South African Tax Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "ZAR"
    },
    "description": "Free South African tax calculator for the 2025/26 tax year. Calculate SARS income tax for salaried employees and business owners with tax brackets, deductions, and rebates.",
    "url": "https://taxcalculator.theprocesse.com",
    "author": {
      "@type": "Organization",
      "name": "The Process Enterprise"
    },
    "provider": {
      "@type": "Organization",
      "name": "The Process Enterprise",
      "url": "https://theprocesse.com"
    },
    "featureList": [
      "Calculate income tax for salaried employees",
      "Calculate corporate tax for businesses",
      "View tax brackets for 2025/26",
      "Calculate tax deductions and rebates",
      "Medical aid tax credits",
      "Retirement annuity contributions",
      "Tax-saving strategies",
      "Business expense deductions"
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "South African taxpayers, salaried employees, business owners"
    },
    "inLanguage": "en-ZA",
    "about": {
      "@type": "Thing",
      "name": "South African Income Tax",
      "sameAs": "https://www.sars.gov.za/"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
              businessType={businessType}
              setBusinessType={setBusinessType}
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
    </>
  );
};

export default SATaxCalculator;