import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await auth()

  const isAuth = !!session?.user
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                     request.nextUrl.pathname.startsWith('/register')

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (!isAuth) {
    let from = request.nextUrl.pathname
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
    "/login",
    "/register",
  ],
}
