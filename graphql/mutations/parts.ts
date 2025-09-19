import { gql } from '@apollo/client';

export const CREATE_PART = gql`
	mutation CreatePart($input: CreatePartInput!) {
		createPart(input: $input) {
			data
			message
			statusCode
		}
	}
`;

export const UPDATE_PART = gql`
	mutation UpdatePart($id: ID!, $input: UpdatePartInput!) {
		updatePart(id: $id, input: $input) {
			data
			message
			statusCode
		}
	}
`;

export const DELETE_PART = gql`
	mutation DeletePart($id: ID!) {
		deletePart(id: $id) {
			data
			message
			statusCode
		}
	}
`;

export const ADD_STOCK = gql`
	mutation AddStock($id: ID!, $quantity: Int!) {
		addStock(id: $id, quantity: $quantity) {
			data
			message
			statusCode
		}
	}
`;

export const CONSUME_STOCK = gql`
	mutation ConsumeStock($id: ID!, $quantity: Int!, $jobOrderId: ID) {
		consumeStock(id: $id, quantity: $quantity, jobOrderId: $jobOrderId) {
			data
			message
			statusCode
		}
	}
`;

export const ADD_STOCK_BATCH = gql`
	mutation AddStockBatch($updates: [StockUpdateInput!]!) {
		addStockBatch(updates: $updates) {
			data
			message
			statusCode
		}
	}
`;

export const CONSUME_STOCK_BATCH = gql`
	mutation ConsumeStockBatch($updates: [StockUpdateInput!]!, $jobOrderId: ID) {
		consumeStockBatch(updates: $updates, jobOrderId: $jobOrderId) {
			data
			message
			statusCode
		}
	}
`;
