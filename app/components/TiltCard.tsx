'use client';

import {useRef, useState, useEffect} from 'react';
import Image from 'next/image';

/** Fortune messages displayed on card back */
const FORTUNE_MESSAGES: readonly string[] = [
  // 야근/퇴근 관련
  '야근 없는 평화로운 2026년 🌙✨',
  '칼퇴 후 헬스장까지 가는 갓생 달성 💪',
  '퇴근 후 카톡 안 오는 꿈같은 현실 📱🚫',
  '6시 땡 치면 사라지는 닌자 퇴근 🥷',
  '야근하면 택시비 무제한 지원 🚕💳',
  '"오늘 일찍 가세요" 팀장님의 한마디 🗣️✨',
  '퇴근길 지하철 자리 100% 확보 🚇💺',
  '금요일 3시 퇴근이 현실이 됩니다 🎉',

  // 연봉/돈 관련
  '연봉 협상, 원하는 대로 척척 💰🎯',
  '성과급 두 배, 업무량 절반 🎁📊',
  '월급날이 한 달에 두 번 오는 기적 💵💵',
  '통장 잔고 보고 놀라는 날이 옵니다 🏦😲',
  '점심값 걱정 없는 부자 직장인 등극 🍚👑',
  '주식 계좌가 초록초록해지는 한 해 📈🌿',
  '로또 3등 당첨 예정 (세금 떼도 행복) 🎰',
  '연말정산 환급금 역대급 예상 💸🎊',

  // 상사/동료 관련
  '상사가 갑자기 착해지는 기적 발생 👼',
  '팀장님이 커피 사주는 빈도 UP ☕️📈',
  '"그거 내가 할게요" 동료의 한마디 🤝',
  '회의 중 내 아이디어만 채택됨 💡👍',
  '팀장님 휴가와 내 컨디션이 싱크로 🏖️😎',
  '잔소리 대신 칭찬이 들리는 한 해 👏',
  '사수가 모든 걸 알려주는 천사로 변신 😇',
  '후배가 커피 사오는 빈도 UP ☕️🙏',

  // 회의/업무 관련
  '회의 시간 절반으로 줄어드는 축복 📉🙏',
  '"이 회의 메일로 대체합니다" 🙌📧',
  '보고서 한 번에 통과되는 기적 📝✅',
  '버그 없는 배포, 장애 없는 운영 🚀✅',
  'QA 통과율 100% 달성 🎯🏆',
  '기획 변경 0건으로 프로젝트 완료 📋✨',
  '"이거 급한 거 아니에요" 라는 말 듣기 🐢',
  '월요일 회의 전부 취소됨 📅❌',

  // 재택/휴가 관련
  '재택근무 영구 승인 예정 🏠💻',
  '연차 눈치 안 보고 쓰는 한 해 🏖️',
  '슬랙 알림 없는 주말이 찾아옵니다 📵😌',
  '월요일이 공휴일인 달이 많아짐 📅🎉',
  '병가 안 써도 될 만큼 건강해짐 💊❌',
  '재택하는데 택배도 제시간에 옴 📦🎁',
  '휴가 중 업무 연락 0건 달성 🏝️📵',

  // 점심/일상 관련
  '점심시간 1시간이 2시간처럼 느껴짐 🍱⏰',
  '구내식당 메뉴가 매일 맛집 수준 🍽️⭐',
  '점심 메뉴 고민 제로, 매일 맛집 발견 🍜🔍',
  '엘리베이터 버튼 누르자마자 도착 🛗✨',
  '프린터 고장 없는 평화로운 한 해 🖨️☮️',
  '커피머신 항상 내 차례에 청소 완료 ☕️✨',

  // 월요일/금요일 관련
  '월요병이 사라지는 신비로운 한 해 🧘‍♂️',
  '일요일 밤이 두렵지 않아짐 🌙😌',
  '금요일이 일주일에 두 번 오는 느낌 🎊🎊',
  '월요일도 금요일 기분으로 출근 🌈',

  // 기타 위트있는 것들
  '이직 면접 합격률 100% 🎯💼',
  '링크드인 헤드헌터 연락 폭주 📞🔥',
  '연말 인사평가 S등급 확정 📊👑',
  '책상 위 서류 자동 정리되는 기적 📚✨',
  '줌 회의 중 방해 요소 제로 🖥️🤫',
  '노트북 배터리 100%로 하루 버팀 🔋💪',
  '메일함 읽지 않은 메일 0개 달성 📬✅',
] as const;

/** Animation timing constants */
const HOLD_DURATION_MS = 1000;
const FLIP_DURATION_MS = 400;
const PROGRESS_INTERVAL_MS = 50;
const TILT_INTENSITY = 15;
const SCALE_ON_HOVER = 1.05;

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

/**
 * Selects a random fortune message
 */
function getRandomFortune(): string {
  const index = Math.floor(Math.random() * FORTUNE_MESSAGES.length);
  return FORTUNE_MESSAGES[index];
}

/**
 * Interactive tilt card component with holographic effects and fortune reveal
 */
export default function TiltCard() {
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
    if (!cardRef.current || isFlipped || isTransitioning) return;

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
    setFortune(getRandomFortune());
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
        className="group relative w-[280px] cursor-pointer select-none sm:w-[320px] md:w-[360px] lg:w-[400px]"
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
            src="/new-year.webp"
            alt="New Year Card"
            width={400}
            height={560}
            priority
            className="pointer-events-none h-auto w-full object-cover"
            sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 360px, 400px"
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
