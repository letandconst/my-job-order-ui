import { CreatePartResponse, Part, UpdatePartResponse } from '@/types/part';
import { Grid, NumberInput, Text, Select, Stack, Switch, Textarea, TextInput, Image, SimpleGrid, Paper, ActionIcon } from '@mantine/core';
import { useForm } from '@mantine/form';

import { useEffect, useState } from 'react';
import { inventoryUnits, partCategories } from '../data';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';

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
			stock: (val) => (mode === 'create' && !val ? 'Stock is required' : null),
			reorderLevel: (val: number) => (!val ? 'Reorder Level is required' : null),
			price: (val: number) => (!val ? 'Price is required' : null),
		},
	});

	const [images, setImages] = useState<FileWithPath[]>([]);
	const [existingImages, setExistingImages] = useState<(string | { url: string; alt?: string })[]>(data?.images ?? []);

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
			// Upload only new images to Cloudinary
			const uploadedImages = await Promise.all(
				images.map(async (file) => {
					const url = await uploadFile(file, 'parts');
					return url ? { url, alt: file.name } : null;
				})
			);

			const newImages = uploadedImages.filter((img) => img !== null);

			// Merge existing + new
			const finalImages = [...existingImages.map((img) => (typeof img === 'string' ? { url: img, alt: '' } : { url: img.url, alt: img.alt || '' })), ...newImages];

			// Sanitize form values
			const sanitizedValues = {
				...form.values,
				name: form.values.name.trim(),
				description: form.values.description?.trim() || null,
				category: form.values.category.trim(),
				brand: form.values.brand.trim(),
				condition: form.values.condition.toLowerCase(),
				unit: form.values.unit.trim(),
				reorderLevel: Number(form.values.reorderLevel) || 0,
				price: Number(form.values.price),
				isActive: Boolean(form.values.isActive),
			};

			// exclude stock from update
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { stock, ...rest } = sanitizedValues;

			const result = await updatePart({
				variables: {
					id: data._id,
					input: {
						...rest,
						images: finalImages, // ✅ send both remaining existing + new
					},
				},
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
			{/* Images */}
			{mode === 'view' ? (
				existingImages.length > 0 ? (
					<SimpleGrid
						cols={{ base: 1, sm: 4 }}
						mt='md'
					>
						{existingImages.map((img, i) => {
							const src = typeof img === 'string' ? img : img.url;
							const alt = typeof img === 'string' ? data?.name : img.alt || `Part Image ${i + 1}`;

							return (
								<Image
									key={i}
									src={src}
									alt={alt}
									radius='md'
									height={120}
									fit='cover'
									style={{
										border: '1px solid var(--mantine-color-gray-3)',
										padding: '8px',
										objectFit: 'contain',
									}}
								/>
							);
						})}
					</SimpleGrid>
				) : (
					<Paper
						shadow='md'
						radius='md'
						withBorder
						p='xl'
						mb='md'
					>
						<Text
							c='dimmed'
							ta='center'
							size='lg'
						>
							No images available
						</Text>
					</Paper>
				)
			) : (
				<>
					<Dropzone
						onDrop={(files) => setImages((prev) => [...prev, ...files])}
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
								Attach as many files as you like, each file should not exceed 5mb
							</Text>
						</div>
					</Dropzone>

					{/* Current Images (removable) */}
					{existingImages.length > 0 && (
						<>
							<Text
								size='sm'
								fw={500}
								mt='md'
							>
								Current Images
							</Text>
							<SimpleGrid
								cols={{ base: 1, sm: 4 }}
								mt='sm'
							>
								{existingImages.map((img, i) => {
									const src = typeof img === 'string' ? img : img.url;
									const alt = typeof img === 'string' ? data?.name : img.alt || `Part Image ${i + 1}`;

									return (
										<div
											key={`existing-${i}`}
											style={{ position: 'relative' }}
										>
											<Image
												src={src}
												alt={alt}
												radius='md'
												height={120}
												fit='cover'
												style={{
													border: '1px solid var(--mantine-color-gray-3)',
													padding: '8px',
													objectFit: 'contain',
												}}
											/>
											<ActionIcon
												color='red'
												variant='filled'
												size='sm'
												style={{ position: 'absolute', top: 5, right: 5 }}
												onClick={() => setExistingImages((prev) => prev.filter((_, idx) => idx !== i))}
											>
												✕
											</ActionIcon>
										</div>
									);
								})}
							</SimpleGrid>
						</>
					)}

					{/* New Uploads */}
					{images.length > 0 && (
						<>
							<Text
								size='sm'
								fw={500}
								mt='md'
							>
								New Uploads
							</Text>
							<SimpleGrid
								cols={{ base: 1, sm: 4 }}
								mt='sm'
							>
								{images.map((file, i) => {
									const imageUrl = URL.createObjectURL(file);
									return (
										<div
											key={`new-${i}`}
											style={{ position: 'relative' }}
										>
											<Image
												src={imageUrl}
												alt={file.name}
												radius='md'
												height={120}
												fit='cover'
												onLoad={() => URL.revokeObjectURL(imageUrl)}
											/>
											<ActionIcon
												color='red'
												variant='filled'
												size='sm'
												style={{ position: 'absolute', top: 5, right: 5 }}
												onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
											>
												✕
											</ActionIcon>
										</div>
									);
								})}
							</SimpleGrid>
						</>
					)}
				</>
			)}

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
						disabled={mode === 'view'}
					/>
				</Grid.Col>
			</Grid>

			{/* Description */}
			<Textarea
				label='Description'
				placeholder={mode !== 'view' ? 'Part description (optional)' : 'N/A'}
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
		</Stack>
	);
}
