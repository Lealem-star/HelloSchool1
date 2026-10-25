import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tx_ref, status } = body

    if (!tx_ref) {
      return NextResponse.json({ error: 'Missing tx_ref' }, { status: 400 })
    }

    if (status === 'success') {
      // Find purchase by tx_ref
      await (prisma as any).digitalPurchase.updateMany({
        where: { transactionRef: tx_ref },
        data: {
          status: 'Active',
          updatedAt: new Date(),
        },
      }).catch(() => {})

      // Also mark registration as Enrolled
      await (prisma as any).registration.updateMany({
        where: { transactionRef: tx_ref },
        data: {
          status: 'Enrolled',
          approvedAt: new Date(),
          approvedBy: 'Chapa Webhook',
          updatedAt: new Date(),
        },
      }).catch(() => {})
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Chapa webhook callback error:', error)
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 })
  }
}
