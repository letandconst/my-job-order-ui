export interface ServiceType {
	_id: string;
	name: string;
	description?: string;
	category: string;
	isActive: boolean;
	amount: {
		sedan?: number;
		hatchback?: number;
		crossover?: number;
		suv?: number;
		pickup?: number;
	};
}

export interface ServiceTypeResponse {
	services: {
		data: ServiceType[];
		message: string;
		statusCode: number;
	};
}
