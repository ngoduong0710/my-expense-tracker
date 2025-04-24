'use client'

import { getCurrentMonthYear, getMonthName } from '@/lib/utils'
import { BudgetFormValues, budgetSchema } from '@/types/form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CategoryOption {
  id: string
  name: string
  type: string
  color: string
}

export default function BudgetForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryOption[]>([])

  const { month, year } = getCurrentMonthYear()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      categoryId: '',
      amount: 0,
      month,
      year,
    },
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?type=expense')

        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch categories')
        }

        setCategories(result.data)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('Không thể tải danh mục. Vui lòng thử lại.')
      }
    }

    fetchCategories()
  }, [])

  const onSubmit = async (data: BudgetFormValues) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Có lỗi xảy ra khi lưu ngân sách')
      }

      router.refresh()

      setValue('categoryId', '')
      setValue('amount', 0)
    } catch (err) {
      console.error('Error saving budget:', err)
      setError((err as Error).message || 'Có lỗi xảy ra khi lưu ngân sách')
    } finally {
      setLoading(false)
    }
  }

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: getMonthName(i + 1),
  }))

  const currentYear = new Date().getFullYear()
  const yearOptions = [
    { value: currentYear - 1, label: (currentYear - 1).toString() },
    { value: currentYear, label: currentYear.toString() },
    { value: currentYear + 1, label: (currentYear + 1).toString() },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="month">Tháng</Label>
        <Select defaultValue={month.toString()} onValueChange={(value) => setValue('month', parseInt(value))}>
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
        {errors.month && <p className="text-sm font-medium text-destructive">{errors.month.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="year">Năm</Label>
        <Select defaultValue={year.toString()} onValueChange={(value) => setValue('year', parseInt(value))}>
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
        {errors.year && <p className="text-sm font-medium text-destructive">{errors.year.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">Danh mục</Label>
        <Select value={watch('categoryId')} onValueChange={(value) => setValue('categoryId', value)}>
          <SelectTrigger id="categoryId">
            <SelectValue placeholder="Chọn danh mục" />
          </SelectTrigger>
          <SelectContent>
            {categories.length === 0 ? (
              <SelectItem value="none" disabled>
                Không có danh mục chi tiêu
              </SelectItem>
            ) : (
              categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    {category.name}
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.categoryId && <p className="text-sm font-medium text-destructive">{errors.categoryId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Số tiền ngân sách</Label>
        <Input id="amount" type="number" placeholder="0" {...register('amount', { valueAsNumber: true })} />
        {errors.amount && <p className="text-sm font-medium text-destructive">{errors.amount.message}</p>}
      </div>

      <Button type="submit" disabled={loading || categories.length === 0} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang lưu...
          </>
        ) : (
          'Thiết lập ngân sách'
        )}
      </Button>
    </form>
  )
}
