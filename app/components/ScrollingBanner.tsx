'use client';

/** New Year greeting messages */
const MESSAGES: readonly string[] = [
  '🎉 새해 복 많이 받으세요!',
  '✨ Happy New Year 2026!',
  '🐴 붉은 말의 해를 맞이하세요',
  '🔥 병오년 대박나세요',
  '💫 올해도 행복 가득하시길',
  '🍀 건강과 행운이 함께하길',
  '⭐ 모든 소원이 이루어지길',
  '💝 사랑과 웃음이 넘치길',
] as const;

/** Animation duration in seconds */
const ANIMATION_DURATION_S = 20;

/**
 * News ticker style scrolling banner
 */
export default function ScrollingBanner() {
  const repeatedMessages = [...MESSAGES, ...MESSAGES];

  return (
    <div className="flex h-8 items-center overflow-hidden rounded-full bg-red-600 sm:h-9">
      {/* Label badge */}
      <div
        className="flex h-full shrink-0 items-center rounded-l-full bg-yellow-400 px-4 text-xs font-bold text-red-600 sm:text-sm"
        style={{fontFamily: 'var(--font-space)'}}
      >
        2026
      </div>

      {/* Scrolling area */}
      <div className="relative flex-1 overflow-hidden">
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: `ticker ${ANIMATION_DURATION_S}s linear infinite`,
          }}
        >
          {repeatedMessages.map((message, index) => (
            <span
              key={index}
              className="mx-6 text-xs font-medium text-white sm:text-sm"
              style={{fontFamily: 'var(--font-space), var(--font-noto)'}}
            >
              {message}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
