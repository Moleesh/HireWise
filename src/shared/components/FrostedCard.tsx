/** @format */

import { type ReactNode } from 'react';

type FrostedCardProps = {
	children: ReactNode;
	className?: string;
	hover?: boolean;
	glow?: boolean;
	onClick?: () => void;
};

/** FrostedCard - Glassmorphic card with backdrop blur, hover effects, and optional click handler. */
const FrostedCard = ({
	children,
	className = '',
	hover = true,
	glow = false,
	onClick,
}: FrostedCardProps) => (
	<div
		onClick={onClick}
		className={`
      relative overflow-hidden rounded-2xl
      bg-[var(--card-bg)] backdrop-blur-xl
      border border-[var(--card-border)]
      shadow-[var(--card-shadow)]
      transition-all duration-300 ease-out
      ${hover ? 'hover:shadow-[var(--card-shadow-hover)] hover:-translate-y-0.5 hover:border-[var(--card-border-hover)]' : ''}
      ${glow ? 'hover:shadow-[var(--card-glow)]' : ''}
      ${onClick ? 'cursor-pointer' : ''}
      ${className}
    `}
	>
		<div className="absolute inset-0 bg-gradient-to-b from-[var(--card-shine)] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
		<div className="relative z-10">{children}</div>
	</div>
);

export default FrostedCard;
