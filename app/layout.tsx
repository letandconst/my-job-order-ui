import './globals.css';
import type { Metadata } from 'next';
import Providers from './providers';
import { Poppins } from 'next/font/google';
import '@mantine/core/styles.css';

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
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
