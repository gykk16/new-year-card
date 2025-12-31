'use client';

import {useEffect, useState, useCallback} from 'react';
import type {Options} from 'canvas-confetti';

/** Time remaining until target date */
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Confetti color palette */
const CONFETTI_COLORS = [
  '#fbbf24',
  '#f59e0b',
  '#ef4444',
  '#22c55e',
  '#3b82f6',
  '#a855f7',
];

/** Target date for countdown */
const TARGET_DATE = new Date('2026-01-01T00:00:00').getTime();

/** Confetti animation duration in milliseconds */
const CONFETTI_DURATION_MS = 5000;

/**
 * Fires celebratory confetti animation from both sides and center
 */
async function fireConfetti(): Promise<void> {
  const {default: confetti} = await import('canvas-confetti');
  const end = Date.now() + CONFETTI_DURATION_MS;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: {x: 0},
      colors: CONFETTI_COLORS,
    } as Options);
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: {x: 1},
      colors: CONFETTI_COLORS,
    } as Options);

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

  // Big center burst
  confetti({
    particleCount: 100,
    spread: 100,
    origin: {y: 0.6},
    colors: CONFETTI_COLORS,
  } as Options);
}

/**
 * Calculates time remaining until target date
 */
function calculateTimeLeft(): TimeLeft | null {
  const now = Date.now();
  const difference = TARGET_DATE - now;

  if (difference <= 0) {
    return {days: 0, hours: 0, minutes: 0, seconds: 0};
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
}

/** Props for TimeBlock component */
interface TimeBlockProps {
  value: number;
  label: string;
}

/**
 * Displays a single time unit block
 */
function TimeBlock({value, label}: TimeBlockProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-lg font-bold text-white backdrop-blur-sm sm:h-14 sm:w-14 sm:rounded-xl sm:text-2xl md:h-16 md:w-16 md:text-3xl"
        style={{fontFamily: 'var(--font-space)'}}
      >
        {String(value).padStart(2, '0')}
      </div>
      <span className="mt-1 text-[10px] font-medium tracking-wide text-zinc-400 sm:mt-2 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

/**
 * Separator component between time blocks
 */
function TimeSeparator() {
  return (
    <div
      className="flex h-10 items-center text-base font-bold text-white/30 sm:h-14 sm:text-xl md:h-16 md:text-2xl"
      style={{fontFamily: 'var(--font-space)'}}
    >
      :
    </div>
  );
}

/**
 * Countdown timer component with New Year celebration
 */
export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isNewYear, setIsNewYear] = useState<boolean>(false);

  const handleNewYear = useCallback(() => {
    if (!isNewYear) {
      setIsNewYear(true);
      fireConfetti();
    }
  }, [isNewYear]);

  useEffect(() => {
    const updateTime = () => {
      const time = calculateTimeLeft();

      if (time && time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
        setTimeLeft(time);
        handleNewYear();
      } else {
        setTimeLeft(time);
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [handleNewYear]);

  // New Year celebration view
  if (isNewYear) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="animate-bounce text-5xl sm:text-6xl md:text-7xl">🎉</div>
        <h2
          className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl"
          style={{fontFamily: 'var(--font-noto)'}}
        >
          새해 복 많이 받으세요!
        </h2>
        <p
          className="text-lg text-white/80 sm:text-xl"
          style={{fontFamily: 'var(--font-noto)'}}
        >
          Happy New Year 2026! 🐴
        </p>
      </div>
    );
  }

  // Loading state
  if (!timeLeft) {
    return (
      <div className="flex flex-col items-center gap-3 sm:gap-5">
        <h2 className="text-sm font-semibold tracking-tight text-white sm:text-lg md:text-xl">
          2026년까지
        </h2>
        <div className="flex items-start gap-1 sm:gap-2 md:gap-3">
          <TimeBlock value={0} label="DAYS" />
          <TimeSeparator />
          <TimeBlock value={0} label="HRS" />
          <TimeSeparator />
          <TimeBlock value={0} label="MIN" />
          <TimeSeparator />
          <TimeBlock value={0} label="SEC" />
        </div>
      </div>
    );
  }

  // Countdown view
  return (
    <div className="flex flex-col items-center gap-3 sm:gap-5">
      <h2 className="text-sm font-semibold tracking-tight text-white sm:text-lg md:text-xl">
        2026년까지
      </h2>
      <div className="flex items-start gap-1 sm:gap-2 md:gap-3">
        <TimeBlock value={timeLeft.days} label="DAYS" />
        <TimeSeparator />
        <TimeBlock value={timeLeft.hours} label="HRS" />
        <TimeSeparator />
        <TimeBlock value={timeLeft.minutes} label="MIN" />
        <TimeSeparator />
        <TimeBlock value={timeLeft.seconds} label="SEC" />
      </div>
    </div>
  );
}
