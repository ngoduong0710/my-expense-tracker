import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/dashboard
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0)

    const monthTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
    })

    const income = monthTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)

    const expense = monthTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)

    const balance = income - expense

    const recentTransactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: 5,
    })

    const expenseByCategory = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type: 'expense',
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
    })

    const categoryIds = expenseByCategory.map((e) => e.categoryId)
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
    })

    const expenseCategoryData = expenseByCategory.map((e) => {
      const category = categories.find((c) => c.id === e.categoryId)
      return {
        categoryId: e.categoryId,
        name: category?.name || 'Unknown',
        color: category?.color || '#000000',
        amount: e._sum.amount || 0,
        percentage: ((e._sum.amount || 0) / (expense || 1)) * 100,
      }
    })

    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        month: currentMonth,
        year: currentYear,
      },
      include: {
        category: true,
      },
    })

    const budgetData = budgets.map((b) => {
      const spent = monthTransactions
        .filter((t) => t.categoryId === b.categoryId && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      return {
        id: b.id,
        categoryId: b.categoryId,
        categoryName: b.category.name,
        color: b.category.color,
        budgetAmount: b.amount,
        spentAmount: spent,
        percentage: (spent / b.amount) * 100,
        remaining: b.amount - spent,
      }
    })

    const response = {
      summary: {
        income,
        expense,
        balance,
      },
      recentTransactions,
      expenseByCategory: expenseCategoryData,
      budgets: budgetData,
    }

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
