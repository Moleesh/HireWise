/** @format */

type HireWiseIconProps = {
  size?: number;
  className?: string;
};

/** HireWiseIcon - Multi-layered animated brand icon with stroke-draw, rotating ring, and pulsing glow. */
const HireWiseIcon = ({ size = 24, className = '' }: HireWiseIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer rotating ring */}
    <circle
      cx="32"
      cy="32"
      r="30"
      stroke="currentColor"
      strokeWidth="0.5"
      opacity="0.2"
      strokeDasharray="4 6"
      className="animate-icon-ring"
    />

    {/* Middle hexagonal frame with stroke-draw animation */}
    <path
      d="M32 4L58 18V46L32 60L6 46V18L32 4Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
      pathLength="1"
      className="animate-icon-draw"
    />

    {/* Inner hexagonal fill with subtle gradient */}
    <path
      d="M32 10L52 21V43L32 54L12 43V21L32 10Z"
      fill="currentColor"
      opacity="0.08"
    />

    {/* Inner hexagonal border */}
    <path
      d="M32 10L52 21V43L32 54L12 43V21L32 10Z"
      stroke="currentColor"
      strokeWidth="0.75"
      strokeLinejoin="round"
      opacity="0.3"
    />

    {/* Central checkmark with stroke-draw animation */}
    <path
      d="M22 32L29 39L42 25"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      pathLength="1"
      className="animate-icon-check"
    />

    {/* Top accent node */}
    <circle cx="32" cy="4" r="2" fill="currentColor" opacity="0.6" className="animate-icon-pulse" />

    {/* Bottom accent node */}
    <circle
      cx="32"
      cy="60"
      r="2"
      fill="currentColor"
      opacity="0.6"
      className="animate-icon-pulse"
    />

    {/* Left accent node */}
    <circle cx="6" cy="18" r="1.5" fill="currentColor" opacity="0.4" className="animate-icon-pulse" />

    {/* Right accent node */}
    <circle
      cx="58"
      cy="18"
      r="1.5"
      fill="currentColor"
      opacity="0.4"
      className="animate-icon-pulse"
    />

    {/* Glow layer */}
    <circle
      cx="32"
      cy="32"
      r="20"
      fill="currentColor"
      opacity="0.04"
      className="animate-icon-glow"
    />
  </svg>
);

export default HireWiseIcon;
