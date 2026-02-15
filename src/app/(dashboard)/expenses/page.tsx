export const metadata = {
  title: 'Expenses - ProcessX',
  description: 'Manage your business expenses',
}

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track and manage your business expenses
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-12 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            Expense management features are being built. You'll soon be able to add, categorize, and track all your business expenses here.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
            <span className="text-sm font-medium">Phase 2 Feature</span>
          </div>
        </div>
      </div>
    </div>
  )
}
