import { gql } from '@apollo/client';

export const GET_CURRENT_USER = gql`
	query currentUser {
		me {
			data
			message
			statusCode
		}
	}
`;
