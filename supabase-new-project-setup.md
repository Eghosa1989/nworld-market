# New Supabase Project Setup

Your app has already been switched to this Supabase project:

- URL: `https://zpvdccvnjbqwsbbooanl.supabase.co`
- Anon key: `sb_publishable_ORVzsDh6s7mHxk6sCnEVKQ_j0Acwc0W`

I cannot run SQL in your Supabase project from here because this workspace only has the public anon key, not dashboard/service-role access.

Run the following in the Supabase SQL Editor, in this order.

## 1. Base tables and public read policies

```sql
-- 1. Create a table for Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create a table for Products
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL REFERENCES public.categories(name) ON DELETE CASCADE,
  image text NOT NULL,
  images text[] DEFAULT '{}'::text[],
  rating numeric DEFAULT 5.0,
  badge text,
  search_tags text[] DEFAULT '{}'::text[],
  sizes jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create a table for Orders
CREATE TABLE IF NOT EXISTS public.orders (
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

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public categories are viewable by everyone." ON public.categories;
CREATE POLICY "Public categories are viewable by everyone."
  ON public.categories FOR SELECT
  USING ( true );

DROP POLICY IF EXISTS "Products are viewable by everyone." ON public.products;
CREATE POLICY "Products are viewable by everyone."
  ON public.products FOR SELECT
  USING ( true );

DROP POLICY IF EXISTS "Anyone can create an order." ON public.orders;
CREATE POLICY "Anyone can create an order."
  ON public.orders FOR INSERT
  WITH CHECK ( true );
```

## 2. Auth profiles, wishlist, and storage

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  is_admin boolean DEFAULT false,
  join_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, split_part(new.email, '@', 1));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own wishlist" ON public.wishlist_items;
CREATE POLICY "Users view own wishlist"
  ON public.wishlist_items FOR SELECT
  USING ( auth.uid() = user_id );

DROP POLICY IF EXISTS "Users insert own wishlist" ON public.wishlist_items;
CREATE POLICY "Users insert own wishlist"
  ON public.wishlist_items FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

DROP POLICY IF EXISTS "Users delete own wishlist" ON public.wishlist_items;
CREATE POLICY "Users delete own wishlist"
  ON public.wishlist_items FOR DELETE
  USING ( auth.uid() = user_id );

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'product-images' );

DROP POLICY IF EXISTS "Auth Users Upload" ON storage.objects;
CREATE POLICY "Auth Users Upload"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Auth Users Update" ON storage.objects;
CREATE POLICY "Auth Users Update"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Auth Users Delete" ON storage.objects;
CREATE POLICY "Auth Users Delete"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
```

## 3. Orders read/update policies for admin screen

```sql
DROP POLICY IF EXISTS "Anyone can view orders." ON public.orders;
CREATE POLICY "Anyone can view orders."
  ON public.orders FOR SELECT
  USING ( true );

DROP POLICY IF EXISTS "Anyone can update orders." ON public.orders;
CREATE POLICY "Anyone can update orders."
  ON public.orders FOR UPDATE
  USING ( true );
```

## 4. Allow authenticated users to manage categories and products

This is needed for your admin page to add, edit, and delete products.

```sql
DROP POLICY IF EXISTS "Authenticated users manage categories" ON public.categories;
CREATE POLICY "Authenticated users manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING ( true )
  WITH CHECK ( true );

DROP POLICY IF EXISTS "Authenticated users manage products" ON public.products;
CREATE POLICY "Authenticated users manage products"
  ON public.products FOR ALL
  TO authenticated
  USING ( true )
  WITH CHECK ( true );
```

## 5. Seed the Seafood and Meat catalog

Use the SQL in [supabase-seed-catalog.md](c:/Users/EGHOSA/Desktop/store%20for%20mrs%20nneka/nworld-market/supabase-seed-catalog.md).

## 6. Google authentication

In Supabase:

- Go to Authentication -> Providers -> Google
- Enable Google
- Add your Google client ID and secret
- Set Site URL to `https://nworldmarket1.web.app`
- Add redirect URL `https://nworldmarket1.web.app/*`

After running all of the above, your app will load categories/products from the new backend only, upload product images to the bucket, and require Google auth for customer login.
