import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/layout/DashboardNav'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { getUserCompanies, getActiveCompany } from '@/lib/company-context'
import { canCreateCompany } from '@/lib/subscription/feature-gate'

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

  // Get all user's companies and the active one
  const [companies, activeCompany, canCreate] = await Promise.all([
    getUserCompanies(session.user.id),
    getActiveCompany(session.user.id),
    canCreateCompany(session.user.id),
  ])

  // If no company, redirect appropriately
  if (!activeCompany) {
    if (isAdmin) {
      // Admins without a company go to admin dashboard
      redirect('/admin')
    }
    // Regular users go to onboarding
    redirect('/onboarding/company')
  }

  return (
    <QueryProvider>
      <div className="min-h-screen bg-white">
        <DashboardNav
          user={{
            name: session.user.name || '',
            email: session.user.email || '',
          }}
          companies={companies.map((c) => ({
            id: c.companyId,
            name: c.companyName,
            role: c.role,
          }))}
          currentCompanyId={activeCompany.companyId}
          canCreateCompany={canCreate.allowed}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
          {children}
        </main>
      </div>
    </QueryProvider>
  )
}
