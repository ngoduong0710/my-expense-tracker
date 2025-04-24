import BudgetProgress from '@/components/budgets/budget-progress'
import ExpenseChart from '@/components/dashboard/expense-chart'
import RecentTransactions from '@/components/dashboard/recent-transactions'
import SummaryCards from '@/components/dashboard/summary-cards'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

export default function DashboardPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tổng quan</h2>
        <Button asChild>
          <Link href="/transactions/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Thêm giao dịch
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          <TabsTrigger value="budgets">Ngân sách</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Suspense fallback={<SummarySkeleton />}>
            <SummaryCards />
          </Suspense>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Giao dịch gần đây</CardTitle>
                <CardDescription>5 giao dịch gần nhất của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<RecentTransactionsSkeleton />}>
                  <RecentTransactions />
                </Suspense>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Chi tiêu theo danh mục</CardTitle>
                <CardDescription>Phân bổ chi tiêu trong tháng này</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<ChartSkeleton />}>
                  <ExpenseChart />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phân tích chi tiêu</CardTitle>
              <CardDescription>Phân tích chi tiết chi tiêu của bạn theo thời gian</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Suspense fallback={<ChartSkeleton height={300} />}>
                <ExpenseChart />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ngân sách của bạn</CardTitle>
              <CardDescription>Theo dõi tiến độ ngân sách hàng tháng</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<BudgetSkeleton />}>
                <BudgetProgress />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SummarySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-[100px]" />
              </CardTitle>
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-[120px] mb-1" />
              <Skeleton className="h-4 w-[80px]" />
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

function RecentTransactionsSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[120px]" />
            </div>
            <Skeleton className="h-5 w-[80px]" />
          </div>
        ))}
    </div>
  )
}

function ChartSkeleton({ height = 200 }: { height?: number }) {
  return <Skeleton className={`w-full h-[${height}px]`} />
}

function BudgetSkeleton() {
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
          </div>
        ))}
    </div>
  )
}
