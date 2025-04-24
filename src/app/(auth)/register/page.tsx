'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RegisterFormValues, registerSchema } from '@/types/form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          action: 'register',
        }),
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.error || 'Đăng ký thất bại. Vui lòng thử lại.')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Đăng ký tài khoản</h1>
        <p className="text-gray-500 dark:text-gray-400">Tạo tài khoản mới để sử dụng ứng dụng</p>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Họ tên</Label>
          <Input id="name" placeholder="Nguyễn Văn A" {...register('name')} />
          {errors.name && <p className="text-sm font-medium text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="example@example.com" {...register('email')} />
          {errors.email && <p className="text-sm font-medium text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input id="password" type="password" {...register('password')} />
          {errors.password && <p className="text-sm font-medium text-destructive">{errors.password.message}</p>}
        </div>
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang đăng ký...
            </>
          ) : (
            'Đăng ký'
          )}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Đã có tài khoản?{' '}
        <Link href="/login" className="underline">
          Đăng nhập
        </Link>
      </div>
    </div>
  )
}
