-- Create missing tables to match UI usage

-- 1) Farm tasks (user-scoped)
CREATE TABLE IF NOT EXISTS public.farm_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  crop text,
  date date,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.farm_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'farm_tasks' AND policyname = 'Users can view own tasks'
  ) THEN
    CREATE POLICY "Users can view own tasks"
      ON public.farm_tasks FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'farm_tasks' AND policyname = 'Users can insert own tasks'
  ) THEN
    CREATE POLICY "Users can insert own tasks"
      ON public.farm_tasks FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'farm_tasks' AND policyname = 'Users can update own tasks'
  ) THEN
    CREATE POLICY "Users can update own tasks"
      ON public.farm_tasks FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'farm_tasks' AND policyname = 'Users can delete own tasks'
  ) THEN
    CREATE POLICY "Users can delete own tasks"
      ON public.farm_tasks FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Trigger to maintain updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_farm_tasks_updated_at'
  ) THEN
    CREATE TRIGGER trg_farm_tasks_updated_at
    BEFORE UPDATE ON public.farm_tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;


-- 2) Market forecasts (readable by everyone)
CREATE TABLE IF NOT EXISTS public.market_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commodity_name text NOT NULL,
  county text NOT NULL,
  forecast_price numeric,
  confidence_level text,
  period text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.market_forecasts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'market_forecasts' AND policyname = 'Anyone can view forecasts'
  ) THEN
    CREATE POLICY "Anyone can view forecasts"
      ON public.market_forecasts FOR SELECT USING (true);
  END IF;
END $$;


-- 3) Farm budgets (user-scoped)
CREATE TABLE IF NOT EXISTS public.farm_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  year integer NOT NULL,
  category text NOT NULL,
  subcategory text,
  planned_amount numeric NOT NULL,
  actual_amount numeric,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.farm_budgets ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'farm_budgets' AND policyname = 'Users can view own budgets'
  ) THEN
    CREATE POLICY "Users can view own budgets"
      ON public.farm_budgets FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'farm_budgets' AND policyname = 'Users can insert own budgets'
  ) THEN
    CREATE POLICY "Users can insert own budgets"
      ON public.farm_budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'farm_budgets' AND policyname = 'Users can update own budgets'
  ) THEN
    CREATE POLICY "Users can update own budgets"
      ON public.farm_budgets FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'farm_budgets' AND policyname = 'Users can delete own budgets'
  ) THEN
    CREATE POLICY "Users can delete own budgets"
      ON public.farm_budgets FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_farm_budgets_updated_at'
  ) THEN
    CREATE TRIGGER trg_farm_budgets_updated_at
    BEFORE UPDATE ON public.farm_budgets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;


-- 4) Payment transactions (user-scoped, read-only in UI)
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount numeric NOT NULL,
  description text,
  payment_provider text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'payment_transactions' AND policyname = 'Users can view own transactions'
  ) THEN
    CREATE POLICY "Users can view own transactions"
      ON public.payment_transactions FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'payment_transactions' AND policyname = 'Users can insert own transactions'
  ) THEN
    CREATE POLICY "Users can insert own transactions"
      ON public.payment_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
