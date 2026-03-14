import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { Navbar } from '@/components/layout/Navbar';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { ProductGrid } from '@/components/home/ProductGrid';
import { Footer } from '@/components/layout/Footer';

export default function Catalog() {
  const [location] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchVersion, setSearchVersion] = useState(0);

  useEffect(() => {
    const onSearchUpdate = () => setSearchVersion((prev) => prev + 1);
    window.addEventListener('catalog-search', onSearchUpdate);
    return () => window.removeEventListener('catalog-search', onSearchUpdate);
  }, []);

  const initialSearchTerm = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const queryFromUrl = params.get('q')?.trim();
    if (queryFromUrl) return queryFromUrl;

    const hasPendingSearch = sessionStorage.getItem('catalog-search-pending') === '1';
    if (!hasPendingSearch) return '';

    sessionStorage.removeItem('catalog-search-pending');
    return sessionStorage.getItem('catalog-search-query')?.trim() || '';
  }, [location, searchVersion]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28">
        <CategoryGrid activeCategory={selectedCategory} onSelectCategory={setSelectedCategory} compactWhenSelected />
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
