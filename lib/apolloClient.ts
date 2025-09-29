import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, Observable } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors, CombinedProtocolErrors } from '@apollo/client/errors';
import { REFRESH_TOKEN_MUTATION } from '@/graphql/mutations/auth';
import Router from 'next/router';

// --------------------
// Token Refresh Helpers
// --------------------
let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

const resolvePendingRequests = () => {
	pendingRequests.forEach((cb) => cb());
	pendingRequests = [];
};

let apolloClient: ApolloClient | null = null;
// --------------------
// Error Link
// --------------------
const errorLink = new ErrorLink(({ error, operation, forward }) => {
	if (CombinedGraphQLErrors.is(error)) {
		for (const err of error.errors) {
			console.log(`[GraphQL error]: Message: ${err.message}, Path: ${err.path}`);

			if (err.extensions?.code === 'UNAUTHENTICATED') {
				if (!isRefreshing) {
					isRefreshing = true;

					return new Observable((observer) => {
						apolloClient!
							.mutate({ mutation: REFRESH_TOKEN_MUTATION })
							.then(() => {
								isRefreshing = false;
								resolvePendingRequests();

								const subscriber = forward(operation).subscribe({
									next: (result) => observer.next(result),
									error: (err) => observer.error(err),
									complete: () => observer.complete(),
								});

								return () => subscriber.unsubscribe();
							})
							.catch(() => {
								isRefreshing = false;
								alert('Your session has expired. Please log in again.');
								Router.push('/auth/login');
								observer.complete();
							});
					});
				}

				// Queue requests until refresh finishes
				return new Observable((observer) => {
					pendingRequests.push(() => {
						const subscriber = forward(operation).subscribe({
							next: (result) => observer.next(result),
							error: (err) => observer.error(err),
							complete: () => observer.complete(),
						});
						return () => subscriber.unsubscribe();
					});
				});
			}
		}
	} else if (CombinedProtocolErrors.is(error)) {
		for (const err of error.errors) {
			console.log(`[Protocol error]: Message: ${err.message}, Extensions: ${JSON.stringify(err.extensions)}`);
		}
	} else {
		console.error(`[Network error]: ${error}`);
	}
});

// --------------------
// Http Link
// --------------------
const httpLink = new HttpLink({
	uri: process.env.NEXT_PUBLIC_BACKEND + '/graphql',
	credentials: 'include',
});

// --------------------
// Apollo Client
// --------------------
apolloClient = new ApolloClient({
	link: ApolloLink.from([errorLink, httpLink]),
	cache: new InMemoryCache(),
});

export default apolloClient;
