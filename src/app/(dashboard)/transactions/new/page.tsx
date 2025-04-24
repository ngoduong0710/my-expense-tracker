import TransactionForm from '@/components/forms/transaction-form'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'

export default function NewTransactionPage() {
  return (
    <div className="max-w-3xl mx-auto my-6">
      <Suspense fallback={<FormSkeleton />}>
        <TransactionForm />
      </Suspense>
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="space-y-4 border rounded-lg p-6">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-4 w-[350px]" />
      <div className="pt-4 space-y-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <div className="flex justify-between pt-4">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
    </div>
  )
}
