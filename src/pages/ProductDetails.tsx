import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getStoreItemById, getStoreItems } from "@/lib/api";
import { useUiPreferences } from "@/lib/ui-preferences";

function shuffle<T>(arr: T[]): T[] {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = clone[i];
    clone[i] = clone[j];
    clone[j] = temp;
  }
  return clone;
}

export default function ProductDetails() {
  const { isArabic, t } = useUiPreferences();
  const [location] = useLocation();
  const id = Number(location.split("/").pop() ?? NaN);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const itemQuery = useQuery({
    queryKey: ["store-item", id],
    queryFn: () => getStoreItemById(id),
    enabled: Number.isInteger(id) && id > 0,
  });

  const allItemsQuery = useQuery({
    queryKey: ["store-items"],
    queryFn: getStoreItems,
  });

  const relatedItems = useMemo(() => {
    if (!itemQuery.data || !allItemsQuery.data) return [];
    const pool = allItemsQuery.data.filter((candidate) => candidate.id !== itemQuery.data.id);
    return shuffle(pool).slice(0, 4);
  }, [itemQuery.data, allItemsQuery.data]);

  const currentImages = itemQuery.data?.imageUrls?.length
    ? itemQuery.data.imageUrls
    : itemQuery.data?.imageUrl
      ? [itemQuery.data.imageUrl]
      : [];

  const showImageArrows = currentImages.length > 1;

  const goToPrevImage = () => {
    if (!currentImages.length) return;
    setActiveImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
  };

  const goToNextImage = () => {
    if (!currentImages.length) return;
    setActiveImageIndex((prev) => (prev + 1) % currentImages.length);
  };

  useEffect(() => {
    setActiveImageIndex(0);
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-10">
        <Link href="/" className="inline-flex max-w-full items-center gap-2 text-sm font-semibold text-primary hover:opacity-80 mb-6 wrap-break-word">
          <ArrowLeft className="w-4 h-4" /> {t('Back to store', 'العودة للمتجر')}
        </Link>

        {itemQuery.isLoading ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            {t('Loading item details...', 'جار تحميل تفاصيل المنتج...')}
          </div>
        ) : itemQuery.isError ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-8 text-center text-destructive">
            {t('Failed to load this item.', 'فشل تحميل هذا المنتج.')}
          </div>
        ) : !itemQuery.data ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            {t('Item not found.', 'المنتج غير موجود.')}
          </div>
        ) : (
          <section className="space-y-12">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-border bg-card aspect-square">
                  <img
                    src={currentImages[activeImageIndex] || itemQuery.data.imageUrl}
                    alt={itemQuery.data.nameEn}
                    className="w-full h-full object-cover"
                  />

                  {showImageArrows ? (
                    <>
                      <button
                        type="button"
                        onClick={goToPrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/60 text-foreground backdrop-blur-sm hover:bg-white/85 transition-colors flex items-center justify-center"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={goToNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/60 text-foreground backdrop-blur-sm hover:bg-white/85 transition-colors flex items-center justify-center"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  ) : null}
                </div>
                {currentImages.length > 1 ? (
                  <div className="grid grid-cols-5 gap-2">
                    {currentImages.map((img, index) => (
                      <button
                        key={`${img}-${index}`}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`rounded-xl overflow-hidden border ${activeImageIndex === index ? "border-primary" : "border-border"}`}
                      >
                        <img src={img} alt={`${itemQuery.data.nameEn} ${index + 1}`} className="w-full h-16 object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                <div className="inline-flex px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold mb-4">
                  {itemQuery.data.category}
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">{isArabic ? itemQuery.data.nameAr : itemQuery.data.nameEn}</h1>
                <p className="arabic-text text-xl text-muted-foreground mt-2">{isArabic ? itemQuery.data.nameEn : itemQuery.data.nameAr}</p>

                <div className="mt-6">
                  {itemQuery.data.onSale && itemQuery.data.salePrice != null ? (
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-primary">${Number(itemQuery.data.salePrice).toFixed(2)}</span>
                      <span className="text-lg text-muted-foreground line-through">${Number(itemQuery.data.price).toFixed(2)}</span>
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-primary text-primary-foreground">{t('On Sale', 'عرض خاص')}</span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-foreground">${Number(itemQuery.data.price).toFixed(2)}</span>
                  )}
                </div>

                <div className="mt-8 space-y-4">
                  <div>
                    <h2 className="font-semibold text-foreground mb-1">{t('Description', 'الوصف')}</h2>
                    <p className="text-foreground/80">{isArabic ? itemQuery.data.descAr : itemQuery.data.descEn}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t('Arabic', 'English')}</h3>
                    <p className="arabic-text text-muted-foreground">{isArabic ? itemQuery.data.descEn : itemQuery.data.descAr}</p>
                  </div>
                </div>
              </div>
            </div>

            <section>
              <h2 className="text-2xl font-display font-bold mb-5">{t('You May Also Like', 'قد يعجبك ايضا')}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedItems.map((related) => (
                  <article key={related.id} className="rounded-2xl border border-border bg-card overflow-hidden group">
                    <img src={related.imageUrls?.[0] || related.imageUrl} alt={related.nameEn} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-1">{isArabic ? related.nameAr : related.nameEn}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{related.category}</p>
                      <p className="font-bold text-primary mb-3">
                        ${Number((related.onSale && related.salePrice != null) ? related.salePrice : related.price).toFixed(2)}
                      </p>
                      <Link
                        href={`/item/${related.id}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80"
                      >
                        {t('View Item', 'عرض المنتج')} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
