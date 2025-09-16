'use client';

import { ReactNode } from 'react';
import { Modal, Group, Button, type MantineSize } from '@mantine/core';

interface ReusableModalProps {
	opened: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	showFooter?: boolean;
	saveButtonText?: string;
	saveButtonColor?: string;
	onSave?: () => void;
	size?: MantineSize | string;
}

export function ReusableModal({ opened, onClose, title, children, showFooter = true, saveButtonText = 'Save', saveButtonColor = 'blue', onSave, size = 'md' }: ReusableModalProps) {
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={title}
			centered
			size={size}
			overlayProps={{
				backgroundOpacity: 0.45,
				blur: 2,
			}}
		>
			{/* Body */}
			{children}

			{/* Footer */}
			{showFooter && (
				<Group
					justify='flex-end'
					mt='lg'
				>
					<Button
						variant='default'
						onClick={onClose}
					>
						Cancel
					</Button>
					<Button
						color={saveButtonColor}
						onClick={onSave}
					>
						{saveButtonText}
					</Button>
				</Group>
			)}
		</Modal>
	);
}
