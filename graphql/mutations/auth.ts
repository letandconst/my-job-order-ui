import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
	mutation Mutation($firstName: String!, $lastName: String!, $username: String!, $email: String!, $password: String!) {
		register(firstName: $firstName, lastName: $lastName, username: $username, email: $email, password: $password) {
			data
			message
			statusCode
		}
	}
`;

export const LOGIN_MUTATION = gql`
	mutation Login($email: String, $username: String, $password: String!) {
		login(email: $email, username: $username, password: $password) {
			data
			message
			statusCode
		}
	}
`;

export const REFRESH_TOKEN_MUTATION = gql`
	mutation RefreshToken {
		refreshToken {
			data
			message
			statusCode
		}
	}
`;

export const LOGOUT_MUTATION = gql`
	mutation Logout {
		logout {
			data
			message
			statusCode
		}
	}
`;

export const FORGOT_PASSWORD_MUTATION = gql`
	mutation ForgotPassword($email: String!) {
		forgotPassword(email: $email) {
			data
			message
			statusCode
		}
	}
`;

export const RESET_PASSWORD_MUTATION = gql`
	mutation ResetPassword($token: String!, $newPassword: String!) {
		resetPassword(token: $token, newPassword: $newPassword) {
			data
			message
			statusCode
		}
	}
`;
