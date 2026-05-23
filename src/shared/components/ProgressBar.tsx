/** @format */

type ProgressBarProps = {
	label: string;
	value: number;
	max?: number;
	showPercent?: boolean;
	size?: 'sm' | 'md';
	color?: string;
};

/** ProgressBar - Animated progress bar with label, percentage, and color-coded fill. */
const ProgressBar = ({
	label,
	value,
	max = 100,
	showPercent = true,
	size = 'sm',
	color,
}: ProgressBarProps) => {
	const percent = Math.min(100, Math.round((value / max) * 100));
	const barColor =
		color ??
		(percent >= 80
			? 'var(--score-excellent)'
			: percent >= 60
				? 'var(--score-good)'
				: percent >= 40
					? 'var(--score-fair)'
					: 'var(--score-poor)');
	const height = size === 'sm' ? 'h-1.5' : 'h-2.5';

	return (
		<div className="text-center">
			<div className="text-xs text-[var(--text-quaternary)] mb-1">{label}</div>
			<div className={`${height} rounded-full bg-[var(--progress-bg)] overflow-hidden`}>
				<div
					className="h-full rounded-full transition-all duration-500 animate-progress-fill"
					style={{ width: `${percent}%`, backgroundColor: barColor }}
				/>
			</div>
			{showPercent && (
				<span
					className={`text-xs tabular-nums ${size === 'md' ? 'font-bold' : ''}`}
					style={{ color: barColor }}
				>
					{percent}%
				</span>
			)}
		</div>
	);
};

export default ProgressBar;
