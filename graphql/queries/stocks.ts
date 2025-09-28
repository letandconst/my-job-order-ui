import { gql } from '@apollo/client';

export const GET_STOCK_TRANSACTIONS = gql`
	query Query {
		stockTransactions {
			part {
				name
				unit
			}
			quantity
			type
			balanceAfter
			createdBy {
				firstName
			}
		}
	}
`;
