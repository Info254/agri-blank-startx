-- Create base tables
CREATE TABLE public.parcels (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    size_hectares numeric(10,2) NOT NULL CHECK (size_hectares > 0),
    soil_type text,
    location_lat numeric(10,6),
    location_lng numeric(10,6),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.crops (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    scientific_name text,
    typical_yield_per_hectare numeric(10,2),
    growing_season_days integer,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(name)
);

CREATE TABLE public.plantings (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    parcel_id uuid REFERENCES public.parcels(id) ON DELETE CASCADE,
    crop_id uuid REFERENCES public.crops(id) ON DELETE RESTRICT,
    planting_date date NOT NULL,
    expected_harvest_date date,
    area_planted_hectares numeric(10,2) NOT NULL CHECK (area_planted_hectares > 0),
    expected_yield numeric(10,2),
    actual_yield numeric(10,2),
    status text NOT NULL CHECK (status IN ('planned', 'planted', 'growing', 'harvested', 'failed')),
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add updated_at triggers
CREATE TRIGGER handle_updated_at_parcels
    BEFORE UPDATE ON public.parcels
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_crops
    BEFORE UPDATE ON public.crops
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_plantings
    BEFORE UPDATE ON public.plantings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plantings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own parcels"
    ON public.parcels FOR SELECT
    USING (owner_id = auth.uid());

CREATE POLICY "Users can modify their own parcels"
    ON public.parcels FOR ALL
    USING (owner_id = auth.uid());

CREATE POLICY "Crops visible to all authenticated users"
    ON public.crops FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can modify crops"
    ON public.crops FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.uid() = auth.users.id
            AND auth.users.role = 'admin'
        )
    );

CREATE POLICY "Users can view their own plantings"
    ON public.plantings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.parcels
            WHERE parcels.id = plantings.parcel_id
            AND parcels.owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can modify their own plantings"
    ON public.plantings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.parcels
            WHERE parcels.id = plantings.parcel_id
            AND parcels.owner_id = auth.uid()
        )
    );
