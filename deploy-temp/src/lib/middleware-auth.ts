import { NextRequest } from 'next/server'
import { verifyToken } from './auth'

export function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

export function requireAuth(request: NextRequest): { id: number; email: string; role: string } | null {
  const token = getAuthToken(request)
  if (!token) {
    return null
  }

  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') {
    return null
  }

  return payload
}

