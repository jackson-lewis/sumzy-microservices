import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies()

  if (request.nextUrl.pathname.startsWith('/login')) {
    if (cookieStore.get('token')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!cookieStore.get('token')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/dashboard/reports')) {
    const year = request.nextUrl.searchParams.get('year')
    const month = request.nextUrl.searchParams.get('month')

    if (!year || !month) {
      const today = new Date()
      const url = new URL('/dashboard/reports', request.url)

      url.searchParams.set(
        'year',
        year || today.getFullYear().toString()
      )
      url.searchParams.set(
        'month',
        month || (today.getMonth() + 1).toString()
      )
      return NextResponse.redirect(url)
    }
  }
}
 
export const config = {
  matcher: ['/login', '/dashboard{/:path}']
}