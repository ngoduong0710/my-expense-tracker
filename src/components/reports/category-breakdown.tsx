'use client'

import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, getMonthName } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface CategoryData {
  id: string
  name: string
  color: string
  amount: number
  percentage: number
  transactions: number
}

interface CategoryBreakdownData {
  month: number
  year: number
  categories: {
    expense: CategoryData[]
    income: CategoryData[]
  }
}

export default function CategoryBreakdown() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<CategoryBreakdownData | null>(null)
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense')

  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear())

  useEffect(() => {
    const simulateData = () => {
      setIsLoading(true)

      const sampleData: CategoryBreakdownData = {
        month: selectedMonth,
        year: selectedYear,
        categories: {
          expense: [
            {
              id: '1',
              name: 'Ăn uống',
              color: '#FF5252',
              amount: 4000000,
              percentage: 33.3,
              transactions: 25,
            },
            {
              id: '2',
              name: 'Nhà cửa',
              color: '#4CAF50',
              amount: 3000000,
              percentage: 25,
              transactions: 5,
            },
            {
              id: '3',
              name: 'Di chuyển',
              color: '#2196F3',
              amount: 2000000,
              percentage: 16.7,
              transactions: 15,
            },
            {
              id: '4',
              name: 'Mua sắm',
              color: '#9C27B0',
              amount: 1500000,
              percentage: 12.5,
              transactions: 8,
            },
            {
              id: '5',
              name: 'Giải trí',
              color: '#FF9800',
              amount: 1000000,
              percentage: 8.3,
              transactions: 6,
            },
            {
              id: '6',
              name: 'Khác',
              color: '#607D8B',
              amount: 500000,
              percentage: 4.2,
              transactions: 3,
            },
          ],
          income: [
            {
              id: '7',
              name: 'Lương',
              color: '#4CAF50',
              amount: 12000000,
              percentage: 80,
              transactions: 1,
            },
            {
              id: '8',
              name: 'Thưởng',
              color: '#FFC107',
              amount: 2000000,
              percentage: 13.3,
              transactions: 1,
            },
            {
              id: '9',
              name: 'Thu nhập khác',
              color: '#9C27B0',
              amount: 1000000,
              percentage: 6.7,
              transactions: 2,
            },
          ],
        },
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

  const chartData = data.categories[activeTab].map((category) => ({
    name: category.name,
    amount: category.amount,
    color: category.color,
  }))

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

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'expense' | 'income')}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense">Chi tiêu</TabsTrigger>
            <TabsTrigger value="income">Thu nhập</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 20,
              right: 30,
              left: 90,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
            <YAxis type="category" dataKey="name" width={80} />
            <Tooltip formatter={(value) => [formatCurrency(value as number), 'Số tiền']} />
            <Bar dataKey="amount" name="Số tiền" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Chi tiết theo danh mục</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Số giao dịch
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tỷ lệ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.categories[activeTab].map((category) => (
                <tr key={category.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">{category.transactions}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    {formatCurrency(category.amount)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">{category.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
