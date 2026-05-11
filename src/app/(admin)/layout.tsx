import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminNav from '@/components/layout/AdminNav'
import { QueryProvider } from '@/components/providers/QueryProvider'

export const metadata = {
  title: {
    default: 'Admin - ProcessX',
    template: '%s | Admin - ProcessX',
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Additional server-side check (middleware should handle this, but double-check)
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    redirect('/dashboard?error=access_denied')
  }

  return (
    <QueryProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <main className="pl-64">
          <div className="min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </QueryProvider>
  )
}
