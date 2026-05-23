/** @format */

type HireWiseIconProps = {
	size?: number;
	className?: string;
};

/** HireWiseIcon - Minimal HW monogram inside a soft squircle with an animated accent sweep. */
const HireWiseIcon = ({ size = 24, className = '' }: HireWiseIconProps) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 64 64"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
	>
		<defs>
			<linearGradient id="hw-sweep" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
				<stop offset="100%" stopColor="currentColor" stopOpacity="0.55" />
			</linearGradient>
		</defs>

		{/* Soft squircle backdrop */}
		<path
			d="M32 3
         C50 3 61 14 61 32
         C61 50 50 61 32 61
         C14 61 3 50 3 32
         C3 14 14 3 32 3 Z"
			fill="currentColor"
			opacity="0.08"
		/>
		<path
			d="M32 3
         C50 3 61 14 61 32
         C61 50 50 61 32 61
         C14 61 3 50 3 32
         C3 14 14 3 32 3 Z"
			stroke="url(#hw-sweep)"
			strokeWidth="1.25"
			pathLength="1"
			className="animate-icon-draw"
		/>

		{/* H */}
		<path
			d="M18 20 L18 44 M18 32 L30 32 M30 20 L30 44"
			stroke="currentColor"
			strokeWidth="3"
			strokeLinecap="round"
			strokeLinejoin="round"
			pathLength="1"
			className="animate-icon-check"
		/>

		{/* W */}
		<path
			d="M36 20 L40 44 L44 28 L48 44 L52 20"
			stroke="currentColor"
			strokeWidth="3"
			strokeLinecap="round"
			strokeLinejoin="round"
			fill="none"
			pathLength="1"
			className="animate-icon-check"
		/>

		{/* Accent dot */}
		<circle
			cx="52"
			cy="14"
			r="2.25"
			fill="currentColor"
			opacity="0.7"
			className="animate-icon-pulse"
		/>
	</svg>
);

export default HireWiseIcon;
