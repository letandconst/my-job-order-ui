// Shared modal type for all pages
export type ModalMode = 'create' | 'edit' | 'view';

export interface ModalState<T = any> {
	opened: boolean;
	mode: ModalMode;
	rowData?: T;
}
