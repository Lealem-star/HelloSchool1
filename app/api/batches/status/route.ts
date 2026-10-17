import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    let p: any = prisma
    if (!p.batch) {
      try {
        const { PrismaClient } = require('@prisma/client')
        p = new PrismaClient()
      } catch {
        p = prisma
      }
    }

    let openBatches: any[] = []
    let allBatches: any[] = []

    if (p.batch) {
      allBatches = await p.batch.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        include: {
          registrations: {
            select: { id: true, courseTitle: true, shift: true, status: true },
          },
        },
      })
      openBatches = allBatches.filter((b) => b.status === 'Open')
    } else {
      // Raw SQL fallback
      const rows = await p.$queryRaw`
        SELECT b.*, COUNT(r.id) as enrolledCount
        FROM Batch b
        LEFT JOIN Registration r ON r.batchId = b.id
        GROUP BY b.id
        ORDER BY b.sortOrder ASC, b.createdAt DESC
      `
      allBatches = Array.isArray(rows) ? rows : []
      openBatches = allBatches.filter((b: any) => b.status === 'Open')
    }

    const hasOpenBatch = openBatches.length > 0
    const activeBatch = hasOpenBatch ? openBatches[0] : null

    return NextResponse.json(
      {
        hasOpenBatch,
        totalBatches: allBatches.length,
        openBatchesCount: openBatches.length,
        activeBatch: activeBatch
          ? {
              id: activeBatch.id,
              batchNumber: activeBatch.batchNumber,
              title: activeBatch.title,
              status: activeBatch.status,
              startDate: activeBatch.startDate,
              capacity: activeBatch.capacity || 60,
              enrolledCount: activeBatch.registrations?.length || Number(activeBatch.enrolledCount || 0),
            }
          : null,
        status: hasOpenBatch ? 'open' : 'closed',
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (err: any) {
    console.error('Error fetching public batch status:', err)
    return NextResponse.json(
      {
        hasOpenBatch: true,
        totalBatches: 1,
        openBatchesCount: 1,
        activeBatch: {
          id: 'batch_01',
          batchNumber: 'Batch 01',
          title: '2026 Practical TVET Intake · Bahir Dar Campus',
          status: 'Open',
        },
        status: 'open',
      },
      { status: 200 }
    )
  }
}
