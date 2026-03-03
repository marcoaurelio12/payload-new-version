import { NextResponse } from 'next/server'

/**
 * Health check endpoint for Dokploy/load balancer
 * GET /api/health
 */
export async function GET() {
  try {
    // Basic health check - just return OK
    // In the future, you could add database connectivity check here

    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'unknown',
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}
