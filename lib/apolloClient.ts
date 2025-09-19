'use client';

import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, Observable, gql } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors, CombinedProtocolErrors } from '@apollo/client/errors';
import { SetContextLink } from '@apollo/client/link/context';
import { REFRESH_TOKEN_MUTATION } from '@/graphql/mutations/auth';
import Router from 'next/router';

// Create the main HTTP link
const httpLink = new HttpLink({
	uri: process.env.NEXT_PUBLIC_BACKEND + '/graphql',
	credentials: 'include',
});

// Create the SetContextLink
const authLink = new SetContextLink((prevContext, operation) => {
	return {
		headers: {
			...prevContext.headers,
		},
	};
});

// Create the ErrorLink
const errorLink = new ErrorLink(({ error, operation, forward }) => {
	if (CombinedGraphQLErrors.is(error)) {
		for (const err of error.errors) {
			console.log(`[GraphQL error]: Message: ${err.message}, Path: ${err.path}`);

			// Handle expired or invalid access token
			if (err.message.includes('Session expired') || err.message.includes('invalid token')) {
				// Use forward inside an observable to retry the operation
				return new ApolloLink((op, fwd) => {
					return new Observable((observer) => {
						apolloClient
							.mutate({ mutation: REFRESH_TOKEN_MUTATION })
							.then(() => {
								const subscriber = fwd(op).subscribe({
									next: (result) => observer.next(result),
									error: (err) => observer.error(err),
									complete: () => observer.complete(),
								});
								return () => subscriber.unsubscribe();
							})
							.catch(() => {
								Router.push('/auth/login'); // Redirect if refresh fails
								observer.complete();
							});
					});
				}).request(operation, forward);
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

// Combine the links into a single chain
export const apolloClient = new ApolloClient({
	link: ApolloLink.from([authLink, errorLink, httpLink]),
	cache: new InMemoryCache(),
});
