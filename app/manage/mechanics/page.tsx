'use client';

import { EntityPage } from '@/components/Entity/EntityPage';

import { MechanicForm } from './components/MechanicForm';

const sampleData = [
	{ id: 1, name: 'John Doe', email: 'john@example.com' },
	{ id: 2, name: 'Jane Smith', email: 'jane@example.com' },
	{ id: 3, name: 'Alice Johnson', email: 'alice@example.com' },
	{ id: 4, name: 'Bob Williams', email: 'bob@example.com' },
	{ id: 5, name: 'Charlie Brown', email: 'charlie@example.com' },
	{ id: 6, name: 'David Miller', email: 'david@example.com' },
	{ id: 7, name: 'Eve Davis', email: 'eve@example.com' },
	{ id: 8, name: 'Frank Wilson', email: 'frank@example.com' },
	{ id: 9, name: 'Grace Lee', email: 'grace@example.com' },
	{ id: 10, name: 'Hank Taylor', email: 'hank@example.com' },
	{ id: 11, name: 'Ivy Anderson', email: 'ivy@example.com' },
	{ id: 12, name: 'Jack Thomas', email: 'jack@example.com' },
	{ id: 13, name: 'Kathy Harris', email: 'kathy@example.com' },
	{ id: 14, name: 'Leo Martin', email: 'leo@example.com' },
	{ id: 15, name: 'Mia Jackson', email: 'mia@example.com' },
	{ id: 16, name: 'Nathan White', email: 'nathan@example.com' },
	{ id: 17, name: 'Olivia Clark', email: 'olivia@example.com' },
	{ id: 18, name: 'Paul Lewis', email: 'paul@example.com' },
	{ id: 19, name: 'Quinn Robinson', email: 'quinn@example.com' },
	{ id: 20, name: 'Rachel Walker', email: 'rachel@example.com' },
	{ id: 21, name: 'Sam Young', email: 'sam@example.com' },
	{ id: 22, name: 'Tina King', email: 'tina@example.com' },
	{ id: 23, name: 'Ulysses Scott', email: 'ulysses@example.com' },
	{ id: 24, name: 'Vera Green', email: 'vera@example.com' },
	{ id: 25, name: 'Will Adams', email: 'will@example.com' },
	{ id: 26, name: 'Xander Baker', email: 'xander@example.com' },
	{ id: 27, name: 'Yara Nelson', email: 'yara@example.com' },
	{ id: 28, name: 'Zane Carter', email: 'zane@example.com' },
	{ id: 29, name: 'Amber Mitchell', email: 'amber@example.com' },
	{ id: 30, name: 'Brian Perez', email: 'brian@example.com' },
	{ id: 31, name: 'Cathy Roberts', email: 'cathy@example.com' },
	{ id: 32, name: 'Derek Turner', email: 'derek@example.com' },
	{ id: 33, name: 'Ella Phillips', email: 'ella@example.com' },
	{ id: 34, name: 'Felix Campbell', email: 'felix@example.com' },
	{ id: 35, name: 'Gina Parker', email: 'gina@example.com' },
	{ id: 36, name: 'Harry Evans', email: 'harry@example.com' },
	{ id: 37, name: 'Isla Edwards', email: 'isla@example.com' },
	{ id: 38, name: 'Jake Collins', email: 'jake@example.com' },
	{ id: 39, name: 'Lily Stewart', email: 'lily@example.com' },
	{ id: 40, name: 'Mason Sanchez', email: 'mason@example.com' },
	{ id: 41, name: 'Nora Morris', email: 'nora@example.com' },
	{ id: 42, name: 'Owen Rogers', email: 'owen@example.com' },
	{ id: 43, name: 'Piper Reed', email: 'piper@example.com' },
	{ id: 44, name: 'Quentin Cook', email: 'quentin@example.com' },
	{ id: 45, name: 'Riley Morgan', email: 'riley@example.com' },
	{ id: 46, name: 'Sophia Bell', email: 'sophia@example.com' },
	{ id: 47, name: 'Tyler Murphy', email: 'tyler@example.com' },
	{ id: 48, name: 'Uma Bailey', email: 'uma@example.com' },
	{ id: 49, name: 'Victor Rivera', email: 'victor@example.com' },
	{ id: 50, name: 'Wendy Cooper', email: 'wendy@example.com' },
	{ id: 51, name: 'Ximena Richardson', email: 'ximena@example.com' },
	{ id: 52, name: 'Yusuf Cox', email: 'yusuf@example.com' },
	{ id: 53, name: 'Zara Howard', email: 'zara@example.com' },
	{ id: 54, name: 'Aaron Ward', email: 'aaron@example.com' },
	{ id: 55, name: 'Bella Torres', email: 'bella@example.com' },
	{ id: 56, name: 'Caleb Peterson', email: 'caleb@example.com' },
	{ id: 57, name: 'Diana Gray', email: 'diana@example.com' },
	{ id: 58, name: 'Ethan Ramirez', email: 'ethan@example.com' },
	{ id: 59, name: 'Fiona James', email: 'fiona@example.com' },
	{ id: 60, name: 'George Watson', email: 'george@example.com' },
];

const columns = [
	{ accessor: 'name', title: 'Name', sortable: true },
	{ accessor: 'email', title: 'Email' },
];

export default function ClientsPage() {
	return (
		<EntityPage
			title='Mechanics'
			data={sampleData}
			columns={columns}
			FormComponent={MechanicForm}
			entityName='Mechanic'
			loading={false}
		/>
	);
}
