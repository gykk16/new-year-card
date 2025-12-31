'use client';

import {useRef, useState, useEffect} from 'react';
import Image from 'next/image';
import {getRandomFortune, type FortuneCategory} from '../data/fortunes';

/** Animation timing constants */
const HOLD_DURATION_MS = 1000;
const FLIP_DURATION_MS = 400;
const PROGRESS_INTERVAL_MS = 50;
const TILT_INTENSITY = 15;
const SCALE_ON_HOVER = 1.05;

/** Category to card image mapping */
const CARD_IMAGES: Record<string, string> = {
  worker: '/card-worker.webp',
  housewife: '/card-housewife.webp',
  student: '/card-student.webp',
};

/** Position state interface */
interface Position {
  x: number;
  y: number;
}

/** Glare effect state interface */
interface GlareState extends Position {
  opacity: number;
}

/**
 * Generates holographic gradient based on position
 */
function getHoloGradient(position: Position): string {
  const angle = 125 + (position.x - 50) * 0.5;
  return `linear-gradient(
    ${angle}deg,
    rgba(255, 0, 0, 0.4) 0%,
    rgba(255, 154, 0, 0.4) 10%,
    rgba(208, 222, 33, 0.4) 20%,
    rgba(79, 220, 74, 0.4) 30%,
    rgba(63, 218, 216, 0.4) 40%,
    rgba(47, 201, 226, 0.4) 50%,
    rgba(28, 127, 238, 0.4) 60%,
    rgba(95, 21, 242, 0.4) 70%,
    rgba(186, 12, 248, 0.4) 80%,
    rgba(251, 7, 217, 0.4) 90%,
    rgba(255, 0, 0, 0.4) 100%
  )`;
}

/**
 * Generates card transform string
 */
function getCardTransform(rotateX: number, rotateY: number, scale: number): string {
  return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
}

/** Props for TiltCard component */
interface TiltCardProps {
  category?: FortuneCategory;
  disabled?: boolean;
}

/**
 * Interactive tilt card component with holographic effects and fortune reveal
 */
export default function TiltCard({category = 'worker', disabled = false}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const holdTimerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [glare, setGlare] = useState<GlareState>({x: 50, y: 50, opacity: 0});
  const [holoPosition, setHoloPosition] = useState<Position>({x: 50, y: 50});
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [fortune, setFortune] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const clearTimers = (): void => {
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handleMove = (clientX: number, clientY: number): void => {
    if (!cardRef.current || isFlipped || isTransitioning || disabled) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newRotateX = ((y - centerY) / centerY) * -TILT_INTENSITY;
    const newRotateY = ((x - centerX) / centerX) * TILT_INTENSITY;
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    setRotateX(newRotateX);
    setRotateY(newRotateY);
    setScale(SCALE_ON_HOVER);
    setGlare({x: percentX, y: percentY, opacity: 0.25});
    setHoloPosition({x: percentX, y: percentY});
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    e.preventDefault();
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMouseLeave = (): void => {
    if (!isFlipped && !isTransitioning) {
      setRotateX(0);
      setRotateY(0);
      setScale(1);
      setGlare({x: 50, y: 50, opacity: 0});
      setHoloPosition({x: 50, y: 50});
    }
  };

  const flipToBack = (): void => {
    setFortune(getRandomFortune(category));
    setIsFlipped(true);
    setIsTransitioning(true);
    setRotateY(180);
    setRotateX(0);
    setScale(1);
    setTimeout(() => setIsTransitioning(false), FLIP_DURATION_MS);
  };

  const flipToFront = (): void => {
    setIsFlipped(false);
    setIsTransitioning(true);
    setRotateY(0);
    setRotateX(0);
    setScale(1);
    setTimeout(() => setIsTransitioning(false), FLIP_DURATION_MS);
  };

  const handlePointerDown = (e: React.PointerEvent): void => {
    if (disabled) return;

    e.preventDefault();
    e.stopPropagation();

    if (isFlipped) {
      flipToFront();
      return;
    }

    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / HOLD_DURATION_MS) * 100, 100);
      setHoldProgress(progress);
    }, PROGRESS_INTERVAL_MS);

    holdTimerRef.current = window.setTimeout(() => {
      clearTimers();
      setIsHolding(false);
      setHoldProgress(0);
      flipToBack();
    }, HOLD_DURATION_MS);
  };

  const handlePointerUp = (): void => {
    if (!isFlipped) {
      clearTimers();
      setIsHolding(false);
      setHoldProgress(0);
    }
  };

  const handlePointerLeave = (): void => {
    if (!isFlipped) {
      clearTimers();
      setIsHolding(false);
      setHoldProgress(0);
    }
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const holoGradient = getHoloGradient(holoPosition);
  const cardTransform = getCardTransform(rotateX, rotateY, scale);
  const transitionStyle = isTransitioning
    ? `transform ${FLIP_DURATION_MS}ms ease-in-out`
    : 'transform 0.15s ease-out';

  return (
    <div className="relative" style={{perspective: '1000px'}}>
      {/* Hold progress ring */}
      {isHolding && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <svg className="relative h-32 w-32 drop-shadow-lg" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${holdProgress * 2.64} 264`}
              transform="rotate(-90 50 50)"
              style={{filter: 'drop-shadow(0 0 6px rgba(255,200,0,0.8))'}}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <text
              x="50"
              y="55"
              textAnchor="middle"
              fill="white"
              fontSize="18"
              fontWeight="bold"
            >
              {Math.round(holdProgress)}%
            </text>
          </svg>
        </div>
      )}

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
        className="group relative w-[240px] cursor-pointer select-none sm:w-[280px]"
        style={{
          transform: cardTransform,
          transition: transitionStyle,
          transformStyle: 'preserve-3d',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'none',
        }}
      >
        {/* Front of card */}
        <div
          className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/20"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <Image
            src={CARD_IMAGES[category] || '/card-worker.webp'}
            alt={`${category} card`}
            width={400}
            height={560}
            priority
            className="pointer-events-none h-auto w-full object-cover"
            sizes="(max-width: 640px) 240px, 280px"
            draggable={false}
          />

          {/* Holographic rainbow effect */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 mix-blend-color-dodge transition-opacity duration-300 group-hover:opacity-70"
            style={{backgroundImage: holoGradient}}
          />

          {/* Sparkle/shimmer overlay */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
            style={{
              backgroundImage: `
                radial-gradient(circle at ${holoPosition.x}% ${holoPosition.y}%, rgba(255,255,255,0.8) 0%, transparent 25%),
                radial-gradient(circle at ${100 - holoPosition.x}% ${100 - holoPosition.y}%, rgba(255,255,255,0.4) 0%, transparent 20%)
              `,
            }}
          />

          {/* Diagonal shine lines */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(
                ${45 + (holoPosition.x - 50) * 0.3}deg,
                transparent,
                transparent 5px,
                rgba(255,255,255,0.1) 5px,
                rgba(255,255,255,0.1) 10px
              )`,
            }}
          />

          {/* Main glare effect */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              backgroundImage: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}) 0%, transparent 50%)`,
            }}
          />
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 p-6 shadow-2xl shadow-black/50 ring-4 ring-yellow-300"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Hologram rainbow effect */}
          <div
            className="pointer-events-none absolute inset-0 opacity-70 mix-blend-overlay"
            style={{
              backgroundImage: `linear-gradient(
                135deg,
                rgba(255,0,0,0.4) 0%,
                rgba(255,154,0,0.4) 12%,
                rgba(208,222,33,0.4) 24%,
                rgba(79,220,74,0.4) 36%,
                rgba(63,218,216,0.4) 48%,
                rgba(28,127,238,0.4) 60%,
                rgba(95,21,242,0.4) 72%,
                rgba(186,12,248,0.4) 84%,
                rgba(255,0,0,0.4) 100%
              )`,
            }}
          />

          {/* Shimmer overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(
                -45deg,
                transparent 30%,
                rgba(255,255,255,0.6) 50%,
                transparent 70%
              )`,
              backgroundSize: '200% 200%',
              animation: 'shimmer 3s ease-in-out infinite',
            }}
          />

          {/* Sparkle effect */}
          <div
            className="pointer-events-none absolute inset-0 opacity-50 mix-blend-screen"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(255,255,255,0.8) 0%, transparent 20%),
                radial-gradient(circle at 80% 70%, rgba(255,255,255,0.6) 0%, transparent 15%),
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 25%)
              `,
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            <div className="text-5xl">⚡</div>
            <h3
              className="text-2xl font-bold text-amber-900 sm:text-3xl"
              style={{fontFamily: 'var(--font-noto)'}}
            >
              2026
            </h3>
            <p
              className="text-base font-medium leading-relaxed text-amber-900 sm:text-lg"
              style={{fontFamily: 'var(--font-noto)'}}
            >
              {fortune}
            </p>
            <div className="mt-2 text-xs text-amber-700/70">
              클릭하면 돌아갑니다
            </div>
          </div>

          {/* Decorative blur elements */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-yellow-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-amber-300/50 blur-3xl" />
        </div>
      </div>
    </div>
  );
}
