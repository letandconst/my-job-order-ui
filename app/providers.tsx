'use client';

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { apolloClient } from '@/lib/apolloClient';

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<ApolloProvider client={apolloClient}>
			<MantineProvider
				withGlobalClasses
				defaultColorScheme='light'
			>
				<Notifications position='top-right' />
				{children}
			</MantineProvider>
		</ApolloProvider>
	);
}
