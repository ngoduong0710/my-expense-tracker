'use client'

import { cn } from '@/lib/utils'
import { TransactionFormValues, transactionSchema } from '@/types/form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

interface CategoryOption {
  id: string
  name: string
  type: string
  color: string
}

interface TransactionFormProps {
  transaction?: {
    id: string
    amount: number
    type: 'income' | 'expense'
    categoryId: string
    description: string | null
    date: Date
  }
}

export default function TransactionForm({ transaction }: TransactionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>(transaction?.type || 'expense')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: transaction?.amount || 0,
      type: transaction?.type || 'expense',
      categoryId: transaction?.categoryId || '',
      description: transaction?.description || '',
      date: transaction?.date ? new Date(transaction.date) : new Date(),
    },
  })

  const watchType = watch('type')

  useEffect(() => {
    setTransactionType(watchType)
    const currentCategoryId = watch('categoryId')
    if (currentCategoryId) {
      const category = categories.find((c) => c.id === currentCategoryId)
      if (category && category.type !== watchType) {
        setValue('categoryId', '')
      }
    }
  }, [watchType, categories, setValue, watch])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')

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

  const onSubmit = async (data: TransactionFormValues) => {
    setLoading(true)
    setError(null)

    try {
      const url = transaction ? `/api/transactions/${transaction.id}` : '/api/transactions'

      const method = transaction ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Có lỗi xảy ra khi lưu giao dịch')
      }

      router.push('/transactions')
      router.refresh()
    } catch (err) {
      console.error('Error saving transaction:', err)
      setError((err as Error).message || 'Có lỗi xảy ra khi lưu giao dịch')
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter((category) => category.type === transactionType)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{transaction ? 'Chỉnh sửa giao dịch' : 'Thêm giao dịch mới'}</CardTitle>
        <CardDescription>
          {transaction ? 'Cập nhật thông tin giao dịch của bạn' : 'Nhập thông tin cho giao dịch mới'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form id="transaction-form" onSubmit={handleSubmit(onSubmit)}>
          <Tabs
            defaultValue={transaction?.type || 'expense'}
            onValueChange={(value) => setValue('type', value as 'income' | 'expense')}
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expense">Chi tiêu</TabsTrigger>
              <TabsTrigger value="income">Thu nhập</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Số tiền</Label>
              <Input id="amount" type="number" placeholder="0" {...register('amount', { valueAsNumber: true })} />
              {errors.amount && <p className="text-sm font-medium text-destructive">{errors.amount.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Danh mục</Label>
              <Select
                defaultValue={transaction?.categoryId || ''}
                onValueChange={(value) => setValue('categoryId', value)}
              >
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.length === 0 ? (
                    <SelectItem value="" disabled>
                      Không có danh mục phù hợp
                    </SelectItem>
                  ) : (
                    filteredCategories.map((category) => (
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
              <Label htmlFor="date">Ngày</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !watch('date') && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watch('date') ? format(watch('date'), 'PPP', { locale: vi }) : <span>Chọn ngày</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watch('date')}
                    onSelect={(date) => setValue('date', date || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-sm font-medium text-destructive">{errors.date.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả (tùy chọn)</Label>
              <Textarea id="description" placeholder="Nhập mô tả cho giao dịch" rows={3} {...register('description')} />
            </div>

            <input type="hidden" {...register('type')} />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()} disabled={loading}>
          Hủy bỏ
        </Button>
        <Button type="submit" form="transaction-form" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : transaction ? (
            'Cập nhật'
          ) : (
            'Tạo giao dịch'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
