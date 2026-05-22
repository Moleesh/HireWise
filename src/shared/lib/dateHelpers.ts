/**
 * getAge - Returns human-readable age string from an ISO date string.
 *
 * @format
 */

export const getAge = (dateStr: string): string => {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days < 1) return 'Today';
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month';
  return `${months} months`;
};

/** formatDate - Returns relative time string for recent dates, or locale date for older ones. */
export const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  const hours = Math.floor((Date.now() - d.getTime()) / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
};
