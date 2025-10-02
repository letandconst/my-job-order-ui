import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
	mutation Register($firstName: String!, $lastName: String!, $username: String!, $email: String!, $password: String!) {
		register(firstName: $firstName, lastName: $lastName, username: $username, email: $email, password: $password) {
			message
			user {
				firstName
				lastName
			}
		}
	}
`;

export const LOGIN_MUTATION = gql`
	mutation Mutation($password: String!, $username: String, $email: String) {
		login(password: $password, username: $username, email: $email) {
			message
			token
			user {
				firstName
				lastName
				email
				avatar
			}
		}
	}
`;

export const REFRESH_TOKEN_MUTATION = gql`
	mutation RefreshToken {
		refreshToken {
			message
		}
	}
`;

export const LOGOUT_MUTATION = gql`
	mutation Logout {
		logout {
			message
		}
	}
`;

export const FORGOT_PASSWORD_MUTATION = gql`
	mutation ForgotPassword($email: String!) {
		forgotPassword(email: $email) {
			message
		}
	}
`;

export const RESET_PASSWORD_MUTATION = gql`
	mutation ResetPassword($token: String!, $newPassword: String!) {
		resetPassword(token: $token, newPassword: $newPassword) {
			message
		}
	}
`;

export const UPDATE_PROFILE_MUTATION = gql`
	mutation UpdateProfile {
		updateProfile {
			message
			token
			user {
				id
			}
		}
	}
`;
