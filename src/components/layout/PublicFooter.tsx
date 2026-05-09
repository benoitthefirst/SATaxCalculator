import Link from 'next/link'
import Image from 'next/image'

export default function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/ProcessX_Logo_full.webp"
                alt="ProcessX"
                width={140}
                height={36}
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600">
              Simple bookkeeping and CRM solution for South African businesses.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/pricing" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/calculators" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Tax Calculator
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="https://theprocesse.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  The Process Enterprise
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
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
