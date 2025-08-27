-- Create missing tables referenced in the codebase

-- Animals table for farm management
CREATE TABLE public.animals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  birth_date DATE,
  health_status TEXT DEFAULT 'healthy',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Farm input suppliers table
CREATE TABLE public.farm_input_suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  location TEXT,
  products_offered TEXT[],
  rating NUMERIC,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Farm input products table
CREATE TABLE public.farm_input_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES public.farm_input_suppliers(id),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  availability_status TEXT DEFAULT 'available',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_input_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_input_products ENABLE ROW LEVEL SECURITY;

-- RLS policies for animals
CREATE POLICY "Users can view their own animals" ON public.animals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own animals" ON public.animals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own animals" ON public.animals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own animals" ON public.animals FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for suppliers (publicly viewable)
CREATE POLICY "Anyone can view suppliers" ON public.farm_input_suppliers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert suppliers" ON public.farm_input_suppliers FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS policies for products (publicly viewable)
CREATE POLICY "Anyone can view products" ON public.farm_input_products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage products" ON public.farm_input_products FOR ALL USING (auth.role() = 'authenticated');

-- Add triggers for updated_at
CREATE TRIGGER update_animals_updated_at
  BEFORE UPDATE ON public.animals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.farm_input_suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.farm_input_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();