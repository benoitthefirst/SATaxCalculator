'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

interface DashboardNavProps {
  user: {
    name: string
    email: string
  }
  company: {
    name: string
    role: string
  }
}

export default function DashboardNav({ user, company }: DashboardNavProps) {
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Expenses', href: '/expenses' },
    { name: 'Reports', href: '/reports' },
    { name: 'Settings', href: '/settings' },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#007AFF] to-[#0051D5] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-white text-sm font-bold">P</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">ProcessX</span>
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

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{company.name}</p>
              <p className="text-xs text-gray-500 capitalize">{company.role}</p>
            </div>

            <div className="relative group">
              <button className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#007AFF] to-[#0051D5] flex items-center justify-center text-white text-sm font-medium shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </button>

              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10 hidden group-hover:block">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/settings"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Settings
                  </Link>
                  <Link
                    href="/calculators"
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
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden border-t border-gray-100">
        <div className="px-3 pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'block px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200',
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
    </nav>
  )
}
