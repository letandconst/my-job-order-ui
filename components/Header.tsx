'use client';
import { Group, ActionIcon, Menu, Avatar, useMantineColorScheme, Box } from '@mantine/core';
import { IconMenu2, IconSun, IconMoonStars, IconBell, IconUser, IconLogout } from '@tabler/icons-react';
import { useUser, User } from '@/context/UserContext';
import { useApolloClient, useMutation } from '@apollo/client/react';
import { LOGOUT_MUTATION } from '@/graphql/mutations/auth';
import { useRouter } from 'next/navigation';

export function HeaderBar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const { user, loading, refetchUser } = useUser();
	const client = useApolloClient();
	const router = useRouter();

	const [logoutMutation] = useMutation(LOGOUT_MUTATION, {
		onCompleted: async () => {
			router.push('/auth/login');

			refetchUser();
			await client.clearStore();
		},
	});

	const getInitials = (user: User | null) => {
		if (!user) return '';
		return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
	};

	const handleLogout = async () => {
		await logoutMutation();
	};

	if (loading) return null;

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
						<Avatar
							radius='xl'
							color='blue'
							src={user?.avatar || null}
							alt={`${user?.firstName} ${user?.lastName}`}
							name={`${user?.firstName} ${user?.lastName}`}
						/>
					</Menu.Target>

					<Menu.Dropdown>
						<Menu.Item leftSection={<IconUser size={16} />}>Account Settings</Menu.Item>
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
