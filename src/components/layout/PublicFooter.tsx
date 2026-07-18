import Link from 'next/link'
import Image from 'next/image'

export default function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/ProcessX_Logo_full.webp"
                alt="ProcessX"
                width={140}
                height={36}
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600 mb-4">
              Simple bookkeeping and CRM solution for South African businesses.
            </p>
            <p className="text-sm text-gray-500">
              Bookkeeping Made Simple, Business Made Easy
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/calculators" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Tax Calculators
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Watch Demo
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Get Started Free
                </Link>
              </li>
            </ul>
          </div>

          {/* Tax Calculators */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Calculators</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/calculators/income-tax-calculator" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Income Tax Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/salary-tax-calculator" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Salary Tax Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/business-tax-calculator" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Business Tax Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/sars-tax-calculator" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  SARS Tax Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/income-tax-brackets" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Tax Brackets 2024
                </Link>
              </li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Industries</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/industries/retail" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Retail
                </Link>
              </li>
              <li>
                <Link href="/industries/construction" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Construction
                </Link>
              </li>
              <li>
                <Link href="/industries/restaurant" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Restaurant & Bar
                </Link>
              </li>
              <li>
                <Link href="/industries/healthcare" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Healthcare
                </Link>
              </li>
              <li>
                <Link href="/industries" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  View All Industries
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Help Centre
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Solutions
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-[#062C2E] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            © {currentYear} The Process Enterprise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
