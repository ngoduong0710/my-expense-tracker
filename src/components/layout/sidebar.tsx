'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CreditCard, LayoutDashboard, ListTodo, PieChart, Plus, Settings, Tags } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      title: 'Tổng quan',
      isActive: pathname === '/dashboard',
    },
    {
      href: '/transactions',
      icon: CreditCard,
      title: 'Giao dịch',
      isActive: pathname === '/transactions' || pathname.startsWith('/transactions/'),
    },
    {
      href: '/categories',
      icon: Tags,
      title: 'Danh mục',
      isActive: pathname === '/categories',
    },
    {
      href: '/budgets',
      icon: ListTodo,
      title: 'Ngân sách',
      isActive: pathname === '/budgets',
    },
    {
      href: '/reports',
      icon: PieChart,
      title: 'Báo cáo',
      isActive: pathname === '/reports',
    },
  ]

  return (
    <aside className={cn('pb-12', className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Button asChild className="w-full justify-start gap-2">
            <Link href="/transactions/new">
              <Plus className="h-4 w-4" />
              Thêm giao dịch
            </Link>
          </Button>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Menu</h2>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    item.isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-muted',
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  )
}
