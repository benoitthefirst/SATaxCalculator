'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function PublicHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/calculators', label: 'Tax Calculator' },
    { href: '/help', label: 'Help Centre' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#062C2E]/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/Px_Logo_white.webp"
            alt="ProcessX"
            width={140}
            height={36}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'text-[#E8FF3F]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Link
              href="/dashboard"
              className="px-5 py-2.5 text-sm font-semibold rounded-full bg-[#E8FF3F] text-[#062C2E] hover:bg-[#d4eb38] transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-semibold rounded-full bg-[#E8FF3F] text-[#062C2E] hover:bg-[#d4eb38] transition-colors"
              >
                Start Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-white"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#062C2E]">
          <div className="px-6 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-base font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-[#E8FF3F]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 space-y-3">
              {session ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-5 py-3 text-base font-semibold rounded-full bg-[#E8FF3F] text-[#062C2E] hover:bg-[#d4eb38] transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-5 py-3 text-base font-medium rounded-full border border-white/20 text-white hover:bg-white/5 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-5 py-3 text-base font-semibold rounded-full bg-[#E8FF3F] text-[#062C2E] hover:bg-[#d4eb38] transition-colors"
                  >
                    Start Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
