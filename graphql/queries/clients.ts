import { gql } from '@apollo/client';

export const LIST_CLIENTS = gql`
	query Clients {
		clients {
			data
			message
			statusCode
		}
	}
`;
