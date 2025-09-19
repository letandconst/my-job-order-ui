import { Badge, Select, Table, Button, Popover } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { text } from 'stream/consumers';

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
			<Select
				label='Categories'
				placeholder='Search categories…'
				data={['Preventive Maintenance', 'Underchassis & Suspension', 'Engine & Drivetrain Repair', 'Electrical & Electronics', 'Air Conditioning (A/C)', 'Body Repair & Paint', 'Auto Detailing & Appearance', 'Upgrades & Accessories']}
				comboboxProps={{ withinPortal: true, position: 'bottom-end' }}
				clearable
				rightSection={<IconChevronDown size={16} />}
				searchable
			/>
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
				rightSection={<IconChevronDown size={16} />}
			/>
		),
	},
	{
		accessor: 'amount',
		textAlign: 'center',
		title: 'Amount ( per car type )',
		render: (record: { id: string | number; amount: Record<string, number> }) => {
			return (
				<Popover
					width={250}
					position='bottom'
					withArrow
					shadow='md'
				>
					<Popover.Target>
						<Button
							variant='light'
							size='xs'
						>
							View Prices
						</Button>
					</Popover.Target>
					<Popover.Dropdown>
						<Table
							striped
							highlightOnHover
							withColumnBorders
						>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Car Type</Table.Th>
									<Table.Th>Price (₱)</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{Object.entries(record.amount).map(([type, price]) => (
									<Table.Tr key={type}>
										<Table.Td style={{ textTransform: 'capitalize' }}>{type}</Table.Td>
										<Table.Td>{price?.toLocaleString() ?? '-'}</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</Popover.Dropdown>
				</Popover>
			);
		},
	},
];
