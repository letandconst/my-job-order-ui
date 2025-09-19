import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/auth/login', '/auth/forgot-password', '/auth/reset-password'];

// File extensions & internal paths to skip
const ignoredExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.json'];
const ignoredPrefixes = ['/api', '/_next/static', '/_next/image', '/favicon.ico'];

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const accessToken = req.cookies.get('accessToken')?.value;

	// ⏭ Skip middleware for static assets & internal paths
	if (ignoredPrefixes.some((prefix) => pathname.startsWith(prefix)) || ignoredExtensions.some((ext) => pathname.endsWith(ext))) {
		return NextResponse.next();
	}

	const isPublic = publicPaths.some((path) => pathname.startsWith(path));

	if (accessToken && isPublic) {
		return NextResponse.redirect(new URL('/', req.url));
	}

	if (!accessToken && !isPublic) {
		return NextResponse.redirect(new URL('/auth/login', req.url));
	}

	return NextResponse.next();
}
