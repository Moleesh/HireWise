/** @format */

import { useEffect, useRef, useState } from 'react';

type CountUpProps = {
  value: number;
  suffix?: string;
  duration?: number;
};

/** CountUp - Animated counter that smoothly transitions between numeric values. */
const CountUp = ({ value, suffix = '', duration = 800 }: CountUpProps) => {
  const [display, setDisplay] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startTime.current = null;
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(eased * value));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return (
    <span className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">
      {display}
      {suffix}
    </span>
  );
};

export default CountUp;
