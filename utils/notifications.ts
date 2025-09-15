import { showNotification } from '@mantine/notifications';

type NotificationColor = 'green' | 'red' | 'blue' | 'yellow';

export const notify = (title: string, message: string, color: NotificationColor = 'green') => {
	showNotification({ title, message, color });
};
