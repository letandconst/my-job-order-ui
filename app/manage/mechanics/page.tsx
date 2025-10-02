'use client';

import { MechanicForm } from './components/MechanicForm';
import { mechanicColumns } from './columns';
import { LIST_MECHANICS } from '@/graphql/queries/mechanics';
import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { DataTableColumn } from 'mantine-datatable';
import { ListMechanicsResponse, Mechanic } from '@/types/mechanic';
import { BaseTable, TableAction } from '@/components/DataTable/BaseTable';
import { Button, Group, Select, TextInput } from '@mantine/core';
import { IconDownload, IconFilter, IconPencil, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { BaseModal } from '@/components/PageModal/Modal';
import { useModal } from '@/hooks/useModal';
import { useDebouncedValue } from '@mantine/hooks';

const specialtyOptions = ['Engine Repair', 'Transmission', 'Electrical Systems', 'Brakes', 'Suspension', 'Air Conditioning', 'Diagnostics', 'Welding', 'Wheel Alignment', 'Hybrid Vehicles', 'Diesel Engines', 'Body and Paint'];

export default function MechanicsPage() {
	const { data, loading } = useQuery<ListMechanicsResponse>(LIST_MECHANICS, {
		fetchPolicy: 'cache-first',
	});
	const { modal, openModal, closeModal } = useModal<{ id: string }>();

	const [search, setSearch] = useState<string>('');
	const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null);
	const [mechanics, setMechanics] = useState<Mechanic[]>([]);
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [debouncedSearch] = useDebouncedValue(search, 300);
	const [fetching, setFetching] = useState<boolean>(false);
	const [filteredMechanics, setFilteredMechanics] = useState<Mechanic[]>([]);

	const rowActions: TableAction<Mechanic>[] = [
		{
			label: 'Edit',
			icon: <IconPencil size={16} />,
			onClick: (row) => openModal('edit', row.id),
		},
		{
			label: 'Delete',
			icon: <IconTrash size={16} />,
			onClick: (row) => alert(`Delete ${row.id}`),
		},
	];

	useEffect(() => {
		if (data?.mechanics) {
			setMechanics(data.mechanics);
			setFilteredMechanics(data.mechanics);
		}
	}, [data]);

	useEffect(() => {
		setFetching(true);

		const timer = setTimeout(() => {
			const filtered = mechanics.filter((m) => {
				const matchesSearch = m.name.toLowerCase().includes(debouncedSearch.toLowerCase());

				const matchesSpecialty = !specialtyFilter || m.specialties.includes(specialtyFilter);

				return matchesSearch && matchesSpecialty;
			});

			setFilteredMechanics(filtered);
			setFetching(false);
		}, 200);

		return () => clearTimeout(timer);
	}, [mechanics, debouncedSearch, specialtyFilter]);

	return (
		<>
			<BaseTable
				title='Mechanics'
				description='Manage your mechanic details'
				headerButtons={
					<Group gap='sm'>
						{/* 🔍 Search filter */}
						<TextInput
							placeholder='Search mechanic...'
							leftSection={<IconSearch size={16} />}
							value={search}
							onChange={(e) => setSearch(e.currentTarget.value)}
						/>

						{/* 📊 Status filter */}
						<Select
							placeholder='Filter by specialty'
							data={specialtyOptions}
							value={specialtyFilter}
							onChange={setSpecialtyFilter}
							clearable
							leftSection={<IconFilter size={16} />}
							w={250}
						/>

						{/* 📂 Export button */}
						<Button
							onClick={() => console.log('click export')}
							leftSection={<IconDownload size={16} />}
						>
							Export
						</Button>

						{/* ➕ Add button */}
						<Button
							color='green'
							onClick={() => openModal('create')}
							leftSection={<IconPlus size={16} />}
						>
							Add Mechanic
						</Button>
					</Group>
				}
				columns={mechanicColumns as DataTableColumn<Mechanic>[]}
				data={filteredMechanics}
				onView={(row) => openModal('view', row.id)}
				rowActions={rowActions}
				fetching={loading || fetching}
			/>

			<BaseModal
				opened={modal.opened}
				onClose={closeModal}
				title={modal.mode === 'create' ? `New Mechanic` : modal.mode === 'edit' ? `Edit Mechanic` : `View Mechanic`}
				showFooter={modal.mode !== 'view'}
				saveButtonText={submitting ? 'Saving...' : modal.mode === 'create' ? 'Create' : 'Update'}
				saveButtonColor='green'
				onSave={() => {
					const event = new Event('form-submit');
					window.dispatchEvent(event);
				}}
				size='xl'
			>
				<MechanicForm
					mode={modal.mode}
					id={modal.id}
					onClose={closeModal}
					onSubmittingChange={setSubmitting}
				/>
			</BaseModal>
		</>
	);
}
