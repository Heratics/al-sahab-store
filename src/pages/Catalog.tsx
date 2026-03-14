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
  const [categoryVersion, setCategoryVersion] = useState(0);
  const [prioritizedItemId, setPrioritizedItemId] = useState<number | null>(null);

  useEffect(() => {
    const onSearchUpdate = () => setSearchVersion((prev) => prev + 1);
    const onCategoryUpdate = () => setCategoryVersion((prev) => prev + 1);
    window.addEventListener('catalog-search', onSearchUpdate);
    window.addEventListener('catalog-category', onCategoryUpdate);
    return () => {
      window.removeEventListener('catalog-search', onSearchUpdate);
      window.removeEventListener('catalog-category', onCategoryUpdate);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryFromUrl = params.get('cat')?.trim();

    const hasPendingCategory = sessionStorage.getItem('catalog-category-pending') === '1';
    const pendingCategory = sessionStorage.getItem('catalog-category-value')?.trim() || '';

    if (hasPendingCategory) {
      sessionStorage.removeItem('catalog-category-pending');
      setSelectedCategory(pendingCategory || null);
      return;
    }

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [location, categoryVersion]);

  useEffect(() => {
    const returnIdRaw = sessionStorage.getItem('catalog-return-item-id');
    if (!returnIdRaw) return;

    const returnId = Number(returnIdRaw);
    if (Number.isInteger(returnId) && returnId > 0) {
      setPrioritizedItemId(returnId);
    }

    const savedSearch = sessionStorage.getItem('catalog-return-search')?.trim();
    if (savedSearch) {
      sessionStorage.setItem('catalog-search-query', savedSearch);
      sessionStorage.setItem('catalog-search-pending', '1');
      setSearchVersion((prev) => prev + 1);
    }

    const savedCategory = sessionStorage.getItem('catalog-return-category')?.trim();
    if (savedCategory) {
      setSelectedCategory(savedCategory);
    }

    const scrollToFeatured = () => {
      const featured = document.getElementById('featured');
      if (!featured) return;
      const top = featured.getBoundingClientRect().top + window.scrollY - 112;
      window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
    };

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollToFeatured);
    });

    sessionStorage.removeItem('catalog-return-item-id');
  }, [location]);

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
          prioritizedItemId={prioritizedItemId}
        />
      </main>
      <Footer />
    </div>
  );
}
