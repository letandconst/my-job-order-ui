'use client';

import { NavLink, ScrollArea, Box, Group, Text, Tooltip, Typography } from '@mantine/core';
import { IconLayoutDashboard, IconClipboardList, IconTool, IconPackage, IconUserShield, IconUsersGroup, IconUserCog, IconReportAnalytics } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

import classes from './globals.module.css';

interface SidebarProps {
	collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
	const pathname = usePathname();

	return (
		<Box
			style={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			{/* Logo section */}
			<Group
				h={60}
				px='md'
				style={{
					justifyContent: collapsed ? 'center' : 'flex-start',
				}}
			>
				{collapsed ? <Typography>AH</Typography> : <Typography>THE AUTO HUB</Typography>}
			</Group>

			{/* Scrollable nav area */}
			<ScrollArea style={{ flex: 1 }}>
				<Box p='xs'>
					{/* MAIN */}
					{!collapsed && (
						<Text
							size='xs'
							fw={600}
							c='dimmed'
							mt='md'
							mb={8}
						>
							Main
						</Text>
					)}
					<SidebarLink
						label='Dashboard'
						href='/'
						icon={<IconLayoutDashboard size={18} />}
						collapsed={collapsed}
						active={pathname === '/'}
					/>

					{/* OPERATIONS */}
					{!collapsed && (
						<Text
							size='xs'
							fw={600}
							c='dimmed'
							mt={24}
							mb={8}
						>
							Operations
						</Text>
					)}
					<SidebarLink
						label='Job Orders'
						href='/job-orders'
						icon={<IconClipboardList size={18} />}
						collapsed={collapsed}
						active={pathname.startsWith('/job-orders')}
					/>
					<SidebarLink
						label='Services'
						href='/services'
						icon={<IconTool size={18} />}
						collapsed={collapsed}
						active={pathname.startsWith('/services')}
					/>
					<SidebarLink
						label='Inventory'
						href='/inventory'
						icon={<IconPackage size={18} />}
						collapsed={collapsed}
						active={pathname.startsWith('/inventory')}
					/>

					{/* PEOPLE */}
					{!collapsed && (
						<Text
							size='xs'
							fw={600}
							c='dimmed'
							mt={24}
							mb={8}
						>
							People
						</Text>
					)}
					<SidebarLink
						label='Users'
						href='/manage/users'
						icon={<IconUserShield size={18} />}
						collapsed={collapsed}
						active={pathname.startsWith('/users')}
					/>
					<SidebarLink
						label='Clients'
						href='/manage/clients'
						icon={<IconUsersGroup size={18} />}
						collapsed={collapsed}
						active={pathname.startsWith('/clients')}
					/>
					<SidebarLink
						label='Mechanics'
						href='/manage/mechanics'
						icon={<IconUserCog size={18} />}
						collapsed={collapsed}
						active={pathname.startsWith('/mechanics')}
					/>

					{/* REPORTS */}
					{!collapsed && (
						<Text
							size='xs'
							fw={600}
							c='dimmed'
							mt={24}
							mb={8}
						>
							Reports
						</Text>
					)}
					<SidebarLink
						label='Reports'
						href='/reports'
						icon={<IconReportAnalytics size={18} />}
						collapsed={collapsed}
						active={pathname.startsWith('/reports')}
					/>
				</Box>
			</ScrollArea>
		</Box>
	);
}

function SidebarLink({ label, href, icon, collapsed, active }: { label: string; href: string; icon: React.ReactNode; collapsed: boolean; active?: boolean }) {
	if (collapsed) {
		return (
			<Tooltip
				label={label}
				position='right'
				withArrow
			>
				<NavLink
					component='a'
					href={href}
					leftSection={icon}
					className={classes.navlink_custom}
					variant='outline'
					style={{
						marginBottom: 8,
					}}
				/>
			</Tooltip>
		);
	}

	return (
		<NavLink
			component='a'
			href={href}
			label={label}
			leftSection={icon}
			variant='subtle'
			className={classes.navlink_custom}
			style={{
				marginBottom: 8,
				fontWeight: active ? 600 : '',
				backgroundColor: active ? 'var(--nav-active-bg)' : '',
				color: active ? 'var(--nav-active-color)' : '',
			}}
		/>
	);
}
