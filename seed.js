import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zpvdccvnjbqwsbbooanl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwdmRjY3ZuamJxd3NiYm9vYW5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NDI4OTksImV4cCI6MjA5MDMxODg5OX0.UZeKN8KKAEnkUcz7fwtXIPUSn-W5xP8bE4bjsr0_TPc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const products = [
  // Seafood - Frozen
  { name: 'Snails (Frozen)', category: 'Seafood', rating: 4.8, image: 'https://images.unsplash.com/photo-1596702672691-88f57fbeae7b?w=600&auto=format&fit=crop&q=80', search_tags: ['seafood', 'frozen', 'snail'], sizes: [{ size: 'Medium Pack', price: 25.00 }, { size: 'Large Pack', price: 40.00 }] },
  { name: 'Tilapia (Frozen)', category: 'Seafood', rating: 4.5, image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=600&auto=format&fit=crop&q=80', search_tags: ['seafood', 'frozen', 'tilapia', 'fish'], sizes: [{ size: '1 Carton', price: 35.00 }] },
  { name: 'Mackerel (Frozen)', category: 'Seafood', rating: 4.7, image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=600&auto=format&fit=crop&q=80', search_tags: ['seafood', 'frozen', 'mackerel', 'fish', 'titus'], sizes: [{ size: '1 Carton', price: 42.00 }] },
  { name: 'Croaker Fish (Frozen)', category: 'Seafood', rating: 4.9, image: 'https://images.unsplash.com/photo-1611171711791-b3491baee069?w=600&auto=format&fit=crop&q=80', search_tags: ['seafood', 'frozen', 'croaker', 'fish'], sizes: [{ size: '1 Carton', price: 55.00 }] },
  { name: 'Whiting Fish (Frozen)', category: 'Seafood', rating: 4.4, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80', search_tags: ['seafood', 'frozen', 'whiting', 'whitening', 'fish'], sizes: [{ size: '1 Carton', price: 38.00 }] },
  { name: 'Catfish (Frozen)', category: 'Seafood', rating: 4.6, image: 'https://images.unsplash.com/photo-1518174780517-8e146dd997f7?w=600&auto=format&fit=crop&q=80', search_tags: ['seafood', 'frozen', 'catfish', 'fish'], sizes: [{ size: '1 Carton', price: 48.00 }] },

  // Seafood - Dry
  { name: 'Stockfish Head', category: 'Seafood', rating: 4.8, image: 'https://images.unsplash.com/photo-1507915573437-56e6d187216a?w=600&auto=format&fit=crop&q=80', search_tags: ['seafood', 'dry', 'stockfish', 'head'], sizes: [{ size: 'Medium Bag', price: 30.00 }] },
  { name: 'Stockfish (Full)', category: 'Seafood', rating: 4.9, image: 'https://images.unsplash.com/photo-1503144883498-842eb3a693b8?w=600&auto=format&fit=crop&q=80', search_tags: ['seafood', 'dry', 'stockfish'], sizes: [{ size: '1 Piece', price: 45.00 }, { size: '3 Pieces', price: 120.00 }] },
  { name: 'Dry Catfish', category: 'Seafood', rating: 4.7, image: 'https://images.unsplash.com/photo-1544026262-b91caddcb6ea?w=600&auto=format&fit=crop&q=80', search_tags: ['seafood', 'dry', 'catfish', 'smoked'], sizes: [{ size: 'Small Pack', price: 15.00 }, { size: 'Large Pack', price: 35.00 }] },
  { name: 'Dry Fish (Mangala/Bonga)', category: 'Seafood', rating: 4.5, image: 'https://images.unsplash.com/photo-1629241838848-18e38d745cfa?w=600&auto=format&fit=crop&q=80', search_tags: ['seafood', 'dry', 'fish', 'mangala', 'bonga'], sizes: [{ size: 'Basket', price: 20.00 }] },
  { name: 'Dried Crayfish', category: 'Seafood', rating: 4.9, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80', search_tags: ['seafood', 'dry', 'crayfish', 'shrimp'], sizes: [{ size: 'Small Custard Paint', price: 12.00 }, { size: 'Large Custard Paint', price: 22.00 }] },

  // Seafood - Fresh
  { name: 'Fresh Periwinkle', category: 'Seafood', rating: 4.7, image: 'https://images.unsplash.com/photo-1559160581-2ac36b5bc9bf?w=600&auto=format&fit=crop&q=80', search_tags: ['seafood', 'fresh', 'periwinkle'], sizes: [{ size: 'Small Pack', price: 10.00 }, { size: 'Large Pack', price: 18.00 }] },
  { name: 'Fresh Catfish', category: 'Seafood', rating: 4.8, image: 'https://images.unsplash.com/photo-1582236528766-3d2cb2f3e827?w=600&auto=format&fit=crop&q=80', search_tags: ['seafood', 'fresh', 'catfish', 'live'], sizes: [{ size: '1kg', price: 10.00 }, { size: '5kg', price: 45.00 }] },

  // Meat - Meat Sharing
  { name: 'Beef (1/16 Cow)', category: 'Meat', rating: 4.9, image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'beef', 'cow', 'sharing'], sizes: [{ size: '1/16 Cow', price: 80.00 }] },
  { name: 'Beef (1/8 Cow)', category: 'Meat', rating: 4.9, image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'beef', 'cow', 'sharing'], sizes: [{ size: '1/8 Cow', price: 150.00 }] },
  { name: 'Beef (1/4 Cow)', category: 'Meat', rating: 4.9, image: 'https://images.unsplash.com/photo-1602473859663-c782b6b0c606?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'beef', 'cow', 'sharing'], sizes: [{ size: '1/4 Cow', price: 290.00 }] },
  { name: 'Beef (1/2 Cow)', category: 'Meat', rating: 4.9, image: 'https://images.unsplash.com/photo-1558030043-4dc3d3b76fef?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'beef', 'cow', 'sharing'], sizes: [{ size: '1/2 Cow', price: 560.00 }] },
  { name: 'Beef (Full Cow)', category: 'Meat', rating: 5.0, image: 'https://images.unsplash.com/photo-1615937691515-d3237eb02e9a?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'beef', 'cow', 'sharing'], sizes: [{ size: 'Full Cow', price: 1100.00 }] },
  { name: 'Goat Meat (Quarter)', category: 'Meat', rating: 4.8, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'goat', 'sharing'], sizes: [{ size: 'Quarter Goat', price: 65.00 }] },
  { name: 'Goat Meat (Half)', category: 'Meat', rating: 4.8, image: 'https://images.unsplash.com/photo-1644705574305-ac10dbe3fbd3?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'goat', 'sharing'], sizes: [{ size: 'Half Goat', price: 120.00 }] },
  { name: 'Goat Meat (Full)', category: 'Meat', rating: 4.9, image: 'https://images.unsplash.com/photo-1542289456-ee04fceda1fc?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'goat', 'sharing'], sizes: [{ size: 'Full Goat', price: 230.00 }] },

  // Meat - Specific Parts
  { name: 'Cow Skin (Kpomo)', category: 'Meat', rating: 4.8, image: 'https://images.unsplash.com/photo-1629813876020-00d984cfb7d8?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'cow', 'skin', 'kpomo', 'ponmo'], sizes: [{ size: 'Medium Pack', price: 15.00 }] },
  { name: 'Cow Head', category: 'Meat', rating: 4.5, image: 'https://images.unsplash.com/photo-1549488344-c7820ad2691e?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'cow', 'head'], sizes: [{ size: 'Whole Head', price: 45.00 }] },
  { name: 'Cow Feet', category: 'Meat', rating: 4.7, image: 'https://images.unsplash.com/photo-1533166649197-ff0bdf73c7ed?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'cow', 'feet', 'bokoto'], sizes: [{ size: '4 Pieces', price: 25.00 }] },
  { name: 'Cow Tripes (Towel)', category: 'Meat', rating: 4.6, image: 'https://images.unsplash.com/photo-1518492027159-0f488c9f0ef9?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'cow', 'tripes', 'towel', 'shaki'], sizes: [{ size: 'Medium Pack', price: 20.00 }] },
  { name: 'Beef Internal Organs', category: 'Meat', rating: 4.6, image: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'beef', 'organs', 'offal'], sizes: [{ size: 'Assorted Pack', price: 22.00 }] },
  { name: 'Beef Tongue', category: 'Meat', rating: 4.7, image: 'https://images.unsplash.com/photo-1624300629298-e9ad39c13bc0?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'beef', 'tongue'], sizes: [{ size: '1 Piece', price: 30.00 }] },
  { name: 'Goat Head', category: 'Meat', rating: 4.8, image: 'https://images.unsplash.com/photo-1632773418579-24add3e88701?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'goat', 'head', 'isi ewu'], sizes: [{ size: 'Whole Head', price: 25.00 }] },
  { name: 'Goat Feet', category: 'Meat', rating: 4.5, image: 'https://images.unsplash.com/photo-1522810574044-67253573c706?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'goat', 'feet'], sizes: [{ size: '4 Pieces', price: 18.00 }] },
  { name: 'Goat Internal Organs', category: 'Meat', rating: 4.6, image: 'https://images.unsplash.com/photo-1558030006-455b5d03ed82?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'goat', 'organs', 'offal'], sizes: [{ size: 'Assorted Pack', price: 20.00 }] },
  
  // Meat - Chicken
  { name: 'Chicken (Soft/Broiler)', category: 'Meat', rating: 4.8, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'chicken', 'soft', 'broiler', 'poultry'], sizes: [{ size: '1 Carton', price: 50.00 }] },
  { name: 'Chicken (Hard/Layer)', category: 'Meat', rating: 4.9, image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'chicken', 'hard', 'layer', 'poultry'], sizes: [{ size: '1 Carton', price: 60.00 }] },
  { name: 'Chicken (Cut)', category: 'Meat', rating: 4.7, image: 'https://images.unsplash.com/photo-1603360946321-4f32badb0230?w=600&auto=format&fit=crop&q=80', search_tags: ['meat', 'chicken', 'cut', 'parts', 'poultry'], sizes: [{ size: '1 Carton', price: 55.00 }] },

  // Snacks
  { name: 'Chin-chin', category: 'Snacks', rating: 4.8, image: 'https://images.unsplash.com/photo-1623910309176-ffda251a37c8?w=600&auto=format&fit=crop&q=80', search_tags: ['snacks', 'chin-chin', 'crunchy', 'pastry'], sizes: [{ size: 'Small Container', price: 5.00 }, { size: 'Large Container', price: 12.00 }] },
  { name: 'Puff-puff', category: 'Snacks', rating: 4.9, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80', search_tags: ['snacks', 'puff-puff', 'dough', 'fried'], sizes: [{ size: 'Mixed Box', price: 10.00 }] },
  { name: 'Nigerian Buns', category: 'Snacks', rating: 4.7, image: 'https://images.unsplash.com/photo-1615598687265-1d0dfa02ecf0?w=600&auto=format&fit=crop&q=80', search_tags: ['snacks', 'buns', 'nigerian', 'pastry'], sizes: [{ size: 'Mixed Box', price: 10.00 }] },
  { name: 'Meatpie', category: 'Snacks', rating: 4.9, image: 'https://images.unsplash.com/photo-1583344686524-7eaffb5c00e1?w=600&auto=format&fit=crop&q=80', search_tags: ['snacks', 'meatpie', 'pie', 'pastry'], sizes: [{ size: 'Half Dozen', price: 15.00 }, { size: 'Dozen', price: 28.00 }] },
  { name: 'Samosa', category: 'Snacks', rating: 4.8, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80', search_tags: ['snacks', 'samosa', 'pastry'], sizes: [{ size: 'Pack of 10', price: 12.00 }, { size: 'Pack of 30', price: 30.00 }] },
  { name: 'Fried Groundnut', category: 'Snacks', rating: 4.7, image: 'https://images.unsplash.com/photo-1549454133-c820894e63b6?w=600&auto=format&fit=crop&q=80', search_tags: ['snacks', 'groundnut', 'peanuts', 'fried'], sizes: [{ size: 'Bottle', price: 8.00 }] },
  { name: 'Kuli-kuli', category: 'Snacks', rating: 4.6, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80', search_tags: ['snacks', 'kuli-kuli', 'peanut', 'crunchy'], sizes: [{ size: 'Medium Pack', price: 6.00 }] },
  { name: 'Plantain Chips', category: 'Snacks', rating: 4.9, image: 'https://images.unsplash.com/photo-1599818816550-93a0da91322f?w=600&auto=format&fit=crop&q=80', search_tags: ['snacks', 'plantain', 'chips', 'crispy'], sizes: [{ size: 'Pack of 6', price: 10.00 }] },
  { name: 'Banana Chips', category: 'Snacks', rating: 4.8, image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=600&auto=format&fit=crop&q=80', search_tags: ['snacks', 'banana', 'chips', 'crispy'], sizes: [{ size: 'Pack of 6', price: 10.00 }] }
];

async function seed() {
  console.log('Fetching products...');
  const { data: currentProducts } = await supabase.from('products').select('id');
  if (currentProducts && currentProducts.length > 0) {
     const ids = currentProducts.map(p => p.id);
     console.log('Sending single batch delete for', ids.length, 'products...');
     await supabase.from('products').delete().in('id', ids);
     console.log('Old products deleted successfully.');
  }

  // Ensure categories
  await supabase.from('categories').insert([{name: "Seafood"}, {name: "Meat"}, {name: "Snacks"}]).select();

  console.log('Sending insert request in smaller batches...');
  for (let i = 0; i < products.length; i += 10) {
     const batch = products.slice(i, i + 10);
     const { error } = await supabase.from('products').insert(batch);
     if (error) {
       console.error('Batch error:', error);
     }
  }
  
  console.log('Successfully inserted all products!');
}

seed();
