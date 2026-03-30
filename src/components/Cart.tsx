import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import CheckoutModal from './CheckoutModal';

export default function Cart() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <>
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-60 backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-70 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-orange-100 bg-orange-50">
              <h2 className="text-2xl font-black text-orange-950 flex items-center gap-2">
                <ShoppingBag /> Your Cart
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-orange-900 bg-orange-200/50 rounded-full hover:bg-orange-200 transition-colors"
                aria-label="Close cart"
                title="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-orange-400">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ShoppingBag size={84} strokeWidth={1} className="mx-auto mb-4 opacity-50" />
                  </motion.div>
                  <p className="text-2xl font-black text-orange-900">Your cart is empty</p>
                  <p className="text-orange-700">Looks like you haven't added anything yet.</p>
                  <button 
                    onClick={() => {
                        setIsCartOpen(false);
                        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-6 bg-orange-100 text-orange-900 px-8 py-3 rounded-full font-bold hover:bg-orange-200 transition-all flex items-center gap-2"
                  >
                    Start Shopping <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <motion.div 
                      key={item.cartItemId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 bg-white border border-orange-100 p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-orange-50" />
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-orange-950 line-clamp-2 leading-tight pr-2">{item.name}</h3>
                            {item.size && <p className="text-xs text-orange-600/80 font-medium mt-0.5">Size: {item.size}</p>}
                            <p className="text-orange-600 font-black mt-1">${item.price.toFixed(2)}</p>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            aria-label="Remove item"
                            title="Remove item"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        
                        <div className="mt-3 flex items-center gap-3 bg-orange-50 rounded-lg p-1 w-fit border border-orange-100/50">
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1 hover:bg-white rounded-md transition-colors text-orange-900 shadow-sm"
                            aria-label="Decrease quantity"
                            title="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-orange-900 w-6 text-center text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1 hover:bg-white rounded-md transition-colors text-orange-900 shadow-sm"
                            aria-label="Increase quantity"
                            title="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-orange-100 bg-orange-50 space-y-4">
                <div className="bg-orange-100/50 rounded-xl p-3 border border-orange-200/50">
                  {cartTotal >= 100 ? (
                    <p className="text-sm font-bold text-green-700 text-center flex items-center justify-center gap-1.5">
                      <span className="text-lg">🎉</span> You've unlocked FREE delivery!
                    </p>
                  ) : (
                    <div className="space-y-2">
                       <p className="text-xs font-bold text-orange-900 text-center">
                         You're <span className="text-orange-600">${(100 - cartTotal).toFixed(2)}</span> away from FREE delivery!
                       </p>
                       <progress
                         className="free-delivery-progress"
                         value={Math.min((cartTotal / 100) * 100, 100)}
                         max={100}
                       />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center text-lg text-orange-900">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-black text-2xl">${cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-orange-900 text-orange-50 py-4 rounded-full font-black text-lg hover:bg-orange-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl flex items-center justify-center gap-2"
                >
                  Checkout Now <ArrowRight size={20} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
    
    <CheckoutModal 
      isOpen={isCheckoutOpen} 
      onClose={() => setIsCheckoutOpen(false)} 
    />
    </>
  );
}
