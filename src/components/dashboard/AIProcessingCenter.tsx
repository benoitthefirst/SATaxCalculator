'use client'

interface AIProcessingCenterProps {
  documentsProcessing?: number
  documentsCompleted?: number
  averageConfidence?: number
}

export default function AIProcessingCenter({
  documentsProcessing = 0,
  documentsCompleted = 0,
  averageConfidence = 0,
}: AIProcessingCenterProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8EDF3] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#111827]">AI Processing Center</h3>
        <div className="w-10 h-10 bg-[#DFFB2D]/20 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-[#062C2E]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#F97316]">{documentsProcessing}</div>
          <div className="text-xs text-[#4B5563] mt-1">Processing</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#22C55E]">{documentsCompleted}</div>
          <div className="text-xs text-[#4B5563] mt-1">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#2563EB]">
            {averageConfidence > 0 ? `${averageConfidence.toFixed(1)}%` : '-'}
          </div>
          <div className="text-xs text-[#4B5563] mt-1">Avg. Confidence</div>
        </div>
      </div>
    </div>
  )
}
