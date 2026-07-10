// Problem-based solution pages for SEO targeting
// Targets users searching for solutions to common bookkeeping problems

export interface Solution {
  id: string
  slug: string
  problem: string
  headline: string
  subheadline: string
  description: string
  icon: string
  painPoints: { title: string; description: string }[]
  howWeHelp: { title: string; description: string; icon: string }[]
  benefits: string[]
  stats: { value: string; label: string }[]
  testimonial?: { quote: string; author: string; role: string; company: string }
  keywords: string[]
  metaTitle: string
  metaDescription: string
}

export const solutions: Solution[] = [
  {
    id: 'manual-bookkeeping',
    slug: 'manual-bookkeeping',
    problem: 'Manual Bookkeeping',
    headline: 'Stop Wasting Hours on Manual Bookkeeping',
    subheadline: 'Let AI handle the tedious data entry while you focus on growing your business',
    description: 'Manual bookkeeping is time-consuming, error-prone, and holds your business back. ProcessX automates the entire process with AI-powered document processing.',
    icon: 'FileEdit',
    painPoints: [
      { title: 'Hours Lost to Data Entry', description: 'Manually entering invoices, receipts, and transactions takes countless hours every week that could be spent on revenue-generating activities.' },
      { title: 'Human Error is Inevitable', description: 'Typos, transposed numbers, and missed entries lead to inaccurate books and costly corrections down the line.' },
      { title: 'No Real-Time Visibility', description: 'By the time you finish entering data manually, your financial picture is already outdated.' },
      { title: 'Scaling Becomes Impossible', description: 'As your business grows, manual processes create bottlenecks that limit your potential.' }
    ],
    howWeHelp: [
      { title: 'AI Document Scanning', description: 'Upload invoices, receipts, and bank statements. Our AI extracts all data automatically with 99% accuracy.', icon: 'Scan' },
      { title: 'Automatic Categorisation', description: 'Smart algorithms categorise expenses and income correctly, learning your business patterns over time.', icon: 'Tags' },
      { title: 'Real-Time Processing', description: 'See transactions reflected in your books instantly, giving you up-to-the-minute financial visibility.', icon: 'Zap' },
      { title: 'Bank Integration', description: 'Connect your bank accounts for automatic transaction import and reconciliation.', icon: 'Building2' }
    ],
    benefits: [
      'Save 10+ hours per week on data entry',
      '99% accuracy on document extraction',
      'Real-time financial visibility',
      'Scale without hiring more staff',
      'Focus on business growth, not paperwork'
    ],
    stats: [
      { value: '10+', label: 'Hours saved weekly' },
      { value: '99%', label: 'Data accuracy' },
      { value: '5min', label: 'Average processing time' },
      { value: '80%', label: 'Cost reduction' }
    ],
    testimonial: {
      quote: 'I used to spend every Sunday doing bookkeeping. Now ProcessX handles it all automatically. I have my weekends back.',
      author: 'Sarah M.',
      role: 'Owner',
      company: 'Cape Town Consulting'
    },
    keywords: ['manual bookkeeping', 'manual data entry', 'bookkeeping automation', 'automate bookkeeping'],
    metaTitle: 'Escape Manual Bookkeeping | ProcessX AI Automation',
    metaDescription: 'Stop wasting hours on manual data entry. ProcessX AI automates bookkeeping with 99% accuracy. Save 10+ hours per week. Start your free trial today.'
  },
  {
    id: 'spreadsheet-bookkeeping',
    slug: 'spreadsheet-bookkeeping',
    problem: 'Spreadsheet Bookkeeping',
    headline: 'Graduate from Spreadsheets to Smart Bookkeeping',
    subheadline: 'Excel was never designed for bookkeeping. Upgrade to purpose-built AI software.',
    description: 'Spreadsheets break, formulas fail, and files get corrupted. ProcessX gives you enterprise-grade bookkeeping with the simplicity your business needs.',
    icon: 'Table',
    painPoints: [
      { title: 'Formulas Break Constantly', description: 'One wrong keystroke can break your entire spreadsheet, and finding the error takes hours.' },
      { title: 'No Audit Trail', description: 'When multiple people edit the same file, tracking who changed what becomes impossible.' },
      { title: 'Version Control Nightmare', description: '"Final_v2_FINAL_updated.xlsx" - sound familiar? Managing spreadsheet versions is chaos.' },
      { title: 'Limited Reporting', description: 'Creating financial reports from spreadsheets requires manual work every single time.' }
    ],
    howWeHelp: [
      { title: 'Bulletproof Data Integrity', description: 'No formulas to break. Your data is stored securely in a proper database with automatic backups.', icon: 'Shield' },
      { title: 'Complete Audit Trail', description: 'Every change is logged with timestamps and user information for complete accountability.', icon: 'History' },
      { title: 'One Source of Truth', description: 'Everyone works from the same live data. No more emailing files back and forth.', icon: 'Database' },
      { title: 'One-Click Reports', description: 'Generate profit & loss, balance sheets, and cash flow reports instantly.', icon: 'FileText' }
    ],
    benefits: [
      'No more broken formulas',
      'Complete audit trail',
      'Real-time collaboration',
      'Professional financial reports',
      'Bank-level security'
    ],
    stats: [
      { value: '0', label: 'Broken formulas' },
      { value: '100%', label: 'Audit trail coverage' },
      { value: '1-click', label: 'Report generation' },
      { value: '256-bit', label: 'Encryption' }
    ],
    testimonial: {
      quote: 'Our Excel file crashed and we lost 3 months of data. After switching to ProcessX, we never worry about data loss again.',
      author: 'John K.',
      role: 'Finance Manager',
      company: 'JHB Logistics'
    },
    keywords: ['spreadsheet bookkeeping', 'excel bookkeeping', 'bookkeeping software vs excel', 'replace excel accounting'],
    metaTitle: 'Replace Spreadsheet Bookkeeping | ProcessX Software',
    metaDescription: 'Tired of broken formulas and lost Excel files? ProcessX replaces spreadsheet bookkeeping with secure, automated software. Free trial available.'
  },
  {
    id: 'bookkeeping-mistakes',
    slug: 'bookkeeping-mistakes',
    problem: 'Bookkeeping Mistakes',
    headline: 'Eliminate Costly Bookkeeping Mistakes',
    subheadline: 'AI-powered accuracy that catches errors before they cost you money',
    description: 'Bookkeeping errors lead to tax penalties, audit issues, and poor business decisions. ProcessX uses AI to ensure accuracy and catch mistakes automatically.',
    icon: 'AlertTriangle',
    painPoints: [
      { title: 'Costly Tax Penalties', description: 'Incorrect bookkeeping leads to wrong tax filings, resulting in SARS penalties and interest charges.' },
      { title: 'Audit Nightmares', description: 'Inconsistent records make audits stressful, time-consuming, and potentially expensive.' },
      { title: 'Bad Business Decisions', description: 'Inaccurate financial data leads to poor decisions that can hurt your business.' },
      { title: 'Wasted Time on Corrections', description: 'Finding and fixing errors takes time away from running your business.' }
    ],
    howWeHelp: [
      { title: 'AI Error Detection', description: 'Our algorithms automatically flag unusual transactions, duplicates, and potential errors.', icon: 'Search' },
      { title: 'Smart Validation', description: 'Built-in validation rules ensure data consistency across all your records.', icon: 'CheckCircle' },
      { title: 'Automatic Reconciliation', description: 'Bank reconciliation happens automatically, catching discrepancies immediately.', icon: 'RefreshCw' },
      { title: 'Real-Time Alerts', description: 'Get notified of potential issues before they become expensive problems.', icon: 'Bell' }
    ],
    benefits: [
      'Catch errors before they cause problems',
      'Avoid tax penalties',
      'Audit-ready records always',
      'Make decisions with confidence',
      'Save time on corrections'
    ],
    stats: [
      { value: '99%', label: 'Error reduction' },
      { value: 'R0', label: 'Average tax penalties' },
      { value: '100%', label: 'Reconciliation accuracy' },
      { value: '24/7', label: 'Error monitoring' }
    ],
    testimonial: {
      quote: 'ProcessX caught a R50,000 duplicate payment before it went through. That single catch paid for years of subscription.',
      author: 'Michael T.',
      role: 'CFO',
      company: 'Durban Manufacturing'
    },
    keywords: ['bookkeeping mistakes', 'bookkeeping errors', 'accounting errors', 'fix bookkeeping mistakes'],
    metaTitle: 'Eliminate Bookkeeping Mistakes | ProcessX AI',
    metaDescription: 'Stop costly bookkeeping errors with AI-powered accuracy. ProcessX catches mistakes automatically. Avoid tax penalties and audit issues. Try free.'
  },
  {
    id: 'lost-receipts',
    slug: 'lost-receipts',
    problem: 'Lost Receipts',
    headline: 'Never Lose a Receipt Again',
    subheadline: 'Snap, upload, forget. Your receipts are safe and searchable forever.',
    description: 'Lost receipts mean lost deductions and tax troubles. ProcessX lets you capture receipts instantly with your phone and stores them securely in the cloud.',
    icon: 'Receipt',
    painPoints: [
      { title: 'Lost Tax Deductions', description: 'Every lost receipt is money left on the table. SARS requires proof for expense claims.' },
      { title: 'Faded Paper Receipts', description: 'Thermal paper fades over time, making receipts illegible when you need them most.' },
      { title: 'Disorganised Shoeboxes', description: 'Searching through piles of receipts wastes hours and creates stress at tax time.' },
      { title: 'No Backup System', description: 'Paper receipts can be lost, damaged, or destroyed with no way to recover them.' }
    ],
    howWeHelp: [
      { title: 'Instant Mobile Capture', description: 'Snap a photo of any receipt with your phone. Our AI extracts all details automatically.', icon: 'Camera' },
      { title: 'Cloud Storage Forever', description: 'Receipts are stored securely in the cloud with automatic backups. Never lose another one.', icon: 'Cloud' },
      { title: 'Smart Search', description: 'Find any receipt instantly by searching vendor, amount, date, or category.', icon: 'Search' },
      { title: 'Automatic Matching', description: 'Receipts are automatically matched to bank transactions for complete records.', icon: 'Link' }
    ],
    benefits: [
      'Claim every deduction you deserve',
      'Receipts stored securely forever',
      'Find any receipt in seconds',
      'SARS-compliant documentation',
      'No more faded or lost receipts'
    ],
    stats: [
      { value: '100%', label: 'Receipt capture rate' },
      { value: '3sec', label: 'Average upload time' },
      { value: '∞', label: 'Cloud storage' },
      { value: 'R15K+', label: 'Avg. recovered deductions' }
    ],
    testimonial: {
      quote: 'I claimed R18,000 more in deductions this year because I actually had all my receipts. ProcessX paid for itself 100 times over.',
      author: 'Thabo N.',
      role: 'Freelance Consultant',
      company: 'Independent'
    },
    keywords: ['lost receipts', 'receipt management', 'receipt storage', 'digital receipts', 'receipt scanner'],
    metaTitle: 'Never Lose Receipts Again | ProcessX Receipt Scanner',
    metaDescription: 'Stop losing receipts and tax deductions. ProcessX captures, stores, and organises receipts automatically. Claim every deduction. Try free today.'
  },
  {
    id: 'duplicate-invoices',
    slug: 'duplicate-invoices',
    problem: 'Duplicate Invoices',
    headline: 'Stop Paying Duplicate Invoices',
    subheadline: 'AI detection prevents double payments before they happen',
    description: 'Duplicate payments drain cash flow and create accounting headaches. ProcessX automatically detects and flags potential duplicates before payment.',
    icon: 'Copy',
    painPoints: [
      { title: 'Cash Flow Drain', description: 'Duplicate payments tie up cash that could be used for business growth.' },
      { title: 'Recovery Hassles', description: 'Getting refunds for duplicate payments is time-consuming and often unsuccessful.' },
      { title: 'Supplier Confusion', description: 'Duplicates create confusion with suppliers and damage professional relationships.' },
      { title: 'Audit Issues', description: 'Duplicate entries complicate audits and raise red flags with auditors.' }
    ],
    howWeHelp: [
      { title: 'AI Duplicate Detection', description: 'Our algorithms analyse invoice numbers, amounts, dates, and vendors to catch duplicates.', icon: 'Scan' },
      { title: 'Pre-Payment Alerts', description: 'Get warned before approving payment on a potential duplicate invoice.', icon: 'AlertCircle' },
      { title: 'Historical Matching', description: 'New invoices are checked against your entire payment history automatically.', icon: 'History' },
      { title: 'One-Click Resolution', description: 'Mark duplicates for review or dismissal with a single click.', icon: 'Check' }
    ],
    benefits: [
      'Prevent duplicate payments',
      'Protect cash flow',
      'Save time on recovery',
      'Maintain supplier relationships',
      'Clean audit trail'
    ],
    stats: [
      { value: 'R50K+', label: 'Avg. saved per year' },
      { value: '99.5%', label: 'Detection accuracy' },
      { value: '0', label: 'Duplicate payments' },
      { value: '2sec', label: 'Detection speed' }
    ],
    testimonial: {
      quote: 'ProcessX caught a R42,000 duplicate invoice from our biggest supplier. We would never have noticed until it was too late.',
      author: 'Lisa P.',
      role: 'Accounts Payable',
      company: 'Pretoria Retail Group'
    },
    keywords: ['duplicate invoices', 'duplicate payments', 'invoice verification', 'payment verification'],
    metaTitle: 'Prevent Duplicate Invoice Payments | ProcessX',
    metaDescription: 'Stop paying duplicate invoices. ProcessX AI detects duplicates before payment with 99.5% accuracy. Protect your cash flow. Free trial.'
  },
  {
    id: 'slow-bookkeeping',
    slug: 'slow-bookkeeping',
    problem: 'Slow Bookkeeping',
    headline: 'Accelerate Your Bookkeeping by 10x',
    subheadline: 'What used to take days now takes minutes with AI automation',
    description: 'Slow bookkeeping means delayed insights and missed opportunities. ProcessX processes documents in seconds, not hours.',
    icon: 'Clock',
    painPoints: [
      { title: 'Delayed Financial Insights', description: 'By the time your books are updated, the information is already stale.' },
      { title: 'Month-End Crunch', description: 'Rushing to close books at month-end leads to errors and stress.' },
      { title: 'Growth Bottleneck', description: 'More transactions mean more work, limiting how fast you can scale.' },
      { title: 'Opportunity Cost', description: 'Time spent on slow bookkeeping could be invested in growing your business.' }
    ],
    howWeHelp: [
      { title: 'Instant Processing', description: 'Upload a document and see it processed in seconds, not hours or days.', icon: 'Zap' },
      { title: 'Batch Processing', description: 'Process hundreds of invoices and receipts simultaneously.', icon: 'Layers' },
      { title: 'Continuous Updates', description: 'Books are updated in real-time as transactions occur.', icon: 'RefreshCw' },
      { title: 'Automated Workflows', description: 'Set up rules to automatically handle routine transactions.', icon: 'GitBranch' }
    ],
    benefits: [
      '10x faster processing',
      'Real-time financial data',
      'No month-end crunch',
      'Scale without slowdown',
      'More time for strategy'
    ],
    stats: [
      { value: '10x', label: 'Faster processing' },
      { value: '5sec', label: 'Per document' },
      { value: '1000+', label: 'Docs per hour' },
      { value: '0', label: 'Backlog' }
    ],
    testimonial: {
      quote: 'We process 500+ invoices monthly. What used to take our team 3 days now happens automatically in hours.',
      author: 'David R.',
      role: 'Operations Director',
      company: 'SA Distribution Co.'
    },
    keywords: ['slow bookkeeping', 'bookkeeping speed', 'fast bookkeeping', 'bookkeeping efficiency'],
    metaTitle: 'Speed Up Slow Bookkeeping | ProcessX AI',
    metaDescription: 'Accelerate bookkeeping by 10x with AI automation. Process documents in seconds, not days. Real-time financial insights. Start free trial.'
  },
  {
    id: 'cash-flow-problems',
    slug: 'cash-flow-problems',
    problem: 'Cash Flow Problems',
    headline: 'Get Your Cash Flow Under Control',
    subheadline: 'Real-time visibility and AI predictions to manage cash flow confidently',
    description: 'Cash flow surprises kill businesses. ProcessX gives you real-time visibility and predictive insights to stay ahead of cash flow issues.',
    icon: 'TrendingDown',
    painPoints: [
      { title: 'Surprise Shortfalls', description: 'Finding out you cant make payroll on payday is every business owner\'s nightmare.' },
      { title: 'No Forward Visibility', description: 'Without forecasting, you\'re flying blind into the future.' },
      { title: 'Late Invoice Collection', description: 'Outstanding receivables pile up, tying up cash you need now.' },
      { title: 'Poor Payment Timing', description: 'Paying bills without considering cash flow impact leads to problems.' }
    ],
    howWeHelp: [
      { title: 'Real-Time Dashboard', description: 'See exactly where your cash stands right now, updated continuously.', icon: 'BarChart3' },
      { title: 'Cash Flow Forecasting', description: 'AI predicts future cash positions based on patterns and scheduled payments.', icon: 'TrendingUp' },
      { title: 'Invoice Tracking', description: 'Track outstanding invoices and send automatic payment reminders.', icon: 'FileText' },
      { title: 'Payment Scheduling', description: 'Optimise payment timing to maintain healthy cash reserves.', icon: 'Calendar' }
    ],
    benefits: [
      'No more cash surprises',
      'See 30/60/90 day forecast',
      'Faster invoice collection',
      'Optimised payment timing',
      'Make confident decisions'
    ],
    stats: [
      { value: '30%', label: 'Faster collections' },
      { value: '90-day', label: 'Cash forecast' },
      { value: '24/7', label: 'Real-time visibility' },
      { value: 'R0', label: 'Surprise shortfalls' }
    ],
    testimonial: {
      quote: 'ProcessX predicted a cash shortfall 6 weeks out. We adjusted spending and avoided what could have been a crisis.',
      author: 'Amanda S.',
      role: 'Business Owner',
      company: 'Garden Route Tours'
    },
    keywords: ['cash flow problems', 'cash flow management', 'cash flow forecast', 'business cash flow'],
    metaTitle: 'Solve Cash Flow Problems | ProcessX Dashboard',
    metaDescription: 'Get cash flow under control with real-time visibility and AI forecasting. No more surprises. Predict issues before they happen. Try free.'
  },
  {
    id: 'vat-mistakes',
    slug: 'vat-mistakes',
    problem: 'VAT Mistakes',
    headline: 'Never Make a VAT Mistake Again',
    subheadline: 'Automatic VAT calculations and SARS-ready reports',
    description: 'VAT errors lead to SARS penalties and compliance headaches. ProcessX automatically calculates VAT correctly and generates compliant reports.',
    icon: 'Calculator',
    painPoints: [
      { title: 'Calculation Errors', description: 'Manual VAT calculations are error-prone, especially with different rates and exemptions.' },
      { title: 'SARS Penalties', description: 'Incorrect VAT returns result in penalties, interest, and potential audits.' },
      { title: 'Filing Stress', description: 'Gathering VAT data for submissions is stressful and time-consuming.' },
      { title: 'Rate Confusion', description: 'Different VAT rates for different goods and services add complexity.' }
    ],
    howWeHelp: [
      { title: 'Automatic VAT Calculation', description: 'VAT is calculated automatically on every transaction with 100% accuracy.', icon: 'Calculator' },
      { title: 'Rate Management', description: 'System handles standard rate, zero-rated, and exempt items correctly.', icon: 'Settings' },
      { title: 'SARS-Ready Reports', description: 'Generate VAT201 reports with one click, ready for submission.', icon: 'FileCheck' },
      { title: 'Deadline Reminders', description: 'Never miss a VAT submission deadline with automatic alerts.', icon: 'Bell' }
    ],
    benefits: [
      '100% VAT calculation accuracy',
      'SARS-compliant reports',
      'No more deadline panic',
      'Handle all VAT rates',
      'Audit-ready records'
    ],
    stats: [
      { value: '100%', label: 'Calculation accuracy' },
      { value: 'R0', label: 'SARS penalties' },
      { value: '1-click', label: 'VAT reports' },
      { value: '0', label: 'Missed deadlines' }
    ],
    testimonial: {
      quote: 'We had a R30,000 VAT penalty last year from errors. Since ProcessX, our submissions have been perfect every time.',
      author: 'Peter M.',
      role: 'Finance Director',
      company: 'Eastern Cape Motors'
    },
    keywords: ['VAT mistakes', 'VAT errors', 'VAT calculation', 'SARS VAT', 'VAT compliance'],
    metaTitle: 'Eliminate VAT Mistakes | ProcessX Compliance',
    metaDescription: 'Stop making costly VAT errors. ProcessX automates VAT calculations with 100% accuracy. SARS-compliant reports in one click. Try free.'
  },
  {
    id: 'sars-compliance',
    slug: 'sars-compliance',
    problem: 'SARS Compliance',
    headline: 'Stay SARS Compliant Effortlessly',
    subheadline: 'Automatic compliance with South African tax requirements',
    description: 'SARS compliance is complex and constantly changing. ProcessX keeps you compliant automatically with built-in South African tax rules.',
    icon: 'Shield',
    painPoints: [
      { title: 'Complex Requirements', description: 'SARS has numerous requirements that are difficult to track and implement correctly.' },
      { title: 'Changing Regulations', description: 'Tax laws change frequently, and staying updated is a full-time job.' },
      { title: 'Audit Anxiety', description: 'The fear of a SARS audit keeps business owners up at night.' },
      { title: 'Documentation Requirements', description: 'SARS requires specific documentation that must be maintained for years.' }
    ],
    howWeHelp: [
      { title: 'Built-In Compliance', description: 'South African tax rules are built into the system and updated automatically.', icon: 'CheckCircle' },
      { title: 'Audit-Ready Records', description: 'All transactions are documented to SARS standards with complete audit trails.', icon: 'FileText' },
      { title: 'Automatic Updates', description: 'When tax laws change, ProcessX updates automatically. No manual intervention.', icon: 'RefreshCw' },
      { title: 'Compliance Reports', description: 'Generate all required SARS reports including VAT201, EMP201, and more.', icon: 'FileCheck' }
    ],
    benefits: [
      'Always SARS compliant',
      'Audit-ready anytime',
      'Automatic law updates',
      'All required reports',
      'Peace of mind'
    ],
    stats: [
      { value: '100%', label: 'Compliance rate' },
      { value: '0', label: 'Audit failures' },
      { value: 'Auto', label: 'Law updates' },
      { value: '7yrs', label: 'Record retention' }
    ],
    testimonial: {
      quote: 'We got audited by SARS last year. Thanks to ProcessX, we had everything they needed at our fingertips. Audit closed in 2 days.',
      author: 'Nomsa K.',
      role: 'Owner',
      company: 'Soweto Catering Services'
    },
    keywords: ['SARS compliance', 'SARS requirements', 'South African tax compliance', 'tax compliance software'],
    metaTitle: 'SARS Compliance Made Easy | ProcessX',
    metaDescription: 'Stay SARS compliant automatically. ProcessX has South African tax rules built-in with automatic updates. Audit-ready records. Start free trial.'
  },
  {
    id: 'expense-tracking-problems',
    slug: 'expense-tracking-problems',
    problem: 'Expense Tracking Problems',
    headline: 'Fix Your Expense Tracking Chaos',
    subheadline: 'Automatic expense capture, categorisation, and reporting',
    description: 'Messy expense tracking leads to lost deductions and financial confusion. ProcessX automates the entire expense management process.',
    icon: 'Wallet',
    painPoints: [
      { title: 'Lost Expenses', description: 'Small expenses slip through the cracks, adding up to significant lost deductions.' },
      { title: 'Category Confusion', description: 'Inconsistent categorisation makes reports unreliable and analysis impossible.' },
      { title: 'Reimbursement Delays', description: 'Employees wait weeks for expense reimbursements, hurting morale.' },
      { title: 'Policy Violations', description: 'Without controls, expenses often violate company policies.' }
    ],
    howWeHelp: [
      { title: 'Mobile Expense Capture', description: 'Employees capture expenses instantly with their phones. No paperwork needed.', icon: 'Smartphone' },
      { title: 'Smart Categorisation', description: 'AI automatically categorises expenses based on vendor and description.', icon: 'Tags' },
      { title: 'Approval Workflows', description: 'Configurable approval workflows ensure compliance and fast processing.', icon: 'CheckSquare' },
      { title: 'Policy Enforcement', description: 'Built-in rules flag out-of-policy expenses before they\'re approved.', icon: 'Shield' }
    ],
    benefits: [
      'Capture every expense',
      'Consistent categorisation',
      'Fast reimbursements',
      'Policy compliance',
      'Clear expense reports'
    ],
    stats: [
      { value: '100%', label: 'Expense capture' },
      { value: '24hrs', label: 'Reimbursement time' },
      { value: '95%', label: 'Auto-categorised' },
      { value: '0', label: 'Policy violations' }
    ],
    testimonial: {
      quote: 'Our expense reports used to be a mess. Now everything is captured and categorised automatically. Finance team loves it.',
      author: 'Robert V.',
      role: 'HR Manager',
      company: 'Johannesburg Tech Solutions'
    },
    keywords: ['expense tracking problems', 'expense management', 'expense software', 'track business expenses'],
    metaTitle: 'Fix Expense Tracking Problems | ProcessX',
    metaDescription: 'End expense tracking chaos. ProcessX automates capture, categorisation, and reporting. Every expense tracked. Fast reimbursements. Try free.'
  },
  {
    id: 'invoice-processing-problems',
    slug: 'invoice-processing-problems',
    problem: 'Invoice Processing Problems',
    headline: 'End Invoice Processing Headaches',
    subheadline: 'AI-powered invoice processing that works 24/7',
    description: 'Manual invoice processing is slow, error-prone, and expensive. ProcessX automates the entire workflow from receipt to payment.',
    icon: 'FileX',
    painPoints: [
      { title: 'Processing Backlog', description: 'Invoices pile up waiting for manual processing, delaying payments.' },
      { title: 'Data Entry Errors', description: 'Manual typing introduces errors that cause payment problems.' },
      { title: 'Lost Invoices', description: 'Paper and email invoices get lost, leading to late payments and fees.' },
      { title: 'Slow Approvals', description: 'Manual approval routing delays payment processing significantly.' }
    ],
    howWeHelp: [
      { title: 'AI Data Extraction', description: 'Our AI reads invoices and extracts all data automatically with 99% accuracy.', icon: 'Scan' },
      { title: 'Email Integration', description: 'Invoices sent to your email are captured and processed automatically.', icon: 'Mail' },
      { title: 'Smart Routing', description: 'Invoices are automatically routed to the right approver based on rules.', icon: 'GitBranch' },
      { title: 'Payment Integration', description: 'Approved invoices flow directly to payment with no manual steps.', icon: 'CreditCard' }
    ],
    benefits: [
      'Zero processing backlog',
      '99% data accuracy',
      'Never lose an invoice',
      'Fast approval cycles',
      'On-time payments always'
    ],
    stats: [
      { value: '99%', label: 'Extraction accuracy' },
      { value: '5sec', label: 'Processing time' },
      { value: '0', label: 'Lost invoices' },
      { value: '3x', label: 'Faster approvals' }
    ],
    testimonial: {
      quote: 'We process 1,000+ invoices monthly. ProcessX reduced our processing time by 80% and eliminated errors.',
      author: 'Michelle D.',
      role: 'Accounts Payable Manager',
      company: 'Cape Wholesale Ltd'
    },
    keywords: ['invoice processing problems', 'invoice automation', 'invoice software', 'automated invoicing'],
    metaTitle: 'Solve Invoice Processing Problems | ProcessX AI',
    metaDescription: 'End invoice processing headaches with AI automation. 99% accuracy, 5-second processing, zero backlog. Try ProcessX free today.'
  }
]

export const getSolutionBySlug = (slug: string): Solution | undefined => {
  return solutions.find(s => s.slug === slug)
}

export const getAllSolutionSlugs = (): string[] => {
  return solutions.map(s => s.slug)
}
