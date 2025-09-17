'use client';

import { useEffect, useState } from 'react';
import { DataTable, type DataTableSortStatus, type DataTableColumn } from 'mantine-datatable';
import { Box, TextInput, Group, ActionIcon, Button, Flex } from '@mantine/core';
import { IconSearch, IconEye, IconEdit } from '@tabler/icons-react';
import React from 'react';

interface ReusableDataTableProps<T extends { _id: string | number }> {
	data: T[];
	columns: DataTableColumn<T>[]; // user-defined columns
	pageSize?: number;
	globalSearch?: boolean;
	loading?: boolean;
	buttonLabel?: string;
	onButtonClick?: () => void;
	onAction?: (action: 'view' | 'edit', row: T) => void;
}

type Primitive = string | number | boolean;
type ColumnFilterValue = Primitive | Primitive[];

export function ReusableDataTable<T extends { _id: string | number }>({ data, columns, pageSize = 10, globalSearch = true, loading = false, buttonLabel, onButtonClick, onAction }: ReusableDataTableProps<T>) {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
		columnAccessor: 'createdAt' as keyof T,
		direction: 'desc',
	});
	const [records, setRecords] = useState<T[]>([]);
	const [pageLoading, setPageLoading] = useState(false);

	const [columnFilters, setColumnFilters] = useState<Record<string, ColumnFilterValue>>({});

	const paginatedRecords = records.map((record, index) => ({ id: record._id ?? index, ...record })).slice((page - 1) * pageSize, page * pageSize);

	// universal comparator
	const nativeSort = (arr: T[], accessor: keyof T, dir: 'asc' | 'desc') => {
		return [...arr].sort((a, b) => {
			const aVal = a[accessor];
			const bVal = b[accessor];

			if (aVal == null) return 1;
			if (bVal == null) return -1;

			const aStr = aVal instanceof Date ? aVal.getTime() : aVal.toString();
			const bStr = bVal instanceof Date ? bVal.getTime() : bVal.toString();

			if (aStr < bStr) return dir === 'asc' ? -1 : 1;
			if (aStr > bStr) return dir === 'asc' ? 1 : -1;
			return 0;
		});
	};

	// filtering + sorting
	useEffect(() => {
		if (loading) return;
		let filtered = [...data];

		if (search) {
			filtered = filtered.filter((item) => Object.values(item).some((value) => value?.toString().toLowerCase().includes(search.toLowerCase())));
		}

		Object.entries(columnFilters).forEach(([key, value]) => {
			if (!value || (Array.isArray(value) && value.length === 0)) return;

			filtered = filtered.filter((item) => {
				const cellValue = key.split('.').reduce<unknown>((acc, k) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[k] : undefined), item);

				if (key === 'isActive') {
					if (Array.isArray(value)) {
						return value.some((v) => cellValue === (v === 'true'));
					}
					return cellValue === (value === 'true');
				}

				if (Array.isArray(value)) {
					return value.includes(cellValue);
				}
				return cellValue === value;
			});
		});

		if (sortStatus.columnAccessor) {
			filtered = nativeSort(filtered, sortStatus.columnAccessor as keyof T, sortStatus.direction);
		}

		setRecords(filtered);
		setPage(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, search, sortStatus, columnFilters, loading]);

	// simulate backend page fetch
	const handlePageChange = (newPage: number) => {
		setPageLoading(true);
		setTimeout(() => {
			setPage(newPage);
			setPageLoading(false);
		}, 400); // simulate network delay
	};

	const actionColumn: DataTableColumn<T> = {
		accessor: 'actions',
		title: <Box mr={6}>Actions</Box>,
		textAlign: 'right',
		width: 100,
		render: (row: T) => (
			<Group
				gap={4}
				justify='center'
				wrap='nowrap'
			>
				<ActionIcon
					size='md'
					variant='subtle'
					color='green'
					key='view'
					onClick={() => onAction?.('view', row)}
				>
					<IconEye size={16} />
				</ActionIcon>
				<ActionIcon
					size='md'
					variant='subtle'
					color='blue'
					key='edit'
					onClick={() => onAction?.('edit', row)}
				>
					<IconEdit size={16} />
				</ActionIcon>
			</Group>
		),
	};

	const enhancedColumns = columns.map((col) =>
		col.filter
			? {
					...col,
					filter: React.cloneElement(col.filter as React.ReactElement<{ value?: unknown; onChange?: (v: unknown) => void }>, {
						value: (() => {
							const val = columnFilters[col.accessor as string];
							if (typeof val === 'boolean') return val ? 'true' : 'false';
							if (Array.isArray(val)) return val;
							return val ?? null;
						})(),

						onChange: (v: unknown) =>
							setColumnFilters(
								(prev) =>
									({
										...prev,
										[col.accessor as string]: v as ColumnFilterValue,
									} as Record<string, ColumnFilterValue>)
							),
					}),
					filtering: Boolean(Array.isArray(columnFilters[col.accessor as string]) && (columnFilters[col.accessor as string] as Primitive[]).length > 0),
			  }
			: col
	);

	return (
		<Box>
			{(globalSearch || buttonLabel) && (
				<Flex
					justify='flex-end'
					gap={8}
					align='center'
					mb='sm'
				>
					{globalSearch && (
						<TextInput
							placeholder='Search...'
							leftSection={<IconSearch size={16} />}
							value={search}
							onChange={(e) => setSearch(e.currentTarget.value)}
							w={250}
						/>
					)}
					{buttonLabel && (
						<Button
							onClick={onButtonClick}
							color='blue'
						>
							{buttonLabel}
						</Button>
					)}
				</Flex>
			)}

			<DataTable
				height={600}
				withTableBorder
				shadow='sm'
				striped
				highlightOnHover
				horizontalSpacing='md'
				verticalSpacing='md'
				fz='sm'
				verticalAlign='center'
				fetching={loading || pageLoading}
				loaderType='oval'
				loaderSize='md'
				loaderColor='blue'
				loaderBackgroundBlur={1}
				totalRecords={records.length}
				recordsPerPage={pageSize}
				page={page}
				onPageChange={handlePageChange}
				records={paginatedRecords}
				columns={[...enhancedColumns, actionColumn]}
				sortStatus={sortStatus}
				onSortStatusChange={setSortStatus}
				noRecordsText='No data found'
			/>
		</Box>
	);
}
