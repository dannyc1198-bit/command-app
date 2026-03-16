import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const patterns = await prisma.pattern.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        lastSeen: 'desc'
      }
    })

    return NextResponse.json(patterns)
  } catch (error) {
    console.error('Error fetching patterns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patterns' },
      { status: 500 }
    )
  }
}
