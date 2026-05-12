import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import ExpenseDetail from '@/components/expenses/ExpenseDetail'
import { getActiveCompanyForUser } from '@/lib/company-context'

export const metadata = {
  title: 'Expense Details - ProcessX',
  description: 'View and edit expense details',
}

export default async function ExpenseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
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

  const { id } = await params

  const expense = await prisma.expense.findUnique({
    where: { id },
    include: {
      category: true,
      user: {
        select: {
          first_name: true,
          last_name: true,
          email: true,
        },
      },
    },
  })

  if (!expense || expense.company_id !== companyId || expense.is_deleted) {
    notFound()
  }

  const categories = await prisma.expenseCategory.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <ExpenseDetail
        expense={expense}
        categories={categories}
        companyId={companyId}
        userId={session.user.id}
        isVatRegistered={Boolean(company?.vat_number)}
      />
    </div>
  )
}
