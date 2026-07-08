'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

interface PublicHeaderProps {
  variant?: 'light' | 'dark'
}

export default function PublicHeader({ variant = 'light' }: PublicHeaderProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isDark = variant === 'dark'

  const navItems = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/calculators', label: 'Tax Calculator' },
    { href: '/help', label: 'Help Centre' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-md ${
        isDark
          ? 'border-[#081F22] bg-[#062C2E]/90'
          : 'border-[#E8EDF3] bg-white/80'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={isDark ? '/Px_Logo_white.webp' : '/ProcessX_Logo_full.webp'}
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
                  ? isDark
                    ? 'text-[#DFFB2D]'
                    : 'text-[#2563EB]'
                  : isDark
                  ? 'text-gray-300 hover:text-white'
                  : 'text-[#4B5563] hover:text-[#2563EB]'
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
              className={`px-5 py-2.5 text-sm font-medium rounded-full transition-colors ${
                isDark
                  ? 'bg-[#DFFB2D] text-[#062C2E] hover:bg-[#e8fc5a]'
                  : 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]'
              }`}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={`text-sm font-medium transition-colors ${
                  isDark ? 'text-gray-300 hover:text-white' : 'text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`px-5 py-2.5 text-sm font-medium rounded-full transition-colors ${
                  isDark
                    ? 'bg-[#DFFB2D] text-[#062C2E] hover:bg-[#e8fc5a]'
                    : 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]'
                }`}
              >
                Start Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t ${
            isDark ? 'border-[#081F22] bg-[#062C2E]' : 'border-[#E8EDF3] bg-white'
          }`}
        >
          <div className="px-6 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-base font-medium transition-colors ${
                  pathname === item.href
                    ? isDark
                      ? 'text-[#DFFB2D]'
                      : 'text-[#2563EB]'
                    : isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-[#4B5563] hover:text-[#2563EB]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className={`pt-4 border-t space-y-3 ${isDark ? 'border-[#081F22]' : 'border-[#E8EDF3]'}`}>
              {session ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-center px-5 py-3 text-base font-medium rounded-full transition-colors ${
                    isDark
                      ? 'bg-[#DFFB2D] text-[#062C2E] hover:bg-[#e8fc5a]'
                      : 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]'
                  }`}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block w-full text-center px-5 py-3 text-base font-medium rounded-full border transition-colors ${
                      isDark
                        ? 'border-[#081F22] text-white hover:bg-white/5'
                        : 'border-[#E8EDF3] text-[#111827] hover:bg-[#F7F9FC]'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block w-full text-center px-5 py-3 text-base font-medium rounded-full transition-colors ${
                      isDark
                        ? 'bg-[#DFFB2D] text-[#062C2E] hover:bg-[#e8fc5a]'
                        : 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]'
                    }`}
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
