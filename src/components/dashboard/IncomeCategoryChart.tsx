'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface CategoryData {
  name: string
  value: number
  color: string
}

interface IncomeCategoryChartProps {
  data: CategoryData[]
  totalIncome: number
}

const COLORS = ['#22C55E', '#10B981', '#059669', '#047857', '#065F46']

export default function IncomeCategoryChart({ data, totalIncome }: IncomeCategoryChartProps) {
  const formatCurrency = (value: number) =>
    `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const chartData = data.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
  }))

  return (
    <div className="bg-white rounded-2xl border border-[#E8EDF3] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#111827]">Income by Category</h3>
      </div>

      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-[#4B5563]">
          No income recorded yet
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), '']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E8EDF3',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-3 w-full">
            {chartData.slice(0, 5).map((item, index) => {
              const percentage = totalIncome > 0 ? ((item.value / totalIncome) * 100).toFixed(1) : '0'
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-[#4B5563] truncate max-w-[120px]">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-[#111827]">{percentage}%</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
