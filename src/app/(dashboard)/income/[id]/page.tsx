import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import IncomeDetail from '@/components/income/IncomeDetail'
import { getActiveCompanyForUser } from '@/lib/company-context'

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
      source_document: {
        select: {
          id: true,
          original_filename: true,
          document_type: true,
          file_url: true,
        },
      },
    },
  })

  // Security check: income must belong to user's company
  if (!income || income.company_id !== companyId || income.is_deleted) {
    notFound()
  }

  // Convert Decimal fields to numbers for client component
  const serializedIncome = {
    ...income,
    amount: Number(income.amount),
  }

  const categories = await prisma.incomeCategory.findMany({
    where: {
      OR: [
        { is_system: true },
        { company_id: companyId },
      ],
      is_active: true,
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <IncomeDetail
        income={serializedIncome}
        categories={categories}
        companyId={companyId}
        userId={session.user.id}
        isVatRegistered={Boolean(company?.vat_number)}
      />
    </div>
  )
}
