import { toDisplayDate } from '@/utils/dateFormatter';
import { Badge, Group } from '@mantine/core';

export const clientColumns = [
	{
		accessor: 'name',
		title: 'Name',
	},
	{
		accessor: 'address',
		title: 'Address',
	},
	{
		accessor: 'mobileNumber',
		title: 'Mobile Number',
	},
	{
		accessor: 'cars',
		title: 'Cars',
		render: (row: { cars?: { model: string; year: string; _id: string }[] }) => (
			<Group
				gap='xs'
				wrap='wrap'
			>
				{row.cars?.map((car) => (
					<Badge
						key={car._id}
						variant='light'
						color='blue'
						radius='sm'
					>
						{`${car.model} ${car.year}`}
					</Badge>
				))}
			</Group>
		),
	},
	{
		accessor: 'lastService',
		title: 'Last Service',
		sortable: true,
		render: (row: { lastService: string | Date | undefined }) => toDisplayDate(row.lastService),
	},
];
