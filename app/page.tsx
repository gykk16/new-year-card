import CardCarousel from './components/CardCarousel';
import Countdown from './components/Countdown';
import ConfettiBackground from './components/ConfettiBackground';
import ScrollingBanner from './components/ScrollingBanner';

export default function Home() {
  return (
    <ConfettiBackground>
      <div className="flex h-dvh flex-col">
        {/* 1. Countdown */}
        <section className="shrink-0 pt-4 text-center">
          <Countdown />
        </section>

        {/* 2. Greeting */}
        <section className="shrink-0 py-2 text-center">
          <p
            className="text-base font-medium text-white sm:text-lg"
            style={{fontFamily: 'var(--font-noto)'}}
          >
            🎆 새해 복 많이 받으세요! 🎇
          </p>
        </section>

        {/* 3 & 4. Card + Controls */}
        <section className="flex min-h-0 flex-1 items-center justify-center">
          <CardCarousel />
        </section>

        {/* 5. Footer */}
        <section className="shrink-0 p-4">
          <ScrollingBanner />
        </section>
      </div>
    </ConfettiBackground>
  );
}
