import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { getActiveCompanyForUser } from '@/lib/company-context'
import Link from 'next/link'
import { ExportButton } from '@/components/common/ExportButton'

export const metadata = {
  title: 'Assets - ProcessX',
  description: 'Manage your business assets and depreciation',
}

export default async function AssetsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const companyId = await getActiveCompanyForUser(session.user.id)

  if (!companyId) {
    redirect('/onboarding/company')
  }

  const assets = await prisma.asset.findMany({
    where: {
      company_id: companyId,
      is_deleted: false,
    },
    orderBy: { purchase_date: 'desc' },
  })

  // Calculate depreciation for each asset
  const assetsWithDepreciation = assets.map((asset) => {
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

    return {
      ...asset,
      annualDepreciation,
      bookValue,
    }
  })

  const totalCost = assetsWithDepreciation.reduce((sum, a) => sum + Number(a.purchase_cost), 0)
  const totalBookValue = assetsWithDepreciation.reduce((sum, a) => sum + a.bookValue, 0)
  const totalAnnualDepreciation = assetsWithDepreciation.reduce((sum, a) => sum + a.annualDepreciation, 0)

  const assetTypeLabels: Record<string, string> = {
    vehicle: 'Vehicle',
    computer: 'Computer',
    phone: 'Phone',
    camera: 'Camera',
    furniture: 'Furniture',
    equipment: 'Equipment',
    other: 'Other',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Assets</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track capital assets and depreciation for SARS
          </p>
        </div>
        <div className="flex gap-3">
          <ExportButton
            href="/api/assets/export"
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 active:scale-[0.98]"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </ExportButton>
          <Link
            href="/assets/new"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-br from-[#FF9500] to-[#FF6B00] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200 active:scale-[0.98]"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Asset
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Total Assets</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {assets.length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Capital items</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500">Total Book Value</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            R {totalBookValue.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Original: R {totalCost.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-orange-50 rounded-2xl border border-orange-100 p-6">
          <p className="text-sm font-medium text-orange-600">Annual Depreciation</p>
          <p className="text-2xl font-semibold text-orange-700 mt-1">
            R {totalAnnualDepreciation.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-orange-500 mt-1">Tax deduction (wear & tear)</p>
        </div>
      </div>

      {/* Assets List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {assets.length === 0 ? (
          <div className="px-8 py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-50 mb-4">
              <svg
                className="w-8 h-8 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <p className="text-gray-500 mb-4">No assets recorded yet</p>
            <Link
              href="/assets/new"
              className="inline-block text-[#FF9500] hover:text-[#FF6B00] font-medium transition-colors"
            >
              Add your first asset →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">
                    Book Value
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">
                    Annual Depr.
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assetsWithDepreciation.map((asset, index) => (
                  <tr
                    key={asset.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                        <p className="text-xs text-gray-500">
                          Purchased: {new Date(asset.purchase_date).toLocaleDateString('en-ZA')}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                        {assetTypeLabels[asset.asset_type] || asset.asset_type}
                      </span>
                      {asset.business_use_percent !== null && asset.business_use_percent < 100 && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-50 text-yellow-700">
                          {asset.business_use_percent}% business
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-900">
                      R {Number(asset.purchase_cost).toLocaleString('en-ZA', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      R {asset.bookValue.toLocaleString('en-ZA', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-orange-600">
                      R {asset.annualDepreciation.toLocaleString('en-ZA', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <Link
                        href={`/assets/${asset.id}`}
                        className="text-[#FF9500] hover:text-[#FF6B00] font-medium transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t border-gray-200">
                  <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-700">
                    Total ({assets.length} assets)
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    R {totalCost.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    R {totalBookValue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-orange-600">
                    R {totalAnnualDepreciation.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* SARS Info */}
      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">SARS Depreciation (Section 11(e))</h3>
        <p className="text-sm text-blue-700">
          Business assets can be depreciated over their useful life. SARS-approved rates: Computers (3 years), Vehicles (5 years), Furniture (6 years).
          The annual depreciation amount reduces your taxable income.
        </p>
      </div>
    </div>
  )
}
