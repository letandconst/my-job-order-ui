import { gql } from '@apollo/client';

export const GET_PARTS = gql`
	query GetParts {
		parts {
			data
			message
			statusCode
		}
	}
`;

export const GET_LOW_STOCK_PARTS = gql`
	query LowStockParts {
		lowStockParts {
			data
			message
			statusCode
		}
	}
`;
