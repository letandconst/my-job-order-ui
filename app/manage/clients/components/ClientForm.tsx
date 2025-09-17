import React, { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { Box, Stack, Grid, TextInput, ActionIcon, Text, Group, Table, ScrollArea, Button, Badge } from '@mantine/core';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import { ClientData, CreateClientResponse, FormValues, UpdateClientResponse } from '@/types/client';
import { toInputDate } from '@/utils/dateFormatter';
import { CREATE_CLIENT, UPDATE_CLIENT } from '@/graphql/mutations/client';
import { useMutation } from '@apollo/client/react';
import { notify } from '@/utils/notifications';
import { LIST_CLIENTS } from '@/graphql/queries/clients';

interface ClientFormProps {
	mode: 'create' | 'edit' | 'view';
	data?: Partial<ClientData>;
	onClose?: () => void;
	onSubmittingChange?: (submitting: boolean) => void;
}

export function ClientForm({ mode, data, onClose, onSubmittingChange }: ClientFormProps) {
	const form = useForm<FormValues>({
		initialValues: {
			name: data?.name ?? '',
			address: data?.address ?? '',
			birthday: data?.birthday ? data.birthday.slice(0, 10) : '',
			mobileNumber: data?.mobileNumber ?? '',
			cars:
				data?.cars?.length && Array.isArray(data.cars)
					? data.cars.map((c) => ({
							_id: c._id,
							model: c.model ?? '',
							year: c.year ?? '',
							plateNumber: c.plateNumber ?? '',
					  }))
					: [{ model: '', year: '', plateNumber: '' }],
		},
		validate: {
			name: (val) => (val.trim().length < 3 ? 'Name must be at least 3 characters' : null),
			mobileNumber: (val) => (val.trim().length < 7 ? 'Invalid phone number' : null),
			cars: {
				model: (val: string) => (!val.trim() ? 'Model is required' : null),
				year: (val: string) => (!/^\d{4}$/.test(val) ? 'Enter a valid year (e.g., 2023)' : null),
				plateNumber: (val: string) => (!val.trim() ? 'Plate number is required' : null),
			},
		},
	});

	const [createClient] = useMutation<CreateClientResponse>(CREATE_CLIENT, {
		refetchQueries: [{ query: LIST_CLIENTS }],
	});
	const [updateClient] = useMutation<UpdateClientResponse>(UPDATE_CLIENT, {
		refetchQueries: [{ query: LIST_CLIENTS }],
	});

	const handleCreate = async () => {
		const sanitizedCars = form.values.cars.map(({ model, year, plateNumber }) => ({
			model,
			year,
			plateNumber,
		}));

		const result = await createClient({
			variables: { input: { ...form.values, cars: sanitizedCars } },
		});

		setTimeout(() => {
			if (result.data?.createClient?.statusCode === 200) {
				notify('Success', 'Client created successfully', 'green');
			} else {
				notify('Error', result.data?.createClient?.message || 'Failed to create client', 'red');
			}
		}, 1000);
	};

	const handleUpdate = async () => {
		const sanitizedCars = form.values.cars.map(({ model, year, plateNumber }) => ({
			model,
			year,
			plateNumber,
		}));

		const result = await updateClient({
			variables: {
				input: {
					clientId: data!._id,
					name: form.values.name,
					address: form.values.address,
					birthday: form.values.birthday,
					mobileNumber: form.values.mobileNumber,
					cars: sanitizedCars,
				},
			},
		});

		setTimeout(() => {
			if (result.data?.updateClient?.statusCode === 200) {
				notify('Success', 'Client updated successfully', 'green');
			} else {
				notify('Error', result.data?.updateClient?.message || 'Failed to update client', 'red');
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

			onClose?.();
		};

		window.addEventListener('form-submit', handleFormSubmit);
		return () => window.removeEventListener('form-submit', handleFormSubmit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form, mode, data, onClose, onSubmittingChange, createClient, updateClient]);

	return (
		<Box>
			<Stack gap='md'>
				{/* Row 1: Name | Birthday */}
				<Grid>
					<Grid.Col>
						<TextInput
							label='Name'
							placeholder='Enter client name'
							disabled={mode !== 'create'}
							{...form.getInputProps('name')}
						/>
					</Grid.Col>
				</Grid>

				{/* Row 2: Mobile | Address */}
				<Grid>
					<Grid.Col span={6}>
						<TextInput
							label='Mobile Number'
							placeholder='Enter mobile number'
							disabled={mode === 'view'}
							{...form.getInputProps('mobileNumber')}
						/>
					</Grid.Col>
					<Grid.Col span={6}>
						<TextInput
							label='Birthday'
							type='date'
							disabled={mode !== 'create'}
							{...form.getInputProps('birthday')}
						/>
					</Grid.Col>
				</Grid>
				<Grid>
					<Grid.Col>
						<TextInput
							label='Address'
							placeholder='Enter client address'
							disabled={mode === 'view'}
							{...form.getInputProps('address')}
						/>
					</Grid.Col>
				</Grid>

				{/* Cars Section */}
				<Stack gap='sm'>
					<Group
						justify='space-between'
						align='center'
					>
						<Text fw={500}>Cars</Text>
						{mode !== 'view' && (
							<Button
								leftSection={<IconPlus size={16} />}
								onClick={() =>
									form.insertListItem('cars', {
										model: '',
										year: '',
										plateNumber: '',
									})
								}
								variant='light'
								size='xs'
							>
								Add Car
							</Button>
						)}
					</Group>

					{mode === 'view' ? (
						<Group
							gap='xs'
							wrap='wrap'
						>
							{form.values.cars?.length ? (
								form.values.cars.map((car, index) => (
									<Badge
										key={car._id ?? index}
										variant='light'
										color='blue'
										radius='sm'
									>
										{`${car.model || '-'} ${car.year || ''}`.trim()}
									</Badge>
								))
							) : (
								<Text
									size='sm'
									c='dimmed'
								>
									No cars listed
								</Text>
							)}
						</Group>
					) : (
						<Stack gap='sm'>
							{form.values.cars.map((car, index) => (
								<Box key={car._id ?? index}>
									<Group
										align='center'
										gap='sm'
									>
										{/* Model - flexible */}
										<TextInput
											placeholder='Model'
											{...form.getInputProps(`cars.${index}.model` as const)}
											style={{ flex: 1 }}
										/>
										{/* Year - fixed width */}
										<TextInput
											placeholder='Year'
											{...form.getInputProps(`cars.${index}.year` as const)}
											style={{ width: 120 }}
											maxLength={4}
										/>
										{/* Plate number - fixed width */}
										<TextInput
											placeholder='Plate Number'
											{...form.getInputProps(`cars.${index}.plateNumber` as const)}
											style={{ width: 160 }}
										/>
										{/* Remove */}
										<ActionIcon
											color='red'
											variant='light'
											onClick={() => {
												if (form.values.cars.length > 1) {
													form.removeListItem('cars', index);
												} else {
													notify('Error', 'At least one car is required', 'red');
												}
											}}
											aria-label={`Remove car ${index + 1}`}
										>
											<IconTrash size={18} />
										</ActionIcon>
									</Group>
								</Box>
							))}
						</Stack>
					)}

					{form.values.cars.length === 0 && mode !== 'view' && (
						<Text
							size='sm'
							c='dimmed'
							ta='center'
						>
							No cars added
						</Text>
					)}
				</Stack>

				{mode === 'view' && (
					<Stack>
						<Text
							fw={600}
							size='sm'
						>
							History
						</Text>
						<ScrollArea style={{ height: 200 }}>
							<Table
								highlightOnHover
								withColumnBorders
								withTableBorder
								verticalSpacing='sm'
								horizontalSpacing='md'
							>
								<Table.Thead>
									<Table.Tr>
										<Table.Th>Car</Table.Th>
										<Table.Th>Work Requested</Table.Th>
										<Table.Th>Assigned Mechanic</Table.Th>
										<Table.Th>Date</Table.Th>
									</Table.Tr>
								</Table.Thead>

								<Table.Tbody>
									{data?.jobHistory?.length ? (
										data.jobHistory.map((job) => {
											const car = data.cars?.find((c) => c._id === job.car);
											return (
												<Table.Tr key={job._id}>
													<Table.Td>{car ? `${car.model} ${car.year}` : '-'}</Table.Td>
													<Table.Td>
														<ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
															{job.workRequested.map((wr) => (
																<li key={wr._id ?? `${job._id}-${wr.service._id}`}>{wr.service?.name ?? '-'}</li>
															))}
														</ul>
													</Table.Td>
													<Table.Td>{job.assignedMechanic?.name ?? '-'}</Table.Td>
													<Table.Td>{toInputDate(job.createdAt)}</Table.Td>
												</Table.Tr>
											);
										})
									) : (
										<Table.Tr>
											<Table.Td colSpan={4}>
												<Text
													size='sm'
													c='dimmed'
													ta='center'
												>
													No history of service
												</Text>
											</Table.Td>
										</Table.Tr>
									)}
								</Table.Tbody>
							</Table>
						</ScrollArea>
					</Stack>
				)}
			</Stack>
		</Box>
	);
}

export default ClientForm;
