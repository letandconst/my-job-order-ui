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
		message: string;
	};
}

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	const [tokenValid, setTokenValid] = useState<boolean>(true);

	const [resetPassword, { loading }] = useMutation<ResetPasswordResponse>(RESET_PASSWORD_MUTATION);

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
			notify('Error', 'Something went wrong. Please try again.', 'red');
			return;
		}

		try {
			const { data } = await resetPassword({
				variables: { token, newPassword: values.password },
			});

			const res = data?.resetPassword;
			if (!res) {
				notify('Error', 'Something went wrong. Please try again.', 'red');
				return;
			}

			notify('Success', res.message);
			form.reset();

			setTimeout(() => router.push('/auth/login'), 1000);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'Something went wrong.';
			setTokenValid(false);
			notify('Error', message, 'red');
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
