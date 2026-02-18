import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

import { prisma } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get categories
    const categories = await prisma.expenseCategory.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      categories,
    })
  } catch (error) {
    console.error('Fetch companies error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}
