import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DocumentAnalyzer from '@/components/documents/DocumentAnalyzer'

export const metadata = {
  title: 'Analyze Document - ProcessX',
  description: 'Upload and analyze financial documents with AI',
}

export default async function DocumentAnalyzePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          Document Analyzer
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload an invoice, receipt, bank statement, or payslip to automatically extract data
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        <DocumentAnalyzer />
      </div>

      <div className="bg-gray-50 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-900">Supported Documents</h3>
        <ul className="mt-2 text-sm text-gray-600 space-y-1">
          <li>Invoices and receipts</li>
          <li>Bank statements</li>
          <li>Payslips and salary advice</li>
          <li>Expense reports</li>
        </ul>
        <p className="mt-3 text-xs text-gray-500">
          Upload PDF, JPG, or PNG files. Maximum file size: 10MB
        </p>
      </div>
    </div>
  )
}
