import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Tax Calculators South Africa | Business & Personal Tax Calculator',
  description: 'Free South African tax calculators. Calculate business tax, company tax, tax refunds, total cost to company, and more. SARS-compliant calculations for 2024/2025.',
  keywords: 'tax calculator, business tax calculator, company tax calculator, tax refund calculator, total cost to company calculator, south africa tax calculator, SARS tax calculator',
  openGraph: {
    title: 'Free Tax Calculators South Africa | ProcessX',
    description: 'Calculate your South African tax instantly. Free business tax, company tax, VAT, and personal tax calculators.',
    type: 'website',
  },
}

export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
