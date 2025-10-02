'use client';

import { useMutation } from '@apollo/client/react';
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Paper, Stack, Title, Text, Group, Center, rem } from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';

import { notify } from '@/utils/notifications';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import LoadingOverlayWrapper from '@/components/LoadingOverlayWrapper';
import { GET_CURRENT_USER } from '@/graphql/queries/users';
import { LOGIN_MUTATION } from '@/graphql/mutations/auth';

interface LoginResponse {
	login: {
		message: string;
		user: {
			firstName: string;
			lastName: string;
			avatar: string;
			email: string | null;
		};
	};
}

export default function LoginPage() {
	const router = useRouter();
	const [login, { loading }] = useMutation<LoginResponse>(LOGIN_MUTATION);

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
			const variables = values.identifier.includes('@') ? { email: values.identifier, username: null, password: values.password } : { username: values.identifier, email: null, password: values.password };

			const { data } = await login({
				variables,
				refetchQueries: [{ query: GET_CURRENT_USER }],
				awaitRefetchQueries: true,
			});

			const res = data?.login;

			if (res?.user) {
				notify('Welcome', res.message || 'Login successful');
				router.push('/');
			} else {
				notify('Login failed', res?.message || 'Incorrect username or password', 'red');
				form.reset();
			}
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'Login failed.';
			notify('Error', message, 'red');
			form.reset();
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
