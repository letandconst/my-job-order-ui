import { gql } from '@apollo/client';

export const CREATE_CLIENT = gql`
	mutation Mutation($input: CreateClientInput!) {
		createClient(input: $input) {
			data
			message
			statusCode
		}
	}
`;

export const UPDATE_CLIENT = gql`
	mutation UpdateClient($input: UpdateClientInput!) {
		updateClient(input: $input) {
			data
			message
			statusCode
		}
	}
`;
