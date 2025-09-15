'use client';
import { ReactNode } from 'react';
import { LoadingOverlay } from '@mantine/core';

interface LoadingOverlayWrapperProps {
	children: ReactNode;
	visible: boolean;
}

export default function LoadingOverlayWrapper({ children, visible }: LoadingOverlayWrapperProps) {
	return (
		<div style={{ position: 'relative' }}>
			<LoadingOverlay
				visible={visible}
				overlayProps={{ radius: 'sm', blur: 2 }}
			/>
			{children}
		</div>
	);
}
