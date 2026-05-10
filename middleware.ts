import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Use the same secret that NextAuth uses
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET

  const token = await getToken({
    req: request,
    secret,
    cookieName: process.env.NODE_ENV === 'production'
      ? '__Secure-authjs.session-token'
      : 'authjs.session-token',
  })

  const isAuth = !!token
  const pathname = request.nextUrl.pathname
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isAdminPage = pathname.startsWith('/admin')

  // Redirect authenticated users away from auth pages
  if (isAuthPage) {
    if (isAuth) {
      // Redirect admins to admin dashboard, regular users to user dashboard
      const role = token?.role as string
      if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Check admin routes
  if (isAdminPage) {
    if (!isAuth) {
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(pathname)}`, request.url)
      )
    }

    // Check if user has admin role
    const role = token?.role as string
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      // Redirect non-admin users to dashboard with access denied
      return NextResponse.redirect(new URL('/dashboard?error=access_denied', request.url))
    }

    return NextResponse.next()
  }

  // Protected dashboard routes
  if (!isAuth) {
    let from = pathname
    if (request.nextUrl.search) {
      from += request.nextUrl.search
    }

    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/expenses/:path*",
    "/income/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/onboarding/:path*",
    "/admin/:path*",
    "/assets/:path*",
    "/vehicle-logbook/:path*",
    "/login",
    "/register",
  ],
}
