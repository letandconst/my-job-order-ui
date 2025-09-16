import { ModalMode } from '@/types/modal';

export interface Mechanic {
	_id: string;
	name: string;
	phoneNumber: string;
	address: string;
	birthday: string;
	bio: string;
	avatar: string | null;
	specialties: string[];
	emergencyContact: {
		name: string;
		phoneNumber: string;
	};
	dateJoined: string;
}

export interface ListMechanicsResponse {
	listMechanics: {
		data: Mechanic[];
		message: string;
		statusCode: number;
	};
}

export interface MechanicFormProps {
	mode: ModalMode;
	data?: {
		name: string;
		phoneNumber: string;
		address: string;
		birthday: string;
		bio: string;
		avatar: string | null;
		specialties: string[];
		emergencyContact: {
			name: string;
			phoneNumber: string;
		};
		dateJoined: string;
	};
}

export interface CreateMechanicResponse {
	createMechanic: {
		data: Mechanic;
		message: string;
		statusCode: number;
	};
}

export interface MechanicFormState {
	name: string;
	phoneNumber: string;
	birthday: string;
	address: string;
	emergencyContactName: string;
	emergencyContactPhone: string;
	bio: string;
	specialties: string[];
}

export interface UpdateMechanicResponse {
	updateMechanic: {
		data: Mechanic;
		message: string;
		statusCode: number;
	};
}
