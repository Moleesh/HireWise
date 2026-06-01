/** @format */

import { ShimmerRow } from '../../shared/components/ShimmerLoader';

/** RankingLoading - Skeleton layout while ranking data loads. */
const RankingLoading = () => (
    <div className="max-w-7xl mx-auto">
        <div className="mb-8">
            <div className="h-8 w-48 bg-[var(--skeleton-bg)] rounded-lg mb-2" />
            <div className="h-4 w-64 bg-[var(--skeleton-bg)] rounded-lg" />
        </div>
        <ShimmerRow rows={5} />
    </div>
);

export default RankingLoading;
