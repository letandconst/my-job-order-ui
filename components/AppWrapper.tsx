'use client';

import { usePathname } from 'next/navigation';
import { DashboardLayout } from '@/components/PageLayout';

const authRoutes = ['/auth/login', '/auth/forgot-password', '/auth/reset-password'];

export function AppWrapper({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isAuthRoute = authRoutes.some((route) => pathname?.startsWith(route));

	if (isAuthRoute) {
		return <>{children}</>;
	}

	return <DashboardLayout pathname={pathname ?? ''}>{children}</DashboardLayout>;
}
