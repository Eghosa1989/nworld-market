import { ShoppingBag, Menu, X, ShoppingCart, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { isLoggedIn, setIsLoginModalOpen, setIsProfileModalOpen } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="fixed top-0 w-full z-60 bg-orange-600 text-white h-7 flex items-center justify-center text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-sm">
        🎉 Free delivery on all orders over $100!
      </div>
      <nav className={`fixed top-7 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-orange-950/97 backdrop-blur-md shadow-md py-1' : 'bg-transparent py-2'} text-orange-50 border-b ${scrolled ? 'border-orange-800/40' : 'border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-10 transition-all duration-500">
          <div 
            onClick={() => scrollTo('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="p-1 bg-orange-50/10 rounded-full text-orange-100 group-hover:bg-orange-50 group-hover:text-orange-900 transition-colors">
              <ShoppingBag size={16} strokeWidth={2} />
            </span>
            <span className="text-sm font-serif font-bold tracking-widest uppercase">UNIQ &quot;N&quot; PREMIUM MARKET</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => scrollTo('home')} className="text-xs uppercase tracking-widest text-orange-100/70 hover:text-white font-bold transition-colors">Home</button>
            <button onClick={() => scrollTo('products')} className="text-xs uppercase tracking-widest text-orange-100/70 hover:text-white font-bold transition-colors">Shop</button>
            <button onClick={() => scrollTo('about')} className="text-xs uppercase tracking-widest text-orange-100/70 hover:text-white font-bold transition-colors">About</button>
            <button onClick={() => scrollTo('contact')} className="text-xs uppercase tracking-widest text-orange-100/70 hover:text-white font-bold transition-colors">Contact</button>

            {isLoggedIn ? (
              <button onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-orange-100/70 hover:text-white font-bold transition-colors">
                <User size={14} /> Profile
              </button>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-orange-100/70 hover:text-white font-bold transition-colors">
                <User size={14} /> Login
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-orange-50 text-orange-900 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white transition-all shadow-sm flex items-center gap-1.5"
            >
              <ShoppingCart size={13} />
              Cart 
              {cartCount > 0 && (
                <span className="bg-orange-600 text-white text-[9px] px-1.5 py-0.5 rounded-full ml-0.5">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="relative p-1.5 text-orange-50 hover:text-white cursor-pointer z-50"
              aria-label="Open cart"
              title="Open cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-orange-50 p-1.5 cursor-pointer z-50"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              title={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-orange-800/50 bg-orange-900 overflow-hidden shadow-2xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              <button onClick={() => scrollTo('home')} className="text-left px-3 py-2.5 text-sm uppercase tracking-widest font-bold hover:bg-orange-800 rounded-xl transition-colors">Home</button>
              <button onClick={() => scrollTo('products')} className="text-left px-3 py-2.5 text-sm uppercase tracking-widest font-bold hover:bg-orange-800 rounded-xl transition-colors">Shop</button>
              <button onClick={() => scrollTo('about')} className="text-left px-3 py-2.5 text-sm uppercase tracking-widest font-bold hover:bg-orange-800 rounded-xl transition-colors">About</button>
              <button onClick={() => { scrollTo('contact'); setIsOpen(false); }} className="text-left px-3 py-2.5 text-sm uppercase tracking-widest font-bold hover:bg-orange-800 rounded-xl transition-colors">Contact</button>
              
              {isLoggedIn ? (
                <button 
                  onClick={() => { setIsProfileModalOpen(true); setIsOpen(false); }} 
                  className="flex items-center gap-2 text-left px-3 py-2.5 text-sm uppercase tracking-widest font-bold text-orange-200 hover:text-white hover:bg-orange-800 rounded-xl transition-colors"
                >
                  <User size={16} /> Profile
                </button>
              ) : (
                <button 
                  onClick={() => { setIsLoginModalOpen(true); setIsOpen(false); }} 
                  className="flex items-center gap-2 text-left px-3 py-2.5 text-sm uppercase tracking-widest font-bold text-orange-200 hover:text-white hover:bg-orange-800 rounded-xl transition-colors"
                >
                  <User size={16} /> Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
}

