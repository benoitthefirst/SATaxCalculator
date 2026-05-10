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

  // Check if user is an admin
  const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN'

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

  // If no company, redirect appropriately
  if (!membership) {
    if (isAdmin) {
      // Admins without a company go to admin dashboard
      redirect('/admin')
    }
    // Regular users go to onboarding
    redirect('/onboarding/company')
  }

  return (
    <div className="min-h-screen bg-white">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  )
}
