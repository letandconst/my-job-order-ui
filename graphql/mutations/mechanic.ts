import { gql } from '@apollo/client';

export const CREATE_MECHANIC = gql`
	mutation CreateMechanic($input: CreateMechanicInput!) {
		createMechanic(input: $input) {
			avatar
			name
			dateJoined
			phoneNumber
			birthday
			address
			emergencyContact {
				name
				phoneNumber
			}
			specialties
			bio
		}
	}
`;

export const UPDATE_MECHANIC = gql`
	mutation Mutation($input: UpdateMechanicInput!) {
		updateMechanic(input: $input) {
			avatar
			phoneNumber
			address
			emergencyContact {
				name
				phoneNumber
			}
			specialties
			bio
		}
	}
`;
