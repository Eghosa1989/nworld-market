-- 1. Create a Profiles table to store additional user info
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  is_admin boolean DEFAULT false,
  join_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles are viewable by everyone
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

-- Users can insert/update their own profile
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, split_part(new.email, '@', 1));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. Create the Wishlist table
CREATE TABLE public.wishlist_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Users can see their own wishlist
CREATE POLICY "Users view own wishlist"
  ON public.wishlist_items FOR SELECT
  USING ( auth.uid() = user_id );

-- Users can insert their own wishlist items
CREATE POLICY "Users insert own wishlist"
  ON public.wishlist_items FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

-- Users can delete their own wishlist items
CREATE POLICY "Users delete own wishlist"
  ON public.wishlist_items FOR DELETE
  USING ( auth.uid() = user_id );

-- 3. Set up Storage for Product Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Anyone can read public images
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'product-images' );

-- Authenticated users (we will assume admins since we are keeping it simple) can insert images
CREATE POLICY "Auth Users Upload"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Auth Users Update"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

CREATE POLICY "Auth Users Delete"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
