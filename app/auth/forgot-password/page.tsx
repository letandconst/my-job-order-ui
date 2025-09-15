'use client';

import { useMutation } from '@apollo/client/react';
import { useForm } from '@mantine/form';
import { TextInput, Button, Paper, Stack, Title, Center, Typography, ActionIcon, Flex } from '@mantine/core';
import { FORGOT_PASSWORD_MUTATION } from '@/graphql/mutations/auth';
import LoadingOverlayWrapper from '@/components/LoadingOverlayWrapper';
import { IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

import { notify } from '@/utils/notifications';

interface ForgotPasswordResponse {
	forgotPassword: {
		data: string | null;
		message: string;
		statusCode: number;
	};
}

export default function ForgotPasswordPage() {
	const router = useRouter();
	const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD_MUTATION);

	const form = useForm({
		initialValues: { email: '' },
		validate: {
			email: (value) => {
				if (!value) return 'Email is required';

				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(value)) return 'Please enter a valid email';
				return null;
			},
		},
	});

	const handleSubmit = async (values: typeof form.values) => {
		try {
			const result = await forgotPassword({ variables: { email: values.email } });

			const data = result.data as ForgotPasswordResponse | undefined;
			const res = data?.forgotPassword;

			if (!res) return notify('Error', 'No response from server', 'red');

			if (res.statusCode === 200) {
				notify('Success', res.message);
				form.reset();
			} else {
				notify('Error', res.message || 'Request failed', 'red');
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Something went wrong';
			notify('Error', message, 'red');
		}
	};
	return (
		<LoadingOverlayWrapper visible={loading}>
			<Center h='100vh'>
				<Paper
					shadow='md'
					p='xl'
					radius='lg'
					w={600}
					withBorder
				>
					<Stack>
						<Flex
							gap='sm'
							align='center'
						>
							<ActionIcon
								variant='transparent'
								size='xl'
								onClick={() => router.back()}
								style={{ alignSelf: 'start' }}
							>
								<IconArrowLeft size={24} />
							</ActionIcon>
							<Title
								order={2}
								ta='center'
							>
								Forgot Your Password?
							</Title>
						</Flex>

						<Typography>No worries—we’ve all been there. Just enter your email address below, and we’ll send you a secure link to reset your password.</Typography>

						<form onSubmit={form.onSubmit(handleSubmit)}>
							<Stack>
								<TextInput {...form.getInputProps('email')} />
								<Button
									type='submit'
									loading={loading}
									fullWidth
								>
									Send Reset Link
								</Button>
							</Stack>
						</form>
					</Stack>
				</Paper>
			</Center>
		</LoadingOverlayWrapper>
	);
}
