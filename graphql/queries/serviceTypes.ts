import { gql } from '@apollo/client';

export const LIST_SERVICES = gql`
	query Query {
		services {
			data
			message
			statusCode
		}
	}
`;
