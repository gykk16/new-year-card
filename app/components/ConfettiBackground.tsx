'use client';

import {useCallback, useEffect, type ReactNode} from 'react';

/** Confetti color palette */
const CONFETTI_COLORS = [
  '#fbbf24',
  '#f59e0b',
  '#ef4444',
  '#22c55e',
  '#3b82f6',
  '#a855f7',
];

/** Default confetti particle count */
const CONFETTI_PARTICLE_COUNT = 50;

/** Default confetti spread angle */
const CONFETTI_SPREAD = 60;

/** Auto confetti interval in milliseconds */
const AUTO_CONFETTI_INTERVAL_MS = 3000;

/** Auto confetti particle count */
const AUTO_CONFETTI_PARTICLE_COUNT = 15;

/** Props for ConfettiBackground component */
interface ConfettiBackgroundProps {
  children: ReactNode;
}

/**
 * Background wrapper that fires confetti on click/touch and automatically
 */
export default function ConfettiBackground({children}: ConfettiBackgroundProps) {
  const fireConfetti = useCallback(async (e: React.MouseEvent | React.TouchEvent) => {
    const x = 'clientX' in e ? e.clientX : e.touches[0]?.clientX;
    const y = 'clientY' in e ? e.clientY : e.touches[0]?.clientY;

    if (x === undefined || y === undefined) return;

    const {default: confetti} = await import('canvas-confetti');
    confetti({
      particleCount: CONFETTI_PARTICLE_COUNT,
      spread: CONFETTI_SPREAD,
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      },
      colors: CONFETTI_COLORS,
    });
  }, []);

  // Auto fire confetti periodically
  useEffect(() => {
    const fireAutoConfetti = async () => {
      const {default: confetti} = await import('canvas-confetti');
      confetti({
        particleCount: AUTO_CONFETTI_PARTICLE_COUNT,
        spread: 80,
        origin: {
          x: Math.random(),
          y: Math.random() * 0.6,
        },
        colors: CONFETTI_COLORS,
        gravity: 0.8,
        scalar: 0.9,
      });
    };

    const interval = setInterval(fireAutoConfetti, AUTO_CONFETTI_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative min-h-dvh bg-gradient-to-b from-zinc-900 to-black"
      onClick={fireConfetti}
    >
      {children}
    </div>
  );
}
