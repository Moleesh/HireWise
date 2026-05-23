/**
 * formatDate - Formats a date string or returns 'Never' for null values.
 *
 * @format
 */

export const formatDate = (dateStr: string | null): string => {
	if (!dateStr) return 'Never';
	return new Date(dateStr).toLocaleDateString();
};
