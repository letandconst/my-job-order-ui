'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { ReusableDataTable } from '@/components/DataTable/Datatable';
import { ReusableModal } from '@/components/PageModal/Modal';
import { ModalMode, ModalState } from '@/types/modal';
import type { DataTableColumn } from 'mantine-datatable';

interface EntityPageProps<T extends { id: string | number }> {
	title: string;
	data: T[];
	columns: DataTableColumn<T>[];
	FormComponent: React.ComponentType<{ mode: ModalMode; data?: T }>;
	entityName: string;
	pageSize?: number;
	loading: boolean;
}

export function EntityPage<T extends { id: string | number }>({ title, data, loading, columns, FormComponent, entityName, pageSize = 10 }: EntityPageProps<T>) {
	const [modal, setModal] = useState<ModalState<T>>({
		opened: false,
		mode: 'create',
	});

	const handleAddClick = () => setModal({ opened: true, mode: 'create' });
	const handleAction = (action: 'view' | 'edit', row: T) => setModal({ opened: true, mode: action, rowData: row });
	const handleClose = () => setModal({ opened: false, mode: 'create' });
	const handleSave = () => {
		console.log(`${modal.mode === 'create' ? 'Creating' : 'Updating'} ${entityName}`, modal.rowData);
		handleClose();
	};

	return (
		<>
			<PageHeader title={title} />

			<ReusableDataTable
				data={data}
				columns={columns}
				pageSize={pageSize}
				onAction={handleAction}
				loading={loading}
				buttonLabel={`Add New ${entityName}`}
				onButtonClick={handleAddClick}
			/>

			<ReusableModal
				opened={modal.opened}
				onClose={handleClose}
				title={modal.mode === 'create' ? `New ${entityName}` : modal.mode === 'edit' ? `Edit ${entityName}` : `View ${entityName}`}
				showFooter={modal.mode !== 'view'}
				saveButtonText={modal.mode === 'create' ? 'Create' : 'Update'}
				saveButtonColor='green'
				onSave={handleSave}
				size='lg'
			>
				<FormComponent
					mode={modal.mode}
					data={modal.rowData}
				/>
			</ReusableModal>
		</>
	);
}
