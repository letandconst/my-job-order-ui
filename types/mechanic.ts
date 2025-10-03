import { ModalMode } from '@/types/modal';

export interface Mechanic {
	id: string;
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
	createdAt: string;
}

export interface ListMechanicsResponse {
	mechanics: Mechanic[];
}

export interface ListMechanicResponse {
	mechanic: Mechanic;
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

export interface CreateMechanicResponse {
	createMechanic: Mechanic;
}

export interface UpdateMechanicResponse {
	updateMechanic: Mechanic;
}
