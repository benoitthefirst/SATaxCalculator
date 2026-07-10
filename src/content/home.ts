// ProcessX Homepage Content
// All marketing copy for the homepage

export const heroContent = {
  badge: {
    flag: '🇿🇦',
    text: 'Built for South African Businesses',
  },
  headline: {
    line1: 'AI Bookkeeping',
    line2: 'Software that',
    highlight: 'Works for You.',
  },
  subheadline:
    'ProcessX automatically extracts data from invoices, receipts, bank statements and payslips in under 60 seconds with 99% accuracy.',
  cta: {
    primary: {
      text: 'Start Free Trial',
      href: '/register',
    },
    secondary: {
      text: 'Watch Demo',
      href: '/demo',
    },
  },
  socialProof: {
    avatars: ['TM', 'ZN', 'PV', 'AM'],
    rating: 5,
    text: 'Trusted by 500+ businesses across South Africa',
  },
}

export const heroStats = [
  {
    value: '10,000+',
    label: 'Documents Processed',
  },
  {
    value: '60',
    suffix: 'sec',
    label: 'Average Processing',
  },
  {
    value: '99%',
    label: 'AI Accuracy',
  },
  {
    value: '100%',
    label: 'SARS Compliant',
  },
  {
    value: '30+',
    label: 'Hours Saved Monthly',
  },
]

export const documentTypes = [
  {
    type: 'Invoice',
    filename: 'invoice_march_2024.pdf',
    amount: 'R 12,450.00',
    vendor: 'Office Supplies Ltd',
    date: '15 March 2024',
    status: 'Processed',
    confidence: 99.2,
  },
  {
    type: 'Receipt',
    filename: 'fuel_receipt_001.jpg',
    amount: 'R 1,250.00',
    vendor: 'Engen Sandton',
    date: '14 March 2024',
    status: 'Processed',
    confidence: 98.7,
  },
  {
    type: 'Bank Statement',
    filename: 'fnb_statement_feb.pdf',
    amount: 'R 45,000.00',
    vendor: 'FNB Business',
    date: '01 March 2024',
    status: 'Processing',
    confidence: 97.5,
  },
  {
    type: 'Payslip',
    filename: 'payslip_employee_001.pdf',
    amount: 'R 28,500.00',
    vendor: 'Salary Payment',
    date: '28 February 2024',
    status: 'Processed',
    confidence: 99.8,
  },
]

export const aiProcessingSteps = [
  {
    step: 1,
    title: 'Upload Document',
    description: 'Drop any invoice, receipt, bank statement, or payslip',
    icon: 'upload',
  },
  {
    step: 2,
    title: 'AI Analysis',
    description: 'ProcessX AI extracts all relevant data automatically',
    icon: 'cpu',
  },
  {
    step: 3,
    title: 'Smart Categorization',
    description: 'Expenses are categorized and VAT is calculated',
    icon: 'sparkles',
  },
  {
    step: 4,
    title: 'Ready for Tax',
    description: 'SARS-compliant records ready for submission',
    icon: 'check',
  },
]

export const dashboardFeatures = [
  {
    title: 'Real-time Overview',
    description: 'See your income, expenses, and profit at a glance',
  },
  {
    title: 'AI Insights',
    description: 'Get smart recommendations to save on tax',
  },
  {
    title: 'Quick Actions',
    description: 'Add expenses, income, and assets in seconds',
  },
]

export const expenseFeatures = [
  {
    step: 1,
    title: 'Snap & Upload',
    description: 'Take a photo of any receipt or invoice',
  },
  {
    step: 2,
    title: 'Auto-Extract',
    description: 'AI reads vendor, amount, date, and VAT',
  },
  {
    step: 3,
    title: 'Categorize',
    description: 'Smart categorization for SARS compliance',
  },
]

export const sarsReports = [
  {
    title: 'Profit & Loss Statement',
    description: 'Complete income and expense breakdown',
    icon: 'chart',
  },
  {
    title: 'Tax Computation Report',
    description: 'Calculated tax liability with deductions',
    icon: 'calculator',
  },
  {
    title: 'VAT Report',
    description: 'Input and output VAT summary',
    icon: 'receipt',
  },
  {
    title: 'Deduction Summary',
    description: 'All claimable business deductions',
    icon: 'list',
  },
]

export const comparisonTable = {
  title: 'Why choose ProcessX?',
  subtitle: 'See how AI-powered bookkeeping compares to manual methods',
  headers: ['Feature', 'Manual Bookkeeping', 'ProcessX AI'],
  rows: [
    {
      feature: 'Document Processing',
      manual: '10-15 minutes per document',
      processx: '60 seconds per document',
      highlight: true,
    },
    {
      feature: 'Data Entry Errors',
      manual: '5-10% error rate',
      processx: '< 1% error rate',
      highlight: true,
    },
    {
      feature: 'VAT Calculation',
      manual: 'Manual calculation required',
      processx: 'Automatic extraction',
      highlight: false,
    },
    {
      feature: 'SARS Compliance',
      manual: 'Requires expertise',
      processx: 'Built-in compliance',
      highlight: false,
    },
    {
      feature: 'Report Generation',
      manual: 'Hours of work',
      processx: 'One-click export',
      highlight: true,
    },
    {
      feature: 'Cost',
      manual: 'R500-2000/month (bookkeeper)',
      processx: 'From R0/month',
      highlight: true,
    },
  ],
}

export const testimonials = [
  {
    quote:
      'ProcessX has completely transformed how I manage my freelance finances. Tax season is no longer stressful!',
    author: 'Thabo Molefe',
    role: 'Freelance Developer',
    company: 'Self-employed',
    location: 'Johannesburg',
    avatar: 'TM',
    rating: 5,
  },
  {
    quote:
      'Finally, a bookkeeping tool that understands South African tax requirements. The SARS compliance features are invaluable.',
    author: 'Zanele Nkosi',
    role: 'Small Business Owner',
    company: 'ZN Consulting',
    location: 'Cape Town',
    avatar: 'ZN',
    rating: 5,
  },
  {
    quote:
      'The vehicle logbook feature alone saves me hours every month. Highly recommend for any business owner with company vehicles.',
    author: 'Pieter van der Berg',
    role: 'Transport Company Owner',
    company: 'VDB Logistics',
    location: 'Pretoria',
    avatar: 'PV',
    rating: 5,
  },
  {
    quote:
      'As an accountant, I recommend ProcessX to all my small business clients. It makes my job so much easier.',
    author: 'Ayanda Mkhize',
    role: 'Chartered Accountant',
    company: 'AM Accounting',
    location: 'Durban',
    avatar: 'AM',
    rating: 5,
  },
]

export const ctaContent = {
  title: 'Ready to simplify your bookkeeping?',
  subtitle: 'Join thousands of South African businesses using ProcessX',
  primaryCta: {
    text: 'Start Free Trial',
    href: '/register',
  },
  secondaryCta: {
    text: 'View Pricing',
    href: '/pricing',
  },
  note: 'No credit card required. Free plan available forever.',
}

export const faq = [
  {
    question: 'What is ProcessX?',
    answer:
      'ProcessX is an AI-powered bookkeeping software designed specifically for South African businesses. It automatically extracts data from invoices, receipts, bank statements, and payslips, saving you hours of manual data entry.',
  },
  {
    question: 'How accurate is the AI?',
    answer:
      'Our AI achieves 99% accuracy on document processing. Every extracted field is verified and you can review before confirming. The system learns from corrections to improve over time.',
  },
  {
    question: 'Is ProcessX SARS compliant?',
    answer:
      'Yes! ProcessX is built specifically for South African tax requirements. All reports are SARS-compliant and can be exported in formats accepted by SARS eFiling.',
  },
  {
    question: 'Can I try ProcessX for free?',
    answer:
      'Absolutely! We offer a free plan that includes basic features. No credit card required to sign up. Upgrade anytime when you need more features.',
  },
  {
    question: 'What documents can ProcessX process?',
    answer:
      'ProcessX can process invoices, receipts, bank statements, payslips, and other financial documents. We support PDF, JPG, PNG, and HEIC formats.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Simply create an account, set up your business profile, and start uploading documents. ProcessX will guide you through the entire process.',
  },
]

export const metadata = {
  title: 'ProcessX | AI Bookkeeping Software for South African Businesses',
  description:
    'ProcessX is South Africa\'s AI bookkeeping software that automatically extracts invoices, receipts, bank statements and payslips in under 60 seconds with 99% accuracy.',
  keywords: [
    'AI bookkeeping',
    'bookkeeping software',
    'South Africa',
    'SARS compliant',
    'invoice processing',
    'receipt scanner',
    'expense tracking',
    'small business accounting',
  ],
}
