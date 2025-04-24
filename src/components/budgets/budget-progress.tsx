'use client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface BudgetItem {
  id: string
  categoryId: string
  categoryName: string
  color: string
  budgetAmount: number
  spentAmount: number
  percentage: number
  remaining: number
}

interface DashboardData {
  budgets: BudgetItem[]
}

export default function BudgetProgress() {
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
        <p>Không thể tải dữ liệu ngân sách. Vui lòng thử lại sau.</p>
      </div>
    )
  }

  const { budgets } = data

  if (!budgets || budgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
        <p className="text-muted-foreground mb-4">Bạn chưa thiết lập ngân sách nào cho tháng này.</p>
        <Button asChild>
          <Link href="/budgets">Thiết lập ngân sách</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {budgets.map((budget) => (
        <div key={budget.id} className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: budget.color }} />
              <span className="font-medium">{budget.categoryName}</span>
            </div>
            <div className="text-sm font-medium">
              {formatCurrency(budget.spentAmount)} / {formatCurrency(budget.budgetAmount)}
            </div>
          </div>
          <Progress
            value={budget.percentage > 100 ? 100 : budget.percentage}
            className={`h-2 ${budget.percentage > 90 ? 'bg-red-200 dark:bg-red-950' : ''}`}
            // indicatorClassName={
            //   budget.percentage > 100 ? 'bg-red-500' : budget.percentage > 90 ? 'bg-amber-500' : undefined
            // }
          />
          <div className="flex justify-between text-sm">
            <span className={budget.percentage > 100 ? 'text-red-500' : ''}>
              {budget.percentage.toFixed(0)}% sử dụng
            </span>
            <span className={budget.remaining < 0 ? 'text-red-500' : 'text-green-600'}>
              {budget.remaining < 0 ? 'Vượt ' : 'Còn lại '}
              {formatCurrency(Math.abs(budget.remaining))}
            </span>
          </div>
          {budget.percentage > 100 && (
            <div className="flex items-center gap-2 p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>Bạn đã vượt ngân sách cho danh mục này!</span>
            </div>
          )}
        </div>
      ))}
      <div className="flex justify-center pt-4">
        <Button asChild variant="outline">
          <Link href="/budgets">Quản lý ngân sách</Link>
        </Button>
      </div>
    </div>
  )
}
