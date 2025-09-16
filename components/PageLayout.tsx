'use client';

import { useState } from 'react';
import { AppShell, Box } from '@mantine/core';
import { Sidebar } from './Sidebar';
import { HeaderBar } from './Header';

export function DashboardLayout({ children }: { children: React.ReactNode; pathname: string }) {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<AppShell
			navbar={{
				width: collapsed ? 80 : 240,
				breakpoint: 'sm',
				collapsed: { mobile: false },
			}}
			padding={0}
			styles={{
				navbar: {
					transition: 'width 0.3s ease',
				},
			}}
		>
			{/* Sidebar (always full height on the left) */}
			<AppShell.Navbar>
				<Sidebar collapsed={collapsed} />
			</AppShell.Navbar>

			{/* Main area */}
			<AppShell.Main style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
				{/* Header above content, beside sidebar */}
				<HeaderBar onToggleSidebar={() => setCollapsed((c) => !c)} />

				{/* Page content below header */}
				<Box style={{ flex: 1, padding: '52px 24px', overflow: 'auto' }}>{children}</Box>
			</AppShell.Main>
		</AppShell>
	);
}
