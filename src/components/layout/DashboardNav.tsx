'use client'

import { useState, useEffect, useRef } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import CompanySwitcher from './CompanySwitcher'

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  accountant: 'Accountant',
  viewer: 'Viewer',
}

interface Company {
  id: string
  name: string
  role: string
}

interface DashboardNavProps {
  user: {
    name: string
    email: string
  }
  companies: Company[]
  currentCompanyId: string
  canCreateCompany: boolean
}

export default function DashboardNav({ user, companies, currentCompanyId, canCreateCompany }: DashboardNavProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Income', href: '/income' },
    { name: 'Expenses', href: '/expenses' },
    { name: 'Assets', href: '/assets' },
    { name: 'Logbook', href: '/vehicle-logbook' },
    { name: 'Reports', href: '/reports' },
    { name: 'Settings', href: '/settings' },
  ]

  return (
    <>
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between h-16">
          {/* Left section: Hamburger (mobile) + Logo (desktop) + Nav links */}
          <div className="flex items-center">
            {/* Mobile menu button - left side */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors mr-2"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Logo - hidden on mobile, visible on desktop */}
            <div className="hidden sm:flex flex-shrink-0 items-center">
              <Link href="/dashboard" className="flex items-center group">
                <Image
                  src="/ProcessX_Logo_full.webp"
                  alt="ProcessX"
                  width={140}
                  height={36}
                  className="h-9 w-auto"
                  priority
                />
              </Link>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    pathname === item.href
                      ? 'bg-blue-50 text-[#007AFF]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Center section: Logo (mobile only) */}
          <div className="sm:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/dashboard" className="flex items-center">
              <Image
                src="/ProcessX_Logo_full.webp"
                alt="ProcessX"
                width={130}
                height={34}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Right section: Company switcher (desktop only) + User menu */}
          <div className="flex items-center space-x-4">
            {/* Hide company switcher on mobile - it's in the drawer */}
            <div className="hidden sm:block">
              <CompanySwitcher
                companies={companies}
                currentCompanyId={currentCompanyId}
                canCreateCompany={canCreateCompany}
              />
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#007AFF] to-[#0051D5] flex items-center justify-center text-white text-sm font-medium shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Settings
                    </Link>
                    <Link
                      href="/calculators"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Tax Calculator
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </nav>

    {/* Mobile drawer */}
    <MobileDrawer
      isOpen={isMobileMenuOpen}
      onClose={() => setIsMobileMenuOpen(false)}
      navigation={navigation}
      pathname={pathname}
      companies={companies}
      currentCompanyId={currentCompanyId}
      canCreateCompany={canCreateCompany}
    />
    </>
  )
}

function MobileDrawer({
  isOpen,
  onClose,
  navigation,
  pathname,
  companies,
  currentCompanyId,
  canCreateCompany,
}: {
  isOpen: boolean
  onClose: () => void
  navigation: { name: string; href: string }[]
  pathname: string
  companies: Company[]
  currentCompanyId: string
  canCreateCompany: boolean
}) {
  const [isSwitching, setIsSwitching] = useState(false)
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false)
  const currentCompany = companies.find((c) => c.id === currentCompanyId)

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleSwitch = async (companyId: string) => {
    if (companyId === currentCompanyId) {
      return
    }

    setIsSwitching(true)
    try {
      const response = await fetch('/api/companies/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId }),
      })

      if (response.ok) {
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Failed to switch company:', error)
      setIsSwitching(false)
    }
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          'sm:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        id="mobile-menu"
        className={cn(
          'sm:hidden fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
          <Link href="/dashboard" onClick={onClose}>
            <Image
              src="/ProcessX_Logo_full.webp"
              alt="ProcessX"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <span className="sr-only">Close menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Company switcher dropdown */}
        {companies.length > 0 && currentCompany && (
          <div className="relative px-3 py-3 border-b border-gray-100">
            {/* Dropdown trigger - shows current company */}
            <button
              onClick={() => setIsBusinessDropdownOpen(!isBusinessDropdownOpen)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isBusinessDropdownOpen ? 'bg-orange-50 ring-2 ring-orange-200' : 'hover:bg-gray-50'
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-medium text-base flex-shrink-0">
                {currentCompany.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentCompany.name}
                </p>
                <p className="text-xs text-gray-500">{roleLabels[currentCompany.role]}</p>
              </div>
              <svg
                className={cn(
                  'w-5 h-5 text-gray-400 transition-transform duration-200',
                  isBusinessDropdownOpen && 'rotate-180'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown overlay - positioned absolutely */}
            {isBusinessDropdownOpen && (
              <div className="absolute left-3 right-3 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                {companies
                  .filter((company) => company.id !== currentCompanyId)
                  .map((company) => (
                    <button
                      key={company.id}
                      onClick={() => {
                        handleSwitch(company.id)
                        setIsBusinessDropdownOpen(false)
                      }}
                      disabled={isSwitching}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                        {company.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {company.name}
                        </p>
                        <p className="text-xs text-gray-500">{roleLabels[company.role]}</p>
                      </div>
                    </button>
                  ))}
                {canCreateCompany && (
                  <>
                    <div className="border-t border-gray-100 my-1" />
                    <Link
                      href="/companies/new"
                      onClick={() => {
                        setIsBusinessDropdownOpen(false)
                        onClose()
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Add Business</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation links */}
        <nav className="px-3 py-4 space-y-1 flex-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                'block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                pathname === item.href
                  ? 'bg-blue-50 text-[#007AFF]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
