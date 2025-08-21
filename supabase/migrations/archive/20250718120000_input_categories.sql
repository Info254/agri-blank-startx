-- Migration: Add farm_input_categories table
CREATE TABLE IF NOT EXISTS public.farm_input_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Add category_id to farm_input_products
ALTER TABLE public.farm_input_products
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.farm_input_categories(id);

-- Index for faster category search
CREATE INDEX IF NOT EXISTS idx_farm_input_products_category_id ON public.farm_input_products(category_id);
