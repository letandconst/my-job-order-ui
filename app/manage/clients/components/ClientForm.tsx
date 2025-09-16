'use client';

import { TextInput } from '@mantine/core';
import { ModalMode } from '@/types/modal';

interface ClientFormProps {
	mode: ModalMode;
	data?: any;
}

export function ClientForm({ mode, data }: ClientFormProps) {
	const isView = mode === 'view';

	return (
		<>
			<TextInput
				label='Name'
				placeholder='Client name'
				mb='sm'
				defaultValue={data?.name}
				disabled={isView}
			/>
			<TextInput
				label='Email'
				placeholder='Client email'
				defaultValue={data?.email}
				disabled={isView}
			/>
		</>
	);
}
