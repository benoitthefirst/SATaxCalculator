import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Announcements',
}

export default function AnnouncementsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Announcements</h1>
        <p className="text-gray-500 mt-1">Manage platform announcements</p>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Announcements will allow you to broadcast messages to all users,
          display maintenance notices, and share important updates.
        </p>
      </div>
    </div>
  )
}
