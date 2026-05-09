import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import IncomeDetail from '@/components/income/IncomeDetail'

export const metadata = {
  title: 'Income Details - ProcessX',
  description: 'View and edit income details',
}

export default async function IncomeDetailPage({
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

  const income = await prisma.income.findUnique({
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

  // Security check: income must belong to user's company
  if (!income || income.company_id !== membership.company.id || income.is_deleted) {
    notFound()
  }

  const categories = await prisma.incomeCategory.findMany({
    where: {
      OR: [
        { is_system: true },
        { company_id: membership.company.id },
      ],
      is_active: true,
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <IncomeDetail
        income={income}
        categories={categories}
        companyId={membership.company.id}
        userId={session.user.id}
        isVatRegistered={Boolean(membership.company.vat_number)}
      />
    </div>
  )
}
