import { useEffect, useRef, useState } from 'react';
import { TextInput, Textarea, Stack, Grid, Group, Badge, Text, Avatar, ActionIcon, rem } from '@mantine/core';
import { TagsInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_MECHANIC, UPDATE_MECHANIC } from '@/graphql/mutations/mechanic';
import { CreateMechanicResponse, ListMechanicResponse, UpdateMechanicResponse } from '@/types/mechanic';
import { IconPencil } from '@tabler/icons-react';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { notify } from '@/utils/notifications';

import { toInputDate, toDisplayDate } from '@/utils/dateFormatter';
import { LIST_MECHANIC, LIST_MECHANICS } from '@/graphql/queries/mechanics';
import { ModalMode } from '@/types/modal';

interface MechanicFormProps {
	mode: ModalMode;
	id?: string;
	onClose?: () => void;
	onSubmittingChange?: (submitting: boolean) => void;
}

export function MechanicForm({ mode, id, onClose, onSubmittingChange }: MechanicFormProps) {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string>('');
	const { uploadFile } = useCloudinaryUpload();

	const { data } = useQuery<ListMechanicResponse>(LIST_MECHANIC, {
		variables: { mechanicId: id },
		skip: !id || mode === 'create',
	});

	const mechanic = data?.mechanic;

	const form = useForm({
		initialValues: {
			name: '',
			phoneNumber: '',
			birthday: '',
			address: '',
			emergencyContactName: '',
			emergencyContactPhone: '',
			bio: '',
			specialties: [] as string[],
			avatar: '',
			dateJoined: '',
		},
		validate: {
			name: (val) => (val.trim().length < 2 ? 'Name must be at least 3 characters' : null),
			phoneNumber: (val) => (val.trim().length < 7 ? 'Invalid phone number' : null),
			address: (val) => (!val || val.trim() === '' ? 'Address is required' : null),
			emergencyContactName: (val) => (!val || val.trim() === '' ? 'Emergency contact name is required' : null),
			emergencyContactPhone: (val) => (!val || val.trim().length < 7 ? 'Invalid emergency contact phone' : null),
			dateJoined: (val) => (!val ? 'Date joined is required' : null),
			birthday: (val) => (!val ? 'Birthday is required' : null),
		},
	});

	const initials = form.values.name
		? form.values.name
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase()
		: '';

	const [createMechanic] = useMutation<CreateMechanicResponse>(CREATE_MECHANIC, {
		refetchQueries: [{ query: LIST_MECHANICS }],
		awaitRefetchQueries: true,
	});
	const [updateMechanic] = useMutation<UpdateMechanicResponse>(UPDATE_MECHANIC, {
		refetchQueries: [{ query: LIST_MECHANICS }],
		awaitRefetchQueries: true,
	});

	useEffect(() => {
		if (mechanic) {
			form.setValues({
				name: mechanic.name ?? '',
				phoneNumber: mechanic.phoneNumber ?? '',
				birthday: toInputDate(mechanic.birthday) ?? '',
				address: mechanic.address ?? '',
				emergencyContactName: mechanic.emergencyContact?.name ?? '',
				emergencyContactPhone: mechanic.emergencyContact?.phoneNumber ?? '',
				bio: mechanic.bio ?? '',
				specialties: mechanic.specialties ?? [],
				avatar: mechanic.avatar ?? '',
				dateJoined: toInputDate(mechanic.dateJoined) ?? '',
			});
			setAvatarPreview(mechanic.avatar ?? '');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mechanic]);

	useEffect(() => {
		const handleFormSubmit = async () => {
			const validation = form.validate();
			if (validation.hasErrors) return;

			onSubmittingChange?.(true);

			try {
				const avatarUrl = await uploadAvatarIfNeeded();
				if (mode === 'create') {
					await handleCreate(avatarUrl);
				} else if (mode === 'edit' && id) {
					await handleUpdate(avatarUrl);
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
	}, [form, mode, data, avatarFile, createMechanic, updateMechanic, onClose]);

	// --- Helpers --- //
	const uploadAvatarIfNeeded = async (): Promise<string> => {
		if (!avatarFile) return form.values.avatar;
		try {
			const avatarUrl = await uploadFile(avatarFile, 'avatars');
			if (!avatarUrl) throw new Error('Avatar upload failed');
			return avatarUrl;
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Unknown error';
			notify('Error', `Avatar upload failed: ${message}`, 'red');
			throw err;
		}
	};

	// --- Helpers --- //

	const handleCreate = async (avatarUrl: string) => {
		try {
			const { data } = await createMechanic({
				variables: {
					input: {
						...form.values,
						avatar: avatarUrl,
					},
				},
			});

			if (data?.createMechanic) {
				setTimeout(() => {
					notify('Success', 'Mechanic created successfully', 'green');
				}, 200);
			} else {
				notify('Error', 'Failed to create mechanic', 'red');
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Unknown error';
			notify('Error', `Something went wrong: ${message}`, 'red');
		}
	};

	const handleUpdate = async (avatarUrl: string) => {
		try {
			const { data } = await updateMechanic({
				variables: {
					input: {
						id,
						phoneNumber: form.values.phoneNumber,
						address: form.values.address,
						emergencyContactName: form.values.emergencyContactName,
						emergencyContactPhone: form.values.emergencyContactPhone,
						bio: form.values.bio,
						avatar: avatarUrl,
						specialties: form.values.specialties,
					},
				},
			});

			if (data?.updateMechanic) {
				setTimeout(() => {
					notify('Success', 'Mechanic updated successfully', 'green');
				}, 200);
			} else {
				notify('Error', 'Failed to update mechanic', 'red');
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Unknown error';
			notify('Error', `Something went wrong: ${message}`, 'red');
		}
	};

	return (
		<Stack gap='md'>
			{/* Avatar + Name */}
			<Stack
				align='center'
				gap='md'
			>
				<div style={{ position: 'relative', display: 'inline-block' }}>
					<Avatar
						src={avatarPreview || form.values.avatar}
						radius='md'
						size={80}
						color='blue'
					>
						{initials}
					</Avatar>

					{(mode === 'edit' || mode === 'create') && (
						<ActionIcon
							variant='filled'
							color='blue'
							radius='xl'
							size='lg'
							style={{
								position: 'absolute',
								bottom: 0,
								right: 0,
								transform: 'translate(25%, 25%)',
							}}
							onClick={() => fileInputRef.current?.click()}
						>
							<IconPencil style={{ width: rem(16), height: rem(16) }} />
						</ActionIcon>
					)}

					<input
						ref={fileInputRef}
						type='file'
						hidden
						accept='image/*'
						onChange={(e) => {
							if (e.target.files?.[0]) {
								setAvatarFile(e.target.files[0]);
								setAvatarPreview(URL.createObjectURL(e.target.files[0]));
							}
						}}
					/>
				</div>
			</Stack>

			{/* Details */}
			<Grid>
				{mode === 'view' ? (
					<>
						<Grid.Col span={6}>
							<Text
								fw={600}
								size='lg'
							>
								{form.values.name}
							</Text>
						</Grid.Col>
						<Grid.Col span={6}>
							<Text
								fw={600}
								size='lg'
							>
								Joined: {toDisplayDate(form.values.dateJoined)}
							</Text>
						</Grid.Col>
					</>
				) : (
					<>
						<Grid.Col span={6}>
							<TextInput
								label='Name'
								placeholder='Enter full name'
								disabled={mode !== 'create'}
								{...form.getInputProps('name')}
								error={form.errors.name}
							/>
						</Grid.Col>
						<Grid.Col span={6}>
							<TextInput
								label='Date Joined'
								type='date'
								disabled={mode !== 'create'}
								{...form.getInputProps('dateJoined')}
								error={form.errors.dateJoined}
							/>
						</Grid.Col>
					</>
				)}
				<Grid.Col span={6}>
					<TextInput
						label='Phone Number'
						placeholder='Enter phone number'
						disabled={mode !== 'edit' && mode !== 'create'}
						{...form.getInputProps('phoneNumber')}
						error={form.errors.phoneNumber}
					/>
				</Grid.Col>
				<Grid.Col span={6}>
					<TextInput
						label='Birthday'
						type='date'
						disabled={mode !== 'create'}
						{...form.getInputProps('birthday')}
						error={form.errors.birthday}
					/>
				</Grid.Col>
				<Grid.Col span={12}>
					<TextInput
						label='Address'
						placeholder='Enter address'
						disabled={mode !== 'edit' && mode !== 'create'}
						{...form.getInputProps('address')}
						error={form.errors.address}
					/>
				</Grid.Col>
			</Grid>

			{/* Emergency Contact */}
			<Grid>
				<Grid.Col span={6}>
					<TextInput
						label='Emergency Contact Name'
						disabled={mode !== 'create' && mode === 'view'}
						{...form.getInputProps('emergencyContactName')}
						error={form.errors.emergencyContactName}
					/>
				</Grid.Col>
				<Grid.Col span={6}>
					<TextInput
						label='Emergency Contact Phone'
						disabled={mode !== 'create' && mode === 'view'}
						{...form.getInputProps('emergencyContactPhone')}
						error={form.errors.emergencyContactPhone}
					/>
				</Grid.Col>
			</Grid>

			{/* Specialties */}
			<Stack gap='xs'>
				<Text
					size='sm'
					fw={500}
				>
					Specialties
				</Text>
				{mode === 'view' ? (
					<Group
						gap='xs'
						wrap='wrap'
					>
						{form.values.specialties.length > 0 ? (
							form.values.specialties.map((s, i) => (
								<Badge
									key={i}
									variant='light'
									color='blue'
								>
									{s}
								</Badge>
							))
						) : (
							<Text
								size='sm'
								c='dimmed'
							>
								No specialties listed
							</Text>
						)}
					</Group>
				) : (
					<TagsInput
						placeholder='Add specialties'
						splitChars={[',']}
						clearable
						{...form.getInputProps('specialties')}
					/>
				)}
			</Stack>

			{/* Bio */}
			<Textarea
				label='Bio'
				placeholder='Enter bio'
				autosize
				minRows={2}
				disabled={mode === 'view'}
				{...form.getInputProps('bio')}
			/>
		</Stack>
	);
}
