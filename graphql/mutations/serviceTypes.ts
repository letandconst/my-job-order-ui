import { gql } from '@apollo/client';

export const CREATE_SERVICE_TYPE = gql`
	mutation CreateServiceType($input: CreateServiceTypeInput!) {
		createServiceType(input: $input) {
			data
			message
			statusCode
		}
	}
`;

export const UPDATE_SERVICE_TYPE = gql`
	mutation UpdateServiceType($input: UpdateServiceTypeInput!) {
		updateServiceType(input: $input) {
			data
			message
			statusCode
		}
	}
`;
