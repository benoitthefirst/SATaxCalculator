import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import VehicleLogDetail from '@/components/vehicle/VehicleLogDetail'

export const metadata = {
  title: 'Trip Details - ProcessX',
  description: 'View and edit trip details',
}

export default async function VehicleLogDetailPage({
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

  const entry = await prisma.vehicleLogEntry.findFirst({
    where: {
      id,
      company_id: membership.company.id,
    },
    include: {
      asset: {
        select: {
          id: true,
          name: true,
          serial_number: true,
        },
      },
    },
  })

  if (!entry) {
    notFound()
  }

  // Get all vehicles for edit form
  const vehicles = await prisma.asset.findMany({
    where: {
      company_id: membership.company.id,
      asset_type: 'vehicle',
      is_deleted: false,
    },
    select: {
      id: true,
      name: true,
      serial_number: true,
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <VehicleLogDetail
        entry={entry}
        vehicles={vehicles}
        companyId={membership.company.id}
      />
    </div>
  )
}
