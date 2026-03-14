import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { ShoppingBag, Star, ArrowRight, ChevronLeft, ChevronRight, Search, X, Expand } from 'lucide-react';
import { getStoreItems } from '@/lib/api';
import { useUiPreferences } from '@/lib/ui-preferences';

const fallbackGradients = [
  'gradient-product-1',
  'gradient-product-2',
  'gradient-product-3',
  'gradient-product-4',
  'gradient-product-5',
  'gradient-product-6',
  'gradient-product-7',
  'gradient-product-8',
  'gradient-product-9',
];

type ProductGridProps = {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  initialSearchTerm?: string;
  prioritizedItemId?: number | null;
};

export function ProductGrid({ selectedCategory, onCategoryChange, initialSearchTerm = '', prioritizedItemId = null }: ProductGridProps) {
  const { isArabic, t } = useUiPreferences();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [imageIndexByItem, setImageIndexByItem] = useState<Record<number, number>>({});
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);

  const openItemDetails = (itemId: number) => {
    sessionStorage.setItem('catalog-return-item-id', String(itemId));
    sessionStorage.setItem('catalog-return-search', searchTerm.trim());
    sessionStorage.setItem('catalog-return-category', selectedCategory || '');
    setLocation(`/item/${itemId}`);
  };

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ['store-items'],
    queryFn: getStoreItems,
  });

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const baseFiltered = items.filter((item) => {
      if (selectedCategory && item.category !== selectedCategory) return false;
      if (!query) return true;

      return [item.nameEn, item.nameAr, item.descEn, item.descAr, item.category]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });

    if (!prioritizedItemId) return baseFiltered;

    const highlighted = baseFiltered.find((item) => item.id === prioritizedItemId);
    if (!highlighted) return baseFiltered;

    return [highlighted, ...baseFiltered.filter((item) => item.id !== prioritizedItemId)];
  }, [items, searchTerm, selectedCategory, prioritizedItemId]);

  const getCurrentImage = (product: (typeof items)[number]) => {
    const images = product.imageUrls?.length ? product.imageUrls : (product.imageUrl ? [product.imageUrl] : []);
    if (!images.length) return null;
    const activeIndex = imageIndexByItem[product.id] ?? 0;
    return images[activeIndex % images.length];
  };

  const changeImage = (productId: number, totalImages: number, direction: -1 | 1) => {
    setImageIndexByItem((prev) => {
      const current = prev[productId] ?? 0;
      const next = (current + direction + totalImages) % totalImages;
      return { ...prev, [productId]: next };
    });
  };

  return (
    <section id="featured" className="py-24 bg-background relative border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-accent fill-accent" />
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase">Staff Picks</h2>
            </div>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              {t('Featured Products', 'المنتجات المميزة')}
            </h3>
            <p className="arabic-text text-xl md:text-2xl font-bold text-muted-foreground mt-2">{t('Our Latest Collection', 'احدث تشكيلتنا')}</p>
          </div>
          {selectedCategory ? (
            <button
              type="button"
              onClick={() => onCategoryChange(null)}
              className="hidden md:flex px-6 py-2.5 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors items-center gap-2"
            >
              {t('Clear Category Filter', 'مسح تصفية القسم')}
            </button>
          ) : null}
        </div>

        <div className="mb-8 grid md:grid-cols-[1fr_auto] gap-3 items-center">
          <label className="relative block">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => onCategoryChange(null)}
              placeholder={t('Search products by name, description, or category', 'ابحث بالاسم او الوصف او القسم')}
              className="w-full rounded-xl border border-input bg-card pl-10 pr-3 py-2.5"
            />
          </label>
          <p className="text-sm text-muted-foreground md:text-right">
            {t('Showing', 'عرض')} {filteredItems.length} {t('of', 'من')} {items.length} {t('items', 'منتج')}
            {selectedCategory ? ` ${t('in', 'في')} ${selectedCategory}` : ''}
          </p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            {t('Loading store items...', 'جار تحميل المنتجات...')}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-8 text-center text-destructive">
            {t('Failed to load items. Check your API/database connection.', 'فشل تحميل المنتجات. تحقق من اتصال قاعدة البيانات.')}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <h4 className="text-2xl font-display font-bold text-foreground">{t("Sorry, we're out of stock right now.", 'نعتذر، المنتجات غير متوفرة حاليا')}</h4>
            <p className="text-sm text-muted-foreground mt-3">{t('Please check back soon for new arrivals.', 'يرجى العودة لاحقا لوصول منتجات جديدة.')}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <h4 className="text-2xl font-display font-bold text-foreground">{t('No matching products found.', 'لا توجد منتجات مطابقة.')}</h4>
            <p className="text-sm text-muted-foreground mt-3">{t('Try another search term or clear the category filter.', 'جرب كلمة بحث اخرى او امسح تصفية القسم.')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {filteredItems.map((product, index) => {
            const productImages = product.imageUrls?.length ? product.imageUrls : (product.imageUrl ? [product.imageUrl] : []);
            const currentImage = getCurrentImage(product);
            const hasImageCarousel = productImages.length > 1;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`group flex flex-col cursor-pointer ${prioritizedItemId === product.id ? 'ring-2 ring-primary/40 ring-offset-2 ring-offset-background rounded-2xl' : ''}`}
                onClick={() => openItemDetails(product.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openItemDetails(product.id);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={product.nameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <>
                      <div className={`absolute inset-0 w-full h-full ${fallbackGradients[index % fallbackGradients.length]} mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-700`}></div>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      <div className="absolute inset-x-8 top-8 bottom-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/50 shadow-inner flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-white/50" />
                      </div>
                    </>
                  )}

                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-foreground rounded-full shadow-sm">
                    {product.category}
                  </div>
                  {product.onSale ? (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-sm">
                      Sale
                    </div>
                  ) : null}

                  {currentImage ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setExpandedImage({ src: currentImage, alt: product.nameEn });
                      }}
                      className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/45 text-white hover:bg-black/65 transition-colors flex items-center justify-center"
                      aria-label={t('Open image', 'فتح الصورة')}
                    >
                      <Expand className="w-4 h-4" />
                    </button>
                  ) : null}

                  {hasImageCarousel ? (
                    <>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          changeImage(product.id, productImages.length, -1);
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/60 text-foreground backdrop-blur-sm hover:bg-white/85 transition-colors flex items-center justify-center"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          changeImage(product.id, productImages.length, 1);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/60 text-foreground backdrop-blur-sm hover:bg-white/85 transition-colors flex items-center justify-center"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  ) : null}
                </div>

                <div className="grow flex flex-col px-1">
                  <h4 className="font-bold text-lg text-foreground leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {isArabic ? product.nameAr : product.nameEn}
                  </h4>
                  <h5 className="arabic-text text-base text-muted-foreground mb-2 line-clamp-1">
                    {isArabic ? product.nameEn : product.nameAr}
                  </h5>
                  <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                    {isArabic ? product.descAr : product.descEn}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase font-semibold">{t('Price', 'السعر')}</span>
                      {product.onSale && product.salePrice != null ? (
                        <span className="font-bold text-lg text-primary">
                          ${Number(product.salePrice).toFixed(2)}
                          <span className="ml-2 text-sm text-muted-foreground line-through">${Number(product.price).toFixed(2)}</span>
                        </span>
                      ) : (
                        <span className="font-bold text-lg text-foreground">${Number(product.price).toFixed(2)}</span>
                      )}
                    </div>
                    <Link
                      href={`/item/${product.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        openItemDetails(product.id);
                      }}
                      className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
            })}
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
          <button
            type="button"
            onClick={() => {
              onCategoryChange(null);
              setSearchTerm('');
            }}
            className="w-full py-3 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            {t('View All Store Items', 'عرض كل المنتجات')}
          </button>
        </div>

        {expandedImage ? (
          <div className="fixed inset-0 z-70 bg-black/90 p-4 sm:p-8 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors flex items-center justify-center"
              aria-label={t('Close image', 'اغلاق الصورة')}
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={expandedImage.src}
              alt={expandedImage.alt}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
