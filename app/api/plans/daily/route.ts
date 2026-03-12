import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateDailyPlan } from '@/lib/ai/plan'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0]
    const date = new Date(dateStr)

    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const plans = await prisma.plan.findMany({
      where: {
        scheduledDate: {
          gte: startOfDay,
          lt: endOfDay
        }
      },
      include: {
        investigation: true,
        execution: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(plans)
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, energyLevel } = body

    const planDate = date ? new Date(date) : new Date()
    const plan = await generateDailyPlan(planDate, energyLevel)

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error creating plan:', error)
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    )
  }
}
