import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Store, Navigation } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -right-64 -top-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-secondary rounded-3xl p-8 md:p-12 overflow-hidden border border-border shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-primary/10">
                  <Store className="w-8 h-8 text-primary" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
                  Visit Al Sahab Store
                </h2>
                <h3 className="arabic-text text-3xl text-primary font-bold mb-6">
                  مرحباً بكم في معرض الشعب
                </h3>
                
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Located in the heart of Aqaba, Al Sahab offers a massive showroom filled with premium furniture, top-brand appliances, and everything you need for your home. Our dedicated team is ready to assist you in finding exactly what you're looking for.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border border-border">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">Location <span className="arabic-text text-sm font-normal text-muted-foreground ml-2">الموقع</span></h4>
                      <p className="text-muted-foreground mt-1">Al-Herafiyen District (منطقة الحرفيين)<br/>H23F+RH6, Aqaba, Jordan</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border border-border">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">Contact <span className="arabic-text text-sm font-normal text-muted-foreground ml-2">اتصل بنا</span></h4>
                      <p className="text-muted-foreground mt-1">+962 7 0000 0000<br/>Available on Phone & WhatsApp</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border border-border">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">Hours <span className="arabic-text text-sm font-normal text-muted-foreground ml-2">أوقات العمل</span></h4>
                      <p className="text-muted-foreground mt-1">Sat - Thu: 9:00 AM - 10:00 PM<br/>Friday: 4:00 PM - 10:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <a 
                    href="https://www.google.com/maps/place/%D8%A8%D9%88%D8%A7%D8%A8%D8%A9+%D8%A7%D9%84%D8%B4%D8%B9%D8%A8+%D9%84%D9%84%D8%AA%D8%AE%D9%81%D9%8A%D8%B6%D8%A7%D8%AA+%D8%A7%D9%84%D8%B9%D9%82%D8%A8%D8%A9%E2%80%AD/@29.5550022,35.0240359,360m/data=!3m1!1e3!4m6!3m5!1s0x15006f00648a785d:0x87defb259c2dd3!8m2!3d29.554538!4d35.023887!16s%2Fg%2F11x989cn75"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <Navigation className="w-5 h-5" />
                    Get Directions
                    <span className="arabic-text text-sm border-l border-white/30 pl-2 ml-1">احصل على الاتجاهات</span>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Visual / Map Representation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white group"
            >
              <a 
                href="https://www.google.com/maps/place/%D8%A8%D9%88%D8%A7%D8%A8%D8%A9+%D8%A7%D9%84%D8%B4%D8%B9%D8%A8+%D9%84%D9%84%D8%AA%D8%AE%D9%81%D9%8A%D8%B6%D8%A7%D8%AA+%D8%A7%D9%84%D8%B9%D9%82%D8%A8%D8%A9%E2%80%AD/@29.5550022,35.0240359,360m/data=!3m1!1e3!4m6!3m5!1s0x15006f00648a785d:0x87defb259c2dd3!8m2!3d29.554538!4d35.023887!16s%2Fg%2F11x989cn75"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary mb-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <MapPin className="w-8 h-8" />
                </div>
                <span className="text-white font-bold text-xl">Open in Google Maps</span>
              </a>

              {/* Styled map graphic */}
              <div className="absolute inset-0 bg-[#e8eae6]">
                {/* Map streets grid pattern */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#fff 2px, transparent 2px), linear-gradient(90deg, #fff 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
                <div className="absolute top-1/4 left-0 right-0 h-4 bg-white opacity-40 rotate-12"></div>
                <div className="absolute top-1/2 left-0 right-0 h-8 bg-white opacity-50 -rotate-6"></div>
                <div className="absolute inset-y-0 left-1/3 w-6 bg-white opacity-40 rotate-6"></div>
                
                {/* Location Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-primary/20 rounded-full animate-ping absolute"></div>
                  <div className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center relative z-10 border-2 border-primary">
                    <img 
                      src={`${import.meta.env.BASE_URL}store-logo.png`} 
                      alt="Logo" 
                      className="w-8 h-8 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div className="mt-2 px-4 py-1.5 bg-foreground text-white text-sm font-bold rounded-full shadow-lg whitespace-nowrap">
                    Al Sahab Store
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
