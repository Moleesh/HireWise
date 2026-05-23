/** @format */

type ShimmerLoaderProps = { className?: string };

/** ShimmerLoader - Skeleton loading placeholder with shimmer animation. */
const ShimmerLoader = ({ className = '' }: ShimmerLoaderProps) => (
	<div className={`relative overflow-hidden rounded-xl bg-[var(--skeleton-bg)] ${className}`}>
		<div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--skeleton-shine)] to-transparent animate-shimmer" />
	</div>
);

/** ShimmerRow - Renders a vertical stack of shimmer placeholders. */
export const ShimmerRow = ({ rows = 3 }: { rows?: number }) => (
	<div className="space-y-3">
		{Array.from({ length: rows }).map((_, i) => (
			<ShimmerLoader key={i} className="h-12 w-full" />
		))}
	</div>
);

/** ShimmerCard - Renders a grid of shimmer card placeholders. */
export const ShimmerCard = ({ count = 4 }: { count?: number }) => (
	<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		{Array.from({ length: count }).map((_, i) => (
			<div
				key={i}
				className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-5 space-y-3"
			>
				<ShimmerLoader className="h-10 w-10 rounded-xl" />
				<ShimmerLoader className="h-6 w-16" />
				<ShimmerLoader className="h-4 w-24" />
				<ShimmerLoader className="h-3 w-20" />
			</div>
		))}
	</div>
);

export default ShimmerLoader;
