import { motion } from 'framer-motion';
import { categories } from '@/data/store-data';
import { ArrowRight } from 'lucide-react';
import { useUiPreferences } from '@/lib/ui-preferences';

type CategoryGridProps = {
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  compactWhenSelected?: boolean;
};

export function CategoryGrid({ activeCategory, onSelectCategory, compactWhenSelected = false }: CategoryGridProps) {
  const { isArabic, t } = useUiPreferences();

  const pickCategory = (category: string) => {
    onSelectCategory(category);
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (compactWhenSelected && activeCategory) {
    return (
      <section id="categories" className="sticky top-20 z-40 border-y border-border bg-background/95 backdrop-blur py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className="shrink-0 rounded-full border border-primary bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold"
            >
              {t('All Categories', 'كل الاقسام')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.nameEn)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  activeCategory === cat.nameEn
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card hover:border-primary/30'
                }`}
              >
                {isArabic ? cat.nameAr : cat.nameEn}
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-sm font-bold tracking-widest text-accent uppercase mb-2">{t('Shop by Department', 'تسوق حسب القسم')}</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              {t('Explore Our Categories', 'استكشف اقسامنا')}
            </h3>
            <p className="text-muted-foreground">
              {t(
                'Everything you need to furnish, decorate, and equip your home, thoughtfully organized for your convenience.',
                'كل ما تحتاجه لتاثيث وتجهيز منزلك، منظم بطريقة سهلة للوصول السريع.'
              )}
            </p>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button
                type="button"
                onClick={() => pickCategory(cat.nameEn)}
                className={`group h-full w-full text-left bg-background rounded-2xl p-6 border transition-all duration-300 cursor-pointer flex flex-col ${
                  activeCategory === cat.nameEn
                    ? 'border-primary shadow-xl shadow-primary/10'
                    : 'border-border hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl ${cat.color} flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <cat.icon className="w-7 h-7" strokeWidth={1.5} />
                </div>
                
                <h4 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{isArabic ? cat.nameAr : cat.nameEn}</h4>
                <h5 className="arabic-text text-lg text-muted-foreground mb-3">{isArabic ? cat.nameEn : cat.nameAr}</h5>
                
                <p className="text-sm text-muted-foreground mb-6 flex-grow">{cat.description}</p>
                
                <div className="mt-auto flex items-center text-sm font-semibold text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  {t('View Items', 'عرض المنتجات')} <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </button>
            </motion.div>
          ))}

          {/* Call to action card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: categories.length * 0.1 }}
          >
            <div className="h-full bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-6 text-white flex flex-col justify-center items-center text-center shadow-lg shadow-primary/20 hover:shadow-xl transition-all hover:-translate-y-1">
              <h4 className="text-2xl font-display font-bold mb-2">{t('And Much More!', 'والمزيد بانتظاركم')}</h4>
              <p className="arabic-text text-xl mb-4 text-white/90">{t('Discover more categories', 'اكتشف المزيد من الاقسام')}</p>
              <button
                type="button"
                onClick={() => {
                  onSelectCategory(null);
                  document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-6 py-2.5 bg-white text-primary rounded-full font-semibold text-sm hover:bg-accent hover:text-foreground transition-colors"
              >
                {t('See Featured Items', 'عرض المنتجات المميزة')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
