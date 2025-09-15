'use client';

import { useMutation } from '@apollo/client/react';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Paper, Stack, Title, Text, Group, Center, rem } from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';
import Link from 'next/link';

import { LOGIN_MUTATION } from '@/graphql/mutations/auth';
import { notify } from '@/utils/notifications';
import { useRouter } from 'next/navigation';

import LoadingOverlayWrapper from '@/components/LoadingOverlayWrapper';

interface LoginResponse {
	login: {
		statusCode: number;
		message: string;
	};
}

interface LoginVariables {
	email?: string | null;
	username?: string | null;
	password: string;
}

export default function LoginPage() {
	const router = useRouter();
	const [login, { loading }] = useMutation(LOGIN_MUTATION);

	const form = useForm({
		initialValues: {
			identifier: '',
			password: '',
		},

		validate: (values) => {
			const errors: Record<string, string> = {};

			// Check identifier
			if (!values.identifier) {
				errors.identifier = 'Email or username is required';
			} else {
				// If it looks like an email, validate format
				if (values.identifier.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.identifier)) {
					errors.identifier = 'Please enter a valid email';
				}
			}

			// Check password
			if (!values.password) {
				errors.password = 'Password is required';
			}

			return errors;
		},
	});

	const handleSubmit = async (values: typeof form.values) => {
		try {
			const variables: LoginVariables = {
				email: values.identifier.includes('@') ? values.identifier : null,
				username: values.identifier.includes('@') ? null : values.identifier,
				password: values.password,
			};

			const result = await login({ variables });
			const data = result.data as LoginResponse | undefined;
			const res = data?.login;

			if (!res) return notify('Error', 'No response from server', 'red');

			if (res.statusCode === 200) {
				notify('Welcome', res.message);
				form.reset();
				// Short delay so user can see notification
				setTimeout(() => {
					router.push('/');
				}, 1000);
			} else {
				notify('Error', res.message || 'Login failed', 'red');
				form.reset();
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
					<Stack
						align='center'
						gap='sm'
					>
						<IconUsers
							size={48}
							stroke={1.5}
							color='white'
							style={{ background: '#48CAE4', borderRadius: '50%', padding: rem(8) }}
						/>
						<Title order={3}>Auto Care Center</Title>
						<Text
							c='dimmed'
							size='sm'
						>
							Sign in to your account
						</Text>
					</Stack>

					<form
						onSubmit={form.onSubmit(handleSubmit)}
						style={{ position: 'relative' }}
					>
						<Stack mt='md'>
							<TextInput
								label='Email or Username'
								placeholder='Enter your email or username'
								{...form.getInputProps('identifier')}
							/>
							<PasswordInput
								label='Password'
								placeholder='Enter your password'
								{...form.getInputProps('password')}
							/>

							<Group
								justify='flex-end'
								mt='xs'
							>
								<Link href='/auth/forgot-password'>
									<Text
										size='sm'
										c='blue'
										fw={500}
									>
										Forgot password?
									</Text>
								</Link>
							</Group>

							<Button
								type='submit'
								loading={loading}
								fullWidth
								mt='md'
							>
								Sign In
							</Button>
						</Stack>
					</form>
				</Paper>
			</Center>
		</LoadingOverlayWrapper>
	);
}
