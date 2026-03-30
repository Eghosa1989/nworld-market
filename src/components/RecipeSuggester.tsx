import { motion } from 'framer-motion';
import { HeartPulse, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import type { Product } from '../data/products';

type BundleConfig = {
  title: string;
  description: string;
  image: string;
  searchTerm: string;
  ingredients: string[];
  productTerms: string[];
};

const bundleIdeas: BundleConfig[] = [
  {
    title: 'Classic Jollof Rice',
    description: 'Everything you need for the perfect party jollof.',
    image: 'https://images.unsplash.com/photo-1515516969-d4008cc6241a?auto=format&fit=crop&w=1200&q=80',
    searchTerm: 'rice',
    ingredients: ['Premium Red Palm Oil', 'Jollof Rice Spice Mix', 'Premium Parboiled Rice'],
    productTerms: ['rice', 'palm oil', 'tomato', 'pepper'],
  },
  {
    title: 'Hearty Egusi Soup',
    description: 'Authentic ingredients for a rich, traditional soup.',
    image: 'https://images.unsplash.com/photo-1625944525533-473f1b3d54b3?auto=format&fit=crop&w=1200&q=80',
    searchTerm: 'egusi',
    ingredients: ['Premium Red Palm Oil', 'Nigerian Egusi Seeds', 'Dried Crayfish', 'African Bitter Leaf'],
    productTerms: ['egusi', 'melon', 'palm oil', 'crayfish', 'bitter leaf'],
  },
  {
    title: 'Pepper Soup Night',
    description: 'Warm, spicy essentials for a quick pepper soup pot.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    searchTerm: 'pepper',
    ingredients: ['Pepper Soup Spice', 'Fresh Pepper Mix', 'Goat Meat or Fish Staples'],
    productTerms: ['pepper', 'spice', 'fish', 'goat'],
  },
  {
    title: 'Plantain & Tomato Stew',
    description: 'A simple, comforting combo with the right pantry base.',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
    searchTerm: 'plantain',
    ingredients: ['Ripe Plantain', 'Tomato Base', 'Vegetable Oil', 'Seasoning Cubes'],
    productTerms: ['plantain', 'tomato', 'oil', 'seasoning'],
  },
];

const normalize = (value: string) => value.toLowerCase();

const productMatchesTerm = (product: Product, term: string) => {
  const normalizedTerm = normalize(term);
  return (
    normalize(product.name).includes(normalizedTerm) ||
    normalize(product.category).includes(normalizedTerm) ||
    product.searchTags.some((tag) => normalize(tag).includes(normalizedTerm))
  );
};

export default function RecipeSuggester() {
  const { addToCart } = useCart();
  const { isLoggedIn, setIsLoginModalOpen, setPendingAction } = useAuth();
  const { products, setSearchQuery, setActiveCategory } = useProducts();

  const shopBundle = (bundle: BundleConfig) => {
    setActiveCategory(null);
    setSearchQuery(bundle.searchTerm);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const addBundleToCart = (bundle: BundleConfig) => {
    if (!isLoggedIn) {
      setPendingAction(() => () => addBundleToCart(bundle));
      setIsLoginModalOpen(true);
      return;
    }

    const matchedProducts: Product[] = [];

    bundle.productTerms.forEach((term) => {
      const match = products.find(
        (product) => productMatchesTerm(product, term) && !matchedProducts.some((item) => item.id === product.id)
      );
      if (match) {
        matchedProducts.push(match);
      }
    });

    if (matchedProducts.length === 0) {
      shopBundle(bundle);
      toast.info('Bundle items are not fully mapped yet, so we opened matching products for you.');
      return;
    }

    matchedProducts.forEach((product) => {
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.sizes[0]?.price ?? 0,
          image: product.image,
          size: product.sizes[0]?.size,
        },
        1,
        false
      );
    });

    toast.success(`${bundle.title} bundle added to cart.`);
  };

  return (
    <section className="bg-orange-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl bg-linear-to-br from-[#5d1805] via-[#5a1605] to-[#6b220a] px-5 py-6 shadow-xl sm:px-6 sm:py-8 lg:px-8 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl flex gap-4 sm:gap-6 items-center"
        >
          <div className="shrink-0 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-[#ffb05c] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
            <HeartPulse size={24} />
          </div>
          <div>
            <h2 className="max-w-xl font-serif text-2xl sm:text-3xl font-black leading-tight text-white">
              What are you cooking?
            </h2>
            <p className="mt-1 max-w-lg text-sm font-medium leading-relaxed text-orange-100/85 sm:text-base">
              Grab everything you need in one quick bundle.
            </p>
          </div>
        </motion.div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {bundleIdeas.map((bundle, index) => (
            <motion.article
              key={bundle.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="rounded-3xl border border-white/8 bg-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="overflow-hidden rounded-2xl bg-black/10 shrink-0 sm:w-1/3">
                  <img
                    src={bundle.image}
                    alt={bundle.title}
                    className="h-32 w-full object-cover sm:h-full sm:min-h-[140px]"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-black text-white sm:text-2xl">
                      {bundle.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-orange-100/82 sm:text-sm">
                      {bundle.description}
                    </p>
                    
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {bundle.ingredients.map((ingredient) => (
                          <span
                            key={ingredient}
                            className="rounded-full bg-black/12 px-2 py-1 text-[10px] sm:text-xs font-medium text-orange-50"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => addBundleToCart(bundle)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#ff9808] to-[#ffb01d] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-[#3f1804] shadow-md transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <ShoppingCart size={14} />
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => shopBundle(bundle)}
                      className="inline-flex items-center justify-center rounded-xl border border-white/12 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white/90 transition-colors hover:bg-white/8 sm:w-auto"
                    >
                      View Items
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}