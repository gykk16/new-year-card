import CardCarousel from './components/CardCarousel';
import Countdown from './components/Countdown';
import ConfettiBackground from './components/ConfettiBackground';
import ScrollingBanner from './components/ScrollingBanner';

export default function Home() {
  return (
    <ConfettiBackground>
      {/* Header - fixed height */}
      <header className="absolute left-0 right-0 top-0 z-20 flex justify-center p-4">
        <Countdown />
      </header>

      {/* Main card area - centered */}
      <main className="flex h-dvh w-full items-center justify-center">
        <CardCarousel />
      </main>

      {/* Footer banner - fixed at bottom */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 p-4">
        <ScrollingBanner />
      </footer>
    </ConfettiBackground>
  );
}
