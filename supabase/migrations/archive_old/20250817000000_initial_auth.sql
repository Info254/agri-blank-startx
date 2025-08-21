-- Create auth schema and initial tables
CREATE SCHEMA IF NOT EXISTS auth;

-- Create basic users table (simplified version)
CREATE TABLE IF NOT EXISTS auth.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    encrypted_password text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create basic roles
CREATE TABLE IF NOT EXISTS auth.roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create user roles junction table
CREATE TABLE IF NOT EXISTS auth.user_roles (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id uuid REFERENCES auth.roles(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (user_id, role_id)
);

-- Create basic farms table
CREATE TABLE IF NOT EXISTS public.farms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    location text NOT NULL,
    size_hectares numeric(10,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create basic parcels table
CREATE TABLE IF NOT EXISTS public.parcels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id uuid REFERENCES public.farms(id) ON DELETE CASCADE,
    name text NOT NULL,
    size_hectares numeric(10,2) NOT NULL,
    soil_type text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own farms" ON public.farms
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can modify their own farms" ON public.farms
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view parcels of their farms" ON public.parcels
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.farms WHERE id = farm_id
        )
    );
CREATE POLICY "Users can modify parcels of their farms" ON public.parcels
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM public.farms WHERE id = farm_id
        )
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS farms_user_id_idx ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS parcels_farm_id_idx ON public.parcels(farm_id);

-- Create auth helper functions
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid AS $$
BEGIN
    RETURN current_setting('request.jwt.claims', true)::json->>'sub'::uuid;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;
