import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import DashboardNav from '@/components/layout/DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Get user's company membership
  const membership = await prisma.companyMember.findFirst({
    where: {
      user_id: session.user.id,
      is_active: true,
    },
    include: {
      company: true,
    },
  })

  // If no company, redirect to onboarding
  if (!membership) {
    redirect('/onboarding/company')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav
        user={{
          name: session.user.name || '',
          email: session.user.email || '',
        }}
        company={{
          name: membership.company.name,
          role: membership.role,
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
