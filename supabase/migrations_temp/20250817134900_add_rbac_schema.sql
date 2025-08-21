-- RBAC Schema

-- Create roles table
CREATE TABLE public.roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Create permissions table
CREATE TABLE public.permissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE -- e.g., 'markets:create', 'users:delete'
);

-- Create role_permissions join table
CREATE TABLE public.role_permissions (
  role_id INTEGER NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id INTEGER NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Create user_roles join table
CREATE TABLE public.user_roles (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- Seed initial roles
INSERT INTO public.roles (name) VALUES
('admin'),
('farmer'),
('exporter'),
('service_provider'),
('guest');

-- Seed initial permissions
INSERT INTO public.permissions (name) VALUES
-- Profiles
('profiles:read'),
('profiles:write:own'),
('profiles:write:all'),
-- Markets
('markets:read'),
('markets:write'),
-- Logistics
('logistics:read'),
('logistics:write'),
-- Trading
('trading:read'),
('trading:write'),
-- Analytics
('analytics:read');

-- Assign permissions to roles
DO $$
DECLARE
  admin_role_id INT;
  farmer_role_id INT;
  exporter_role_id INT;
  service_provider_role_id INT;
  guest_role_id INT;
BEGIN
  -- Get role IDs
  SELECT id INTO admin_role_id FROM public.roles WHERE name = 'admin';
  SELECT id INTO farmer_role_id FROM public.roles WHERE name = 'farmer';
  SELECT id INTO exporter_role_id FROM public.roles WHERE name = 'exporter';
  SELECT id INTO service_provider_role_id FROM public.roles WHERE name = 'service_provider';
  SELECT id INTO guest_role_id FROM public.roles WHERE name = 'guest';

  -- Admin permissions (all)
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT admin_role_id, id FROM public.permissions;

  -- Farmer permissions
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT farmer_role_id, id FROM public.permissions WHERE name IN (
    'profiles:read',
    'profiles:write:own',
    'markets:read',
    'logistics:read',
    'trading:read',
    'trading:write'
  );

  -- Exporter permissions
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT exporter_role_id, id FROM public.permissions WHERE name IN (
    'profiles:read',
    'profiles:write:own',
    'markets:read',
    'logistics:read',
    'trading:read',
    'trading:write'
  );

  -- Service Provider permissions
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT service_provider_role_id, id FROM public.permissions WHERE name IN (
    'profiles:read',
    'profiles:write:own',
    'logistics:read',
    'logistics:write'
  );

  -- Guest permissions
  INSERT INTO public.role_permissions (role_id, permission_id)
  SELECT guest_role_id, id FROM public.permissions WHERE name IN (
    'markets:read',
    'logistics:read'
  );
END $$;

-- Enable RLS for the new tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for RBAC tables
-- Admins can manage all RBAC tables
CREATE POLICY "Allow admins full access" ON public.roles FOR ALL TO authenticated USING ( (SELECT id FROM public.roles WHERE name = 'admin') IN (SELECT role_id FROM public.user_roles WHERE user_id = auth.uid()) );
CREATE POLICY "Allow admins full access" ON public.permissions FOR ALL TO authenticated USING ( (SELECT id FROM public.roles WHERE name = 'admin') IN (SELECT role_id FROM public.user_roles WHERE user_id = auth.uid()) );
CREATE POLICY "Allow admins full access" ON public.role_permissions FOR ALL TO authenticated USING ( (SELECT id FROM public.roles WHERE name = 'admin') IN (SELECT role_id FROM public.user_roles WHERE user_id = auth.uid()) );
CREATE POLICY "Allow admins full access" ON public.user_roles FOR ALL TO authenticated USING ( (SELECT id FROM public.roles WHERE name = 'admin') IN (SELECT role_id FROM public.user_roles WHERE user_id = auth.uid()) );

-- Authenticated users can read roles and permissions
CREATE POLICY "Allow authenticated users to read roles" ON public.roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to read permissions" ON public.permissions FOR SELECT TO authenticated USING (true);

-- Users can view their own roles
CREATE POLICY "Allow users to see their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

