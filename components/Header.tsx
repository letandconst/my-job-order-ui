'use client';
import { Group, ActionIcon, Menu, Avatar, useMantineColorScheme, Box, Skeleton } from '@mantine/core';
import { IconMenu2, IconSun, IconMoonStars, IconBell, IconUser, IconLogout } from '@tabler/icons-react';
import { useUser } from '@/hooks/useUser';
import { useApolloClient, useMutation } from '@apollo/client/react';
import { LOGOUT_MUTATION } from '@/graphql/mutations/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function HeaderBar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const { user, refetchUser, loading } = useUser();
	const client = useApolloClient();
	const router = useRouter();

	const [logoutMutation] = useMutation(LOGOUT_MUTATION, {
		onCompleted: async () => {
			router.push('/auth/login');

			refetchUser();
			await client.clearStore();
		},
	});

	const handleLogout = async () => {
		await logoutMutation();
	};

	return (
		<Box
			style={{
				height: 60,
				padding: '0 16px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				borderBottom: '1px solid var(--mantine-color-default-border)',
				background: 'var(--mantine-color-body)',
			}}
		>
			<ActionIcon
				variant='subtle'
				onClick={onToggleSidebar}
			>
				<IconMenu2 size={20} />
			</ActionIcon>

			<Group gap='sm'>
				<ActionIcon
					variant='subtle'
					onClick={() => toggleColorScheme()}
				>
					{colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoonStars size={20} />}
				</ActionIcon>

				<ActionIcon variant='subtle'>
					<IconBell size={20} />
				</ActionIcon>

				<Menu
					shadow='md'
					width={200}
				>
					<Menu.Target>
						{loading ? (
							<Skeleton
								height='38px'
								width='38px'
								radius='xl'
							/>
						) : (
							<Avatar
								radius='xl'
								color='blue'
								src={user?.avatar || undefined}
								alt={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
								name={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
								style={{ cursor: 'pointer' }}
								styles={{ image: { height: 'auto' } }}
							/>
						)}
					</Menu.Target>

					<Menu.Dropdown>
						<Menu.Item
							component={Link}
							href='/profile'
							leftSection={<IconUser size={16} />}
						>
							Account Settings
						</Menu.Item>
						<Menu.Item
							leftSection={<IconLogout size={16} />}
							color='red'
							onClick={handleLogout}
						>
							Logout
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Group>
		</Box>
	);
}
