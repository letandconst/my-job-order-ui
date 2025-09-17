import './globals.css';
import type { Metadata } from 'next';
import Providers from './providers';
import { ColorSchemeScript } from '@mantine/core';
import { Poppins } from 'next/font/google';
import '@mantine/core/styles.css';
import 'mantine-datatable/styles.layer.css';

import { AppWrapper } from '@/components/AppWrapper';

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	variable: '--font-poppins',
});

export const metadata: Metadata = {
	title: 'Dashboard',
	description: 'Job Order Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang='en'
			className={poppins.className}
		>
			<head>
				<meta
					name='viewport'
					content='minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no'
				/>
				<ColorSchemeScript />
			</head>
			<body>
				<Providers>
					<AppWrapper>{children}</AppWrapper>
				</Providers>
			</body>
		</html>
	);
}
