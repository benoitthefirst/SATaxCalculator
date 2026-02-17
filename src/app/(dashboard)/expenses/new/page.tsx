import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import ExpenseForm from '@/components/forms/ExpenseForm'

export const metadata = {
  title: 'Add Expense - ProcessX',
  description: 'Add a new business expense',
}

export default async function NewExpensePage() {
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
          companyId={membership.company.id}
          userId={session.user.id}
          categories={categories}
        />
      </div>
    </div>
  )
}
