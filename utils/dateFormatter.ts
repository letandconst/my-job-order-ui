import dayjs from 'dayjs';

/**
 * Format a date string to "YYYY-MM-DD" (for <input type="date">)
 */
export function toInputDate(date?: string | Date): string {
	if (!date) return '';
	return dayjs(date).format('YYYY-MM-DD');
}

/**
 * Format a date string for display (e.g. "March 15, 2020")
 */
export function toDisplayDate(date?: string | number | Date, format = 'MMMM D, YYYY'): string {
	if (!date) return '';

	// Convert string numbers ("1642636800000") into actual numbers
	const parsedDate = typeof date === 'string' && /^\d+$/.test(date) ? Number(date) : date;

	return dayjs(parsedDate).format(format);
}
