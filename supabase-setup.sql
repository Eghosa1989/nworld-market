-- 1. Create a table for Categories
CREATE TABLE public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create a table for Products
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL REFERENCES public.categories(name) ON DELETE CASCADE,
  image text NOT NULL,
  images text[] DEFAULT '{}'::text[],
  rating numeric DEFAULT 5.0,
  badge text,
  search_tags text[] DEFAULT '{}'::text[],
  sizes jsonb NOT NULL DEFAULT '[]'::jsonb, -- Array of { size: string, price: number }
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create a table for Orders
CREATE TABLE public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text,
  total numeric NOT NULL,
  status text DEFAULT 'Pending'::text,
  payment_method text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Set up Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.categories FOR SELECT
  USING ( true );

-- Allow public read access to products
CREATE POLICY "Products are viewable by everyone."
  ON public.products FOR SELECT
  USING ( true );

-- For now, allow public insert to orders (so guest users can checkout)
CREATE POLICY "Anyone can create an order."
  ON public.orders FOR INSERT
  WITH CHECK ( true );

-- (For production, you'd restrict these further based on admin roles, 
-- but this allows the store to work exactly as it does now!)

-- Insert default categories
INSERT INTO public.categories (name) VALUES 
('Seafood - Frozen/Dry/Fresh'), ('Meat sharing'), ('Cow parts'),
('Goat parts'), ('Tubers'), ('Drinks/Water'), ('Fresh/Dry vegetables'),
('Oils'), ('Flour/Grains'), ('Snails/Fishes'), ('Spices');
