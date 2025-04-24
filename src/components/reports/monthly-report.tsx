'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, getMonthName } from '@/lib/utils'
import { ArrowDownCircle, ArrowUpCircle, Loader2, Minus, TrendingDown, TrendingUp, WalletIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

interface MonthData {
  month: number
  year: number
  income: number
  expense: number
  balance: number
  categories: {
    id: string
    name: string
    color: string
    amount: number
    percentage: number
  }[]
}

export default function MonthlyReport() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<MonthData | null>(null)

  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear())

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/reports/monthly?month=${selectedMonth}&year=${selectedYear}`)

        if (!response.ok) {
          throw new Error('Failed to fetch report data')
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch report data')
        }

        setData(result.data)
      } catch (err) {
        setError((err as Error).message)
        console.error('Error fetching report data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    const simulateData = () => {
      setIsLoading(true)

      const sampleData: MonthData = {
        month: selectedMonth,
        year: selectedYear,
        income: 15000000,
        expense: 12000000,
        balance: 3000000,
        categories: [
          {
            id: '1',
            name: 'Ăn uống',
            color: '#FF5252',
            amount: 4000000,
            percentage: 33.3,
          },
          {
            id: '2',
            name: 'Nhà cửa',
            color: '#4CAF50',
            amount: 3000000,
            percentage: 25,
          },
          {
            id: '3',
            name: 'Di chuyển',
            color: '#2196F3',
            amount: 2000000,
            percentage: 16.7,
          },
          {
            id: '4',
            name: 'Mua sắm',
            color: '#9C27B0',
            amount: 1500000,
            percentage: 12.5,
          },
          {
            id: '5',
            name: 'Giải trí',
            color: '#FF9800',
            amount: 1000000,
            percentage: 8.3,
          },
          {
            id: '6',
            name: 'Khác',
            color: '#607D8B',
            amount: 500000,
            percentage: 4.2,
          },
        ],
      }

      setTimeout(() => {
        setData(sampleData)
        setIsLoading(false)
      }, 1000)
    }

    simulateData()
  }, [selectedMonth, selectedYear])

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: getMonthName(i + 1),
  }))

  const currentYear = new Date().getFullYear()
  const yearOptions = [
    { value: currentYear - 2, label: (currentYear - 2).toString() },
    { value: currentYear - 1, label: (currentYear - 1).toString() },
    { value: currentYear, label: currentYear.toString() },
  ]

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

    if (percent < 0.05) return null

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

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
        <p>Không thể tải dữ liệu báo cáo. Vui lòng thử lại sau.</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Không có dữ liệu cho khoảng thời gian đã chọn.</p>
      </div>
    )
  }

  const chartData = data.categories.map((category) => ({
    name: category.name,
    value: category.amount,
    color: category.color,
  }))

  const trends = {
    income: 5,
    expense: -2,
    balance: 15,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="month">Tháng</Label>
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
              <SelectTrigger id="month">
                <SelectValue placeholder="Chọn tháng" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Năm</Label>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger id="year">
                <SelectValue placeholder="Chọn năm" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Thu nhập</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-500">{formatCurrency(data.income)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <ArrowUpCircle className="h-6 w-6 text-green-600 dark:text-green-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {trends.income > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-500 mr-1" />
              ) : trends.income < 0 ? (
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-500 mr-1" />
              ) : (
                <Minus className="h-4 w-4 text-gray-600 dark:text-gray-500 mr-1" />
              )}
              <span
                className={
                  trends.income > 0
                    ? 'text-green-600 dark:text-green-500'
                    : trends.income < 0
                      ? 'text-red-600 dark:text-red-500'
                      : 'text-gray-600 dark:text-gray-500'
                }
              >
                {trends.income > 0 ? '+' : ''}
                {trends.income}% so với tháng trước
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Chi tiêu</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-500">{formatCurrency(data.expense)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <ArrowDownCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {trends.expense > 0 ? (
                <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-500 mr-1" />
              ) : trends.expense < 0 ? (
                <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-500 mr-1" />
              ) : (
                <Minus className="h-4 w-4 text-gray-600 dark:text-gray-500 mr-1" />
              )}
              <span
                className={
                  trends.expense > 0
                    ? 'text-red-600 dark:text-red-500'
                    : trends.expense < 0
                      ? 'text-green-600 dark:text-green-500'
                      : 'text-gray-600 dark:text-gray-500'
                }
              >
                {trends.expense > 0 ? '+' : ''}
                {trends.expense}% so với tháng trước
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Số dư</p>
                <p
                  className={`text-2xl font-bold ${
                    data.balance >= 0 ? 'text-blue-600 dark:text-blue-500' : 'text-red-600 dark:text-red-500'
                  }`}
                >
                  {formatCurrency(data.balance)}
                </p>
              </div>
              <div
                className={`h-12 w-12 rounded-full ${
                  data.balance >= 0 ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-red-100 dark:bg-red-900/20'
                } flex items-center justify-center`}
              >
                <WalletIcon
                  className={`h-6 w-6 ${
                    data.balance >= 0 ? 'text-blue-600 dark:text-blue-500' : 'text-red-600 dark:text-red-500'
                  }`}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {trends.balance > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-500 mr-1" />
              ) : trends.balance < 0 ? (
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-500 mr-1" />
              ) : (
                <Minus className="h-4 w-4 text-gray-600 dark:text-gray-500 mr-1" />
              )}
              <span
                className={
                  trends.balance > 0
                    ? 'text-green-600 dark:text-green-500'
                    : trends.balance < 0
                      ? 'text-red-600 dark:text-red-500'
                      : 'text-gray-600 dark:text-gray-500'
                }
              >
                {trends.balance > 0 ? '+' : ''}
                {trends.balance}% so với tháng trước
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium mb-4">Phân bổ chi tiêu theo danh mục</h3>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
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
                  formatter={(value) => <span className="text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Chi tiết theo danh mục</h4>
            <div className="space-y-3">
              {data.categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="text-sm font-medium">
                    {formatCurrency(category.amount)} ({category.percentage.toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
