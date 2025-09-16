'use client';

import { Group, ActionIcon, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
	title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
	const router = useRouter();

	return (
		<Group
			mb='xl'
			gap='sm'
			align='center'
		>
			<ActionIcon
				variant='light'
				size='lg'
				onClick={() => router.back()}
			>
				<IconArrowLeft size={20} />
			</ActionIcon>
			<Title order={2}>{title}</Title>
		</Group>
	);
}
