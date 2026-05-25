/** @format */

import { useEffect, useRef } from 'react';

type LoadMoreButtonProps = {
	remainingCount: number;
	onClick: () => void;
};

/** LoadMoreButton - Intersection sentinel that loads the next lazy-list page. */
const LoadMoreButton = ({ remainingCount, onClick }: LoadMoreButtonProps) => {
	const markerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const marker = markerRef.current;
		if (!marker) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) onClick();
			},
			{ rootMargin: '240px' },
		);
		observer.observe(marker);
		return () => observer.disconnect();
	}, [onClick]);

	return (
		<div
			ref={markerRef}
			className="flex justify-center pt-2 text-xs text-[var(--text-quaternary)]"
		>
			Loading {remainingCount} more…
		</div>
	);
};

export default LoadMoreButton;
