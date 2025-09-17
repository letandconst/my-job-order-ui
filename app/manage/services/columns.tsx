import { Badge, MultiSelect, Select, Stack, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export const serviceTypeColumns = [
	{
		accessor: 'name',
		title: 'Name',
		sortable: true,
	},
	{
		accessor: 'category',
		title: 'Category',
		filter: (
			<MultiSelect
				label='Categories'
				placeholder='Search categories…'
				data={['Preventive Maintenance', 'Underchassis & Suspension', 'Engine & Drivetrain Repair', 'Electrical & Electronics', 'Air Conditioning (A/C)', 'Body Repair & Paint', 'Auto Detailing & Appearance', 'Upgrades & Accessories']}
				leftSection={<IconSearch size={16} />}
				comboboxProps={{ withinPortal: false }}
				clearable
				searchable
			/>
		),
	},
	{
		accessor: 'amount',
		title: 'Amount',
		render: (record: { amount: { [s: string]: unknown } | ArrayLike<unknown> }) => (
			<Stack gap='sm'>
				{Object.entries(record.amount).map(([key, value]) => (
					<Text
						key={key}
						size='sm'
						style={{ textTransform: 'capitalize' }}
					>
						<strong>{key}:</strong> {value?.toLocaleString() ?? '-'}
					</Text>
				))}
			</Stack>
		),
	},
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
			/>
		),
	},
];
