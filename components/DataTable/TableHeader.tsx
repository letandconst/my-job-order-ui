'use client';

import { ReactNode } from 'react';
import { Group, Title, Text } from '@mantine/core';

interface TableHeaderProps {
	title: string;
	description?: string;
	actions?: ReactNode;
}

export default function TableHeader({ title, description, actions }: TableHeaderProps) {
	return (
		<Group
			justify='space-between'
			align='flex-start'
		>
			<div>
				<Title order={3}>{title}</Title>
				{description && (
					<Text
						size='sm'
						c='dimmed'
					>
						{description}
					</Text>
				)}
			</div>
			{actions && <Group>{actions}</Group>}
		</Group>
	);
}
