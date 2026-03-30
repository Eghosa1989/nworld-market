import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useCallback, useEffect } from 'react';
import type { Product } from '../data/products';

export default function ProductModal({ product, isOpen, onClose }: { product: Product | null, isOpen: boolean, onClose: () => void }) {
  const { addToCart } = useCart();
  const { isLoggedIn, setIsLoginModalOpen, setPendingAction } = useAuth();
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCurrentImageIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  if (!isOpen || !product) return null;

  const productImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setPendingAction(() => () => handleAddToCart());
      setIsLoginModalOpen(true);
      return;
    }
    const variant = product.sizes[selectedSizeIndex];
    addToCart({
      id: product.id,
      name: product.name,
      price: variant.price,
      image: product.image,
      size: variant.size
    }, 1, false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-4xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-orange-900 rounded-full shadow-sm transition-all"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Image Section */}
          <div className="md:w-1/2 h-64 md:h-auto bg-orange-50 relative group"> 
            {product.badge && (
              <span className="absolute top-4 left-4 bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full z-10 shadow-md">
                {product.badge}
              </span>
            )}
            
            <div className="overflow-hidden h-full w-full" ref={emblaRef}>
              <div className="flex h-full touch-pan-y">
                {productImages.map((img, idx) => (
                  <div className="flex-[0_0_100%] min-w-0" key={idx}>
                    <img
                      src={img}
                      alt={`${product.name} - Image ${idx + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {productImages.length > 1 && (
              <>
                <button
                  title="Previous image"
                  aria-label="Previous image"
                  onClick={scrollPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-orange-900 rounded-full shadow-md transition-opacity"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  title="Next image"
                  aria-label="Next image"
                  onClick={scrollNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-orange-900 rounded-full shadow-md transition-opacity"
                >
                  <ChevronRight size={20} />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {productImages.map((_, idx) => (
                    <button
                      key={idx}
                      title={`Go to image ${idx + 1}`}
                      aria-label={`Go to image ${idx + 1}`}
                      onClick={(e) => { e.stopPropagation(); scrollTo(idx); }}
                      className={`w-2 h-2 rounded-full transition-colors ${     
                        currentImageIndex === idx ? 'bg-orange-600' : 'bg-white/60 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Info Section */}
          <div className="md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-orange-500 font-bold">
                {product.category}
              </span>
              <span className="text-orange-300">•</span>
              <div className="flex items-center text-yellow-400">
                <Star size={12} className="fill-current" />
                <span className="ml-1 text-xs text-orange-900 font-bold">{product.rating}</span>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-serif font-black text-orange-950 mb-4 leading-tight">
              {product.name}
            </h2>

            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Select Expected Quantity/Weight</h3>
              </div>
              <div className="flex gap-3">
                {product.sizes.map((sizeObj, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSizeIndex(idx)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-bold text-sm ${
                      selectedSizeIndex === idx 
                        ? 'border-orange-500 bg-orange-50 text-orange-900' 
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <div>{sizeObj.size}</div>
                    <div className={selectedSizeIndex === idx ? 'text-orange-600' : 'text-gray-400'}>
                      ${sizeObj.price.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 flex items-center gap-4">
              <div className="text-3xl font-black text-orange-950">
                ${product.sizes[selectedSizeIndex].price.toFixed(2)}
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-orange-950 text-white py-4 px-6 rounded-xl font-black uppercase tracking-widest hover:bg-orange-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
