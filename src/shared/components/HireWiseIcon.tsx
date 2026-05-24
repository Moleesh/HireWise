/** @format */

type HireWiseIconProps = {
	size?: number;
	className?: string;
};

/**
 * HireWiseIcon — refined brand mark.
 * A rounded squircle with a gradient interior, a stylized
 * "H" carved out of negative space, and an animated accent
 * spark that orbits the corner.
 */
const HireWiseIcon = ({ size = 24, className = '' }: HireWiseIconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 64 64"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
		aria-hidden="true"
	>
		<defs>
			<linearGradient id="hw-bg" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
				<stop offset="100%" stopColor="currentColor" stopOpacity="0.65" />
			</linearGradient>
			<linearGradient id="hw-stroke" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0%" stopColor="currentColor" stopOpacity="1" />
				<stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
			</linearGradient>
		</defs>

		{/* Filled squircle */}
		<path
			d="M32 4 C50 4 60 14 60 32 C60 50 50 60 32 60 C14 60 4 50 4 32 C4 14 14 4 32 4 Z"
			fill="url(#hw-bg)"
		/>

		{/* Subtle inner highlight */}
		<path
			d="M32 4 C50 4 60 14 60 32 C60 50 50 60 32 60 C14 60 4 50 4 32 C4 14 14 4 32 4 Z"
			stroke="url(#hw-stroke)"
			strokeOpacity="0.45"
			strokeWidth="1"
			pathLength="1"
			className="animate-icon-draw"
		/>

		{/* Negative-space H built from three white slabs */}
		<rect x="18" y="18" width="6" height="28" rx="2" fill="white" />
		<rect x="40" y="18" width="6" height="28" rx="2" fill="white" />
		<rect x="24" y="29" width="16" height="6" rx="1.5" fill="white" />

		{/* Orbiting accent spark in the top-right */}
		<circle cx="50" cy="14" r="3" fill="white" opacity="0.95" className="animate-icon-pulse" />
		<circle cx="50" cy="14" r="6" fill="white" opacity="0.18" />
	</svg>
);

export default HireWiseIcon;
