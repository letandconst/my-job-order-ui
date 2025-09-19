export interface Part {
	_id: string;
	name: string;
	description: string;
	category: string;
	brand: string;
	condition: string;
	unit: string;
	stock: number;
	reorderLevel: number;
	price: number;
	isActive: boolean;
	supplier: string;
	images?: string[] | null;
}

export interface ListPartsResponse {
	parts: {
		data: Part[];
		message: string;
		statusCode: number;
	};
}

export interface CreatePartResponse {
	createPart: {
		data: Part[];
		message: string;
		statusCode: number;
	};
}

export interface UpdatePartResponse {
	updatePart: {
		data: Part;
		message: string;
		statusCode: number;
	};
}
