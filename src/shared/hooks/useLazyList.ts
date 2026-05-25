/** @format */

import { useEffect, useMemo, useState } from 'react';

type UseLazyListOptions = {
	initialCount?: number;
	increment?: number;
	resetKey?: string;
};

/** useLazyList - Incrementally exposes large lists to keep pages responsive. */
const useLazyList = <T,>(
	items: T[],
	{ initialCount = 12, increment = 12, resetKey = '' }: UseLazyListOptions = {},
) => {
	const [visibleCount, setVisibleCount] = useState(initialCount);

	useEffect(() => {
		void Promise.resolve().then(() => setVisibleCount(initialCount));
	}, [initialCount, resetKey]);

	const visibleItems = useMemo(
		() => items.slice(0, Math.min(visibleCount, items.length)),
		[items, visibleCount],
	);

	return {
		hasMore: visibleCount < items.length,
		loadMore: () => setVisibleCount((count) => Math.min(count + increment, items.length)),
		remainingCount: Math.max(items.length - visibleCount, 0),
		visibleCount: Math.min(visibleCount, items.length),
		visibleItems,
	};
};

export default useLazyList;
