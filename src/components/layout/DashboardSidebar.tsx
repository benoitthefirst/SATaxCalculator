'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils/cn'

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

interface DashboardSidebarProps {
  user: {
    name: string
    email: string
  }
  companies: Company[]
  currentCompanyId: string
  canCreateCompany: boolean
}

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    exact: true,
  },
  {
    href: '/dashboard/income',
    label: 'Income',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/expenses',
    label: 'Expenses',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/documents',
    label: 'Documents',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/assets',
    label: 'Assets',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  // {
  //   href: '/dashboard/banking',
  //   label: 'Banking',
  //   icon: (
  //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  //     </svg>
  //   ),
  // },
  {
    href: '/dashboard/vehicle-logbook',
    label: 'Logbook',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    href: '/dashboard/reports',
    label: 'Reports',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  // {
  //   href: '/dashboard/sars',
  //   label: 'SARS',
  //   icon: (
  //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  //     </svg>
  //   ),
  // },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/support',
    label: 'Support',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function DashboardSidebar({
  user,
  companies,
  currentCompanyId,
  canCreateCompany,
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)

  const currentCompany = companies.find((c) => c.id === currentCompanyId)

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const handleSwitch = async (companyId: string) => {
    if (companyId === currentCompanyId) {
      setIsCompanyDropdownOpen(false)
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

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#081F22]">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[#062C2E] px-6">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/Px_Logo_white.webp"
            alt="ProcessX"
            width={120}
            height={32}
            className="h-7 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Company Switcher */}
      {currentCompany && (
        <div className="relative px-3 py-3 border-b border-[#062C2E]">
          <button
            onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
              isCompanyDropdownOpen ? 'bg-[#DFFB2D]/10 ring-2 ring-[#DFFB2D]/30' : 'hover:bg-white/5'
            )}
          >
            <div className="w-9 h-9 rounded-lg bg-[#DFFB2D] flex items-center justify-center text-[#081F22] font-semibold text-sm flex-shrink-0">
              {currentCompany.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {currentCompany.name}
              </p>
              <p className="text-xs text-gray-400">{roleLabels[currentCompany.role]}</p>
            </div>
            <svg
              className={cn(
                'w-4 h-4 text-gray-400 transition-transform duration-200',
                isCompanyDropdownOpen && 'rotate-180'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isCompanyDropdownOpen && (
            <div className="absolute left-3 right-3 top-full mt-1 bg-[#0a2528] rounded-xl shadow-lg border border-[#062C2E] py-2 z-10">
              {companies
                .filter((company) => company.id !== currentCompanyId)
                .map((company) => (
                  <button
                    key={company.id}
                    onClick={() => {
                      handleSwitch(company.id)
                      setIsCompanyDropdownOpen(false)
                    }}
                    disabled={isSwitching}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#DFFB2D] flex items-center justify-center text-[#081F22] font-semibold text-sm flex-shrink-0">
                      {company.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {company.name}
                      </p>
                      <p className="text-xs text-gray-400">{roleLabels[company.role]}</p>
                    </div>
                  </button>
                ))}
              {canCreateCompany && (
                <>
                  <div className="border-t border-[#062C2E] my-1" />
                  <Link
                    href="/dashboard/companies/new"
                    onClick={() => setIsCompanyDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-white/5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-gray-400">
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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive(item.href, item.exact)
                    ? 'bg-[#DFFB2D]/10 text-[#DFFB2D]'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info */}
      <div className="border-t border-[#062C2E] p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#DFFB2D] flex items-center justify-center">
            <span className="text-sm font-semibold text-[#081F22]">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.name || 'User'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user.email}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Sign out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* AI Assistant - Commented out for now */}
      {/* <div className="border-t border-[#062C2E] p-4">
        <div className="bg-[#062C2E] rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#DFFB2D]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#DFFB2D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-white">AI Assistant</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Ask ProcessX anything about your finances.
          </p>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#DFFB2D] text-[#081F22] text-sm font-semibold rounded-lg hover:bg-[#e8fc5a] transition-colors">
            Ask AI Assistant
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div> */}
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#081F22] border-b border-[#062C2E]">
        <div className="flex items-center justify-between h-16 px-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/dashboard">
            <Image
              src="/Px_Logo_white.webp"
              alt="ProcessX"
              width={120}
              height={32}
              className="h-7 w-auto"
              priority
            />
          </Link>
          <div className="w-10" /> {/* Spacer for balance */}
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 z-40 h-screen w-64 border-r border-[#062C2E] bg-[#081F22]">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar drawer */}
      <>
        {/* Backdrop */}
        <div
          className={cn(
            'lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Drawer */}
        <aside
          className={cn(
            'lg:hidden fixed left-0 top-0 z-50 h-screen w-72 bg-[#081F22] shadow-xl transform transition-transform duration-300 ease-in-out',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Close button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <SidebarContent />
        </aside>
      </>
    </>
  )
}
