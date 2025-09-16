import { gql } from '@apollo/client';

export const LIST_MECHANICS = gql`
	query Query {
		listMechanics {
			data
			message
			statusCode
		}
	}
`;
