import { useState } from 'react';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export const useCloudinaryUpload = () => {
	const [status, setStatus] = useState<UploadStatus>('idle');
	const [error, setError] = useState<string | null>(null);
	const [url, setUrl] = useState<string | null>(null);

	const uploadFile = async (file: File, folder = 'avatars') => {
		setStatus('uploading');
		setError(null);

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
			formData.append('folder', folder);

			const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
				method: 'POST',
				body: formData,
			});

			const data = await res.json();

			if (!res.ok) throw new Error(data.error?.message || 'Upload failed');

			setUrl(data.secure_url);
			setStatus('success');
			return data.secure_url;
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message || 'Upload failed');
			} else {
				setError('Upload failed');
			}
			setStatus('error');
			return null;
		}
	};

	return { uploadFile, status, error, url };
};
