import { gql } from '@apollo/client';

export const CREATE_MECHANIC = gql`
	mutation CreateMechanic($input: CreateMechanicInput!) {
		createMechanic(input: $input) {
			data
			message
			statusCode
		}
	}
`;

export const UPDATE_MECHANIC = gql`
	mutation UpdateMechanic($updateMechanicId: ID!, $address: String, $phoneNumber: String, $emergencyContactName: String, $emergencyContactPhone: String, $bio: String, $avatar: String, $specialties: [String]) {
		updateMechanic(id: $updateMechanicId, address: $address, phoneNumber: $phoneNumber, emergencyContactName: $emergencyContactName, emergencyContactPhone: $emergencyContactPhone, bio: $bio, avatar: $avatar, specialties: $specialties) {
			data
			message
			statusCode
		}
	}
`;
