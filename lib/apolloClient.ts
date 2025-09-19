import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { Observable } from '@apollo/client/core';
import type { GraphQLError } from 'graphql';
import { notify } from '@/utils/notifications';

type NextLink = (operation: ApolloLink.Operation) => Observable<ApolloLink.Result>;

interface ErrorResponse {
	graphQLErrors?: readonly GraphQLError[];
	networkError?: Error;
	operation: ApolloLink.Operation;
	forward?: NextLink;
}

const httpLink = new HttpLink({
	uri: `${process.env.NEXT_PUBLIC_BACKEND}/graphql`,
	credentials: 'include',
});

let isRefreshing = false;
let pending: Array<(ok: boolean) => void> = [];

function refreshToken() {
	return fetch(`${process.env.NEXT_PUBLIC_BACKEND}/graphql`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			query: `mutation { refreshToken { status message } }`,
		}),
	}).then((res) => res.json());
}

const errorLink = new ErrorLink(({ graphQLErrors, operation, forward }: ErrorResponse) => {
	if (!graphQLErrors) return;

	const unauthorized = graphQLErrors.some((err) => err.extensions?.code === 'UNAUTHENTICATED' || /Unauthorized/i.test(err.message));

	if (!unauthorized) return;

	if (!isRefreshing) {
		isRefreshing = true;
		refreshToken()
			.then((res) => {
				if (res.errors) throw new Error('Refresh failed');
				isRefreshing = false;
				pending.forEach((cb) => cb(true));
				pending = [];
			})
			.catch(async () => {
				isRefreshing = false;
				pending.forEach((cb) => cb(false));
				pending = [];

				notify('Error', 'Session expired, please log in again', 'red');

				await apolloClient.clearStore(); //  clear cache
				if (typeof window !== 'undefined') {
					window.location.href = '/auth/login'; //  redirect
				}
			});
	}

	return new Observable((observer) => {
		pending.push((ok) => {
			if (!ok) {
				observer.error(new Error('Could not refresh token'));
				return;
			}
			forward?.(operation).subscribe(observer);
		});
	});
});

export const apolloClient = new ApolloClient({
	link: ApolloLink.from([errorLink, httpLink]),
	cache: new InMemoryCache(),
});
