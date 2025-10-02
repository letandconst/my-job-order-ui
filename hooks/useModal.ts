import { useState } from 'react';

export type ModalMode = 'create' | 'edit' | 'view';

export interface ModalState<T> {
	opened: boolean;
	mode: ModalMode;
	id?: string;
}

export function useModal<T>() {
	const [modal, setModal] = useState<ModalState<T>>({
		opened: false,
		mode: 'create',
	});

	const openModal = (mode: ModalMode, id?: string) => {
		setModal({ opened: true, mode, id });
	};

	const closeModal = () => {
		setModal((prev) => ({ ...prev, opened: false, id: undefined }));
	};

	return {
		modal,
		setModal,
		openModal,
		closeModal,
	};
}
