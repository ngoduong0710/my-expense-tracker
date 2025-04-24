'use client'

import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

interface CategoryExpense {
  categoryId: string
  name: string
  color: string
  amount: number
  percentage: number
}

interface DashboardData {
  expenseByCategory: CategoryExpense[]
}

interface CustomizedLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index: number
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomizedLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.05) return null

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function ExpenseChart() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard')

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch dashboard data')
        }

        setData(result.data)
      } catch (err) {
        setError((err as Error).message)
        console.error('Error fetching dashboard data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return null
  }

  if (error || !data) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-lg">
        <p>Không thể tải dữ liệu biểu đồ. Vui lòng thử lại sau.</p>
      </div>
    )
  }

  const { expenseByCategory } = data

  if (!expenseByCategory || expenseByCategory.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-center p-4">
        <p className="text-muted-foreground">Không có dữ liệu chi tiêu trong tháng này.</p>
      </div>
    )
  }

  const chartData = expenseByCategory.map((item) => ({
    name: item.name,
    value: item.amount,
    color: item.color,
    percentage: item.percentage,
  }))

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [formatCurrency(value), 'Chi tiêu']} />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            formatter={(value, entry, index) => (
              <span className="text-sm">
                {value} ({chartData[index].percentage.toFixed(0)}%)
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
