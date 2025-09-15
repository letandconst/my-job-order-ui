'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { TextInput, Button, Center, Paper, Stack, Title, Typography } from '@mantine/core';
import { notify } from '@/utils/notifications';
import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { RESET_PASSWORD_MUTATION } from '@/graphql/mutations/auth';
import LoadingOverlayWrapper from '@/components/LoadingOverlayWrapper';

interface ResetPasswordResponse {
	resetPassword: {
		statusCode: number;
		message: string;
	};
}

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get('token');
	const [loading, setLoading] = useState<boolean>(false);
	const [tokenValid, setTokenValid] = useState<boolean>(true);

	const [resetPassword] = useMutation(RESET_PASSWORD_MUTATION);

	const form = useForm({
		initialValues: { password: '', confirmPassword: '' },
		validate: {
			password: (value) => (value.length < 6 ? 'Password too short' : null),
			confirmPassword: (value, values) => (value !== values.password ? 'Passwords must match' : null),
		},
	});

	const handleSubmit = async (values: typeof form.values) => {
		if (!token) {
			setTokenValid(false);
			return;
		}

		try {
			setLoading(true);
			const result = await resetPassword({
				variables: { token, newPassword: values.password },
			});

			const data = result.data as ResetPasswordResponse | undefined;
			const res = data?.resetPassword;

			if (!res) return notify('Error', 'No response from server', 'red');

			if (res.statusCode === 200) {
				notify('Success', res.message);
				form.reset();

				setTimeout(() => router.push('/auth/login'), 1000);
			} else {
				setTokenValid(false);
				notify('Error', res.message || 'Failed to reset password', 'red');
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Something went wrong';
			setTokenValid(false);
			notify('Error', message, 'red');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Center h='100vh'>
			<Paper
				shadow='md'
				p='xl'
				radius='lg'
				w={600}
				withBorder
			>
				<LoadingOverlayWrapper visible={loading}>
					{tokenValid ? (
						<Stack>
							<Title
								order={2}
								ta='center'
							>
								Set your New Password
							</Title>

							<form
								onSubmit={form.onSubmit(handleSubmit)}
								style={{ position: 'relative' }}
							>
								<TextInput
									label='New Password'
									type='password'
									{...form.getInputProps('password')}
								/>
								<TextInput
									label='Confirm Password'
									type='password'
									{...form.getInputProps('confirmPassword')}
								/>
								<Button
									type='submit'
									mt='md'
									fullWidth
									loading={loading}
								>
									Reset Password
								</Button>
							</form>
						</Stack>
					) : (
						<Stack
							align='center'
							gap='md'
						>
							<Title order={3}>Link Expired</Title>
							<Typography>The reset password link has expired. Please request a new one.</Typography>
							<Button onClick={() => router.push('/auth/forgot-password')}>Request New Link</Button>
						</Stack>
					)}
				</LoadingOverlayWrapper>
			</Paper>
		</Center>
	);
}
