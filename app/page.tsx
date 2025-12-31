import TiltCard from './components/TiltCard';
import Countdown from './components/Countdown';
import ConfettiBackground from './components/ConfettiBackground';
import ScrollingBanner from './components/ScrollingBanner';

/**
 * Home page component with countdown and interactive card
 */
export default function Home() {
  return (
    <ConfettiBackground>
      <header className="absolute left-0 right-0 top-0 z-10 flex justify-center pt-4 sm:pt-8">
        <Countdown />
      </header>
      <main className="flex min-h-dvh items-center justify-center p-4">
        <TiltCard />
      </main>
      <ScrollingBanner />
    </ConfettiBackground>
  );
}
