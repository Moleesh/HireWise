/** @format */

import { type ReactNode } from 'react';

type BrandGradientProps = {
	children: ReactNode;
	className?: string;
};

/** BrandGradient - Text component with gradient color effect using CSS background-clip. */
const BrandGradient = ({ children, className = '' }: BrandGradientProps) => (
	<span
		className={`bg-gradient-to-r from-[var(--accent-gradient-from)] to-[var(--accent-gradient-to)] bg-clip-text text-transparent ${className}`}
	>
		{children}
	</span>
);

export default BrandGradient;
