import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import ExpenseDetail from '@/components/expenses/ExpenseDetail'

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

  if (!expense || expense.company_id !== membership.company.id || expense.is_deleted) {
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
        companyId={membership.company.id}
        userId={session.user.id}
      />
    </div>
  )
}
