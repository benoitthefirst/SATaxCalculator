import Link from 'next/link'

export default function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xl">
                P
              </div>
              <span className="text-xl font-bold text-gray-900">ProcessX</span>
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
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Features
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
