'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface CompanyMember {
  id: string
  role: string
  is_active: boolean
  joined_at: string
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    is_active: boolean
  }
}

interface Company {
  id: string
  name: string
  registration_number: string | null
  tax_number: string | null
  vat_number: string | null
  business_type: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  province: string | null
  postal_code: string | null
  country: string
  phone: string | null
  email: string | null
  website: string | null
  fiscal_year_end: string | null
  currency: string
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  members: CompanyMember[]
  _count: {
    members: number
    expenses: number
    income: number
    recurring_expenses: number
    assets: number
    vehicle_log_entries: number
  }
}

const businessTypeLabels: Record<string, string> = {
  small_business_corporation: 'Small Business Corporation (SBC)',
  standard_company: 'Standard Company',
  sole_proprietor: 'Sole Proprietor',
}

const memberRoleLabels: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  accountant: 'Accountant',
  viewer: 'Viewer',
}

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCompany()
  }, [id])

  const fetchCompany = async () => {
    try {
      const response = await fetch(`/api/admin/companies/${id}`)
      if (response.ok) {
        const data = await response.json()
        setCompany(data)
      } else if (response.status === 404) {
        router.push('/admin/companies')
      }
    } catch (error) {
      console.error('Failed to fetch company:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!company) return
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/companies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !company.is_active }),
      })
      if (response.ok) {
        setCompany({ ...company, is_active: !company.is_active })
      }
    } catch (error) {
      console.error('Failed to toggle company status:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    )
  }

  if (!company) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Company not found</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/companies" className="hover:text-gray-700">Companies</Link>
        <span>/</span>
        <span className="text-gray-900">{company.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">{company.name}</h1>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${company.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {company.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          {company.business_type && (
            <p className="text-gray-500 mt-1">
              {businessTypeLabels[company.business_type] || company.business_type}
            </p>
          )}
        </div>
        <button
          onClick={handleToggleStatus}
          disabled={saving}
          className={`px-4 py-2 rounded-xl font-medium transition-colors ${
            company.is_active
              ? 'border border-red-200 text-red-600 hover:bg-red-50'
              : 'border border-green-200 text-green-600 hover:bg-green-50'
          }`}
        >
          {company.is_active ? 'Deactivate' : 'Activate'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Details */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Company Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Registration Number</p>
                <p className="text-gray-900">{company.registration_number || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tax Number</p>
                <p className="text-gray-900">{company.tax_number || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">VAT Number</p>
                <p className="text-gray-900">{company.vat_number || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Business Type</p>
                <p className="text-gray-900">
                  {company.business_type ? businessTypeLabels[company.business_type] || company.business_type : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fiscal Year End</p>
                <p className="text-gray-900">{company.fiscal_year_end || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Currency</p>
                <p className="text-gray-900">{company.currency}</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900">{company.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{company.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <p className="text-gray-900">{company.website || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-900">
                  {company.address_line1 || '-'}
                  {company.address_line2 && <>, {company.address_line2}</>}
                  {company.city && <>, {company.city}</>}
                  {company.province && <>, {company.province}</>}
                  {company.postal_code && <> {company.postal_code}</>}
                </p>
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Team Members ({company.members.length})</h2>
            </div>
            {company.members.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No members</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {company.members.map((member) => (
                  <Link
                    key={member.id}
                    href={`/admin/users/${member.user.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {member.user.first_name.charAt(0)}{member.user.last_name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {member.user.first_name} {member.user.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{member.user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        {memberRoleLabels[member.role] || member.role}
                      </span>
                      {!member.user.is_active && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                          Inactive
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Activity Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Team Members</span>
                <span className="font-medium text-gray-900">{company._count.members}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Expenses</span>
                <span className="font-medium text-gray-900">{company._count.expenses}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Income Records</span>
                <span className="font-medium text-gray-900">{company._count.income}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Recurring Expenses</span>
                <span className="font-medium text-gray-900">{company._count.recurring_expenses}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Assets</span>
                <span className="font-medium text-gray-900">{company._count.assets}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Vehicle Log Entries</span>
                <span className="font-medium text-gray-900">{company._count.vehicle_log_entries}</span>
              </div>
            </div>
          </div>

          {/* Owner Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Created By</h2>
            <Link
              href={`/admin/users/${company.created_by.id}`}
              className="flex items-center gap-3 p-3 -m-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {company.created_by.first_name.charAt(0)}{company.created_by.last_name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {company.created_by.first_name} {company.created_by.last_name}
                </p>
                <p className="text-xs text-gray-500">{company.created_by.email}</p>
              </div>
            </Link>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-gray-900">{new Date(company.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-gray-900">{new Date(company.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
