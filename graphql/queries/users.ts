import { gql } from '@apollo/client';

export const GET_CURRENT_USER = gql`
	query Query {
		me {
			username
			firstName
			lastName
			email
			avatar
		}
	}
`;
