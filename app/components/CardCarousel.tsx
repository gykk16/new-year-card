'use client';

import {useState, useRef, useEffect, useCallback} from 'react';
import TiltCard from './TiltCard';
import {CATEGORY_INFO, type FortuneCategory} from '../data/fortunes';

const CATEGORIES: FortuneCategory[] = ['worker', 'housewife', 'student'];
const SWIPE_THRESHOLD = 50;

export default function CardCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < CATEGORIES.length) {
      setCurrentIndex(index);
    }
  }, []);

  const finishSwipe = useCallback(() => {
    if (isHorizontalSwipe.current && Math.abs(dragOffset) > SWIPE_THRESHOLD) {
      if (dragOffset < 0 && currentIndex < CATEGORIES.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (dragOffset > 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    }
    setIsDragging(false);
    setDragOffset(0);
    isHorizontalSwipe.current = null;
  }, [dragOffset, currentIndex]);

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diffX = e.touches[0].clientX - startX.current;
    const diffY = e.touches[0].clientY - startY.current;

    if (isHorizontalSwipe.current === null && (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)) {
      isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
    }

    if (isHorizontalSwipe.current) {
      e.preventDefault(); // Prevent scroll only when swiping horizontally
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    finishSwipe();
  };

  // Mouse events for PC
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startX.current = e.clientX;
    startY.current = e.clientY;
    isHorizontalSwipe.current = null;
    setIsDragging(true);

    // Add global listeners for mouse
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
  };

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    const diffX = e.clientX - startX.current;
    const diffY = e.clientY - startY.current;

    if (isHorizontalSwipe.current === null && (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)) {
      isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
    }

    if (isHorizontalSwipe.current) {
      setDragOffset(diffX);
    }
  }, []);

  const handleGlobalMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleGlobalMouseMove);
    document.removeEventListener('mouseup', handleGlobalMouseUp);
    finishSwipe();
  }, [handleGlobalMouseMove, finishSwipe]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleGlobalMouseMove, handleGlobalMouseUp]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToIndex(currentIndex - 1);
      if (e.key === 'ArrowRight') goToIndex(currentIndex + 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, goToIndex]);

  const getCardStyle = (position: number): React.CSSProperties => {
    const transition = isDragging ? 'none' : 'all 300ms ease-out';
    const dragX = isDragging ? dragOffset * 0.3 : 0;

    if (position === 0) {
      return {
        transform: `translateX(${dragX}px) scale(1)`,
        opacity: 1,
        zIndex: 10,
        transition,
      };
    }

    return {
      transform: `translateX(${position * 60 + dragX}px) scale(0.85)`,
      opacity: 0.4,
      zIndex: 5,
      filter: 'blur(2px)',
      pointerEvents: 'none',
      transition,
    };
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Card area */}
      <div
        ref={containerRef}
        className="relative flex h-[400px] w-[280px] cursor-grab flex-col items-center justify-center sm:h-[480px] sm:w-[320px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {CATEGORIES.map((cat, index) => {
          const position = index - currentIndex;
          if (Math.abs(position) > 1) return null;

          return (
            <div
              key={cat}
              className="absolute select-none"
              style={getCardStyle(position)}
              onClick={() => position !== 0 && !isDragging && goToIndex(index)}
            >
              <TiltCard category={cat} disabled={position !== 0} />
            </div>
          );
        })}
        {/* Hint */}
        <p className="absolute bottom-0 text-xs text-white/50" style={{fontFamily: 'var(--font-noto)'}}>
          👆 꾹 누르기 | ← → 스와이프
        </p>
      </div>

      {/* Category buttons */}
      <div className="flex items-center gap-2">
        {CATEGORIES.map((cat, index) => (
          <button
            key={cat}
            onClick={() => goToIndex(index)}
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs transition-all ${
              index === currentIndex
                ? 'bg-yellow-400 text-yellow-900'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            <span>{CATEGORY_INFO[cat].emoji}</span>
            <span style={{fontFamily: 'var(--font-noto)'}}>{CATEGORY_INFO[cat].label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
