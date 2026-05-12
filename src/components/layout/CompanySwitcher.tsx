'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Company {
  id: string
  name: string
  role: string
}

interface CompanySwitcherProps {
  companies: Company[]
  currentCompanyId: string
  canCreateCompany: boolean
}

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  accountant: 'Accountant',
  viewer: 'Viewer',
}

export default function CompanySwitcher({
  companies,
  currentCompanyId,
  canCreateCompany,
}: CompanySwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const currentCompany = companies.find((c) => c.id === currentCompanyId)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSwitch = async (companyId: string) => {
    if (companyId === currentCompanyId) {
      setIsOpen(false)
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
        // Full page reload to update all data for the new company
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Failed to switch company:', error)
      setIsSwitching(false)
    }
  }

  // Don't show switcher if only one company
  if (companies.length <= 1 && !canCreateCompany) {
    return (
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-medium text-sm">
          {currentCompany?.name.charAt(0).toUpperCase()}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
            {currentCompany?.name}
          </p>
          <p className="text-xs text-gray-500">
            {currentCompany?.role && roleLabels[currentCompany.role]}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-medium text-sm">
          {currentCompany?.name.charAt(0).toUpperCase()}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
            {currentCompany?.name}
          </p>
          <p className="text-xs text-gray-500">
            {currentCompany?.role && roleLabels[currentCompany.role]}
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase">Your Companies</p>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => handleSwitch(company.id)}
                disabled={isSwitching}
                className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 ${
                  company.id === currentCompanyId ? 'bg-orange-50' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-medium text-sm">
                  {company.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {company.name}
                  </p>
                  <p className="text-xs text-gray-500">{roleLabels[company.role]}</p>
                </div>
                {company.id === currentCompanyId && (
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {canCreateCompany && (
            <>
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Link
                  href="/companies/new"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Create New Company</span>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
