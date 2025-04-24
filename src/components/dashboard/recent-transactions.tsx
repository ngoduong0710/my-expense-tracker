'use client'

import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TransactionWithCategory } from '@/types/index'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface DashboardData {
  recentTransactions: TransactionWithCategory[]
}

export default function RecentTransactions() {
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
        <p>Không thể tải giao dịch gần đây. Vui lòng thử lại sau.</p>
      </div>
    )
  }

  const { recentTransactions } = data

  if (recentTransactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
        <p className="text-muted-foreground mb-4">Bạn chưa có giao dịch nào. Hãy bắt đầu theo dõi chi tiêu của bạn.</p>
        <Button asChild>
          <Link href="/transactions/new">Thêm giao dịch đầu tiên</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {recentTransactions.map((transaction) => (
        <Link
          key={transaction.id}
          href={`/transactions/${transaction.id}`}
          className="flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: `${transaction.category.color}30` }}
          >
            {transaction.type === 'income' ? (
              <ArrowUpIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-5 w-5 text-red-500" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.description || transaction.category.name}</p>
            <p className="text-xs text-muted-foreground">{formatDate(new Date(transaction.date))}</p>
          </div>
          <div
            className={`text-sm font-medium ${
              transaction.type === 'income' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
            }`}
          >
            {transaction.type === 'income' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </div>
        </Link>
      ))}

      <div className="flex justify-center">
        <Button asChild variant="outline">
          <Link href="/transactions">Xem tất cả giao dịch</Link>
        </Button>
      </div>
    </div>
  )
}
