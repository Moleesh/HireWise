/** @format */

import { ArrowRight, Clock } from 'lucide-react';
import StatusBadge from '../../shared/components/StatusBadge';
import { getAge, formatDate } from '../../shared/lib/dateHelpers';
import type { Page } from '../../shared/types';

type RecentItem = {
	id: string;
	name?: string;
	title?: string;
	status: string;
	createdAt: string;
};

type ActivityFeedProps = {
	label: string;
	icon: React.ReactNode;
	items: RecentItem[];
	onNavigate: (page: Page, data?: Record<string, string>) => void;
	navigatePage: Page;
	navigateData?: (item: RecentItem) => Record<string, string>;
};

/** ActivityFeed - Recent activity list component for dashboard */
const ActivityFeed = ({
	label,
	icon,
	items,
	onNavigate,
	navigatePage,
	navigateData,
}: ActivityFeedProps) => {
	return (
		<div className="p-4 md:p-6 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl">
			<div className="flex items-center justify-between mb-4 md:mb-5">
				<h2 className="text-base md:text-lg font-semibold text-[var(--text-primary)]">
					{label}
				</h2>
				<button
					onClick={() => onNavigate(navigatePage)}
					className="text-xs md:text-sm text-[var(--accent-text)] hover:text-[var(--accent-text-hover)] flex items-center gap-1 transition-colors"
				>
					View all <ArrowRight className="w-3 h-3" />
				</button>
			</div>
			{items.length === 0 ? (
				<p className="text-[var(--text-quaternary)] text-sm py-8 text-center">
					No items yet
				</p>
			) : (
				<div className="space-y-2">
					{items.map((item) => (
						<div
							key={item.id}
							className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[var(--btn-ghost-hover)] transition-colors cursor-pointer"
							onClick={() =>
								onNavigate(
									navigatePage,
									navigateData ? navigateData(item) : undefined,
								)
							}
						>
							<div className="flex items-center gap-2 md:gap-3 min-w-0">
								{icon}
								<span className="text-sm text-[var(--text-primary)] truncate">
									{item.title ?? item.name ?? 'Untitled'}
								</span>
							</div>
							<div className="flex items-center gap-2 md:gap-3 shrink-0">
								<StatusBadge status={item.status} />
								<span
									className="text-xs text-[var(--text-quaternary)] hidden sm:flex items-center gap-1"
									title={getAge(item.createdAt)}
								>
									<Clock className="w-3 h-3" />
									{formatDate(item.createdAt)}
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ActivityFeed;
