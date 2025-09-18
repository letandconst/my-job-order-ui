'use client';

import { useEffect, useState } from 'react';
import { DataTable, type DataTableSortStatus, type DataTableColumn } from 'mantine-datatable';
import { Box, TextInput, Group, ActionIcon, Button, Flex } from '@mantine/core';
import { IconSearch, IconEye, IconEdit, IconFilter } from '@tabler/icons-react';
import React from 'react';
import { useDebouncedValue } from '@mantine/hooks';

interface ReusableDataTableProps<T extends { _id: string | number }> {
	data: T[];
	columns: DataTableColumn<T>[];
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
	const [debouncedSearch] = useDebouncedValue(search, 400);
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
		columnAccessor: 'createdAt' as keyof T,
		direction: 'desc',
	});
	const [records, setRecords] = useState<T[]>([]);
	const [pageLoading, setPageLoading] = useState(false);
	const [filterLoading, setFilterLoading] = useState(false);
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

		const applyFilterAndSort = async () => {
			setPageLoading(true);

			await new Promise((resolve) => setTimeout(resolve, 400));

			let filtered = [...data];

			// Global search
			if (debouncedSearch) {
				filtered = filtered.filter((item) => Object.values(item).some((value) => value?.toString().toLowerCase().includes(debouncedSearch.toLowerCase())));
			}

			// Column filters
			Object.entries(columnFilters).forEach(([key, value]) => {
				if (!value || (Array.isArray(value) && value.length === 0)) return;

				filtered = filtered.filter((item) => {
					// Reduce safely through nested keys
					const cellValue = key.split('.').reduce<Primitive | Record<string, Primitive> | undefined>((acc, k) => {
						if (acc === undefined) return undefined;
						if (typeof acc === 'object' && acc !== null) {
							return (acc as Record<string, Primitive>)[k];
						}
						return undefined;
					}, item as Record<string, Primitive>);

					// Boolean filter for isActive
					if (key === 'isActive') {
						if (Array.isArray(value)) {
							return value.some((v) => cellValue === (v === 'true'));
						}
						return cellValue === (value === 'true');
					}

					// Array filters (multi-select)
					if (Array.isArray(value)) {
						return value.includes(cellValue as Primitive);
					}

					// Single value filter
					return cellValue === value;
				});
			});

			// Sorting
			if (sortStatus.columnAccessor) {
				filtered = nativeSort(filtered, sortStatus.columnAccessor as keyof T, sortStatus.direction);
			}

			setRecords(filtered);
			setPage(1);
			setPageLoading(false);
			setFilterLoading(false);
		};

		applyFilterAndSort();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, debouncedSearch, sortStatus, columnFilters, loading]);

	// simulate backend page fetch
	const handlePageChange = (newPage: number) => {
		setPageLoading(true);
		setTimeout(() => {
			setPage(newPage);
			setPageLoading(false);
		}, 400);
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

	// enhanced columns with automatic filter integration
	const enhancedColumns = columns.map((col) => {
		if (!col.filter) return col;

		// Check if this column has an active filter
		const isFiltering = Array.isArray(columnFilters[col.accessor as string]) ? (columnFilters[col.accessor as string] as Primitive[]).length > 0 : columnFilters[col.accessor as string] !== undefined && columnFilters[col.accessor as string] !== null;

		return {
			...col,
			filter: React.cloneElement(col.filter as React.ReactElement<{ value?: unknown; onChange?: (v: unknown) => void }>, {
				value: (() => {
					const val = columnFilters[col.accessor as string];
					if (typeof val === 'boolean') return val ? 'true' : 'false';
					if (Array.isArray(val)) return val;
					return val ?? null;
				})(),
				onChange: (v: unknown) =>
					setColumnFilters((prev) => ({
						...prev,
						[col.accessor as string]: v as ColumnFilterValue,
					})),
			}),
			// Here we can add a colored indicator on the filter icon
			Header: () => (
				<Flex
					align='center'
					gap={4}
				>
					<Box>{col.title}</Box>
					<ActionIcon
						size='sm'
						variant='subtle'
						color={isFiltering ? 'blue' : 'gray'}
					>
						<IconFilter size={14} />
					</ActionIcon>
				</Flex>
			),
			filtering: isFiltering,
		};
	});

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
				fetching={loading || pageLoading || filterLoading}
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
