import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import AssetForm from '@/components/forms/AssetForm'
import type { Asset, VehicleLogEntry } from '@prisma/client'

type AssetWithLogs = Asset & {
  vehicle_log_entries: VehicleLogEntry[]
}

export const metadata = {
  title: 'Asset Details - ProcessX',
  description: 'View and edit asset details',
}

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const membership = await prisma.companyMember.findFirst({
    where: {
      user_id: session.user.id,
      is_active: true,
    },
    include: {
      company: true,
    },
  })

  if (!membership) {
    redirect('/onboarding/company')
  }

  const { id } = await params

  const assetData = await prisma.asset.findUnique({
    where: { id },
    include: {
      vehicle_log_entries: {
        orderBy: { trip_date: 'desc' },
        take: 5,
      },
    },
  })

  if (!assetData || assetData.company_id !== membership.company.id || assetData.is_deleted) {
    notFound()
  }

  const asset = assetData as AssetWithLogs

  // Calculate depreciation
  const purchaseCost = Number(asset.purchase_cost)
  const residualValue = Number(asset.residual_value || 0)
  const usefulLife = asset.useful_life_years
  const businessUsePercent = asset.business_use_percent || 100

  const annualDepreciation = ((purchaseCost - residualValue) / usefulLife) * (businessUsePercent / 100)

  const purchaseDate = new Date(asset.purchase_date)
  const now = new Date()
  const yearsElapsed = Math.min(
    (now.getTime() - purchaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
    usefulLife
  )

  const accumulatedDepreciation = annualDepreciation * yearsElapsed
  const bookValue = Math.max(purchaseCost - accumulatedDepreciation, residualValue)
  const yearsRemaining = Math.max(0, usefulLife - Math.floor(yearsElapsed))

  const assetTypeLabels: Record<string, string> = {
    vehicle: 'Motor Vehicle',
    computer: 'Computer/Laptop',
    phone: 'Cell Phone',
    camera: 'Camera/Photography',
    furniture: 'Office Furniture',
    equipment: 'Equipment/Machinery',
    other: 'Other',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/assets"
            className="text-[#FF9500] hover:text-[#FF6B00] text-sm font-medium mb-2 inline-block"
          >
            ← Back to Assets
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">{asset.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {assetTypeLabels[asset.asset_type]} | Purchased {new Date(asset.purchase_date).toLocaleDateString('en-ZA')}
          </p>
        </div>
        {asset.asset_type === 'vehicle' && (
          <Link
            href={`/vehicle-logbook?asset=${asset.id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#FF9500] bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View Logbook
          </Link>
        )}
      </div>

      {/* Depreciation Card */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-100 p-6">
        <h3 className="text-lg font-semibold text-orange-900 mb-4">Depreciation Schedule</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-orange-600">Purchase Cost</p>
            <p className="text-xl font-semibold text-orange-900">
              R {purchaseCost.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-orange-600">Current Book Value</p>
            <p className="text-xl font-semibold text-orange-900">
              R {bookValue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-orange-600">Annual Depreciation</p>
            <p className="text-xl font-semibold text-green-700">
              R {annualDepreciation.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-orange-500">Tax deduction</p>
          </div>
          <div>
            <p className="text-sm text-orange-600">Remaining Life</p>
            <p className="text-xl font-semibold text-orange-900">
              {yearsRemaining} years
            </p>
            <p className="text-xs text-orange-500">of {usefulLife} total</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-orange-600 mb-1">
            <span>Accumulated: R {accumulatedDepreciation.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
            <span>{((yearsElapsed / usefulLife) * 100).toFixed(0)}% depreciated</span>
          </div>
          <div className="h-2 bg-orange-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all"
              style={{ width: `${Math.min((yearsElapsed / usefulLife) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Asset Details */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Details</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Asset Type</p>
            <p className="text-base font-medium text-gray-900">{assetTypeLabels[asset.asset_type]}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Business Use</p>
            <p className="text-base font-medium text-gray-900">{businessUsePercent}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Useful Life</p>
            <p className="text-base font-medium text-gray-900">{usefulLife} years</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Depreciation Rate</p>
            <p className="text-base font-medium text-gray-900">{Number(asset.depreciation_rate).toFixed(2)}% per year</p>
          </div>
          {asset.serial_number && (
            <div>
              <p className="text-sm text-gray-500">Serial Number</p>
              <p className="text-base font-medium text-gray-900">{asset.serial_number}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Residual Value</p>
            <p className="text-base font-medium text-gray-900">
              R {residualValue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {asset.description && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-base text-gray-900 mt-1">{asset.description}</p>
          </div>
        )}

        {asset.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Notes</p>
            <p className="text-base text-gray-700 mt-1">{asset.notes}</p>
          </div>
        )}
      </div>

      {/* Vehicle Logbook Entries (if vehicle) */}
      {asset.asset_type === 'vehicle' && asset.vehicle_log_entries.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Trips</h3>
            <Link
              href={`/vehicle-logbook?asset=${asset.id}`}
              className="text-sm text-[#FF9500] hover:text-[#FF6B00] font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {asset.vehicle_log_entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {entry.start_location} → {entry.end_location}
                  </p>
                  <p className="text-xs text-gray-500">{entry.purpose}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{entry.distance_km} km</p>
                  <p className="text-xs text-gray-500">
                    {new Date(entry.trip_date).toLocaleDateString('en-ZA')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Edit Asset</h3>
        <AssetForm
          companyId={membership.company.id}
          assetId={asset.id}
          initialData={{
            name: asset.name,
            description: asset.description || '',
            asset_type: asset.asset_type,
            purchase_date: new Date(asset.purchase_date).toISOString().split('T')[0],
            purchase_cost: Number(asset.purchase_cost),
            useful_life_years: asset.useful_life_years,
            residual_value: Number(asset.residual_value || 0),
            business_use_percent: asset.business_use_percent || 100,
            serial_number: asset.serial_number || '',
            notes: asset.notes || '',
          }}
        />
      </div>
    </div>
  )
}
