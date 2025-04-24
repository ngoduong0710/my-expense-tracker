'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, getMonthName } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface MonthlyTotal {
  month: number
  year: number
  income: number
  expense: number
  balance: number
}

export default function TrendChart() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<MonthlyTotal[]>([])
  const [chartType, setChartType] = useState<'all' | 'income' | 'expense' | 'balance'>('all')

  useEffect(() => {
    const simulateData = () => {
      setIsLoading(true)

      const currentDate = new Date()
      const currentMonth = currentDate.getMonth() + 1
      const currentYear = currentDate.getFullYear()

      const sampleData: MonthlyTotal[] = []

      for (let i = 0; i < 6; i++) {
        let month = currentMonth - i
        let year = currentYear

        if (month <= 0) {
          month += 12
          year -= 1
        }

        const income = 10000000 + Math.floor(Math.random() * 5000000)
        const expense = 8000000 + Math.floor(Math.random() * 3000000)

        sampleData.push({
          month,
          year,
          income,
          expense,
          balance: income - expense,
        })
      }

      setTimeout(() => {
        setData(sampleData.reverse())
        setIsLoading(false)
      }, 1000)
    }

    simulateData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-lg">
        <p>Không thể tải dữ liệu xu hướng. Vui lòng thử lại sau.</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không có đủ dữ liệu để hiển thị xu hướng.</p>
      </div>
    )
  }

  const chartData = data.map((item) => ({
    name: `${getMonthName(item.month).substring(0, 3)} ${item.year}`,
    income: item.income,
    expense: item.expense,
    balance: item.balance,
  }))

  const formatTooltip = (value: number, name: string) => {
    let displayName = name
    switch (name) {
      case 'income':
        displayName = 'Thu nhập'
        break
      case 'expense':
        displayName = 'Chi tiêu'
        break
      case 'balance':
        displayName = 'Số dư'
        break
    }

    return [formatCurrency(value), displayName]
  }

  return (
    <div className="space-y-6">
      <Tabs value={chartType} onValueChange={(value) => setChartType(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="income">Thu nhập</TabsTrigger>
          <TabsTrigger value="expense">Chi tiêu</TabsTrigger>
          <TabsTrigger value="balance">Số dư</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              width={80}
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(0)}M`
                }
                if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}K`
                }
                return value.toString()
              }}
            />
            <Tooltip formatter={formatTooltip} />
            <Legend />

            {(chartType === 'all' || chartType === 'income') && (
              <Line
                type="monotone"
                dataKey="income"
                name="Thu nhập"
                stroke="#4CAF50"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            )}

            {(chartType === 'all' || chartType === 'expense') && (
              <Line type="monotone" dataKey="expense" name="Chi tiêu" stroke="#FF5252" strokeWidth={2} />
            )}

            {(chartType === 'all' || chartType === 'balance') && (
              <Line type="monotone" dataKey="balance" name="Số dư" stroke="#2196F3" strokeWidth={2} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Dữ liệu chi tiết theo tháng</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tháng
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Thu nhập
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Chi tiêu
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Số dư
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    {getMonthName(item.month)} {item.year}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-green-600 dark:text-green-500">
                    {formatCurrency(item.income)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-red-600 dark:text-red-500">
                    {formatCurrency(item.expense)}
                  </td>
                  <td
                    className={`px-4 py-3 whitespace-nowrap text-right text-sm font-medium ${
                      item.balance >= 0 ? 'text-blue-600 dark:text-blue-500' : 'text-red-600 dark:text-red-500'
                    }`}
                  >
                    {formatCurrency(item.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
