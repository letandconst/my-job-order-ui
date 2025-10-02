import { Badge, Group } from '@mantine/core';
import Image from 'next/image';
import portraitImg from '@/public/Portrait.png';

export const mechanicColumns = [
	{
		accessor: 'avatar',
		title: 'Avatar',
		render: (row: { avatar: string; name: string }) => (
			<Image
				src={row.avatar || portraitImg}
				alt={row.name}
				width={40}
				height={40}
				style={{ borderRadius: '6px' }}
				priority={false}
			/>
		),
	},
	{
		accessor: 'name',
		title: 'Name',
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
];
