import { useForm } from '@mantine/form';
import { TextInput, Stack, Text, Switch, Select, Group, Textarea, Table } from '@mantine/core';
import { CreateServiceResponse, ServiceType, UpdateServiceResponse } from '@/types/serviceType';
import { IconChevronDown } from '@tabler/icons-react';
import { useMutation } from '@apollo/client/react';
import { LIST_SERVICES } from '@/graphql/queries/serviceTypes';
import { CREATE_SERVICE_TYPE, UPDATE_SERVICE_TYPE } from '@/graphql/mutations/serviceTypes';
import { notify } from '@/utils/notifications';
import { useEffect } from 'react';

const categories = [
	{ value: 'Preventive Maintenance', label: 'Preventive Maintenance' },
	{ value: 'Underchassis & Suspension', label: 'Underchassis & Suspension' },
	{ value: 'Engine & Drivetrain Repair', label: 'Engine & Drivetrain Repair' },
	{ value: 'Electrical & Electronics', label: 'Electrical & Electronics' },
	{ value: 'Air Conditioning (A/C)', label: 'Air Conditioning (A/C)' },
	{ value: 'Body Repair & Paint', label: 'Body Repair & Paint' },
	{ value: 'Auto Detailing & Appearance', label: 'Auto Detailing & Appearance' },
	{ value: 'Upgrades & Accessories', label: 'Upgrades & Accessories' },
];

interface ServiceTypeFormProps {
	mode: 'create' | 'edit' | 'view';
	data?: ServiceType;
	onClose?: () => void;
	onSubmittingChange?: (loading: boolean) => void;
}

export function ServiceTypeForm({ mode, data, onClose, onSubmittingChange }: ServiceTypeFormProps) {
	const form = useForm({
		initialValues: {
			name: data?.name ?? '',
			description: data?.description ?? '',
			category: data?.category ?? '',
			isActive: data?.isActive ?? true,
			amount: {
				sedan: data?.amount?.sedan ?? 0,
				hatchback: data?.amount?.hatchback ?? 0,
				crossover: data?.amount?.crossover ?? 0,
				suv: data?.amount?.suv ?? 0,
				pickup: data?.amount?.pickup ?? 0,
			},
		},
		validate: {
			name: (value) => (!value ? 'Service name is required' : null),
			category: (value, values, mode) => (mode === 'create' && !value ? 'Category is required' : null),
			amount: (value, values, mode) => {
				if (!value) return null;

				// Check if user actually changed any amount
				const hasChanged = Object.entries(value).some(([type, val]) => {
					const original = data?.amount?.[type as keyof typeof data.amount];
					// Only consider changed if val is different AND user explicitly typed something
					return val !== undefined && val !== null && val !== original;
				});

				// Check if at least one non-zero value exists
				const hasValue = Object.values(value).some((v) => v !== undefined && v !== null && v > 0);

				if (mode === 'create' && !hasValue) {
					return 'At least one car type amount must be provided';
				}

				if (mode === 'edit' && hasChanged && !hasValue) {
					return 'At least one car type amount must be provided';
				}

				return null;
			},
		},
	});

	const readOnly = mode === 'view';

	const [createService] = useMutation<CreateServiceResponse>(CREATE_SERVICE_TYPE, {
		refetchQueries: [{ query: LIST_SERVICES }],
	});
	const [updateService] = useMutation<UpdateServiceResponse>(UPDATE_SERVICE_TYPE, {
		refetchQueries: [{ query: LIST_SERVICES }],
	});

	const handleCreate = async () => {
		const result = await createService({
			variables: {
				input: {
					name: form.values.name,
					category: form.values.category,
					description: form.values.description,
					isActive: form.values.isActive,
					amount: form.values.amount,
				},
			},
		});

		setTimeout(() => {
			if (result.data?.createServiceType?.statusCode === 200) {
				notify('Success', 'Service created successfully', 'green');
			} else {
				notify('Error', result.data?.createServiceType?.message || 'Failed to create service', 'red');
			}
		}, 1000);
	};

	const handleUpdate = async () => {
		const result = await updateService({
			variables: {
				input: {
					serviceTypeId: data!._id,
					category: form.values.category,
					description: form.values.description,
					isActive: form.values.isActive,
					amount: form.values.amount,
				},
			},
		});

		console.log('result', result);

		setTimeout(() => {
			if (result.data?.updateServiceType?.statusCode === 200) {
				notify('Success', 'Service updated successfully', 'green');
			} else {
				notify('Error', result.data?.updateServiceType?.message || 'Failed to update service', 'red');
			}
		}, 1000);
	};

	useEffect(() => {
		const handleFormSubmit = async () => {
			if (!form.isValid()) return;
			onSubmittingChange?.(true);

			try {
				if (mode === 'create') {
					await handleCreate();
				} else if (mode === 'edit' && data?._id) {
					await handleUpdate();
				}
				onClose?.();
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Unknown error';
				notify('Error', `Something went wrong: ${message}`, 'red');
				console.error(err);
			} finally {
				onSubmittingChange?.(false);
			}
		};

		window.addEventListener('form-submit', handleFormSubmit);
		return () => window.removeEventListener('form-submit', handleFormSubmit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form, mode, data, onClose, onSubmittingChange, createService, updateService]);

	return (
		<>
			<Stack gap='sm'>
				<TextInput
					label='Name'
					placeholder='Service name'
					disabled={mode !== 'create'}
					{...form.getInputProps('name')}
				/>

				<Textarea
					label='Description'
					placeholder='Service description'
					disabled={readOnly}
					autosize
					minRows={2}
					value={readOnly ? form.values.description || '-' : form.values.description}
				/>

				<Select
					label='Category'
					placeholder='Select category'
					checkIconPosition='right'
					data={categories}
					disabled={readOnly}
					searchable
					allowDeselect={false}
					clearable
					rightSection={<IconChevronDown size={16} />}
					{...form.getInputProps('category')}
				/>
			</Stack>
			{mode !== 'view' && (
				<Switch
					mt='md'
					label='Active'
					disabled={readOnly}
					checked={form.values.isActive}
					onChange={(e) => form.setFieldValue('isActive', e.currentTarget.checked)}
				/>
			)}
			{readOnly ? (
				<Stack
					mt='md'
					gap='xs'
				>
					<Text fw={500}>Amount ( per car type )</Text>
					<Table
						striped
						highlightOnHover
						withColumnBorders
					>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Car Type</Table.Th>
								<Table.Th>Price (₱)</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{Object.entries(form.values.amount).map(([key, value]) => (
								<Table.Tr key={key}>
									<Table.Td style={{ textTransform: 'capitalize' }}>{key}</Table.Td>
									<Table.Td>{typeof value === 'number' ? value.toLocaleString() : '-'}</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</Stack>
			) : (
				<>
					<Group
						grow
						mt='md'
					>
						<TextInput
							label='Sedan'
							{...form.getInputProps('amount.sedan')}
						/>
						<TextInput
							label='Hatchback'
							{...form.getInputProps('amount.hatchback')}
						/>
					</Group>

					<Group
						grow
						mt='md'
					>
						<TextInput
							label='Crossover'
							{...form.getInputProps('amount.crossover')}
						/>
						<TextInput
							label='SUV'
							{...form.getInputProps('amount.suv')}
						/>
					</Group>

					<TextInput
						mt='md'
						label='Pickup'
						{...form.getInputProps('amount.pickup')}
					/>
				</>
			)}
		</>
	);
}
