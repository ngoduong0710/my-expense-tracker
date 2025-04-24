import CategoryBreakdown from '@/components/reports/category-breakdown'
import MonthlyReport from '@/components/reports/monthly-report'
import TrendChart from '@/components/reports/trend-chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Suspense } from 'react'

export default function ReportsPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Báo cáo</h2>
      </div>

      <Tabs defaultValue="monthly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monthly">Báo cáo tháng</TabsTrigger>
          <TabsTrigger value="categories">Phân tích danh mục</TabsTrigger>
          <TabsTrigger value="trends">Xu hướng</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo theo tháng</CardTitle>
              <CardDescription>Tổng hợp thu chi của bạn theo tháng</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ReportSkeleton />}>
                <MonthlyReport />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chi tiêu theo danh mục</CardTitle>
              <CardDescription>Phân tích chi tiêu theo từng danh mục</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ReportSkeleton />}>
                <CategoryBreakdown />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Xu hướng chi tiêu</CardTitle>
              <CardDescription>Phân tích xu hướng thu chi theo thời gian</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Suspense fallback={<ReportSkeleton height={400} />}>
                <TrendChart />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ReportSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-[150px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      <Skeleton className={`w-full h-[${height}px]`} />

      <div className="grid gap-4 md:grid-cols-3">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
      </div>
    </div>
  )
}
