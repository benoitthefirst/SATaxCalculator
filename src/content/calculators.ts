// Tax calculator landing pages for SEO
// Targets high-value tax calculator keywords for South Africa

export interface Calculator {
  id: string
  slug: string
  name: string
  headline: string
  subheadline: string
  description: string
  icon: string
  type: 'business' | 'personal' | 'both'
  features: { title: string; description: string; icon: string }[]
  howItWorks: { step: number; title: string; description: string }[]
  benefits: string[]
  faqs: { question: string; answer: string }[]
  keywords: string[]
  metaTitle: string
  metaDescription: string
}

export const calculators: Calculator[] = [
  {
    id: 'business-tax-calculator',
    slug: 'business-tax-calculator',
    name: 'Business Tax Calculator',
    headline: 'Free Business Tax Calculator South Africa',
    subheadline: 'Calculate your company tax, VAT, and deductions in minutes',
    description: 'Our free business tax calculator helps South African businesses calculate their tax liability accurately. Get instant estimates for company tax, VAT, provisional tax, and allowable deductions.',
    icon: 'Building2',
    type: 'business',
    features: [
      { title: 'Company Tax Calculation', description: 'Calculate your company income tax at the current 27% rate with all applicable deductions.', icon: 'Calculator' },
      { title: 'VAT Estimation', description: 'Estimate your VAT liability and payments based on your turnover and expenses.', icon: 'Receipt' },
      { title: 'Provisional Tax', description: 'Calculate your provisional tax payments for IRP6 submissions.', icon: 'Calendar' },
      { title: 'Deduction Optimizer', description: 'Identify all allowable deductions to minimize your tax liability legally.', icon: 'TrendingDown' }
    ],
    howItWorks: [
      { step: 1, title: 'Enter Your Revenue', description: 'Input your annual business revenue and income sources.' },
      { step: 2, title: 'Add Your Expenses', description: 'Enter your business expenses and deductible costs.' },
      { step: 3, title: 'Get Instant Results', description: 'See your estimated tax liability with breakdown by tax type.' }
    ],
    benefits: [
      'Accurate calculations using current SARS rates',
      'Includes all allowable business deductions',
      'VAT registered and non-VAT options',
      'Export results for your accountant',
      'Updated for 2024/2025 tax year'
    ],
    faqs: [
      { question: 'What is the company tax rate in South Africa?', answer: 'The company tax rate in South Africa is 27% for years of assessment ending on or after 31 March 2023. This applies to all companies registered with CIPC.' },
      { question: 'Do I need to register for VAT?', answer: 'You must register for VAT if your taxable turnover exceeds R1 million in any 12-month period. You can voluntarily register if your turnover exceeds R50,000.' },
      { question: 'What business expenses are tax deductible?', answer: 'Deductible expenses include rent, salaries, utilities, office supplies, travel (business-related), professional fees, insurance, and depreciation on assets used for business.' },
      { question: 'When are provisional tax payments due?', answer: 'Provisional tax is paid twice a year: first payment within 6 months after the start of your tax year, second payment at the end of your tax year.' }
    ],
    keywords: ['business tax calculator', 'business tax calculator south africa', 'company tax calculator', 'company tax calculator south africa', 'calculate business tax'],
    metaTitle: 'Business Tax Calculator South Africa | Free Company Tax Calculator',
    metaDescription: 'Free business tax calculator for South Africa. Calculate company tax at 27%, VAT, provisional tax, and deductions. SARS compliant. Get instant results.'
  },
  {
    id: 'company-tax-calculator',
    slug: 'company-tax-calculator',
    name: 'Company Tax Calculator',
    headline: 'South African Company Tax Calculator',
    subheadline: 'Calculate your corporate income tax liability instantly',
    description: 'Calculate your South African company tax with our free online calculator. Get accurate estimates of your corporate income tax at the 27% rate, including SBC rates for qualifying small businesses.',
    icon: 'Building',
    type: 'business',
    features: [
      { title: 'Standard Company Rate', description: 'Calculate tax at the standard 27% company tax rate for all companies.', icon: 'Percent' },
      { title: 'Small Business Corporation', description: 'Check if you qualify for reduced SBC tax rates and calculate savings.', icon: 'BadgePercent' },
      { title: 'Turnover Tax Option', description: 'Compare turnover tax vs standard tax for micro businesses.', icon: 'Scale' },
      { title: 'Tax-Free Thresholds', description: 'Understand exemptions and tax-free portions of your income.', icon: 'Shield' }
    ],
    howItWorks: [
      { step: 1, title: 'Select Company Type', description: 'Choose between standard company, SBC, or turnover tax.' },
      { step: 2, title: 'Enter Taxable Income', description: 'Input your company\'s taxable income after deductions.' },
      { step: 3, title: 'View Tax Breakdown', description: 'See your tax liability with detailed breakdown and effective rate.' }
    ],
    benefits: [
      'Compare different tax structures',
      'SBC qualification checker included',
      'Effective tax rate calculation',
      'Historical rate comparison',
      'SARS-aligned calculations'
    ],
    faqs: [
      { question: 'What is the difference between company tax and income tax?', answer: 'Company tax (corporate income tax) is paid by registered companies (Pty Ltd) on profits. Income tax is paid by individuals, sole proprietors, and partners on personal income.' },
      { question: 'What is a Small Business Corporation (SBC)?', answer: 'An SBC is a company with gross income under R20 million, where shareholders are natural persons. SBCs enjoy progressive tax rates starting from 0% on the first R95,750.' },
      { question: 'Can I reduce my company tax?', answer: 'Yes, through legitimate deductions including salaries, rent, depreciation, donations (limited), retirement fund contributions, and other business expenses.' },
      { question: 'When is company tax due?', answer: 'Companies must submit their annual tax return within 12 months of their financial year-end and pay any outstanding tax. Provisional payments are due during the year.' }
    ],
    keywords: ['company tax calculator', 'company tax calculator south africa', 'corporate tax calculator', 'company income tax calculator', 'pty ltd tax calculator'],
    metaTitle: 'Company Tax Calculator South Africa | Corporate Income Tax 2024',
    metaDescription: 'Calculate South African company tax online. Standard 27% rate and SBC rates. Free corporate income tax calculator with SARS-compliant calculations.'
  },
  {
    id: 'tax-refund-calculator',
    slug: 'tax-refund-calculator',
    name: 'Tax Refund Calculator',
    headline: 'SARS Tax Refund Calculator South Africa',
    subheadline: 'Find out if you qualify for a tax refund and estimate how much',
    description: 'Use our free tax refund calculator to estimate your SARS refund. See if you\'ve overpaid tax through PAYE and calculate your potential refund amount based on your deductions and tax credits.',
    icon: 'Wallet',
    type: 'personal',
    features: [
      { title: 'Refund Estimation', description: 'Calculate your estimated refund based on PAYE paid vs actual tax liability.', icon: 'Calculator' },
      { title: 'Deduction Checker', description: 'Identify deductions you may have missed that increase your refund.', icon: 'Search' },
      { title: 'Medical Credits', description: 'Calculate medical tax credits for yourself and dependants.', icon: 'Heart' },
      { title: 'Retirement Deductions', description: 'See how RA and pension contributions reduce your tax.', icon: 'PiggyBank' }
    ],
    howItWorks: [
      { step: 1, title: 'Enter Income & PAYE', description: 'Input your annual income and PAYE tax already paid.' },
      { step: 2, title: 'Add Deductions', description: 'Enter medical aid, retirement, and other deductions.' },
      { step: 3, title: 'See Your Refund', description: 'Get your estimated refund or amount owing instantly.' }
    ],
    benefits: [
      'Estimate refund before filing',
      'Identify missed deductions',
      'Medical tax credit calculator included',
      'Retirement contribution optimizer',
      'Based on current SARS tax tables'
    ],
    faqs: [
      { question: 'How do I know if I will get a tax refund?', answer: 'You\'ll get a refund if the PAYE deducted from your salary exceeds your actual tax liability after deductions. This often happens if you have medical expenses, retirement contributions, or other deductions.' },
      { question: 'How long does SARS take to pay refunds?', answer: 'SARS aims to process refunds within 72 hours for eFiling submissions with no issues. Complex cases or those requiring verification can take 21 working days or longer.' },
      { question: 'What deductions can increase my refund?', answer: 'Common deductions include retirement annuity contributions, medical expenses exceeding medical tax credits, home office expenses, travel allowance claims, and donations to approved PBOs.' },
      { question: 'Do I need to file a return to get a refund?', answer: 'Yes, you must submit a tax return to SARS to claim a refund. Even if you\'re not required to file, you should if you\'re entitled to a refund.' }
    ],
    keywords: ['tax refund calculator', 'sars tax refund calculator', 'tax refund calculator south africa', 'am i due a tax refund', 'calculate tax refund'],
    metaTitle: 'Tax Refund Calculator South Africa | SARS Refund Estimator 2024',
    metaDescription: 'Free SARS tax refund calculator. Estimate your South African tax refund in minutes. Check if you\'ve overpaid PAYE and calculate your refund amount.'
  },
  {
    id: 'total-cost-to-company-calculator',
    slug: 'total-cost-to-company-calculator',
    name: 'Total Cost to Company Calculator',
    headline: 'Total Cost to Company Calculator South Africa',
    subheadline: 'Convert between CTC and take-home pay accurately',
    description: 'Calculate total cost to company (CTC) packages and see your actual take-home pay. Understand how salary, benefits, UIF, SDL, and tax affect your net income.',
    icon: 'Banknote',
    type: 'personal',
    features: [
      { title: 'CTC to Net Calculator', description: 'Convert your CTC package to actual monthly take-home pay.', icon: 'ArrowDown' },
      { title: 'Salary to CTC', description: 'Calculate the full cost to company from a net salary.', icon: 'ArrowUp' },
      { title: 'Benefits Breakdown', description: 'See how medical aid, pension, and other benefits affect your pay.', icon: 'ListChecks' },
      { title: 'Tax & UIF Calculation', description: 'Calculate PAYE, UIF, and SDL deductions accurately.', icon: 'Receipt' }
    ],
    howItWorks: [
      { step: 1, title: 'Enter Package Details', description: 'Input your CTC or desired net salary.' },
      { step: 2, title: 'Add Benefits', description: 'Specify medical aid, retirement, and other benefits.' },
      { step: 3, title: 'View Full Breakdown', description: 'See CTC, gross, deductions, and net pay clearly.' }
    ],
    benefits: [
      'Accurate CTC to net conversion',
      'Includes all statutory deductions',
      'Compare different package structures',
      'Useful for salary negotiations',
      'Updated with current tax rates'
    ],
    faqs: [
      { question: 'What is Total Cost to Company?', answer: 'Total Cost to Company (CTC) is the total amount an employer pays for an employee, including basic salary, benefits (medical aid, retirement), and employer contributions (UIF, SDL).' },
      { question: 'How do I calculate take-home pay from CTC?', answer: 'Subtract company-paid benefits, then calculate PAYE tax, UIF (1%), and any other deductions from the remaining gross salary to get your net take-home pay.' },
      { question: 'What is SDL and who pays it?', answer: 'Skills Development Levy (SDL) is 1% of total employee remuneration, paid by employers. It funds skills development in South Africa and is not deducted from your salary.' },
      { question: 'How much UIF is deducted from salary?', answer: 'UIF contribution is 2% of your salary, split equally: 1% is deducted from your salary, and 1% is contributed by your employer. Maximum contribution is based on earnings of R17,712 per month.' }
    ],
    keywords: ['total cost to company calculator', 'total cost to company calculator south africa', 'ctc calculator', 'cost to company calculator', 'salary to ctc calculator'],
    metaTitle: 'Total Cost to Company Calculator South Africa | CTC Calculator',
    metaDescription: 'Free total cost to company calculator. Convert CTC to take-home pay instantly. Includes PAYE, UIF, medical aid, and pension calculations for South Africa.'
  },
  {
    id: 'how-to-calculate-tax',
    slug: 'how-to-calculate-tax',
    name: 'How to Calculate Tax',
    headline: 'How to Calculate Tax in South Africa',
    subheadline: 'Complete guide to calculating personal and business taxes',
    description: 'Learn how to calculate tax in South Africa with our comprehensive guide and free calculators. Understand tax brackets, deductions, rebates, and how SARS calculates your tax.',
    icon: 'GraduationCap',
    type: 'both',
    features: [
      { title: 'Tax Brackets Explained', description: 'Understand South Africa\'s progressive tax brackets and marginal rates.', icon: 'Layers' },
      { title: 'Deduction Guide', description: 'Learn which deductions you can claim to reduce taxable income.', icon: 'ListMinus' },
      { title: 'Tax Rebates', description: 'Primary, secondary, and tertiary rebates explained with calculations.', icon: 'BadgePercent' },
      { title: 'Step-by-Step Calculation', description: 'Follow our guide to calculate your own tax liability.', icon: 'CheckSquare' }
    ],
    howItWorks: [
      { step: 1, title: 'Calculate Gross Income', description: 'Add all your income sources: salary, investments, rental, etc.' },
      { step: 2, title: 'Subtract Deductions', description: 'Deduct allowable expenses and contributions.' },
      { step: 3, title: 'Apply Tax Tables', description: 'Use SARS tax tables to calculate tax on taxable income.' },
      { step: 4, title: 'Subtract Rebates', description: 'Apply age-based rebates to reduce final tax amount.' }
    ],
    benefits: [
      'Understand how tax is calculated',
      'Learn to maximize deductions',
      'Know your marginal tax rate',
      'Calculate tax yourself',
      'Make informed financial decisions'
    ],
    faqs: [
      { question: 'What are the tax brackets in South Africa 2024?', answer: 'For 2024/25: 18% (R1-R237,100), 26% (R237,101-R370,500), 31% (R370,501-R512,800), 36% (R512,801-R673,000), 39% (R673,001-R857,900), 41% (R857,901-R1,817,000), 45% (over R1,817,000).' },
      { question: 'How is PAYE calculated?', answer: 'PAYE is calculated by your employer using SARS tax tables. Your annual salary is used to determine your tax bracket, then divided into monthly payments after applying rebates.' },
      { question: 'What is marginal tax rate?', answer: 'Your marginal tax rate is the rate applied to your last rand of income. For example, if you earn R400,000, your marginal rate is 31%, but your effective rate is lower due to progressive brackets.' },
      { question: 'How do tax rebates work?', answer: 'Tax rebates directly reduce your tax liability. Primary rebate (all taxpayers): R17,235. Secondary rebate (65+): R9,444. Tertiary rebate (75+): R3,145. These are subtracted from calculated tax.' }
    ],
    keywords: ['how to calculate tax', 'how to calculate tax in south africa', 'tax calculation south africa', 'calculate income tax', 'sars tax calculation'],
    metaTitle: 'How to Calculate Tax in South Africa | Tax Calculation Guide 2024',
    metaDescription: 'Learn how to calculate tax in South Africa. Free guide covering tax brackets, deductions, rebates, and step-by-step calculation with examples.'
  },
  {
    id: 'how-to-calculate-business-tax',
    slug: 'how-to-calculate-business-tax',
    name: 'How to Calculate Business Tax',
    headline: 'How to Calculate Business Tax in South Africa',
    subheadline: 'Step-by-step guide to calculating tax for your business',
    description: 'Learn how to calculate business tax in South Africa. Covers company tax, sole proprietor tax, partnership tax, and which expenses you can deduct from your business income.',
    icon: 'BookOpen',
    type: 'business',
    features: [
      { title: 'Company vs Sole Proprietor', description: 'Understand the tax difference between company and personal tax rates.', icon: 'GitBranch' },
      { title: 'Taxable Income Calculation', description: 'Learn how to calculate your business taxable income correctly.', icon: 'Calculator' },
      { title: 'Deductible Expenses', description: 'Complete list of expenses you can deduct from business income.', icon: 'ListChecks' },
      { title: 'Provisional Tax Guide', description: 'Understand provisional tax calculations and payment schedules.', icon: 'Calendar' }
    ],
    howItWorks: [
      { step: 1, title: 'Determine Business Structure', description: 'Company (27%), sole proprietor (personal rates), or partnership.' },
      { step: 2, title: 'Calculate Gross Profit', description: 'Revenue minus cost of sales equals gross profit.' },
      { step: 3, title: 'Deduct Allowable Expenses', description: 'Subtract all legitimate business expenses.' },
      { step: 4, title: 'Apply Correct Tax Rate', description: 'Use company rate or personal tax tables.' }
    ],
    benefits: [
      'Choose the right business structure',
      'Maximize legitimate deductions',
      'Avoid SARS penalties',
      'Plan provisional payments',
      'Understand depreciation allowances'
    ],
    faqs: [
      { question: 'How is sole proprietor tax calculated?', answer: 'Sole proprietors pay tax at personal income tax rates on business profit (revenue minus expenses). Business income is added to other personal income and taxed on the total.' },
      { question: 'What is the company tax rate for small businesses?', answer: 'Small Business Corporations (SBC) with turnover under R20m have progressive rates: 0% on first R95,750, 7% up to R365,000, 21% up to R550,000, then 27%.' },
      { question: 'Can I deduct home office expenses?', answer: 'Yes, if you regularly work from home and have a dedicated workspace. You can deduct a portion of rent/bond interest, utilities, and rates based on the area used.' },
      { question: 'What business expenses are NOT deductible?', answer: 'Non-deductible expenses include personal expenses, entertainment (limited), fines and penalties, donations over limits, capital expenditure (use depreciation instead), and income tax itself.' }
    ],
    keywords: ['how to calculate business tax', 'business tax calculation south africa', 'calculate business tax', 'sole proprietor tax calculation', 'company tax calculation'],
    metaTitle: 'How to Calculate Business Tax South Africa | Business Tax Guide',
    metaDescription: 'Learn how to calculate business tax in South Africa. Step-by-step guide for companies and sole proprietors. Deductions, rates, and examples included.'
  },
  {
    id: 'tax-return-calculator',
    slug: 'tax-return-calculator',
    name: 'Tax Return Calculator',
    headline: 'How Are Tax Returns Calculated in South Africa',
    subheadline: 'Understand how SARS calculates your tax return',
    description: 'Learn how tax returns are calculated in South Africa. Understand the process SARS uses to determine if you owe tax or are due a refund, and use our calculator to estimate your return.',
    icon: 'FileText',
    type: 'personal',
    features: [
      { title: 'Return Estimation', description: 'Estimate your tax return outcome before filing with SARS.', icon: 'Calculator' },
      { title: 'PAYE Reconciliation', description: 'Understand how PAYE paid is reconciled against actual tax due.', icon: 'Scale' },
      { title: 'ITA34 Explanation', description: 'Learn what each section of your assessment means.', icon: 'FileSearch' },
      { title: 'Dispute Guide', description: 'Know when and how to dispute your assessment.', icon: 'AlertCircle' }
    ],
    howItWorks: [
      { step: 1, title: 'SARS Receives Your Return', description: 'Your ITR12 is submitted via eFiling or SARS branch.' },
      { step: 2, title: 'Income Verification', description: 'SARS verifies income against employer certificates (IRP5).' },
      { step: 3, title: 'Deductions Applied', description: 'SARS applies claimed deductions and medical credits.' },
      { step: 4, title: 'Assessment Issued', description: 'ITA34 shows tax calculated, PAYE paid, and refund/amount due.' }
    ],
    benefits: [
      'Understand the assessment process',
      'Know what affects your return',
      'Identify deduction opportunities',
      'Prepare for accurate filing',
      'Avoid common mistakes'
    ],
    faqs: [
      { question: 'How are tax returns calculated?', answer: 'SARS calculates your total income, subtracts deductions to get taxable income, applies tax tables, subtracts rebates, then compares this to PAYE already paid. The difference is your refund or amount owing.' },
      { question: 'Why is my tax return different from expected?', answer: 'Common reasons include: income not matching IRP5, missed deductions, incorrect medical credits, additional income sources not declared, or changes in tax tables/rebates from previous year.' },
      { question: 'What is an ITA34 assessment?', answer: 'The ITA34 is SARS\'s official assessment of your tax return. It shows your income, deductions, tax calculated, credits, PAYE paid, and the final outcome (refund or amount due).' },
      { question: 'Can I dispute my tax assessment?', answer: 'Yes, you can dispute via eFiling within 30 business days of assessment. Select the assessment, choose \'Dispute\', and provide supporting documentation for your claim.' }
    ],
    keywords: ['how are tax returns calculated', 'tax return calculator', 'tax return calculation south africa', 'sars tax return', 'ita34 explained'],
    metaTitle: 'How Are Tax Returns Calculated | Tax Return Calculator SA',
    metaDescription: 'Learn how tax returns are calculated in South Africa. Understand SARS assessment process, ITA34 explained, and estimate your return with our free calculator.'
  }
]

export const getCalculatorBySlug = (slug: string): Calculator | undefined => {
  return calculators.find(c => c.slug === slug)
}

export const getAllCalculatorSlugs = (): string[] => {
  return calculators.map(c => c.slug)
}
