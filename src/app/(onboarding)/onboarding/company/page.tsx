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
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#007AFF] to-[#0051D5] mb-6 shadow-lg shadow-blue-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-3">
            Set up your company
          </h1>
          <p className="text-lg text-gray-500">
            Let's get your company profile configured. You can update these details later in settings.
          </p>
        </div>
        <CompanyOnboardingForm userId={session.user.id} />
      </div>
    </div>
  )
}
