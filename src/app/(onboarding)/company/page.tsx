import CompanyOnboardingForm from '@/components/forms/CompanyOnboardingForm'
import { auth } from '@/lib/auth'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

export const metadata = {
  title: 'Company Setup - ProcessX',
  description: 'Set up your company profile',
}

export default async function CompanyOnboardingPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Check if user already has a company
  const existingMembership = await prisma.companyMember.findFirst({
    where: {
      user_id: session.user.id,
      is_active: true,
    },
    include: {
      company: true,
    },
  })

  if (existingMembership) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Set up your company
            </h1>
            <p className="text-gray-600">
              Let's get your company profile configured. You can update these details later in settings.
            </p>
          </div>
          <CompanyOnboardingForm userId={session.user.id} />
        </div>
      </div>
    </div>
  )
}
