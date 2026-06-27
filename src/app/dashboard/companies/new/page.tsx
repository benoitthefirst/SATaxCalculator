import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { canCreateCompany } from '@/lib/subscription/feature-gate'
import CompanyOnboardingForm from '@/components/forms/CompanyOnboardingForm'

export const metadata = {
  title: 'Create New Company - ProcessX',
  description: 'Add another company to your ProcessX account',
}

export default async function NewCompanyPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Check if user can create another company
  const canCreate = await canCreateCompany(session.user.id)

  if (!canCreate.allowed) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Upgrade to Add More Companies
            </h2>
            <p className="text-gray-600 mb-6">
              {canCreate.isUnlimited
                ? "You've reached your company limit."
                : `Your current plan allows ${canCreate.limit} ${canCreate.limit === 1 ? 'company' : 'companies'}.
                   You're currently managing ${canCreate.usage}.`}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Upgrade to the Business plan to manage unlimited companies from a single account.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard/settings/subscription"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                View Plans
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Go Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-8 py-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Create New Company</h1>
          <p className="mt-1 text-sm text-gray-600">
            Add another company to manage with your ProcessX account
          </p>
        </div>

        <div className="p-8">
          <CompanyOnboardingForm userId={session.user.id} />
        </div>
      </div>
    </div>
  )
}
