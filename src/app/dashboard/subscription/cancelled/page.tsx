import Link from 'next/link'

export const metadata = {
  title: 'Payment Cancelled - ProcessX',
}

export default function SubscriptionCancelledPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges have been made to your account.
          You can try again whenever you&apos;re ready.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard/settings/subscription"
            className="block w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>

          <Link
            href="/dashboard"
            className="block w-full py-3 px-4 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Having trouble? <Link href="/contact" className="text-blue-600 hover:underline">Contact support</Link>
        </p>
      </div>
    </div>
  )
}
