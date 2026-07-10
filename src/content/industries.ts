// Industry-specific content for SEO landing pages

export interface Industry {
  id: string
  name: string
  slug: string
  headline: string
  subheadline: string
  description: string
  icon: string
  challenges: {
    title: string
    description: string
  }[]
  solutions: {
    title: string
    description: string
    icon: string
  }[]
  features: string[]
  stats: {
    value: string
    label: string
  }[]
  testimonial?: {
    quote: string
    author: string
    role: string
    company: string
  }
  keywords: string[]
  metaTitle: string
  metaDescription: string
}

export const industries: Industry[] = [
  {
    id: 'construction',
    name: 'Construction',
    slug: 'construction',
    headline: 'Bookkeeping Built for Construction',
    subheadline: 'Track projects, manage subcontractors, and stay SARS compliant',
    description: 'Construction businesses deal with complex project-based accounting, multiple subcontractors, and heavy equipment depreciation. ProcessX simplifies it all with AI-powered document processing and real-time financial tracking.',
    icon: 'hardhat',
    challenges: [
      {
        title: 'Project Cost Tracking',
        description: 'Keeping track of expenses across multiple job sites and projects is time-consuming and error-prone.',
      },
      {
        title: 'Subcontractor Management',
        description: 'Managing invoices and payments from dozens of subcontractors creates paperwork chaos.',
      },
      {
        title: 'Equipment Depreciation',
        description: 'Tracking depreciation on heavy machinery and vehicles for tax deductions is complex.',
      },
      {
        title: 'Cash Flow Gaps',
        description: 'Long payment cycles mean you need clear visibility into your cash position at all times.',
      },
    ],
    solutions: [
      {
        title: 'Project-Based Expense Tracking',
        description: 'Tag expenses to specific projects and job sites. Get instant profit/loss per project.',
        icon: 'folder',
      },
      {
        title: 'AI Invoice Processing',
        description: 'Upload subcontractor invoices and let AI extract all the details automatically.',
        icon: 'cpu',
      },
      {
        title: 'Asset Management',
        description: 'Track equipment with automatic depreciation calculations for SARS compliance.',
        icon: 'truck',
      },
      {
        title: 'Real-Time Cash Flow',
        description: 'See exactly where your money is at any moment with live dashboard updates.',
        icon: 'trending-up',
      },
    ],
    features: [
      'Project-based expense categorization',
      'Subcontractor invoice management',
      'Equipment and vehicle tracking',
      'Automatic depreciation calculations',
      'Job costing reports',
      'VAT tracking and returns',
      'CIDB compliance support',
      'Multi-site expense tracking',
    ],
    stats: [
      { value: '15+', label: 'Hours saved monthly' },
      { value: '99%', label: 'AI accuracy' },
      { value: 'R50K+', label: 'Average tax savings' },
    ],
    testimonial: {
      quote: 'ProcessX cut our admin time in half. We can now see exactly which projects are profitable and which aren\'t.',
      author: 'Johan van der Merwe',
      role: 'Owner',
      company: 'Van der Merwe Construction',
    },
    keywords: ['construction bookkeeping', 'construction accounting software', 'contractor bookkeeping south africa', 'building contractor accounting'],
    metaTitle: 'Construction Bookkeeping Software | ProcessX South Africa',
    metaDescription: 'AI-powered bookkeeping for construction companies. Track projects, manage subcontractors, calculate equipment depreciation, and stay SARS compliant. Start free.',
  },
  {
    id: 'retail',
    name: 'Retail',
    slug: 'retail',
    headline: 'Retail Bookkeeping Made Simple',
    subheadline: 'From daily sales to VAT returns, all in one place',
    description: 'Retail businesses process hundreds of transactions daily. ProcessX helps you track sales, manage inventory costs, reconcile POS systems, and generate SARS-ready VAT reports automatically.',
    icon: 'store',
    challenges: [
      {
        title: 'High Transaction Volume',
        description: 'Processing hundreds of daily transactions manually is impossible to keep up with.',
      },
      {
        title: 'VAT Complexity',
        description: 'Mixed VAT rates, exempt items, and zero-rated goods make VAT returns complicated.',
      },
      {
        title: 'Inventory Costs',
        description: 'Tracking cost of goods sold across thousands of SKUs is a nightmare.',
      },
      {
        title: 'Cash vs Card Reconciliation',
        description: 'Matching POS reports with bank statements takes hours every week.',
      },
    ],
    solutions: [
      {
        title: 'Bank Statement Import',
        description: 'Upload your bank statements and let AI categorize all transactions automatically.',
        icon: 'file-text',
      },
      {
        title: 'VAT Automation',
        description: 'Automatic VAT calculations with support for standard, zero-rated, and exempt items.',
        icon: 'calculator',
      },
      {
        title: 'Expense Categories',
        description: 'Pre-built retail expense categories for accurate cost of goods sold tracking.',
        icon: 'tag',
      },
      {
        title: 'Daily Reconciliation',
        description: 'Match your POS reports with bank deposits in minutes, not hours.',
        icon: 'check-circle',
      },
    ],
    features: [
      'High-volume transaction processing',
      'VAT category management',
      'Cost of goods sold tracking',
      'POS reconciliation support',
      'Supplier invoice management',
      'Stock purchase tracking',
      'Daily/weekly/monthly reports',
      'Multi-store support',
    ],
    stats: [
      { value: '1000+', label: 'Transactions/month' },
      { value: '90%', label: 'Faster VAT returns' },
      { value: '5hrs', label: 'Saved weekly' },
    ],
    keywords: ['retail bookkeeping', 'retail accounting software', 'shop bookkeeping south africa', 'point of sale accounting'],
    metaTitle: 'Retail Bookkeeping Software | ProcessX South Africa',
    metaDescription: 'Bookkeeping software built for retail. Process high-volume transactions, automate VAT returns, and reconcile POS systems. AI-powered. Start free.',
  },
  {
    id: 'restaurant',
    name: 'Restaurant & Hospitality',
    slug: 'restaurant',
    headline: 'Restaurant Bookkeeping That Works',
    subheadline: 'Focus on your guests, not your receipts',
    description: 'Restaurants deal with daily cash handling, tip management, food costs, and complex staff payments. ProcessX handles the financial chaos so you can focus on what matters - your customers.',
    icon: 'utensils',
    challenges: [
      {
        title: 'Daily Cash Management',
        description: 'Tracking cash sales, card payments, and daily takings is a constant challenge.',
      },
      {
        title: 'Food Cost Control',
        description: 'Supplier invoices pile up, making it hard to track your actual food costs.',
      },
      {
        title: 'Staff Payments',
        description: 'Tips, overtime, and variable shifts make payroll complex.',
      },
      {
        title: 'Receipt Chaos',
        description: 'Paper receipts from suppliers get lost, damaged, or forgotten.',
      },
    ],
    solutions: [
      {
        title: 'Receipt Scanning',
        description: 'Snap photos of supplier receipts. AI extracts vendor, amount, and VAT instantly.',
        icon: 'camera',
      },
      {
        title: 'Food Cost Categories',
        description: 'Pre-built categories for food, beverages, and consumables to track your margins.',
        icon: 'pie-chart',
      },
      {
        title: 'Cash Flow Tracking',
        description: 'Monitor daily takings vs expenses in real-time on your dashboard.',
        icon: 'dollar-sign',
      },
      {
        title: 'Supplier Management',
        description: 'Track all your supplier invoices and payments in one organized system.',
        icon: 'users',
      },
    ],
    features: [
      'Receipt photo capture',
      'Food cost percentage tracking',
      'Beverage cost tracking',
      'Daily cash reconciliation',
      'Supplier invoice management',
      'Staff expense tracking',
      'VAT on food vs beverages',
      'Profit margin reports',
    ],
    stats: [
      { value: '30%', label: 'Better cost visibility' },
      { value: '99%', label: 'Receipt capture accuracy' },
      { value: 'R25K+', label: 'Average annual savings' },
    ],
    keywords: ['restaurant bookkeeping', 'hospitality accounting', 'food service bookkeeping south africa', 'cafe accounting software'],
    metaTitle: 'Restaurant Bookkeeping Software | ProcessX South Africa',
    metaDescription: 'Bookkeeping for restaurants and hospitality. Track food costs, manage supplier invoices, and monitor cash flow. AI-powered receipt scanning. Start free.',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    slug: 'healthcare',
    headline: 'Healthcare Practice Bookkeeping',
    subheadline: 'Compliant, secure, and designed for medical professionals',
    description: 'Healthcare practices have unique billing requirements, medical aid reconciliations, and strict compliance needs. ProcessX helps doctors, dentists, and therapists manage their finances professionally.',
    icon: 'heart-pulse',
    challenges: [
      {
        title: 'Medical Aid Claims',
        description: 'Reconciling payments from multiple medical aids is time-consuming and error-prone.',
      },
      {
        title: 'Practice Expenses',
        description: 'Tracking medical supplies, equipment, and practice overheads requires organization.',
      },
      {
        title: 'Tax Deductions',
        description: 'Knowing which expenses qualify for tax deductions in healthcare is complex.',
      },
      {
        title: 'Professional Compliance',
        description: 'Maintaining proper financial records for HPCSA and other bodies is essential.',
      },
    ],
    solutions: [
      {
        title: 'Income Tracking',
        description: 'Track patient payments, medical aid reimbursements, and cash consultations separately.',
        icon: 'wallet',
      },
      {
        title: 'Expense Categories',
        description: 'Medical-specific categories for supplies, equipment, CPD, and practice costs.',
        icon: 'folder',
      },
      {
        title: 'Tax Reports',
        description: 'Generate reports showing all deductible expenses for your accountant.',
        icon: 'file-text',
      },
      {
        title: 'Professional Records',
        description: 'Maintain organized financial records that meet professional standards.',
        icon: 'shield',
      },
    ],
    features: [
      'Medical aid payment tracking',
      'Patient billing records',
      'Medical supply expense tracking',
      'Equipment depreciation',
      'CPD expense tracking',
      'Practice overhead management',
      'HPCSA-compliant records',
      'Tax deduction reports',
    ],
    stats: [
      { value: '10hrs', label: 'Saved monthly' },
      { value: '100%', label: 'Audit ready' },
      { value: 'R40K+', label: 'Tax deductions found' },
    ],
    keywords: ['healthcare bookkeeping', 'medical practice accounting', 'doctor bookkeeping south africa', 'dentist accounting software'],
    metaTitle: 'Healthcare Bookkeeping Software | ProcessX South Africa',
    metaDescription: 'Bookkeeping for doctors, dentists, and healthcare practices. Track medical aid payments, manage expenses, and stay compliant. Start free.',
  },
  {
    id: 'logistics',
    name: 'Logistics & Transport',
    slug: 'logistics',
    headline: 'Logistics Bookkeeping on the Move',
    subheadline: 'Track every kilometer, every delivery, every rand',
    description: 'Transport and logistics companies need to track fuel costs, vehicle expenses, driver payments, and delivery income across multiple vehicles. ProcessX makes fleet financial management simple.',
    icon: 'truck',
    challenges: [
      {
        title: 'Fuel Cost Tracking',
        description: 'Fuel is your biggest expense. Tracking it across multiple vehicles is essential.',
      },
      {
        title: 'Vehicle Expenses',
        description: 'Maintenance, tyres, repairs, and licensing add up fast across a fleet.',
      },
      {
        title: 'Driver Management',
        description: 'Tracking driver payments, advances, and expense claims is complex.',
      },
      {
        title: 'Logbook Compliance',
        description: 'SARS requires detailed vehicle logbooks for claiming travel deductions.',
      },
    ],
    solutions: [
      {
        title: 'Vehicle Logbook',
        description: 'Built-in digital logbook that calculates your allowable travel deductions.',
        icon: 'book',
      },
      {
        title: 'Fuel Tracking',
        description: 'Track fuel expenses per vehicle with automatic receipt scanning.',
        icon: 'fuel',
      },
      {
        title: 'Fleet Expenses',
        description: 'Organize all vehicle expenses by registration number for easy reporting.',
        icon: 'truck',
      },
      {
        title: 'Driver Accounts',
        description: 'Track advances, payments, and expense claims per driver.',
        icon: 'users',
      },
    ],
    features: [
      'Digital vehicle logbook',
      'Per-vehicle expense tracking',
      'Fuel cost monitoring',
      'Maintenance scheduling',
      'Driver payment tracking',
      'Delivery income recording',
      'Fleet depreciation',
      'SARS travel deduction reports',
    ],
    stats: [
      { value: '20%', label: 'Better fuel visibility' },
      { value: 'R80K+', label: 'Travel deductions claimed' },
      { value: '99%', label: 'Logbook compliance' },
    ],
    keywords: ['logistics bookkeeping', 'transport accounting', 'trucking bookkeeping south africa', 'fleet management accounting'],
    metaTitle: 'Logistics & Transport Bookkeeping | ProcessX South Africa',
    metaDescription: 'Bookkeeping for logistics and transport companies. Track fuel, manage fleets, maintain SARS logbooks, and maximize travel deductions. Start free.',
  },
  {
    id: 'professional-services',
    name: 'Professional Services',
    slug: 'professional-services',
    headline: 'Bookkeeping for Professionals',
    subheadline: 'Consultants, lawyers, accountants, and agencies',
    description: 'Professional service firms bill by the hour, manage client projects, and need pristine financial records. ProcessX helps you track billable time, manage expenses, and look professional.',
    icon: 'briefcase',
    challenges: [
      {
        title: 'Client Billing',
        description: 'Tracking income by client and project is essential for profitability analysis.',
      },
      {
        title: 'Business Expenses',
        description: 'From software subscriptions to client entertainment, expenses add up.',
      },
      {
        title: 'Professional Image',
        description: 'Your financial records should be as professional as your services.',
      },
      {
        title: 'Tax Optimization',
        description: 'Professionals often miss deductions they\'re entitled to claim.',
      },
    ],
    solutions: [
      {
        title: 'Client Income Tracking',
        description: 'Track income by client to see which relationships are most valuable.',
        icon: 'users',
      },
      {
        title: 'Expense Management',
        description: 'Categorize business expenses with professional-specific categories.',
        icon: 'receipt',
      },
      {
        title: 'Financial Reports',
        description: 'Generate professional P&L statements and tax summaries instantly.',
        icon: 'bar-chart',
      },
      {
        title: 'Deduction Finder',
        description: 'AI helps identify deductions you might be missing.',
        icon: 'sparkles',
      },
    ],
    features: [
      'Client-based income tracking',
      'Project expense allocation',
      'Professional development costs',
      'Software subscription tracking',
      'Home office deductions',
      'Travel expense management',
      'Client entertainment tracking',
      'Professional fee reports',
    ],
    stats: [
      { value: '95%', label: 'Of users find new deductions' },
      { value: '12hrs', label: 'Saved monthly' },
      { value: 'R35K+', label: 'Average tax savings' },
    ],
    keywords: ['consultant bookkeeping', 'law firm accounting', 'agency bookkeeping south africa', 'professional services accounting'],
    metaTitle: 'Professional Services Bookkeeping | ProcessX South Africa',
    metaDescription: 'Bookkeeping for consultants, lawyers, and agencies. Track client income, manage expenses, and maximize deductions. AI-powered. Start free.',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    slug: 'ecommerce',
    headline: 'E-commerce Bookkeeping Simplified',
    subheadline: 'From Takealot to Shopify, track it all',
    description: 'Online sellers deal with multiple platforms, payment processors, shipping costs, and returns. ProcessX helps you understand your true profit margins across all your sales channels.',
    icon: 'shopping-cart',
    challenges: [
      {
        title: 'Multiple Platforms',
        description: 'Selling on Takealot, Shopify, and social media means scattered financial data.',
      },
      {
        title: 'Payment Fees',
        description: 'PayFast, PayGate, and platform fees eat into margins but are hard to track.',
      },
      {
        title: 'Shipping Costs',
        description: 'Courier costs, packaging, and returns affect profitability per order.',
      },
      {
        title: 'True Profit',
        description: 'Knowing your actual profit after all costs is nearly impossible manually.',
      },
    ],
    solutions: [
      {
        title: 'Multi-Channel Tracking',
        description: 'Track income from all your sales channels in one place.',
        icon: 'globe',
      },
      {
        title: 'Fee Tracking',
        description: 'Automatically categorize platform fees, payment fees, and commissions.',
        icon: 'percent',
      },
      {
        title: 'Cost Analysis',
        description: 'Track shipping, packaging, and product costs to see true margins.',
        icon: 'pie-chart',
      },
      {
        title: 'Profitability Reports',
        description: 'See which products and channels are actually making money.',
        icon: 'trending-up',
      },
    ],
    features: [
      'Multi-platform income tracking',
      'Payment processor fee tracking',
      'Shipping cost management',
      'Product cost tracking',
      'Return/refund recording',
      'Platform commission tracking',
      'True profit calculation',
      'Channel comparison reports',
    ],
    stats: [
      { value: '40%', label: 'Better margin visibility' },
      { value: '8hrs', label: 'Saved weekly' },
      { value: '100%', label: 'Fee tracking accuracy' },
    ],
    keywords: ['ecommerce bookkeeping', 'online store accounting', 'takealot seller accounting south africa', 'shopify bookkeeping'],
    metaTitle: 'E-commerce Bookkeeping Software | ProcessX South Africa',
    metaDescription: 'Bookkeeping for online sellers. Track sales across platforms, manage fees, and calculate true profit margins. Works with Takealot, Shopify & more. Start free.',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    slug: 'manufacturing',
    headline: 'Manufacturing Financial Control',
    subheadline: 'Track raw materials, production costs, and margins',
    description: 'Manufacturers need to track raw material costs, production expenses, equipment depreciation, and finished goods. ProcessX gives you visibility into your true cost of production.',
    icon: 'factory',
    challenges: [
      {
        title: 'Raw Material Costs',
        description: 'Tracking material costs across multiple suppliers and products is complex.',
      },
      {
        title: 'Production Expenses',
        description: 'Utilities, labor, and overhead all contribute to production costs.',
      },
      {
        title: 'Equipment Depreciation',
        description: 'Manufacturing equipment requires careful depreciation tracking for tax.',
      },
      {
        title: 'Costing Accuracy',
        description: 'Knowing your true cost per unit is essential for pricing and margins.',
      },
    ],
    solutions: [
      {
        title: 'Supplier Tracking',
        description: 'Manage all raw material suppliers and track purchase costs.',
        icon: 'package',
      },
      {
        title: 'Production Costs',
        description: 'Categorize all production-related expenses for accurate costing.',
        icon: 'settings',
      },
      {
        title: 'Asset Management',
        description: 'Track machinery with automatic SARS-compliant depreciation.',
        icon: 'cog',
      },
      {
        title: 'Cost Reports',
        description: 'Generate reports showing production costs and profit margins.',
        icon: 'file-text',
      },
    ],
    features: [
      'Raw material cost tracking',
      'Supplier invoice management',
      'Production expense categories',
      'Utility cost allocation',
      'Equipment depreciation',
      'Maintenance cost tracking',
      'Cost of goods manufactured',
      'Margin analysis reports',
    ],
    stats: [
      { value: '25%', label: 'Better cost visibility' },
      { value: 'R100K+', label: 'Equipment depreciation tracked' },
      { value: '15hrs', label: 'Saved monthly' },
    ],
    keywords: ['manufacturing bookkeeping', 'factory accounting', 'production cost accounting south africa', 'manufacturing financial software'],
    metaTitle: 'Manufacturing Bookkeeping Software | ProcessX South Africa',
    metaDescription: 'Bookkeeping for manufacturers. Track raw materials, production costs, and equipment depreciation. Calculate true cost of goods. Start free.',
  },
]

export const getIndustryBySlug = (slug: string): Industry | undefined => {
  return industries.find(i => i.slug === slug)
}

export const getAllIndustrySlugs = (): string[] => {
  return industries.map(i => i.slug)
}
