import { gql } from '@apollo/client';

export const LIST_MECHANICS = gql`
	query Mechanics {
		mechanics {
			id
			avatar
			name
			phoneNumber
			specialties
			address
			createdAt
		}
	}
`;

export const LIST_MECHANIC = gql`
	query Mechanic($mechanicId: ID!) {
		mechanic(id: $mechanicId) {
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
