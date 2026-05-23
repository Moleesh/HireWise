/** @format */

import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';

type ZeroStateProps = {
	icon: LucideIcon;
	title: string;
	description: string;
	action?: ReactNode;
};

/** ZeroState - Empty state placeholder with icon, title, description, and optional action. */
const ZeroState = ({ icon: Icon, title, description, action }: ZeroStateProps) => (
	<div className="flex flex-col items-center justify-center py-16 px-4">
		<div className="relative mb-6">
			<div className="absolute inset-0 bg-[var(--accent-glow)] rounded-full blur-2xl opacity-30 animate-pulse-slow" />
			<div className="relative w-20 h-20 rounded-2xl bg-[var(--accent-bg-subtle)] border border-[var(--accent-border)] flex items-center justify-center animate-float">
				<Icon className="w-10 h-10 text-[var(--accent-text)]" />
			</div>
		</div>
		<h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
		<p className="text-sm text-[var(--text-tertiary)] text-center max-w-sm mb-6">
			{description}
		</p>
		{action}
	</div>
);

export default ZeroState;
