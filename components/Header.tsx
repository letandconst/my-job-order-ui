import { Group, ActionIcon, Menu, Avatar, useMantineColorScheme, Box } from '@mantine/core';
import { IconMenu2, IconSun, IconMoonStars, IconBell, IconUser, IconLogout } from '@tabler/icons-react';

export function HeaderBar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();

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
			{/* Left side (toggle) */}

			<ActionIcon
				variant='subtle'
				onClick={onToggleSidebar}
			>
				<IconMenu2 size={20} />
			</ActionIcon>

			{/* Right side */}
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
							src={null}
							alt='User'
						/>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Item leftSection={<IconUser size={16} />}>Account Settings</Menu.Item>
						<Menu.Item
							leftSection={<IconLogout size={16} />}
							color='red'
						>
							Logout
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Group>
		</Box>
	);
}
