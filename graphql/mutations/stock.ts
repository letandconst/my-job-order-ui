import { gql } from '@apollo/client';

export const CREATE_STOCK_TRANSACTION = gql`
	mutation CreateStockTransaction($input: CreateStockTransactionInput!) {
		createStockTransaction(input: $input) {
			statusCode
			message
			success
			data {
				_id
				part {
					_id
					name
				}
				type
				quantity
				unit
				reference
				remarks
				createdAt
			}
		}
	}
`;
