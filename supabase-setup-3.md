# Supabase Setup 3

Run this in the Supabase SQL Editor.

```sql
-- 1. Enable anyone to read orders (so the admin panel can fetch them and the checkout can return the inserted row)
CREATE POLICY "Anyone can view orders."
  ON public.orders FOR SELECT
  USING ( true );

-- 2. Enable anyone to update orders (so the admin panel can update the status)
CREATE POLICY "Anyone can update orders."
  ON public.orders FOR UPDATE
  USING ( true );
```
