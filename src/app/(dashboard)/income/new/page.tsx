import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import IncomeForm from '@/components/forms/IncomeForm'

export const metadata = {
  title: 'Add Income - ProcessX',
  description: 'Add a new income record',
}

export default async function NewIncomePage() {
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

  // Get income categories (system + company-specific)
  let categories = await prisma.incomeCategory.findMany({
    where: {
      OR: [
        { is_system: true },
        { company_id: membership.company.id },
      ],
      is_active: true,
    },
    orderBy: { name: 'asc' },
  })

  // If no categories exist, create default ones
  if (categories.length === 0) {
    const defaultCategories = [
      { name: 'Sales Revenue', is_system: true },
      { name: 'Service Income', is_system: true },
      { name: 'Consulting Fees', is_system: true },
      { name: 'Interest Income', is_system: true },
      { name: 'Rental Income', is_system: true },
      { name: 'Dividend Income', is_system: true },
      { name: 'Commission Income', is_system: true },
      { name: 'Other Income', is_system: true },
    ]

    await prisma.incomeCategory.createMany({
      data: defaultCategories,
      skipDuplicates: true,
    })

    categories = await prisma.incomeCategory.findMany({
      where: { is_system: true, is_active: true },
      orderBy: { name: 'asc' },
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Add Income</h1>
        <p className="mt-1 text-sm text-gray-500">
          Record a new income transaction
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <IncomeForm
          companyId={membership.company.id}
          userId={session.user.id}
          categories={categories}
          isVatRegistered={Boolean(membership.company.vat_number)}
        />
      </div>
    </div>
  )
}
