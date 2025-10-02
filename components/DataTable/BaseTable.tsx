'use client';

import { DataTable, DataTableColumn } from 'mantine-datatable';
import { Menu, ActionIcon, Group, Tooltip, Stack } from '@mantine/core';
import { IconDots, IconEye } from '@tabler/icons-react';
import { ReactNode } from 'react';
import TableHeader from './TableHeader';
import TableFilters from './TableFilters';

export interface TableAction<T> {
	label: string;
	icon?: ReactNode;
	onClick: (row: T) => void;
}

interface BaseTableProps<T> {
	title: string;
	description?: string;
	headerButtons?: ReactNode;
	filters?: ReactNode;
	columns: DataTableColumn<T>[];
	data: T[];
	onView?: (row: T) => void;
	rowActions?: TableAction<T>[];
	fetching?: boolean;
}

export function BaseTable<T>({ title, description, headerButtons, filters, columns, data, onView, rowActions = [], fetching = false }: BaseTableProps<T>) {
	const finalColumns: DataTableColumn<T>[] = [
		...columns,
		{
			accessor: 'actions',
			title: 'Actions',
			render: (row) => (
				<Group gap='xs'>
					{onView && (
						<Tooltip label='View'>
							<ActionIcon
								variant='light'
								color='blue'
								onClick={() => onView(row)}
							>
								<IconEye size={16} />
							</ActionIcon>
						</Tooltip>
					)}
					{rowActions.length > 0 && (
						<Menu
							shadow='md'
							width={180}
							withinPortal
						>
							<Menu.Target>
								<ActionIcon
									variant='subtle'
									color='gray'
								>
									<IconDots size={18} />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								{rowActions.map((action, idx) => (
									<Menu.Item
										key={idx}
										leftSection={action.icon}
										onClick={() => action.onClick(row)}
									>
										{action.label}
									</Menu.Item>
								))}
							</Menu.Dropdown>
						</Menu>
					)}
				</Group>
			),
		},
	];

	return (
		<Stack gap='md'>
			<TableHeader
				title={title}
				description={description}
				actions={headerButtons}
			/>
			{filters && <TableFilters>{filters}</TableFilters>}
			<DataTable
				withTableBorder
				highlightOnHover
				columns={finalColumns}
				records={data}
				striped
				fetching={fetching}
				height={600}
				noRecordsText='No data found'
			/>
		</Stack>
	);
}
