/** @format */

import { statusConfig, statusLabels } from './StatusBadge/_private/constants';

type StatusBadgeProps = {
	status: string;
	size?: 'sm' | 'md';
};

/** StatusBadge - Colored badge with dot indicator for job and candidate statuses. */
const StatusBadge = ({ status, size = 'sm' }: StatusBadgeProps) => {
	const config = statusConfig[status] ?? statusConfig.draft;
	const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
	const label = statusLabels[status] ?? status.charAt(0).toUpperCase() + status.slice(1);

	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap ${sizeClass}`}
			style={{ backgroundColor: config.bg, color: config.text }}
		>
			<span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.dot }} />
			{label}
		</span>
	);
};

export default StatusBadge;
