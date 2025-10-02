'use client';

import { ReactNode } from 'react';
import { Group, Paper } from '@mantine/core';

interface TableFiltersProps {
	children: ReactNode;
}

export default function TableFilters({ children }: TableFiltersProps) {
	return (
		<Paper
			p='sm'
			withBorder
			radius='md'
		>
			<Group gap='md'>{children}</Group>
		</Paper>
	);
}
