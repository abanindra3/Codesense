import type { NextRequest } from "next/server"

interface RateLimitResult {
  success: boolean
  remaining?: number
  resetTime?: Date
}

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export async function rateLimitCheck(request: NextRequest): Promise<RateLimitResult> {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 20 // 20 requests per minute

  const current = rateLimitMap.get(ip)

  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return { success: true, remaining: maxRequests - 1 }
  }

  if (current.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: new Date(current.resetTime),
    }
  }

  current.count++
  return { success: true, remaining: maxRequests - current.count }
}
