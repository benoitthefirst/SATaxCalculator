import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import ExpenseForm from '@/components/forms/ExpenseForm'
import { getActiveCompanyForUser } from '@/lib/company-context'

export const metadata = {
  title: 'Add Expense - ProcessX',
  description: 'Add a new business expense',
}

export default async function NewExpensePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const companyId = await getActiveCompanyForUser(session.user.id)

  if (!companyId) {
    redirect('/onboarding/company')
  }

  // Get company details for VAT registration status
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { vat_number: true },
  })

  const categories = await prisma.expenseCategory.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Add Expense</h1>
        <p className="mt-1 text-sm text-gray-500">
          Record a new business expense
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <ExpenseForm
          companyId={companyId}
          userId={session.user.id}
          categories={categories}
          isVatRegistered={Boolean(company?.vat_number)}
        />
      </div>
    </div>
  )
}
