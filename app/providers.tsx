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
				theme={{
					fontFamily: 'Poppins, sans-serif',
				}}
			>
				<Notifications
					autoClose={2000}
					position='top-center'
					zIndex={9999}
					styles={{
						root: {
							maxWidth: 400,
							width: '100%',
							right: '0',
							position: 'absolute',
							top: '2%',
						},
					}}
				/>
				{children}
			</MantineProvider>
		</ApolloProvider>
	);
}
