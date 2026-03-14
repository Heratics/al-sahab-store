import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Phone, MapPin, Search, SlidersHorizontal, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUiPreferences } from '@/lib/ui-preferences';

export function Navbar() {
  const [, setLocation] = useLocation();
  const { language, setLanguage, theme, toggleTheme, t, isArabic } = useUiPreferences();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('Home', 'الرئيسية'), href: '/' },
    { name: t('Catalog', 'الاقسام والمنتجات'), href: '/catalog' },
    { name: t('About', 'من نحن'), href: '/about' },
  ];

  const runCatalogSearch = () => {
    const query = searchInput.trim();
    sessionStorage.setItem('catalog-search-query', query);
    sessionStorage.setItem('catalog-search-pending', '1');

    setLocation('/catalog');
    window.setTimeout(() => {
      const url = new URL(window.location.href);
      if (query) {
        url.searchParams.set('q', query);
      } else {
        url.searchParams.delete('q');
      }
      window.history.replaceState({}, '', url.toString());
      window.dispatchEvent(new Event('catalog-search'));
    }, 0);

    setMobileMenuOpen(false);
  };

  const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      runCatalogSearch();
    }
  };

  useEffect(() => {
    const closeSettings = () => setSettingsOpen(false);
    window.addEventListener('scroll', closeSettings);
    return () => window.removeEventListener('scroll', closeSettings);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 overflow-hidden rounded-xl shadow-md border border-primary/10 group-hover:shadow-lg transition-all">
              <img 
                src={`${import.meta.env.BASE_URL}store-logo.png`} 
                alt="Al Sahab Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23eee"/><text x="50" y="50" font-family="Arial" font-size="14" text-anchor="middle" alignment-baseline="middle" fill="%23999">Logo</text></svg>';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg sm:text-xl md:text-2xl text-foreground leading-none tracking-tight">Al Sahab</span>
              <span className="arabic-text font-bold text-primary text-xs sm:text-sm md:text-base leading-none mt-1">الشعب</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name} 
                href={link.href}
                className="group relative flex flex-col items-center py-2"
              >
                <span className="text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors">
                  {link.name}
                </span>
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-white/80 dark:bg-card/80 backdrop-blur px-2 py-1 w-[320px]">
            <Search className="w-4 h-4 text-muted-foreground ml-2" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder={t('Search products...', 'ابحث عن المنتجات...')}
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <button
              type="button"
              onClick={runCatalogSearch}
              className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-semibold hover:opacity-90"
            >
              {t('Search', 'بحث')}
            </button>
          </div>

          {/* Contact / CTA Desktop */}
          <div className="hidden md:flex items-center gap-3 relative">
            <a 
              href="https://www.google.com/maps/place/%D8%A8%D9%88%D8%A7%D8%A8%D8%A9+%D8%A7%D9%84%D8%B4%D8%B9%D8%A8+%D9%84%D9%84%D8%AA%D8%AE%D9%81%D9%8A%D8%B6%D8%A7%D8%AA+%D8%A7%D9%84%D8%B9%D9%82%D8%A8%D8%A9%E2%80%AD/@29.5550022,35.0240359,360m/data=!3m1!1e3!4m6!3m5!1s0x15006f00648a785d:0x87defb259c2dd3!8m2!3d29.554538!4d35.023887!16s%2Fg%2F11x989cn75" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm"
              aria-label="Location"
            >
              <MapPin className="w-5 h-5" />
            </a>
            <Link
              href="/about"
              className="px-5 py-2.5 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>{t('Contact Us', 'اتصل بنا')}</span>
            </Link>

            <button
              type="button"
              onClick={() => setSettingsOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm"
              aria-label={t('Open settings', 'فتح الاعدادات')}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            {settingsOpen ? (
              <div className="absolute top-12 right-0 w-60 rounded-xl border border-border bg-card shadow-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('Dark Mode', 'الوضع الداكن')}</span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-2 py-1 text-xs hover:bg-muted/50"
                  >
                    {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                    {theme === 'dark' ? t('On', 'مفعل') : t('Off', 'مغلق')}
                  </button>
                </div>

                <div>
                  <span className="text-sm font-medium block mb-2">{t('Language', 'اللغة')}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      className={`rounded-lg border px-2 py-1.5 text-xs ${language === 'en' ? 'border-primary bg-primary text-white' : 'border-border hover:bg-muted/50'}`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('ar')}
                      className={`rounded-lg border px-2 py-1.5 text-xs ${language === 'ar' ? 'border-primary bg-primary text-white' : 'border-border hover:bg-muted/50'}`}
                    >
                      العربية
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-secondary/50 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-border/50 shadow-xl overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 rounded-xl border border-border px-2 py-1.5">
                <Search className="w-4 h-4 text-muted-foreground ml-1" />
                <input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={onSearchKeyDown}
                  placeholder={t('Search products...', 'ابحث عن المنتجات...')}
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={runCatalogSearch}
                  className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold"
                >
                  {t('Go', 'اذهب')}
                </button>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.name} 
                  href={link.href}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="font-medium text-foreground">{link.name}</span>
                </Link>
              ))}
              <div className="h-px bg-border/50 my-2" />

              <div className="space-y-2 rounded-xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('Dark Mode', 'الوضع الداكن')}</span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-2 py-1 text-xs hover:bg-muted/50"
                  >
                    {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                    {theme === 'dark' ? t('On', 'مفعل') : t('Off', 'مغلق')}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`rounded-lg border px-2 py-1.5 text-xs ${language === 'en' ? 'border-primary bg-primary text-white' : 'border-border hover:bg-muted/50'}`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('ar')}
                    className={`rounded-lg border px-2 py-1.5 text-xs ${language === 'ar' ? 'border-primary bg-primary text-white' : 'border-border hover:bg-muted/50'}`}
                  >
                    العربية
                  </button>
                </div>
              </div>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-primary text-white font-medium flex items-center justify-center gap-2 shadow-md"
              >
                <Phone className="w-5 h-5" />
                <span>{isArabic ? 'اتصل بنا' : 'Contact Us'}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
