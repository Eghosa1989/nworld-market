import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { toast } from 'sonner';
import { type Product } from '../data/products';
import { supabase } from '../lib/supabase';

interface ProductsContextType {
  products: Product[];
  categories: string[];
  addCategory: (category: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string | number, product: Partial<Product>) => void;
  deleteProduct: (id: string | number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  wishlist: (string | number)[];
  toggleWishlist: (productId: string | number) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<(string | number)[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUserId(session?.user?.id ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUserId) {
      setWishlist([]); // clear wishlist when logged out
      return;
    }
    // Fetch wishlist items from DB
    const loadWishlist = async () => {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('product_id')
        .eq('user_id', currentUserId);
        
      if (!error && data) {
        setWishlist(data.map(d => d.product_id));
      }
    };
    loadWishlist();
  }, [currentUserId]);

  useEffect(() => {
    const loadData = async () => {
      const { data: catData, error: catErr } = await supabase.from('categories').select('name').order('created_at', { ascending: true });
      const { data: prodData, error: prodErr } = await supabase.from('products').select('*').order('created_at', { ascending: false });

      if (catErr) {
        toast.error('Failed to load categories from database');
      }

      if (prodErr) {
        toast.error('Failed to load products from database');
      }

      setCategories((catData || []).map(c => c.name));
      setProducts((prodData || []).map(p => ({
        ...p,
        searchTags: p.search_tags || [],
      })));
    };
    loadData();
  }, []);

  const addCategory = async (category: string) => {
    setCategories(prev => prev.includes(category) ? prev : [...prev, category]);
    const { error } = await supabase.from('categories').insert([{ name: category }]);
    if (error && error.code !== '23505') {
      toast.error("Error saving category");
    } else {
      toast.success(`Category "${category}" added successfully`);
    }
  };

  const toggleWishlist = async (productId: string | number) => {
    if (!currentUserId) {
      toast.error('Please log in to use the wishlist');
      return;
    }

    const isRemoving = wishlist.includes(productId);
    
    // Optimistic UI update
    setWishlist(prev => 
      isRemoving ? prev.filter(id => id !== productId) : [...prev, productId]
    );

    if (isRemoving) {
      toast('Removed from wishlist');
      await supabase.from('wishlist_items')
        .delete()
        .eq('user_id', currentUserId)
        .eq('product_id', productId);
    } else {
      toast.success('Added to wishlist', { icon: '??' });
      await supabase.from('wishlist_items')
        .insert([{ user_id: currentUserId, product_id: productId }]);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const payload = {
      ...product,
      search_tags: product.searchTags
    };
    delete (payload as any).searchTags;

    const { data, error } = await supabase.from('products').insert([payload]).select().single();

    if (error) {
      toast.error('Failed to add product');
      return;
    }

    if (data) {
      setProducts(prev => [{ ...data, searchTags: data.search_tags }, ...prev]);
      toast.success('Product created');
    }
  };

  const updateProduct = async (id: string | number, updates: Partial<Product>) => {
    const payload = { ...updates };
    if (payload.searchTags) {
      (payload as any).search_tags = payload.searchTags;
      delete payload.searchTags;
    }

    setProducts(prev =>
      prev.map(product => (product.id === id ? { ...product, ...updates } : product))
    );

    const { error } = await supabase.from('products').update(payload).eq('id', id);
    if (error) {
      toast.error('Sync failed');
    } else {
      toast.success('Product updated');
    }
  };

  const deleteProduct = async (id: string | number) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast.error("Failed to delete product from database");
    }
  };

  return (
    <ProductsContext.Provider value={{
      products, categories, addCategory, addProduct, updateProduct, deleteProduct,
      searchQuery, setSearchQuery, activeCategory, setActiveCategory,
      wishlist, toggleWishlist
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
