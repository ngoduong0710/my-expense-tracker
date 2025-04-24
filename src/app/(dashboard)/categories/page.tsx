import CategoryList from '@/components/categories/category-list'
import CategoryForm from '@/components/forms/category-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'

export default function CategoriesPage() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Danh mục</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thêm danh mục mới</CardTitle>
            <CardDescription>Tạo danh mục mới cho thu nhập hoặc chi tiêu</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách danh mục</CardTitle>
            <CardDescription>Quản lý các danh mục hiện có</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<CategoryListSkeleton />}>
              <CategoryList />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CategoryListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-5 w-full max-w-[150px]" />
            <Skeleton className="h-5 w-[60px] ml-auto" />
          </div>
        ))}
    </div>
  )
}
