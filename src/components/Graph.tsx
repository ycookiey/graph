'use client'

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import type { Theme } from './RandomTheme'

interface DataPoint {
  date: string
  value: number
}

interface GraphProps {
  data: DataPoint[]
  theme: Theme
}

export default function Graph({ data, theme }: GraphProps) {
  // Format date for display (just day number)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.getDate().toString()
  }

  return (
    <div className="graph-container">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            stroke={theme.textSecondary}
            tick={{ fill: theme.textSecondary, fontSize: 12 }}
            axisLine={{ stroke: theme.grid }}
            tickLine={{ stroke: theme.grid }}
          />
          <YAxis 
            domain={[0, 100]}
            stroke={theme.textSecondary}
            tick={{ fill: theme.textSecondary, fontSize: 12 }}
            axisLine={{ stroke: theme.grid }}
            tickLine={{ stroke: theme.grid }}
            width={30}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: theme.bgFrom,
              border: `1px solid ${theme.grid}`,
              borderRadius: '8px',
              color: theme.textPrimary,
            }}
            labelFormatter={(label) => {
              const date = new Date(label)
              return `${date.getMonth() + 1}/${date.getDate()}`
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={theme.accent}
            strokeWidth={2}
            dot={{ fill: theme.accent, strokeWidth: 0, r: 3 }}
            activeDot={{ fill: theme.accentLight, strokeWidth: 0, r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export type { DataPoint }
