import { motion } from 'framer-motion';
import { Star, Plus, Minus, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useAuth } from '../context/AuthContext';
import { useState, useMemo } from 'react';
import ProductModal from './ProductModal';
import { type Product } from '../data/products';

export default function Products() {
  const { addToCart, cartItems, updateQuantity, setIsCartOpen } = useCart();
  const { products, categories, searchQuery, setSearchQuery, activeCategory, setActiveCategory, wishlist, toggleWishlist } = useProducts();
  const { isLoggedIn, setIsLoginModalOpen, setPendingAction } = useAuth();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<'all' | 'dry' | 'fresh' | 'frozen'>('all');

  const handleSizeChange = (productId: string | number, sizeIndex: number) => {
    setSelectedSizes(prev => ({ ...prev, [productId.toString()]: sizeIndex }));
  };

  const getProductCartItem = (product: Product) => {
    const sizeIndex = selectedSizes[product.id] || 0;
    const size = product.sizes[sizeIndex].size;
    const cartItemId = `${product.id}-${size}`;
    return cartItems.find(item => item.cartItemId === cartItemId);
  };

  const handleAddToCart = (product: Product) => {
    if (!isLoggedIn) {
      setPendingAction(() => () => handleAddToCart(product));
      setIsLoginModalOpen(true);
      return;
    }
    const sizeIndex = selectedSizes[product.id] || 0;
    const variant = product.sizes[sizeIndex];
    addToCart({
      id: product.id,
      name: product.name,
      price: variant.price,
      image: product.image,
      size: variant.size
    }, 1, false); // false to not open cart, just show toast
  };

  const handleBuyNow = (product: Product) => {
    if (!isLoggedIn) {
      setPendingAction(() => () => handleBuyNow(product));
      setIsLoginModalOpen(true);
      return;
    }
    const sizeIndex = selectedSizes[product.id] || 0;
    const variant = product.sizes[sizeIndex];
    if (getProductCartItem(product)) {
      setIsCartOpen(true);
    } else {
      addToCart({
        id: product.id,
        name: product.name,
        price: variant.price,
        image: product.image,
        size: variant.size
      }, 1, true); // true to open cart immediately
    }
  };

  const toCatId = (cat: string) => `cat-${cat.toLowerCase().replace(/[\s&]+/g, '-')}`;

  const handleCategoryClick = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
    setActiveSubCategory('all');
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) ||
      p.searchTags.some(tag => tag.includes(query))
    );
  }, [searchQuery, products]);

  const groups = categories.map(cat => ({
    category: cat,
    products: filteredProducts.filter(p => {
      if (p.category !== cat) return false;
      if (cat === 'Produce' && activeSubCategory !== 'all') {
        // Checking search tags for dry/fresh as subcategory indicator
        return p.searchTags.some(tag => tag.toLowerCase() === activeSubCategory);
      }
      return true;
    })
  })).filter(g => g.products.length > 0);

  const visibleGroups = searchQuery
    ? groups
    : activeCategory
      ? groups.filter(g => g.category === activeCategory)
      : [];

  return (
    <section id="products" className="py-20 bg-orange-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-16 relative z-30">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="text-orange-400 group-focus-within:text-orange-600 transition-colors" size={24} />
            </div>
            <input
              type="text"
              placeholder="Search for egusi, plantain, yam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 rounded-full border-2 border-orange-200 bg-white placeholder-orange-300 text-orange-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all text-lg font-medium shadow-md"
            />
          </div>
        </div>

        {/* Categories (Centered, not sticky) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 max-w-5xl mx-auto text-center"
        >
          <p className="text-sm uppercase tracking-[0.35em] text-orange-500 mb-6 font-bold">Browse By Category</p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-5 md:px-8 py-3 md:py-4 rounded-full text-xs md:text-sm uppercase tracking-wider font-extrabold transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-orange-950 text-white shadow-2xl shadow-orange-900/40 scale-105"
                    : "bg-white text-orange-900 hover:bg-orange-100 hover:scale-105 border-2 border-orange-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {activeCategory === 'Produce' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 flex justify-center gap-3"
            >
              <button
                onClick={() => setActiveSubCategory('all')}
                className={`px-6 py-2 rounded-full text-xs uppercase tracking-wider font-bold transition-all duration-300 ${
                  activeSubCategory === 'all'
                    ? "bg-orange-500 text-white shadow-md scale-105"
                    : "bg-white text-orange-700 border-2 border-orange-200 hover:bg-orange-50"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveSubCategory('dry')}
                className={`px-6 py-2 rounded-full text-xs uppercase tracking-wider font-bold transition-all duration-300 ${
                  activeSubCategory === 'dry'
                    ? "bg-orange-500 text-white shadow-md scale-105"
                    : "bg-white text-orange-700 border-2 border-orange-200 hover:bg-orange-50"
                }`}
              >
                Dry Produce
              </button>
              <button
                onClick={() => setActiveSubCategory('fresh')}
                className={`px-6 py-2 rounded-full text-xs uppercase tracking-wider font-bold transition-all duration-300 ${
                  activeSubCategory === 'fresh'
                    ? "bg-orange-500 text-white shadow-md scale-105"
                    : "bg-white text-orange-700 border-2 border-orange-200 hover:bg-orange-50"
                }`}
              >
                Fresh Produce
              </button>
              <button
                onClick={() => setActiveSubCategory('frozen')}
                className={`px-6 py-2 rounded-full text-xs uppercase tracking-wider font-bold transition-all duration-300 ${
                  activeSubCategory === 'frozen'
                    ? "bg-orange-500 text-white shadow-md scale-105"
                    : "bg-white text-orange-700 border-2 border-orange-200 hover:bg-orange-50"
                }`}
              >
                Frozen Produce
              </button>
            </motion.div>
          )}

        </motion.div>

        {/* Product Grid */}
        <div className="space-y-16">
          {visibleGroups.map((group) => (
            <motion.div
              key={group.category}
              id={toCatId(group.category)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="scroll-mt-32"
            >
              <div className="mb-6 flex items-center gap-4">
                <h3 className="text-2xl font-serif font-medium text-orange-900">{group.category}</h3>
                <div className="h-px bg-orange-200 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {group.products.map((product, index) => {
                  const cartItem = getProductCartItem(product);
                  const selectedSizeIndex = selectedSizes[product.id] || 0;
                  const currentSize = product.sizes[selectedSizeIndex];
                  
                  return (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ y: -8 }}
                      className="bg-white rounded-3xl p-4 shadow-lg shadow-orange-900/5 group flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-orange-900/20 border border-orange-100/50"
                    >
                      <div
                        className="relative h-60 rounded-2xl overflow-hidden mb-5 bg-orange-50 isolate cursor-pointer"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <button
                          aria-label={wishlist?.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                          title={wishlist?.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                          onClick={(e) => {
                            e.stopPropagation(); // prevent opening product modal
                            if (!isLoggedIn) {
                              setPendingAction(() => () => toggleWishlist(product.id));
                              setIsLoginModalOpen(true);
                              return;
                            }
                            toggleWishlist(product.id);
                          }}
                          className={`absolute top-4 right-4 z-20 p-2 rounded-full shadow-sm transition-colors ${
                            wishlist?.includes(product.id) ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-400 hover:bg-white'
                          }`}
                        >
                          <svg className={`w-5 h-5 ${wishlist?.includes(product.id) ? 'fill-current' : 'fill-none stroke-current stroke-2'}`} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78v0z"></path>
                          </svg>
                        </button>
                        {product.badge && (
                          <div className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                            product.badge === 'Fresh' ? 'bg-green-100 text-green-700' :
                            product.badge === 'Frozen' ? 'bg-blue-100 text-blue-700' :
                            product.badge === 'Organic' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {product.badge}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-orange-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      </div>

                      <div className="px-1 flex flex-col flex-1 pb-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1 text-amber-500 bg-amber-50/80 px-2 py-1 rounded-lg w-fit">
                            <Star size={12} fill="currentColor" />
                            <span className="text-xs font-bold text-amber-700">{product.rating}</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-serif font-bold text-orange-950 mb-2 line-clamp-1">{product.name}</h3>
                        
                        {/* Size Dropdown */}
                        {product.sizes.length > 1 ? (
                          <select 
                            aria-label={`Select size for ${product.name}`}
                            value={selectedSizeIndex}
                            onChange={(e) => handleSizeChange(product.id, Number(e.target.value))}
                            className="bg-orange-50/50 border border-orange-100 text-orange-900 text-sm rounded-xl px-3 py-2 mb-4 outline-none focus:border-orange-300 w-full font-medium"
                          >
                            {product.sizes.map((size, idx) => (
                              <option key={idx} value={idx}>{size.size}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="text-sm text-orange-600/80 font-medium mb-4">{product.sizes[0].size}</div>
                        )}

                        <div className="mt-auto flex flex-col gap-3 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-orange-900 leading-none">${currentSize.price.toFixed(2)}</span>
                            
                            {cartItem ? (
                              <div className="flex items-center gap-2 bg-orange-100 rounded-full p-0.5 shadow-inner border border-orange-200/50">
                                <button 
                                  aria-label={`Decrease quantity of ${product.name}`}
                                  onClick={() => updateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                                  className="p-1 bg-white hover:bg-orange-50 rounded-full transition-colors text-orange-700 shadow-sm"
                                >
                                  <Minus size={12} strokeWidth={3} />
                                </button>
                                <span className="w-4 text-center font-black text-xs text-orange-950">{cartItem.quantity}</span>
                                <button 
                                  aria-label={`Increase quantity of ${product.name}`}
                                  onClick={() => updateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                                  className="p-1 bg-white hover:bg-orange-50 rounded-full transition-colors text-orange-700 shadow-sm"
                                >
                                  <Plus size={12} strokeWidth={3} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="relative overflow-hidden text-xs uppercase tracking-wide font-bold px-4 py-2 rounded-full transition-all duration-300 shadow-sm bg-orange-100 text-orange-900 hover:bg-orange-200 hover:shadow-md hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 border border-orange-200"
                              >
                                <Plus size={14} /> Add
                              </button>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleBuyNow(product)}
                            className="w-full relative overflow-hidden text-sm uppercase tracking-wide font-bold px-4 py-3 rounded-xl transition-all duration-300 shadow-md bg-orange-950 text-white hover:bg-orange-800 hover:shadow-lg transform active:scale-95 flex items-center justify-center gap-2"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
          {groups.length === 0 && !searchQuery && (
              <p className="mt-8 text-sm text-center text-orange-900/70 font-medium">
                No products are available yet. Add products from the admin dashboard after seeding the database categories.
              </p>
            )}
            {groups.length > 0 && activeCategory === null && !searchQuery && (
              <p className="mt-8 text-sm text-center text-orange-900/70 font-medium">
                Please select a category above to view products.
              </p>
            )}
          {visibleGroups.length === 0 && searchQuery && (
             <p className="mt-8 text-sm text-center text-orange-900/70 font-medium">
             No products found matching your search.
           </p>
          )}
        </div>
      </div>
      
      <ProductModal 
        product={selectedProduct} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </section>
  );
}
