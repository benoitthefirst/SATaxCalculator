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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Document Analyzer
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload an invoice, receipt, bank statement, or payslip to automatically extract data
        </p>
      </div>

      <DocumentAnalyzer />
    </div>
  )
}
