import { getPayload } from 'payload'
import { NextResponse } from 'next/server'
import config from '@/payload.config'

export async function POST(request: Request) {
  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Update user's onboarding state
    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        onboarding: {
          hasSeenWelcome: true,
          welcomeSeenAt: new Date().toISOString(),
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking welcome:', error)
    return NextResponse.json({ error: 'Failed to track welcome' }, { status: 500 })
  }
}
