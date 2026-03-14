import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/home/Hero';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { ProductGrid } from '@/components/home/ProductGrid';
import { AboutSection } from '@/components/home/AboutSection';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <CategoryGrid activeCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        <ProductGrid selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
