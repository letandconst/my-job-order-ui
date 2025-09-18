import { useForm } from '@mantine/form';
import { TextInput, Stack, Text, Switch, Select, Group, Textarea } from '@mantine/core';
import { ServiceType } from '@/types/serviceType';
import { IconChevronDown } from '@tabler/icons-react';

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
	onSubmit?: (values: ServiceType) => Promise<void> | void;
}

export function ServiceTypeForm({ mode, data, onClose, onSubmittingChange, onSubmit }: ServiceTypeFormProps) {
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
		validate: (values) => {
			const errors: Record<string, string> = {};

			if (!values.name) {
				errors.name = 'Service name is required';
			}

			if (!values.category) {
				errors.category = 'Category is required';
			}

			(Object.keys(values.amount) as Array<keyof typeof values.amount>).forEach((key) => {
				if (values.amount[key]! < 0) {
					errors[`amount.${key}`] = 'Must be 0 or more';
				}
			});

			return errors;
		},
	});

	const readOnly = mode === 'view';

	return (
		<>
			<Stack gap='sm'>
				<TextInput
					label='Name'
					placeholder='Service name'
					readOnly={readOnly}
					{...form.getInputProps('name')}
				/>

				<Textarea
					label='Description'
					placeholder='Optional description'
					readOnly={readOnly}
					autosize
					minRows={2}
					{...form.getInputProps('description')}
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
					<Text fw={500}>Amount</Text>
					{Object.entries(form.values.amount).map(([key, value]) => (
						<Text
							key={key}
							size='sm'
						>
							{key}: {value}
						</Text>
					))}
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
