import { Badge, Select } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

export const partsColumns = [
	{ accessor: 'name', header: 'Name' },
	{ accessor: 'category', header: 'Category' },
	{ accessor: 'brand', header: 'Brand' },
	{
		accessor: 'condition',
		header: 'Condition',
		render: (record: { condition: string }) => <Badge color={record.condition === 'new' ? 'blue' : 'gray'}>{record.condition.toUpperCase()}</Badge>,
		filter: (
			<Select
				label='Condition'
				placeholder='Select Condition'
				data={[
					{ value: 'new', label: 'New' },
					{ value: 'used', label: 'Used' },
				]}
				clearable
				comboboxProps={{ withinPortal: true, position: 'bottom-end' }}
				rightSection={<IconChevronDown size={16} />}
			/>
		),
	},
	{ accessor: 'stock', header: 'Stock' },
	{ accessor: 'unit', header: 'Unit' },
	{ accessor: 'price', header: 'Price' },
	{
		accessor: 'isActive',
		title: 'Status',
		render: (record: { isActive: boolean }) => (record.isActive ? <Badge color='green'>Active</Badge> : <Badge color='red'>Inactive</Badge>),
		filter: (
			<Select
				label='Status'
				placeholder='Select Status'
				data={[
					{ value: 'true', label: 'Active' },
					{ value: 'false', label: 'Inactive' },
				]}
				clearable
				comboboxProps={{ withinPortal: true, position: 'bottom-end' }}
				rightSection={<IconChevronDown size={16} />}
			/>
		),
	},
];
