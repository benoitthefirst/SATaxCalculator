'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface CashFlowData {
  month: string
  income: number
  expenses: number
}

interface CashFlowChartProps {
  data: CashFlowData[]
}

export default function CashFlowChart({ data }: CashFlowChartProps) {
  const formatCurrency = (value: number) =>
    `R ${value.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`

  return (
    <div className="bg-white rounded-2xl border border-[#E8EDF3] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#111827]">Cash Flow Overview</h3>
        <select className="text-sm border border-[#E8EDF3] rounded-lg px-3 py-1.5 text-[#4B5563] bg-white focus:outline-none focus:ring-2 focus:ring-[#DFFB2D] focus:border-transparent">
          <option>This Year</option>
          <option>Last 6 Months</option>
          <option>Last 3 Months</option>
        </select>
      </div>

      <div className="h-64">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#4B5563]">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EDF3" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#4B5563', fontSize: 12 }}
                axisLine={{ stroke: '#E8EDF3' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#4B5563', fontSize: 12 }}
                axisLine={{ stroke: '#E8EDF3' }}
                tickLine={false}
                tickFormatter={(value) => `R${value / 1000}k`}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), '']}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E8EDF3',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{ color: '#111827', fontWeight: 600 }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-sm text-[#4B5563]">{value}</span>}
              />
              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ fill: '#22C55E', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#22C55E' }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: '#EF4444', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#EF4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
