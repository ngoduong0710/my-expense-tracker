'use client'

import { Progress } from '@/components/ui/progress'
import { formatCurrency, getCurrentMonthYear, getMonthName } from '@/lib/utils'
import { Edit, Loader2, MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

export default function BudgetList() {
  const router = useRouter()
  const [data, setData] = useState<BudgetItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [editingBudget, setEditingBudget] = useState<BudgetItem | null>(null)
  const [newAmount, setNewAmount] = useState<number>(0)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const { month, year } = getCurrentMonthYear()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/dashboard`)

        if (!response.ok) {
          throw new Error('Failed to fetch budget data')
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch budget data')
        }

        setData(result.data.budgets || [])
      } catch (err) {
        setError((err as Error).message)
        console.error('Error fetching budgets:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete budget')
      }

      setData(data.filter((b) => b.id !== id))
      router.refresh()
    } catch (err) {
      setDeleteError((err as Error).message)
      console.error('Error deleting budget:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditClick = (budget: BudgetItem) => {
    setEditingBudget(budget)
    setNewAmount(budget.budgetAmount)
    setIsEditDialogOpen(true)
  }

  const handleEditSave = async () => {
    if (!editingBudget) return

    setIsEditing(true)
    setEditError(null)

    try {
      const response = await fetch(`/api/budgets/${editingBudget.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: editingBudget.categoryId,
          amount: newAmount,
          month,
          year,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to update budget')
      }

      setData(
        data.map((b) =>
          b.id === editingBudget.id
            ? {
                ...b,
                budgetAmount: newAmount,
                percentage: (b.spentAmount / newAmount) * 100,
                remaining: newAmount - b.spentAmount,
              }
            : b,
        ),
      )

      setIsEditDialogOpen(false)
      router.refresh()
    } catch (err) {
      setEditError((err as Error).message)
      console.error('Error updating budget:', err)
    } finally {
      setIsEditing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-lg">
        <p>Không thể tải dữ liệu ngân sách. Vui lòng thử lại sau.</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Bạn chưa thiết lập ngân sách nào cho tháng {getMonthName(month)}.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Ngân sách tháng {getMonthName(month)}, {year}
      </div>

      {data.map((budget) => (
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
            //   budget.percentage > 100
            //     ? 'bg-red-500'
            //     : budget.percentage > 90
            //     ? 'bg-amber-500'
            //     : undefined
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
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Mở menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleEditClick(budget)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <AlertDialog>
                    <AlertDialogTrigger className="w-full flex items-center text-left px-2 py-1.5 text-sm text-red-600 dark:text-red-400">
                      <Trash className="h-4 w-4 mr-2" />
                      Xóa
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc muốn xóa ngân sách cho danh mục "{budget.categoryName}"?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      {deleteError && <div className="text-sm text-red-500 mt-2">{deleteError}</div>}
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.preventDefault()
                            handleDelete(budget.id)
                          }}
                          disabled={isDeleting}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Đang xóa...
                            </>
                          ) : (
                            'Xóa'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa ngân sách</DialogTitle>
            <DialogDescription>Cập nhật số tiền ngân sách</DialogDescription>
          </DialogHeader>

          {editingBudget && (
            <div className="space-y-4 py-4">
              {editError && (
                <Alert variant="destructive">
                  <AlertDescription>{editError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="category">Danh mục</Label>
                <div className="flex items-center gap-2 py-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: editingBudget.color }} />
                  <span>{editingBudget.categoryName}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền ngân sách</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(Number(e.target.value))}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isEditing}>
                  Hủy bỏ
                </Button>
                <Button onClick={handleEditSave} disabled={isEditing}>
                  {isEditing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu thay đổi'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
