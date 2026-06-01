/** @format */

import { ShimmerCard, ShimmerRow } from '../../shared/components/ShimmerLoader';

/** DashboardLoading - Skeleton layout while dashboard totals load. */
const DashboardLoading = () => (
    <div className="max-w-7xl mx-auto">
        <div className="mb-8">
            <div className="h-8 w-48 bg-[var(--skeleton-bg)] rounded-lg mb-2" />
            <div className="h-4 w-64 bg-[var(--skeleton-bg)] rounded-lg" />
        </div>
        <ShimmerCard count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6">
                <ShimmerRow rows={4} />
            </div>
            <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6">
                <ShimmerRow rows={4} />
            </div>
        </div>
    </div>
);

export default DashboardLoading;
