-- Initial schema setup
CREATE TABLE IF NOT EXISTS farms (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    location text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS parcels (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    farm_id uuid REFERENCES farms(id) ON DELETE CASCADE,
    name text NOT NULL,
    area_hectares numeric(10,2) NOT NULL,
    soil_type text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own farms"
    ON farms FOR SELECT
    USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own farms"
    ON farms FOR INSERT
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own farms"
    ON farms FOR UPDATE
    USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own farms"
    ON farms FOR DELETE
    USING (owner_id = auth.uid());

CREATE POLICY "Users can view parcels of their farms"
    ON parcels FOR SELECT
    USING (farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid()));

CREATE POLICY "Users can insert parcels to their farms"
    ON parcels FOR INSERT
    WITH CHECK (farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid()));

CREATE POLICY "Users can update parcels of their farms"
    ON parcels FOR UPDATE
    USING (farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid()));

CREATE POLICY "Users can delete parcels of their farms"
    ON parcels FOR DELETE
    USING (farm_id IN (SELECT id FROM farms WHERE owner_id = auth.uid()));

-- Create indexes
CREATE INDEX farms_owner_id_idx ON farms(owner_id);
CREATE INDEX parcels_farm_id_idx ON parcels(farm_id);
