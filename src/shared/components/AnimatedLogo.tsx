/** @format */

import HireWiseIcon from './HireWiseIcon';

type AnimatedLogoProps = {
  size?: number;
  showText?: boolean;
};

/** AnimatedLogo - Animated HireWise logo with glow and gradient sweep effects. */
const AnimatedLogo = ({ size = 24, showText = true }: AnimatedLogoProps) => (
  <div className="flex items-center gap-3">
    <div className="animate-logo-glow">
      <HireWiseIcon size={size} className="text-[var(--accent-text)]" />
    </div>
    {showText && (
      <h1 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
        Hire
        <span className="bg-gradient-to-r from-[var(--accent-gradient-from)] to-[var(--accent-gradient-to)] bg-clip-text text-transparent animate-gradient-sweep bg-[length:200%_200%]"> 
          Wise
        </span>
      </h1>
    )}
  </div>
);

export default AnimatedLogo;
