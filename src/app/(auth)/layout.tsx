import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center h-16 px-4 border-b lg:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold">Chi Tiêu</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="mx-auto grid w-full max-w-[800px] gap-6 rounded-lg p-6 lg:grid-cols-2 lg:p-10 border">
          <div className="flex flex-col justify-center gap-2">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Quản Lý Chi Tiêu Cá Nhân</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Theo dõi thu nhập và chi tiêu một cách dễ dàng. Kiểm soát tài chính với các báo cáo trực quan.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-4">{children}</div>
        </div>
      </main>
      <footer className="flex items-center h-16 px-4 border-t lg:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Chi Tiêu App. Đã đăng ký bản quyền.
        </p>
      </footer>
    </div>
  )
}
