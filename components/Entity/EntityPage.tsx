'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { ReusableDataTable } from '@/components/DataTable/Datatable';
import { ReusableModal } from '@/components/PageModal/Modal';
import { ModalState } from '@/types/modal';
import type { DataTableColumn } from 'mantine-datatable';

type FormComponentProps<T> = {
	mode: 'create' | 'edit' | 'view';
	data?: T;
	onClose?: () => void;
	onSubmittingChange?: React.Dispatch<React.SetStateAction<boolean>>;
};

interface EntityPageProps<T extends { _id: string | number }> {
	title: string;
	data: T[];
	columns: DataTableColumn<T>[];
	FormComponent: React.ComponentType<FormComponentProps<T>>;
	entityName: string;
	pageSize?: number;
	loading: boolean;
}

export function EntityPage<T extends { _id: string | number }>({ title, data, loading, columns, FormComponent, entityName, pageSize = 10 }: EntityPageProps<T>) {
	const [modal, setModal] = useState<ModalState<T>>({
		opened: false,
		mode: 'create',
	});

	const [submitting, setSubmitting] = useState<boolean>(false);

	const handleAddClick = () => setModal({ opened: true, mode: 'create' });
	const handleAction = (action: 'view' | 'edit', row: T) => setModal({ opened: true, mode: action, rowData: row });
	const handleClose = () => {
		setModal((prev) => ({ ...prev, opened: false }));

		setTimeout(() => {
			setModal({ opened: false, mode: 'create', rowData: undefined });
		}, 300);
	};

	return (
		<>
			<PageHeader title={title} />

			<ReusableDataTable
				loading={loading}
				data={data}
				columns={columns}
				pageSize={pageSize}
				onAction={handleAction}
				buttonLabel={`Add New ${entityName}`}
				onButtonClick={handleAddClick}
			/>

			<ReusableModal
				opened={modal.opened}
				onClose={handleClose}
				title={modal.mode === 'create' ? `New ${entityName}` : modal.mode === 'edit' ? `Edit ${entityName}` : `View ${entityName}`}
				showFooter={modal.mode !== 'view'}
				saveButtonText={submitting ? 'Saving...' : modal.mode === 'create' ? 'Create' : 'Update'}
				saveButtonColor='green'
				onSave={() => {
					const event = new Event('form-submit');
					window.dispatchEvent(event);
				}}
				size='xl'
			>
				<FormComponent
					mode={modal.mode}
					data={modal.rowData}
					onClose={handleClose}
					onSubmittingChange={setSubmitting}
				/>
			</ReusableModal>
		</>
	);
}
