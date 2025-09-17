import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public paths that don’t require auth
const publicPaths = ['/auth/login', '/auth/forgot-password', '/auth/reset-password'];

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const token = req.cookies.get('refreshToken')?.value;

	// If user is authenticated and trying to access login or forgot-password, redirect to home
	if (token && publicPaths.some((path) => pathname.startsWith(path))) {
		const homeUrl = new URL('/', req.url);
		return NextResponse.redirect(homeUrl);
	}

	// If user is not authenticated and trying to access a protected page, redirect to login
	if (!token && !publicPaths.some((path) => pathname.startsWith(path))) {
		const loginUrl = new URL('/auth/login', req.url);
		return NextResponse.redirect(loginUrl);
	}

	// Otherwise, allow access
	return NextResponse.next();
}

// Apply to all routes except Next.js internals
export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
