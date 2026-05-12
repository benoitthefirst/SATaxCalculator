'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { use } from 'react'

interface InviteData {
  id: string
  email: string
  role: string
  expiresAt: string
  company: {
    id: string
    name: string
  }
  invitedBy: string
}

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  accountant: 'Accountant',
  viewer: 'Viewer',
}

export default function InviteAcceptPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = use(params)
  const router = useRouter()
  const { data: session, status } = useSession()
  const [invite, setInvite] = useState<InviteData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAccepting, setIsAccepting] = useState(false)

  useEffect(() => {
    async function fetchInvite() {
      try {
        const response = await fetch(`/api/team/invite/${token}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Invalid invitation')
          return
        }

        setInvite(data.invite)
      } catch {
        setError('Failed to load invitation')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvite()
  }, [token])

  const handleAccept = async () => {
    setIsAccepting(true)
    try {
      const response = await fetch(`/api/team/invite/${token}`, {
        method: 'POST',
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to accept invitation')
        setIsAccepting(false)
        return
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch {
      setError('Failed to accept invitation')
      setIsAccepting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Invalid Invitation
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-gradient-to-br from-[#FF9500] to-[#FF6B00] text-white rounded-xl font-medium hover:shadow-lg"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  if (!invite) return null

  // User not logged in
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              You&apos;re Invited!
            </h1>
            <p className="text-gray-600">
              <strong>{invite.invitedBy}</strong> has invited you to join
            </p>
            <p className="text-xl font-semibold text-gray-900 mt-1">
              {invite.company.name}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Your role:</span>
              <span className="font-medium text-gray-900">{roleLabels[invite.role]}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{invite.email}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center mb-6">
            Sign in or create an account with <strong>{invite.email}</strong> to accept this invitation.
          </p>

          <div className="space-y-3">
            <Link
              href={`/login?callbackUrl=/invite/${token}`}
              className="block w-full text-center px-6 py-3 bg-gradient-to-br from-[#FF9500] to-[#FF6B00] text-white rounded-xl font-medium hover:shadow-lg"
            >
              Sign In
            </Link>
            <Link
              href={`/register?email=${encodeURIComponent(invite.email)}&callbackUrl=/invite/${token}`}
              className="block w-full text-center px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // User logged in but email doesn't match
  const userEmail = session?.user?.email
  if (userEmail && userEmail.toLowerCase() !== invite.email.toLowerCase()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Wrong Account
          </h1>
          <p className="text-gray-600 mb-4">
            This invitation was sent to <strong>{invite.email}</strong>, but you&apos;re signed in as <strong>{userEmail}</strong>.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please sign out and sign in with the correct account to accept this invitation.
          </p>
          <Link
            href="/api/auth/signout"
            className="inline-block px-6 py-3 bg-gradient-to-br from-[#FF9500] to-[#FF6B00] text-white rounded-xl font-medium hover:shadow-lg"
          >
            Sign Out
          </Link>
        </div>
      </div>
    )
  }

  // User logged in and email matches - show accept button
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Accept Invitation
          </h1>
          <p className="text-gray-600">
            Join <strong>{invite.company.name}</strong> as {roleLabels[invite.role]}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Company:</span>
            <span className="font-medium text-gray-900">{invite.company.name}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Your role:</span>
            <span className="font-medium text-gray-900">{roleLabels[invite.role]}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Invited by:</span>
            <span className="font-medium text-gray-900">{invite.invitedBy}</span>
          </div>
        </div>

        <button
          onClick={handleAccept}
          disabled={isAccepting}
          className="w-full px-6 py-3 bg-gradient-to-br from-[#FF9500] to-[#FF6B00] text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50"
        >
          {isAccepting ? 'Joining...' : 'Join Team'}
        </button>

        <p className="text-sm text-gray-500 text-center mt-4">
          By accepting, you&apos;ll be able to access {invite.company.name}&apos;s financial data based on your role.
        </p>
      </div>
    </div>
  )
}
