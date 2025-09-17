import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				port: '', // leave empty
				pathname: '/**', // allow all paths under this host
			},
		],
	},
};

export default nextConfig;
