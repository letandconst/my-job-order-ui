'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Grid, Avatar, Button, TextInput, PasswordInput, SimpleGrid, Group, Skeleton } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useUser } from '@/hooks/useUser';
import { notify } from '@/utils/notifications';
import { useMutation } from '@apollo/client/react';
import { UPDATE_PROFILE_MUTATION } from '@/graphql/mutations/auth';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader/PageHeader';

interface UpdateProfileResponse {
	updateProfile: {
		message: string;
	};
}

export default function ProfilePage() {
	const { user, refetchUser } = useUser();
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { uploadFile } = useCloudinaryUpload();
	const [updateProfile, { loading }] = useMutation<UpdateProfileResponse>(UPDATE_PROFILE_MUTATION);
	const router = useRouter();
	const [avatarRemoved, setAvatarRemoved] = useState<boolean>(false);

	const form = useForm({
		initialValues: {
			email: '',
			password: '',
		},
	});

	const handleSubmit = async (values: typeof form.values) => {
		if (!user) return;

		let avatarUrl: string | undefined;

		// Upload avatar first
		if (avatarFile) {
			avatarUrl = await uploadFile(avatarFile, 'avatars');
			if (!avatarUrl) {
				notify('Error', 'Avatar upload failed', 'red');
				return;
			}
		}

		try {
			const { data } = await updateProfile({
				variables: {
					email: values.email,
					password: values.password || undefined,
					avatar: avatarPreview,
				},
			});

			const res = data?.updateProfile;

			if (!res) {
				notify('Error', 'Something went wrong. Please try again.', 'red');
				return;
			}
			notify('Success', res.message);
			refetchUser();

			// Reset password field and file input
			form.setFieldValue('password', '');
			setAvatarFile(null);
			setAvatarPreview(null);
			if (fileInputRef.current) fileInputRef.current.value = '';
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Profile update failed';
			notify('Error', message, 'red');
		}
	};

	useEffect(() => {
		if (user) {
			form.setFieldValue('email', user.email ?? '');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	return (
		<Box
			style={{
				margin: '0 auto',
				bg: 'white',
				maxWidth: '1200px',
			}}
		>
			<PageHeader title='Edit Profile' />

			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Grid grow>
					{/* Left: Avatar */}
					<Grid.Col
						span={2}
						style={{ display: 'flex', flexDirection: 'column' }}
					>
						{!user ? (
							<Skeleton
								height='250px'
								width='250px'
								radius='xl'
							/>
						) : (
							<Avatar
								src={avatarRemoved ? null : avatarPreview || user?.avatar}
								alt='User Avatar'
								size={240}
								radius='xl'
								name={`${user?.firstName} ${user?.lastName}`}
							/>
						)}

						<Button
							variant='outline'
							mt='md'
							component='label'
							w={240}
						>
							Upload New Profile Picture
							<input
								ref={fileInputRef}
								type='file'
								hidden
								onChange={(e) => {
									if (e.target.files?.[0]) {
										setAvatarFile(e.target.files[0]);
										setAvatarPreview(URL.createObjectURL(e.target.files[0]));
									}
								}}
							/>
						</Button>
						{user?.avatar || avatarPreview ? (
							<Button
								variant='outline'
								color='red'
								mt='sm'
								w={240}
								onClick={() => {
									setAvatarFile(null);
									setAvatarPreview(null);
									setAvatarRemoved(true);
									if (fileInputRef.current) {
										fileInputRef.current.value = '';
									}
								}}
							>
								Remove Profile Picture
							</Button>
						) : null}
					</Grid.Col>

					{/* Right: Profile Fields */}
					<Grid.Col span={8}>
						<SimpleGrid
							cols={2}
							spacing='md'
						>
							<TextInput
								label='First Name'
								value={user?.firstName ?? ''}
								disabled
							/>
							<TextInput
								label='Last Name'
								value={user?.lastName ?? ''}
								disabled
							/>
						</SimpleGrid>

						<TextInput
							label='Username'
							value={user?.username ?? ''}
							mt='md'
							disabled
						/>
						<TextInput
							label='Email'
							placeholder='Email'
							{...form.getInputProps('email')}
							mt='md'
						/>
						<PasswordInput
							label='Password'
							placeholder='New password'
							{...form.getInputProps('password')}
							mt='md'
						/>

						<Group
							mt='xl'
							gap='md'
							justify='flex-end'
						>
							<Button
								type='submit'
								loading={loading}
							>
								Update Profile
							</Button>
							<Button
								variant='outline'
								color='gray'
								onClick={() => {
									form.reset();
									setAvatarFile(null);
									setAvatarPreview(null);
									if (fileInputRef.current) fileInputRef.current.value = '';
									router.push('/');
								}}
							>
								Cancel
							</Button>
						</Group>
					</Grid.Col>
				</Grid>
			</form>
		</Box>
	);
}
