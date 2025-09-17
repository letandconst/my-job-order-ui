export interface CarInput {
	_id?: string;
	model: string;
	year: string;
	plateNumber: string;
}

export interface WorkRequested {
	_id?: string;
	service: {
		_id?: string;
		name: string;
	};
	price?: number;
}

export interface JobOrder {
	_id: string;
	client: string;
	car: string;
	assignedMechanic?: {
		_id?: string;
		name?: string;
	};
	workRequested: WorkRequested[];
	createdAt: string;
}

export interface ClientData {
	_id?: string;
	name: string;
	address?: string;
	birthday?: string;
	mobileNumber?: string;
	cars: CarInput[];
	lastService?: string;
	jobHistory?: JobOrder[];
}

export interface FormValues {
	_id?: string;
	name: string;
	address: string;
	birthday: string;
	mobileNumber: string;
	cars: CarInput[];
}

export interface ListClientsResponse {
	clients: {
		data: Client[];
		message: string;
		statusCode: number;
	};
}

export interface Client {
	_id: string;
	name: string;
	address: string;
	mobileNumber: string;
	birthday: string;
	cars: CarInput[];
	lastService?: string;
}

export interface CreateClientResponse {
	createClient: {
		data: Client;
		message: string;
		statusCode: number;
	};
}

export interface UpdateClientResponse {
	updateClient: {
		data: Client;
		message: string;
		statusCode: number;
	};
}
