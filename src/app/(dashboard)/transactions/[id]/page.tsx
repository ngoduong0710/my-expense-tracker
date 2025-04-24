import TransactionForm from '@/components/forms/transaction-form'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditTransactionPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params

  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return notFound()
  }

  const transaction = await prisma.transaction.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  })

  if (!transaction) {
    return notFound()
  }

  const typedTransaction = {
    id: transaction.id,
    amount: transaction.amount,
    type: transaction.type as 'income' | 'expense',
    categoryId: transaction.categoryId,
    description: transaction.description,
    date: transaction.date,
  }

  return (
    <div className="max-w-3xl mx-auto my-6">
      <TransactionForm transaction={typedTransaction} />
    </div>
  )
}
