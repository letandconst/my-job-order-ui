import { CreatePartResponse, Part, UpdatePartResponse } from '@/types/part';
import { Grid, NumberInput, Text, Select, Stack, Switch, Textarea, TextInput, Image } from '@mantine/core';
import { useForm } from '@mantine/form';

import { useEffect, useState } from 'react';
import { inventoryUnits, partCategories } from '../data';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Carousel } from '@mantine/carousel';
import { useMutation } from '@apollo/client/react';
import { CREATE_PART, UPDATE_PART } from '@/graphql/mutations/parts';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { notify } from '@/utils/notifications';
import { GET_PARTS } from '@/graphql/queries/parts';

interface InventoryFormProps {
	mode: 'create' | 'edit' | 'view';
	data?: Part;
	onClose?: () => void;
	onSubmittingChange?: (loading: boolean) => void;
}

const unitOptions = inventoryUnits.map((group) => ({
	group: group.group,
	items: group.units.map((unit) => unit.name),
}));

const categoryOptions = partCategories.map((group) => ({
	group: group.group,
	items: group.categories,
}));

export function InventoryForm({ mode, data, onClose, onSubmittingChange }: InventoryFormProps) {
	const [createPart] = useMutation<CreatePartResponse>(CREATE_PART, {
		refetchQueries: [{ query: GET_PARTS }],
	});
	const [updatePart] = useMutation<UpdatePartResponse>(UPDATE_PART, {
		refetchQueries: [{ query: GET_PARTS }],
	});

	const form = useForm({
		initialValues: {
			name: data?.name ?? '',
			description: data?.description ?? '',
			category: data?.category ?? '',
			brand: data?.brand ?? '',
			condition: data?.condition ?? '',
			unit: data?.unit ?? '',
			stock: data?.stock ?? 0,
			reorderLevel: data?.reorderLevel ?? 0,
			price: data?.price ?? 0,
			isActive: data?.isActive ?? true,
		},
		validate: {
			name: (val) => (!val ? 'Part name is required' : null),
			category: (val) => (!val ? 'Category is required' : null),
			brand: (val) => (!val ? 'Brand is required' : null),
			condition: (val) => (!val ? 'Condition is required' : null),
			unit: (val) => (!val ? 'Unit is required' : null),
			stock: (val: number) => (!val ? 'Stock is required' : null),
			reorderLevel: (val: number) => (val < 0 ? 'Reorder level cannot be negative' : null),
			price: (val: number) => (!val ? 'Price is required' : null),
		},
	});

	const [images, setImages] = useState<FileWithPath[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);

	const { uploadFile } = useCloudinaryUpload();

	const handleCreate = async () => {
		if (!form.isValid()) return;

		try {
			// Upload images to Cloudinary
			const uploadedImages = await Promise.all(
				images.map(async (file) => {
					const url = await uploadFile(file, 'parts');
					return url ? { url, alt: file.name } : null;
				})
			);
			const validImages = uploadedImages.filter((img) => img !== null);

			const sanitizedInput = {
				...form.values,
				price: Number(form.values.price),
				stock: Number(form.values.stock),
				reorderLevel: Number(form.values.reorderLevel),
				condition: form.values.condition?.toLowerCase() || 'new',
				images: validImages,
			};

			const result = await createPart({
				variables: { input: sanitizedInput },
			});

			setTimeout(() => {
				if (result.data?.createPart?.statusCode === 201) {
					notify('Success', 'Part created successfully', 'green');
					onClose?.();
				} else {
					notify('Error', result.data?.createPart?.message || 'Failed to create part', 'red');
				}
			}, 500);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Unknown error';
			notify('Create part error', `Something went wrong: ${message}`, 'red');
			console.error('Create part error:', err);
		} finally {
			onSubmittingChange?.(false);
		}
	};

	const handleUpdate = async () => {
		if (!form.isValid() || !data?._id) return;

		try {
			// Upload images to Cloudinary
			const uploadedImages = await Promise.all(
				images.map(async (file) => {
					const url = await uploadFile(file, 'parts');
					return url ? { url, alt: file.name } : null;
				})
			);
			const validImages = uploadedImages.filter((img) => img !== null);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { stock, ...rest } = form.values; // exclude stock
			const result = await updatePart({
				variables: { id: data._id, input: { ...rest, images: validImages } },
			});

			setTimeout(() => {
				if (result.data?.updatePart?.statusCode === 200) {
					notify('Success', 'Part updated successfully', 'green');
					onClose?.();
				} else {
					notify('Error', result.data?.updatePart?.message || 'Failed to update part', 'red');
				}
			}, 500);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Unknown error';
			notify('Update part error', `Something went wrong: ${message}`, 'red');
			console.error('Error submitting form:', err);
		} finally {
			onSubmittingChange?.(false);
		}
	};

	useEffect(() => {
		const newPreviews = images.map((file) => URL.createObjectURL(file));
		setPreviews(newPreviews);

		return () => {
			newPreviews.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [images]);

	useEffect(() => {
		const handleSubmit = async () => {
			const validation = form.validate();
			if (validation.hasErrors) return;

			onSubmittingChange?.(true);
			try {
				if (mode === 'create') {
					await handleCreate();
					onClose?.();
				} else if (mode === 'edit' && data?._id) {
					await handleUpdate();
				}
			} catch (err) {
				const message = err instanceof Error ? err.message : 'Unknown error';
				notify('Error', `Something went wrong: ${message}`, 'red');
				console.error('Error submitting form:', err);
			} finally {
				onSubmittingChange?.(false);
			}
		};

		window.addEventListener('form-submit', handleSubmit);
		return () => window.removeEventListener('form-submit', handleSubmit);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form, mode, data, onClose, onSubmittingChange, createPart, updatePart]);

	return (
		<Stack gap='md'>
			{/* Name + Category + Brand */}
			<Grid>
				<Grid.Col span={6}>
					<TextInput
						label='Name'
						placeholder='Enter part name'
						disabled={mode === 'view'}
						{...form.getInputProps('name')}
						error={form.errors.name}
					/>
				</Grid.Col>
				<Grid.Col span={6}>
					<Select
						label='Category'
						checkIconPosition='right'
						placeholder='Select category'
						disabled={mode === 'view'}
						data={categoryOptions}
						value={form.values.category}
						onChange={(val) => form.setFieldValue('category', val ?? '')}
						error={form.errors.category}
						searchable
					/>
				</Grid.Col>
				<Grid.Col span={6}>
					<TextInput
						label='Brand'
						placeholder='Enter brand'
						disabled={mode === 'view'}
						{...form.getInputProps('brand')}
						error={form.errors.brand}
					/>
				</Grid.Col>
				<Grid.Col span={6}>
					<Select
						label='Condition'
						checkIconPosition='right'
						placeholder='Select condition'
						disabled={mode === 'view'}
						data={['New', 'Used']}
						{...form.getInputProps('condition')}
						error={form.errors.condition}
					/>
				</Grid.Col>
			</Grid>

			{/* Stock, Reorder Level, Unit, Price */}
			<Grid>
				<Grid.Col span={3}>
					<NumberInput
						label='Stock'
						min={0}
						disabled={mode !== 'create'}
						{...form.getInputProps('stock')}
						error={form.errors.stock}
					/>
				</Grid.Col>
				<Grid.Col span={3}>
					<NumberInput
						label='Reorder Level'
						min={0}
						disabled={mode === 'view'}
						{...form.getInputProps('reorderLevel')}
						error={form.errors.reorderLevel}
					/>
				</Grid.Col>
				<Grid.Col span={3}>
					<Select
						label='Unit'
						checkIconPosition='right'
						placeholder='Select unit'
						disabled={mode === 'view'}
						data={unitOptions}
						{...form.getInputProps('unit')}
						error={form.errors.unit}
						searchable
					/>
				</Grid.Col>
				<Grid.Col span={3}>
					<TextInput
						label='Price'
						{...form.getInputProps('price')}
						onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
							e.target.value = e.target.value.replace(/[^0-9.,]/g, '');
						}}
					/>
				</Grid.Col>
			</Grid>

			{/* Description */}
			<Textarea
				label='Description'
				placeholder='Enter part description'
				autosize
				minRows={2}
				disabled={mode === 'view'}
				{...form.getInputProps('description')}
			/>

			{mode !== 'view' && (
				<Switch
					label='Active'
					{...form.getInputProps('isActive', { type: 'checkbox' })}
				/>
			)}

			{/* Image Upload */}
			{mode !== 'view' && (
				<>
					<Dropzone
						onDrop={setImages}
						accept={IMAGE_MIME_TYPE}
						multiple
						maxSize={5 * 1024 ** 2} // 5MB
					>
						<div>
							<Text
								size='xl'
								inline
							>
								Drag images here or click to select files
							</Text>
							<Text
								size='sm'
								c='dimmed'
								inline
								mt={7}
							>
								Attach as many files as you like, each file should not exceed 5MB
							</Text>
						</div>
					</Dropzone>

					{previews.length > 0 && (
						<Carousel
							withIndicators
							height={200}
							slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
							slideGap={{ base: 0, sm: 'md' }}
							emblaOptions={{ loop: true, align: 'start' }}
							mt='xl'
						>
							{previews.map((src, i) => (
								<Carousel.Slide key={i}>
									<Image
										src={src}
										alt={`Preview ${i}`}
										style={{ width: '100%', height: 200, objectFit: 'cover' }}
									/>
								</Carousel.Slide>
							))}
						</Carousel>
					)}
				</>
			)}
		</Stack>
	);
}
