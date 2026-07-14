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
  },
  {
    id: 'salary-tax-calculator',
    slug: 'salary-tax-calculator',
    name: 'Salary Tax Calculator',
    headline: 'Salary Tax Calculator South Africa',
    subheadline: 'Calculate PAYE tax on your salary instantly',
    description: 'Use our free salary tax calculator to see how much PAYE tax is deducted from your salary. Get accurate calculations based on current SARS tax tables, including rebates and medical tax credits.',
    icon: 'Wallet',
    type: 'personal',
    features: [
      { title: 'Monthly & Annual View', description: 'See your tax breakdown for monthly salary or annual income.', icon: 'Calendar' },
      { title: 'PAYE Calculation', description: 'Accurate Pay As You Earn tax based on current SARS rates.', icon: 'Calculator' },
      { title: 'Net Salary Result', description: 'See exactly what you take home after all deductions.', icon: 'Banknote' },
      { title: 'Tax Rebates Applied', description: 'Automatic application of primary, secondary, and tertiary rebates.', icon: 'BadgePercent' }
    ],
    howItWorks: [
      { step: 1, title: 'Enter Your Salary', description: 'Input your gross monthly or annual salary amount.' },
      { step: 2, title: 'Add Your Age', description: 'Your age determines which tax rebates you qualify for.' },
      { step: 3, title: 'View Tax Breakdown', description: 'See PAYE, UIF, and your net take-home pay.' }
    ],
    benefits: [
      'Instant PAYE tax calculation',
      'Based on 2024/2025 SARS tax tables',
      'Includes all age-based rebates',
      'UIF contribution calculated',
      'Compare different salary scenarios'
    ],
    faqs: [
      { question: 'How is salary tax calculated in South Africa?', answer: 'Salary tax (PAYE) is calculated using progressive tax brackets. Your annual salary is taxed at increasing rates: 18% on the first R237,100, then 26%, 31%, 36%, 39%, 41%, and 45% on amounts over R1,817,000. Rebates are then subtracted.' },
      { question: 'What is the tax-free salary threshold?', answer: 'For the 2024/25 tax year, you pay no income tax if you earn below R95,750 per year (under 65) or R148,217 (65-74) or R165,689 (75+). This is due to the primary, secondary, and tertiary rebates.' },
      { question: 'How much UIF is deducted from my salary?', answer: 'UIF contribution is 1% of your salary, capped at R177.12 per month (based on maximum earnings of R17,712). Your employer also contributes 1%, making the total contribution 2%.' },
      { question: 'What is PAYE?', answer: 'PAYE stands for Pay As You Earn. It\'s the tax your employer deducts from your salary each month and pays directly to SARS on your behalf. It\'s based on your expected annual tax liability divided into monthly payments.' }
    ],
    keywords: ['salary tax calculator', 'salary tax calculator south africa', 'paye calculator', 'calculate tax on salary', 'monthly salary tax'],
    metaTitle: 'Salary Tax Calculator South Africa | PAYE Calculator 2024',
    metaDescription: 'Free salary tax calculator for South Africa. Calculate PAYE tax on your salary instantly. See your net take-home pay with accurate SARS tax rates.'
  },
  {
    id: 'income-tax-calculator',
    slug: 'income-tax-calculator',
    name: 'Income Tax Calculator',
    headline: 'Income Tax Calculator South Africa',
    subheadline: 'Calculate your personal income tax quickly and accurately',
    description: 'Calculate your South African income tax with our free online calculator. Get accurate estimates based on current SARS tax brackets, rebates, and deductions for the 2024/2025 tax year.',
    icon: 'Calculator',
    type: 'personal',
    features: [
      { title: 'Progressive Tax Brackets', description: 'Calculations using all 7 SARS income tax brackets.', icon: 'Layers' },
      { title: 'Multiple Income Sources', description: 'Add salary, rental income, investments, and more.', icon: 'PlusCircle' },
      { title: 'Deductions & Credits', description: 'Include retirement contributions and medical tax credits.', icon: 'ListMinus' },
      { title: 'Effective Tax Rate', description: 'See your actual tax rate versus marginal rate.', icon: 'Percent' }
    ],
    howItWorks: [
      { step: 1, title: 'Enter Total Income', description: 'Add all your income sources for the tax year.' },
      { step: 2, title: 'Add Deductions', description: 'Include retirement contributions and allowable deductions.' },
      { step: 3, title: 'Get Tax Calculation', description: 'See your tax liability with detailed breakdown.' }
    ],
    benefits: [
      'Accurate SARS tax table calculations',
      'All income types supported',
      'Automatic rebate application',
      'Effective tax rate shown',
      'Plan your tax with confidence'
    ],
    faqs: [
      { question: 'What are the income tax brackets in South Africa 2024?', answer: 'The 2024/25 tax brackets are: 18% (R1-R237,100), 26% (R237,101-R370,500), 31% (R370,501-R512,800), 36% (R512,801-R673,000), 39% (R673,001-R857,900), 41% (R857,901-R1,817,000), and 45% (over R1,817,000).' },
      { question: 'What is the difference between marginal and effective tax rate?', answer: 'Marginal rate is the tax rate on your last rand earned. Effective rate is your total tax divided by total income. For example, earning R500,000 has a 31% marginal rate but roughly 22% effective rate.' },
      { question: 'What income is taxable in South Africa?', answer: 'Taxable income includes employment income, business profits, rental income, interest (above exemptions), dividends (local exempt), capital gains, and foreign income for residents.' },
      { question: 'How do I reduce my income tax?', answer: 'Reduce tax through retirement contributions (up to 27.5% of income, max R350,000), medical tax credits, deductible expenses, donations to PBOs (up to 10% of taxable income), and tax-free investments.' }
    ],
    keywords: ['income tax calculator', 'income tax calculator south africa', 'calculate income tax', 'personal income tax calculator', 'sars income tax'],
    metaTitle: 'Income Tax Calculator South Africa | Personal Tax Calculator 2024',
    metaDescription: 'Free income tax calculator for South Africa. Calculate your personal tax using current SARS brackets and rebates. Get accurate results instantly.'
  },
  {
    id: 'sars-tax-calculator',
    slug: 'sars-tax-calculator',
    name: 'SARS Tax Calculator',
    headline: 'SARS Tax Calculator South Africa',
    subheadline: 'Official tax rates and calculations aligned with SARS',
    description: 'Use our SARS-aligned tax calculator for accurate tax calculations. Based on official SARS tax tables, rebates, and thresholds for the current tax year.',
    icon: 'Shield',
    type: 'both',
    features: [
      { title: 'SARS-Aligned Rates', description: 'All calculations use official SARS tax tables and rates.', icon: 'CheckCircle' },
      { title: 'Current Tax Year', description: 'Updated for the 2024/2025 tax year rates and rebates.', icon: 'Calendar' },
      { title: 'Personal & Business', description: 'Calculate individual income tax or company tax.', icon: 'Users' },
      { title: 'Export Results', description: 'Download your calculation for reference or your accountant.', icon: 'Download' }
    ],
    howItWorks: [
      { step: 1, title: 'Select Tax Type', description: 'Choose personal income tax or company tax.' },
      { step: 2, title: 'Enter Your Income', description: 'Input your taxable income amount.' },
      { step: 3, title: 'View SARS Calculation', description: 'See tax calculated using official SARS rates.' }
    ],
    benefits: [
      'Official SARS rates used',
      'Updated for current tax year',
      'Trusted by accountants',
      'Personal and business tax',
      'Clear, detailed breakdown'
    ],
    faqs: [
      { question: 'Are these calculations the same as SARS?', answer: 'Yes, our calculator uses the official SARS tax tables, rebates, and thresholds published for the current tax year. Results match SARS calculations when given the same inputs.' },
      { question: 'When do SARS tax rates change?', answer: 'SARS tax rates are announced in the annual Budget Speech (usually February) and apply from 1 March. New rates affect the tax year starting 1 March through end of February the following year.' },
      { question: 'What is the SARS tax threshold?', answer: 'For 2024/25, the tax threshold (below which no tax is payable) is R95,750 for those under 65, R148,217 for ages 65-74, and R165,689 for those 75 and older.' },
      { question: 'How do I check my calculation with SARS?', answer: 'You can verify calculations using the SARS eFiling tax calculator, or by submitting your return and viewing the ITA34 assessment which shows SARS\'s calculation.' }
    ],
    keywords: ['sars tax calculator', 'sars income tax calculator', 'sars tax calculator south africa', 'sars paye calculator', 'sars tax tables'],
    metaTitle: 'SARS Tax Calculator | South African Revenue Service Tax Rates 2024',
    metaDescription: 'Free SARS tax calculator using official tax tables. Calculate income tax, PAYE, and company tax with SARS-aligned rates. Accurate and up-to-date.'
  },
  {
    id: 'income-tax-brackets',
    slug: 'income-tax-brackets',
    name: 'Income Tax Brackets',
    headline: 'Income Tax Brackets South Africa 2024/2025',
    subheadline: 'Complete guide to SA tax brackets and rates',
    description: 'Understand South African income tax brackets for 2024/2025. See all tax rates, thresholds, and rebates in one place. Calculate your tax bracket and marginal rate.',
    icon: 'Layers',
    type: 'personal',
    features: [
      { title: 'All Tax Brackets', description: 'Complete breakdown of all 7 income tax brackets for 2024/25.', icon: 'Layers' },
      { title: 'Bracket Calculator', description: 'Find which tax bracket your income falls into.', icon: 'Search' },
      { title: 'Historical Comparison', description: 'See how brackets have changed over recent years.', icon: 'History' },
      { title: 'Tax Planning Tool', description: 'Plan income to optimize your tax bracket position.', icon: 'Target' }
    ],
    howItWorks: [
      { step: 1, title: 'Enter Your Income', description: 'Input your annual taxable income.' },
      { step: 2, title: 'See Your Bracket', description: 'Find which tax bracket you fall into.' },
      { step: 3, title: 'Understand Your Rate', description: 'See your marginal rate and total tax.' }
    ],
    benefits: [
      'All current tax brackets listed',
      'Easy to understand format',
      'Marginal vs effective rates explained',
      'Tax planning insights',
      'Updated annually'
    ],
    faqs: [
      { question: 'What are the 2024/2025 tax brackets?', answer: 'The 7 tax brackets for 2024/25 are: 18% (R0-R237,100), 26% (R237,101-R370,500), 31% (R370,501-R512,800), 36% (R512,801-R673,000), 39% (R673,001-R857,900), 41% (R857,901-R1,817,000), and 45% (above R1,817,000).' },
      { question: 'How do tax brackets work?', answer: 'Tax brackets are progressive - you only pay the higher rate on income above each threshold. For example, earning R300,000 means you pay 18% on the first R237,100 and 26% only on the remaining R62,900.' },
      { question: 'What is the highest tax bracket in South Africa?', answer: 'The highest tax bracket is 45%, which applies to taxable income exceeding R1,817,000 per year. This is the marginal rate; the effective rate is always lower.' },
      { question: 'How can I move to a lower tax bracket?', answer: 'You can reduce taxable income through retirement contributions (RA, pension), medical expenses, donations to PBOs, and other deductions. This may move your marginal rate to a lower bracket.' }
    ],
    keywords: ['income tax brackets south africa', 'tax brackets south africa 2024', 'sa tax brackets', 'sars tax brackets', 'tax rates south africa'],
    metaTitle: 'Income Tax Brackets South Africa 2024/2025 | SARS Tax Rates',
    metaDescription: 'Complete guide to South African income tax brackets 2024/2025. See all 7 tax rates, thresholds, and rebates. Find your tax bracket instantly.'
  },
  {
    id: 'sars-income-tax-calculator',
    slug: 'sars-income-tax-calculator',
    name: 'SARS Income Tax Calculator',
    headline: 'SARS Income Tax Calculator',
    subheadline: 'Calculate your tax using official SARS rates',
    description: 'Calculate your income tax using official SARS tax tables and rates. Our calculator mirrors SARS calculations for accurate estimates of your tax liability.',
    icon: 'Shield',
    type: 'personal',
    features: [
      { title: 'Official SARS Tables', description: 'Uses the same tax tables published by SARS.', icon: 'FileCheck' },
      { title: 'Rebate Calculator', description: 'Automatically applies primary, secondary, and tertiary rebates.', icon: 'BadgePercent' },
      { title: 'Medical Tax Credits', description: 'Calculate medical scheme fees tax credits for dependants.', icon: 'Heart' },
      { title: 'Assessment Preview', description: 'Preview what your SARS assessment might look like.', icon: 'FileText' }
    ],
    howItWorks: [
      { step: 1, title: 'Enter Income Details', description: 'Input your annual income and age.' },
      { step: 2, title: 'Add Tax Credits', description: 'Include medical aid and other credits.' },
      { step: 3, title: 'Get SARS Estimate', description: 'See your estimated tax per SARS calculations.' }
    ],
    benefits: [
      'Matches SARS calculation methods',
      'All rebates included',
      'Medical credits supported',
      'Clear assessment preview',
      'Trusted by tax practitioners'
    ],
    faqs: [
      { question: 'Is this calculator the same as SARS eFiling?', answer: 'Our calculator uses the same tax tables and formulas as SARS. Results should match SARS calculations when all inputs are identical. However, always verify with your actual SARS assessment.' },
      { question: 'What rebates are applied?', answer: 'We apply: Primary rebate (R17,235 for all taxpayers), Secondary rebate (R9,444 for ages 65-74), and Tertiary rebate (R3,145 for 75+). These are for the 2024/25 tax year.' },
      { question: 'How do medical tax credits work?', answer: 'You get R364 per month for the first two members on your medical aid, then R246 for each additional dependant. This credit directly reduces your tax payable.' },
      { question: 'Can I use this to prepare my SARS return?', answer: 'This calculator helps estimate your tax, but you must still file your official return via SARS eFiling or a tax practitioner. Use our results for planning and verification.' }
    ],
    keywords: ['sars income tax calculator', 'sars tax calculator', 'sars efiling calculator', 'sars tax tables calculator', 'income tax sars'],
    metaTitle: 'SARS Income Tax Calculator | Official Tax Tables 2024',
    metaDescription: 'Calculate income tax using official SARS tax tables. Free calculator with rebates and medical tax credits. Accurate SARS-aligned results.'
  }
]

export const getCalculatorBySlug = (slug: string): Calculator | undefined => {
  return calculators.find(c => c.slug === slug)
}

export const getAllCalculatorSlugs = (): string[] => {
  return calculators.map(c => c.slug)
}
