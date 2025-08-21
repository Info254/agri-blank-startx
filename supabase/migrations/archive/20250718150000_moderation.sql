-- Add comment to ratings tables
ALTER TABLE public.farm_input_product_ratings ADD COLUMN IF NOT EXISTS comment TEXT;
ALTER TABLE public.farm_input_supplier_ratings ADD COLUMN IF NOT EXISTS comment TEXT;

-- Flags table for suppliers/products
CREATE TABLE IF NOT EXISTS public.marketplace_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT CHECK (entity_type IN ('supplier', 'product')),
    entity_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Ban recommendations table
CREATE TABLE IF NOT EXISTS public.marketplace_ban_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT CHECK (entity_type IN ('supplier', 'product')),
    entity_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);
