import { auth } from '@/lib/auth'
import Link from 'next/link'
import { prisma } from '@/lib/db'

export const metadata = {
  title: 'Settings - ProcessX',
  description: 'Manage your account and company settings',
}

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const membership = await prisma.companyMember.findFirst({
    where: {
      user_id: session.user.id,
      is_active: true,
    },
    include: {
      company: true,
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your account and company settings
        </p>
      </div>

      {/* User Settings */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            User Profile
          </h2>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <p className="text-gray-900">
              {user?.first_name} {user?.last_name}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <p className="text-gray-900">••••••••</p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <Link
              href="/settings/change-password"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-2xl hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Change Password
            </Link>
          </div>
        </div>
      </div>

      {/* Company Settings */}
      {membership && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Company Profile
            </h2>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <p className="text-gray-900">{membership.company.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Type
              </label>
              <p className="text-gray-900 capitalize">
                {membership.company.business_type?.replace(/_/g, ' ')}
              </p>
            </div>
            {membership.company.tax_number && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Number
                </label>
                <p className="text-gray-900">{membership.company.tax_number}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Role
              </label>
              <p className="text-gray-900 capitalize">{membership.role}</p>
            </div>
            <div className="pt-4">
              <p className="text-sm text-gray-500">
                Company settings editing coming soon
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
