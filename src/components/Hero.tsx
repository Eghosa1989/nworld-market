import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="home" className="relative min-h-[50vh] lg:min-h-[60vh] pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden bg-linear-to-b from-orange-900 to-amber-900 text-orange-50 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-5xl mx-auto mt-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-5xl font-black font-serif mb-4 leading-tight tracking-tight drop-shadow-lg">
              A Taste of Home, <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 via-orange-300 to-amber-400 italic">
                Delivered Faster.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl text-orange-100/90 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md font-medium">
              Premium spices, fresh ingredients, and traditional wearâ€”curated directly for you at UNIQ &quot;N&quot; PREMIUM MARKET.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <button 
                onClick={scrollToProducts}
                className="w-full sm:w-auto bg-orange-50 text-orange-950 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white transition-all duration-500 transform hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] flex items-center justify-center gap-2"
              >
                Shop Collection <ArrowRight size={18} className="text-orange-600" />
              </button>
              <button 
                onClick={scrollToProducts}
                className="w-full sm:w-auto px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-orange-800/80 border-2 border-orange-400/50 hover:border-orange-300 transition-all duration-500 flex items-center justify-center gap-2 bg-orange-900/30 backdrop-blur-sm"
              >
                View Categories
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-200 h-200 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-200 h-200 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
