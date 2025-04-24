import BudgetList from '@/components/budgets/budget-list'
import BudgetForm from '@/components/forms/budget-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'

export default function BudgetsPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ngân sách</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thiết lập ngân sách</CardTitle>
            <CardDescription>Thiết lập ngân sách theo danh mục và tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<BudgetFormSkeleton />}>
              <BudgetForm />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ngân sách hiện tại</CardTitle>
            <CardDescription>Theo dõi ngân sách tháng này của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<BudgetListSkeleton />}>
              <BudgetList />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function BudgetFormSkeleton() {
  return (
    <div className="space-y-4">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      <Skeleton className="h-10 w-full mt-6" />
    </div>
  )
}

function BudgetListSkeleton() {
  return (
    <div className="space-y-6">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-[80px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </div>
        ))}
    </div>
  )
}
