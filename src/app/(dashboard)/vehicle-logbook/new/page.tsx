import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { getActiveCompanyForUser } from '@/lib/company-context'
import Link from 'next/link'
import VehicleLogForm from '@/components/forms/VehicleLogForm'

export const metadata = {
  title: 'Log Trip - ProcessX',
  description: 'Log a new vehicle trip',
}

export default async function NewVehicleLogPage({
  searchParams,
}: {
  searchParams: Promise<{ asset?: string }>
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const companyId = await getActiveCompanyForUser(session.user.id)

  if (!companyId) {
    redirect('/onboarding/company')
  }

  // Get all vehicles (assets of type 'vehicle')
  const vehicles = await prisma.asset.findMany({
    where: {
      company_id: companyId,
      asset_type: 'vehicle',
      is_deleted: false,
    },
    select: {
      id: true,
      name: true,
      serial_number: true,
    },
    orderBy: { name: 'asc' },
  })

  const { asset: preselectedVehicleId } = await searchParams

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/vehicle-logbook"
          className="text-[#FF9500] hover:text-[#FF6B00] text-sm font-medium mb-2 inline-block"
        >
          ← Back to Logbook
        </Link>
        <h1 className="text-3xl font-semibold text-gray-900">Log Trip</h1>
        <p className="mt-1 text-sm text-gray-500">
          Record a vehicle trip for SARS compliance
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <VehicleLogForm
          companyId={companyId}
          vehicles={vehicles}
          preselectedVehicleId={preselectedVehicleId}
        />
      </div>

      {/* Tips */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Tips for Accurate Records</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Record trips immediately to avoid forgetting details
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Use specific location names (not just "client")
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Include client names for business meetings
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Record personal trips too - SARS requires total km for business % calculation
          </li>
        </ul>
      </div>
    </div>
  )
}
