import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { getActiveCompanyForUser } from '@/lib/company-context'
import AssetForm from '@/components/forms/AssetForm'

export const metadata = {
  title: 'Add Asset - ProcessX',
  description: 'Add a new business asset',
}

export default async function NewAssetPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const companyId = await getActiveCompanyForUser(session.user.id)

  if (!companyId) {
    redirect('/onboarding/company')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Add Asset</h1>
        <p className="mt-1 text-sm text-gray-500">
          Record a new capital asset for depreciation
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <AssetForm companyId={companyId} />
      </div>
    </div>
  )
}
