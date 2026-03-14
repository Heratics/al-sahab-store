import { useState } from 'react';
import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { Navbar } from '@/components/layout/Navbar';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { ProductGrid } from '@/components/home/ProductGrid';
import { Footer } from '@/components/layout/Footer';

export default function Catalog() {
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const initialSearchTerm = useMemo(() => {
    const queryString = location.includes('?') ? location.slice(location.indexOf('?')) : '';
    const params = new URLSearchParams(queryString);
    return params.get('q')?.trim() || '';
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28">
        <CategoryGrid activeCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        <ProductGrid
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          initialSearchTerm={initialSearchTerm}
        />
      </main>
      <Footer />
    </div>
  );
}
