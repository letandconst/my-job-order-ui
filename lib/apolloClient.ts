'use client';

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
	link: new HttpLink({
		uri: process.env.NEXT_PUBLIC_FRONTEND + '/graphql',
		credentials: 'include',
	}),
	cache: new InMemoryCache(),
});
