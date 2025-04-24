import TransactionFilters from '@/components/transactions/transaction-filters'
import TransactionList from '@/components/transactions/transaction-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export default function TransactionsPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Giao dịch</h2>
        <Button asChild>
          <Link href="/transactions/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Thêm giao dịch
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách giao dịch</CardTitle>
          <CardDescription>Quản lý tất cả các giao dịch thu nhập và chi tiêu của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionFilters />

          <div className="mt-6">
            <Suspense fallback={<TransactionListSkeleton />}>
              <TransactionList />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TransactionListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
            <Skeleton className="h-5 w-[100px]" />
          </div>
        ))}
    </div>
  )
}
