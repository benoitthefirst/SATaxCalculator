'use client'

export interface Activity {
  id: string
  type: 'income' | 'expense' | 'document' | 'asset' | 'trip'
  description: string
  timestamp: Date
  amount?: number
}

interface RecentActivityProps {
  activities: Activity[]
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const formatCurrency = (amount: number) =>
    `R ${Math.abs(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-ZA')
  }

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'income':
        return (
          <div className="w-8 h-8 rounded-full bg-[#22C55E]/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        )
      case 'expense':
        return (
          <div className="w-8 h-8 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
        )
      case 'document':
        return (
          <div className="w-8 h-8 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        )
      case 'asset':
        return (
          <div className="w-8 h-8 rounded-full bg-[#F97316]/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )
      case 'trip':
        return (
          <div className="w-8 h-8 rounded-full bg-[#9333EA]/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#9333EA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        )
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8EDF3] p-6">
      <h3 className="text-lg font-semibold text-[#111827] mb-6">Recent Activity</h3>

      {activities.length === 0 ? (
        <div className="py-8 text-center text-[#4B5563]">
          No recent activity
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex items-start gap-3">
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#111827] truncate">{activity.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#4B5563]">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                  {activity.amount !== undefined && (
                    <>
                      <span className="text-xs text-[#4B5563]">•</span>
                      <span
                        className={`text-xs font-medium ${
                          activity.type === 'income' ? 'text-[#22C55E]' : 'text-[#EF4444]'
                        }`}
                      >
                        {activity.type === 'income' ? '+' : '-'}
                        {formatCurrency(activity.amount)}
                      </span>
                    </>
                  )}
                </div>
              </div>
              {index < activities.length - 1 && (
                <div className="absolute left-4 top-10 bottom-0 w-px bg-[#E8EDF3]" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
