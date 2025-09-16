import { toDisplayDate } from '@/utils/dateFormatter';
import { Badge, Group } from '@mantine/core';

export const mechanicColumns = [
	{
		accessor: 'avatar',
		title: 'Avatar',
		render: (row: { avatar: string; name: string }) => (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				src={row.avatar || '/Portrait.png'}
				alt={row.name}
				width={40}
				height={40}
				style={{ borderRadius: '50%' }}
			/>
		),
	},
	{
		accessor: 'name',
		title: 'Name',
		sortable: true,
	},
	{
		accessor: 'phoneNumber',
		title: 'Phone Number',
	},
	{
		accessor: 'specialties',
		title: 'Specialties',
		render: (row: { specialties?: string[] }) => (
			<Group
				gap='xs'
				wrap='wrap'
			>
				{row.specialties?.map((specialty, index) => (
					<Badge
						key={index}
						variant='light'
						color='blue'
						radius='sm'
					>
						{specialty}
					</Badge>
				))}
			</Group>
		),
	},
	{
		accessor: 'address',
		title: 'Address',
	},
	{
		accessor: 'dateJoined',
		title: 'Date Joined',
		sortable: true,
		render: (row: { dateJoined: string | Date | undefined }) => toDisplayDate(row.dateJoined),
	},
];
