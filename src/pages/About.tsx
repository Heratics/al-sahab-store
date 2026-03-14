import { Navbar } from '@/components/layout/Navbar';
import { AboutSection } from '@/components/home/AboutSection';
import { Footer } from '@/components/layout/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28">
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
