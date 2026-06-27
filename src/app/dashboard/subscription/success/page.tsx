import Link from 'next/link'

export const metadata = {
  title: 'Subscription Activated - ProcessX',
}

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Subscription Activated!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for upgrading your ProcessX subscription. Your new features are
          now available.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/dashboard/settings/subscription"
            className="block w-full py-3 px-4 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            View Subscription Details
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  )
}
