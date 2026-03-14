import { Link } from 'wouter';
import { MapPin, Phone, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-white pt-16 pb-8 relative overflow-hidden">
      {/* Decorative subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/pattern.png)`, backgroundSize: '200px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1">
                <img 
                  src={`${import.meta.env.BASE_URL}store-logo.png`} 
                  alt="Al Sahab Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl tracking-tight text-white">Al Sahab</h3>
                <p className="arabic-text font-bold text-accent text-lg leading-none mt-1">الشعب</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs mt-4">
              Your complete home solution in Aqaba. From luxurious furniture to daily household essentials, we provide quality items for every corner of your home.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-foreground transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-foreground transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span>Quick Links</span>
              <span className="arabic-text text-accent text-sm font-normal">روابط سريعة</span>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/70 hover:text-accent transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-accent transition-colors" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-white/70 hover:text-accent transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-accent transition-colors" />
                  Categories & Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-accent transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-accent transition-colors" />
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span>Visit Us</span>
              <span className="arabic-text text-accent text-sm font-normal">زورونا</span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/70 group">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <a 
                  href="https://www.google.com/maps/place/%D8%A8%D9%88%D8%A7%D8%A8%D8%A9+%D8%A7%D9%84%D8%B4%D8%B9%D8%A8+%D9%84%D9%84%D8%AA%D8%AE%D9%81%D9%8A%D8%B6%D8%A7%D8%AA+%D8%A7%D9%84%D8%B9%D9%82%D8%A8%D8%A9%E2%80%AD/@29.5550022,35.0240359,360m/data=!3m1!1e3!4m6!3m5!1s0x15006f00648a785d:0x87defb259c2dd3!8m2!3d29.554538!4d35.023887!16s%2Fg%2F11x989cn75"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <span className="block">Al-Herafiyen District (منطقة الحرفيين)</span>
                  <span className="block mt-1">H23F+RH6, Aqaba, Jordan</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/70">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <div className="flex flex-col">
                  <span>+962 7 0000 0000</span>
                  <span className="text-xs text-white/50">Call or WhatsApp</span>
                </div>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <Clock className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span>Saturday - Thursday</span>
                  <span>9:00 AM - 10:00 PM</span>
                  <span className="mt-1 text-sm text-white/50 arabic-text">السبت - الخميس</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} Al Sahab Store. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-white/50">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
