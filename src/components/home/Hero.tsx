import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useUiPreferences } from '@/lib/ui-preferences';

export function Hero() {
  const { t } = useUiPreferences();

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
          alt="Al Sahab Background" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background"></div>
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur border border-primary/10 text-primary font-medium text-sm mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                {t("Welcome to Aqaba's Premier Store", 'اهلا بكم في متجر العقبة المميز')}
                <span className="arabic-text border-l border-primary/20 pl-2 ml-1 text-xs">أهلاً بكم في العقبة</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-extrabold text-foreground leading-[1.1] tracking-tight mb-4">
                {t('Everything for', 'كل شيء من اجل')} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent relative">
                  {t('Your Home', 'منزلك')}
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/30" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0,10 Q50,20 100,0" stroke="currentColor" fill="none" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
              
              <h2 className="arabic-text text-3xl md:text-5xl font-bold text-primary mb-6">
                مؤسسة الشعب
              </h2>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                {t(
                  'From elegant furniture and modern appliances to daily household essentials. Discover quality items that make your house a home, all in one place.',
                  'من الاثاث الانيق والاجهزة الحديثة الى مستلزمات المنزل اليومية. اكتشف منتجات عالية الجودة تجعل بيتك اكثر راحة في مكان واحد.'
                )}
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 max-w-md sm:max-w-none">
                <Link
                  href="/catalog"
                  className="w-full sm:w-auto justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-primary text-white font-semibold text-base sm:text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1 hover:bg-primary/95 transition-all duration-300 flex items-center gap-2 group"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{t('Browse Categories', 'تصفح الاقسام')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="w-full sm:w-auto justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-card text-foreground font-semibold text-base sm:text-lg shadow-md border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                >
                  <span>{t('Visit Store', 'زيارة المعرض')}</span>
                  <span className="arabic-text text-primary text-sm">زيارة المعرض</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Featured Visual Composition */}
          <div className="hidden lg:block relative h-[600px] w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute top-10 right-0 w-4/5 h-[400px] rounded-3xl bg-gradient-to-br from-red-50 to-amber-50 dark:from-[hsl(350_30%_18%)] dark:to-[hsl(20_24%_16%)] shadow-2xl border border-white/60 dark:border-white/10 p-6 overflow-hidden"
            >
              {/* Stylized graphic representing a living room setting */}
              <div className="w-full h-full relative">
                <div className="absolute bottom-0 left-10 w-64 h-32 bg-primary/10 rounded-t-3xl backdrop-blur-sm border-t border-x border-white/40 dark:border-white/10"></div>
                <div className="absolute bottom-0 right-20 w-24 h-48 bg-accent/20 rounded-t-full backdrop-blur-sm border border-white/50 dark:border-white/10"></div>
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-[8px] border-primary/5"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <h3 className="font-display text-3xl font-bold text-primary/30">Al Sahab</h3>
                  <p className="arabic-text text-2xl font-bold text-accent/40 mt-2">الشعب</p>
                </div>
              </div>
            </motion.div>

            {/* Floating glass card */}
            <motion.div
              initial={{ opacity: 0, y: 30, x: -20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute bottom-20 left-0 w-64 p-5 rounded-2xl glass-panel"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-foreground leading-tight">Premium Quality</p>
                  <p className="arabic-text text-sm text-muted-foreground">جودة عالية</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Curated selection of the best home products in Aqaba.</p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
