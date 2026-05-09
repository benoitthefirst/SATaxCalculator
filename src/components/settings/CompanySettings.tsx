'use client'

import { useState } from 'react'
import CompanySettingsForm from './CompanySettingsForm'

interface CompanySettingsProps {
  company: {
    id: string
    name: string
    registration_number: string | null
    tax_number: string | null
    vat_number: string | null
    business_type: string | null
    phone: string | null
    email: string | null
    address_line1: string | null
    city: string | null
    province: string | null
    postal_code: string | null
  }
  role: string
}

export default function CompanySettings({ company, role }: CompanySettingsProps) {
  const [isEditing, setIsEditing] = useState(false)

  const canEdit = role === 'owner' || role === 'admin'

  const formatBusinessType = (type: string | null) => {
    if (!type) return 'Not specified'
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (isEditing) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Company Profile
          </h2>
        </div>
        <div className="px-6 py-6">
          <CompanySettingsForm company={company} onCancel={() => setIsEditing(false)} />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Company Profile
        </h2>
        {canEdit && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Edit
          </button>
        )}
      </div>
      <div className="px-6 py-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <p className="text-gray-900">{company.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Type
          </label>
          <p className="text-gray-900">
            {formatBusinessType(company.business_type)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Number
            </label>
            <p className="text-gray-900">{company.tax_number || 'Not provided'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              VAT Number
            </label>
            {company.vat_number ? (
              <div className="flex items-center gap-2">
                <p className="text-gray-900">{company.vat_number}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-700">
                  VAT Registered
                </span>
              </div>
            ) : (
              <p className="text-gray-500">Not VAT registered</p>
            )}
          </div>
        </div>

        {company.registration_number && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CIPC Registration Number
            </label>
            <p className="text-gray-900">{company.registration_number}</p>
          </div>
        )}

        {(company.phone || company.email) && (
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <p className="text-gray-900">{company.phone}</p>
                </div>
              )}
              {company.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{company.email}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {(company.address_line1 || company.city || company.province) && (
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Business Address</h3>
            <p className="text-gray-900">
              {[company.address_line1, company.city, company.province, company.postal_code]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Role
          </label>
          <p className="text-gray-900 capitalize">{role}</p>
        </div>
      </div>
    </div>
  )
}
