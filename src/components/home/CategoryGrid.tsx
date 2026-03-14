import { motion } from 'framer-motion';
import { categories } from '@/data/store-data';
import { ArrowRight } from 'lucide-react';

type CategoryGridProps = {
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
};

export function CategoryGrid({ activeCategory, onSelectCategory }: CategoryGridProps) {
  const pickCategory = (category: string) => {
    onSelectCategory(category);
    document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
            <h2 className="text-sm font-bold tracking-widest text-accent uppercase mb-2">Shop by Department</h2>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Explore Our Categories
            </h3>
            <p className="arabic-text text-xl md:text-2xl font-bold text-primary mb-4">
              تصفح أقسام المعرض
            </p>
            <p className="text-muted-foreground">
              Everything you need to furnish, decorate, and equip your home, thoughtfully organized for your convenience.
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
                
                <h4 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{cat.nameEn}</h4>
                <h5 className="arabic-text text-lg text-muted-foreground mb-3">{cat.nameAr}</h5>
                
                <p className="text-sm text-muted-foreground mb-6 flex-grow">{cat.description}</p>
                
                <div className="mt-auto flex items-center text-sm font-semibold text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  View Items <ArrowRight className="w-4 h-4 ml-1" />
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
              <h4 className="text-2xl font-display font-bold mb-2">And Much More!</h4>
              <p className="arabic-text text-xl mb-4 text-white/90">والمزيد بانتظاركم</p>
              <button
                type="button"
                onClick={() => {
                  onSelectCategory(null);
                  document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-6 py-2.5 bg-white text-primary rounded-full font-semibold text-sm hover:bg-accent hover:text-foreground transition-colors"
              >
                See Featured Items
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
