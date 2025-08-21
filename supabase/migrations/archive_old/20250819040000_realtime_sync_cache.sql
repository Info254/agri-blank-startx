-- Real-time data synchronization and caching system

-- Create table for real-time sync status
CREATE TABLE IF NOT EXISTS public.sync_status (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    entity_type text NOT NULL,
    last_sync_at timestamp with time zone,
    sync_status text NOT NULL,
    sync_error text,
    retry_count integer DEFAULT 0,
    next_retry_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create table for sync queue
CREATE TABLE IF NOT EXISTS public.sync_queue (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    operation text NOT NULL,
    payload jsonb NOT NULL,
    priority integer DEFAULT 0,
    status text DEFAULT 'pending',
    error_message text,
    retry_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create table for data cache
CREATE TABLE IF NOT EXISTS public.data_cache (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    cache_key text NOT NULL,
    cache_value jsonb NOT NULL,
    user_id uuid REFERENCES auth.users,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT unique_cache_key UNIQUE (cache_key, user_id)
);

-- Create function to manage sync queue
CREATE OR REPLACE FUNCTION public.enqueue_sync_operation(
    p_user_id uuid,
    p_entity_type text,
    p_entity_id uuid,
    p_operation text,
    p_payload jsonb,
    p_priority integer DEFAULT 0
)
RETURNS uuid AS $$
DECLARE
    v_queue_id uuid;
BEGIN
    INSERT INTO public.sync_queue (
        user_id,
        entity_type,
        entity_id,
        operation,
        payload,
        priority
    ) VALUES (
        p_user_id,
        p_entity_type,
        p_entity_id,
        p_operation,
        p_payload,
        p_priority
    ) RETURNING id INTO v_queue_id;

    -- Notify sync processor
    PERFORM pg_notify(
        'sync_queue_update',
        json_build_object(
            'queue_id', v_queue_id,
            'entity_type', p_entity_type,
            'priority', p_priority
        )::text
    );

    RETURN v_queue_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to process sync queue
CREATE OR REPLACE FUNCTION public.process_sync_queue()
RETURNS void AS $$
DECLARE
    v_queue_item record;
BEGIN
    -- Get next items to process
    FOR v_queue_item IN
        SELECT *
        FROM public.sync_queue
        WHERE status = 'pending'
        ORDER BY priority DESC, created_at ASC
        LIMIT 100
        FOR UPDATE SKIP LOCKED
    LOOP
        BEGIN
            -- Update status to processing
            UPDATE public.sync_queue
            SET status = 'processing',
                updated_at = now()
            WHERE id = v_queue_item.id;

            -- Process based on entity type and operation
            CASE v_queue_item.entity_type
                WHEN 'farm_statistics' THEN
                    PERFORM process_farm_statistics_sync(v_queue_item.payload);
                WHEN 'yield_tracking' THEN
                    PERFORM process_yield_tracking_sync(v_queue_item.payload);
                WHEN 'resource_usage' THEN
                    PERFORM process_resource_usage_sync(v_queue_item.payload);
                ELSE
                    RAISE EXCEPTION 'Unsupported entity type: %', v_queue_item.entity_type;
            END CASE;

            -- Update sync status
            INSERT INTO public.sync_status (
                user_id,
                entity_type,
                last_sync_at,
                sync_status
            ) VALUES (
                v_queue_item.user_id,
                v_queue_item.entity_type,
                now(),
                'success'
            )
            ON CONFLICT (user_id, entity_type)
            DO UPDATE SET
                last_sync_at = EXCLUDED.last_sync_at,
                sync_status = EXCLUDED.sync_status,
                updated_at = now();

            -- Mark as completed
            UPDATE public.sync_queue
            SET status = 'completed',
                updated_at = now()
            WHERE id = v_queue_item.id;

        EXCEPTION WHEN OTHERS THEN
            -- Handle error
            UPDATE public.sync_queue
            SET status = CASE WHEN retry_count >= 3 THEN 'failed' ELSE 'pending' END,
                error_message = SQLERRM,
                retry_count = retry_count + 1,
                updated_at = now()
            WHERE id = v_queue_item.id;

            UPDATE public.sync_status
            SET sync_status = 'error',
                sync_error = SQLERRM,
                retry_count = retry_count + 1,
                next_retry_at = now() + (interval '5 minutes' * retry_count),
                updated_at = now()
            WHERE user_id = v_queue_item.user_id
            AND entity_type = v_queue_item.entity_type;
        END;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to manage cache
CREATE OR REPLACE FUNCTION public.get_or_set_cache(
    p_key text,
    p_user_id uuid,
    p_ttl interval,
    p_generator_func text
)
RETURNS jsonb AS $$
DECLARE
    v_cached_value jsonb;
    v_new_value jsonb;
BEGIN
    -- Try to get from cache
    SELECT cache_value
    INTO v_cached_value
    FROM public.data_cache
    WHERE cache_key = p_key
    AND user_id = p_user_id
    AND (expires_at IS NULL OR expires_at > now());

    -- Return cached value if exists
    IF v_cached_value IS NOT NULL THEN
        RETURN v_cached_value;
    END IF;

    -- Generate new value
    EXECUTE 'SELECT ' || p_generator_func || '($1)' 
    INTO v_new_value
    USING p_user_id;

    -- Store in cache
    INSERT INTO public.data_cache (
        cache_key,
        cache_value,
        user_id,
        expires_at
    ) VALUES (
        p_key,
        v_new_value,
        p_user_id,
        CASE WHEN p_ttl IS NOT NULL THEN now() + p_ttl ELSE NULL END
    )
    ON CONFLICT (cache_key, user_id)
    DO UPDATE SET
        cache_value = EXCLUDED.cache_value,
        expires_at = EXCLUDED.expires_at,
        updated_at = now();

    RETURN v_new_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to invalidate cache
CREATE OR REPLACE FUNCTION public.invalidate_cache(
    p_key text,
    p_user_id uuid
)
RETURNS void AS $$
BEGIN
    DELETE FROM public.data_cache
    WHERE cache_key = p_key
    AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create cache cleanup job
CREATE OR REPLACE FUNCTION public.cleanup_expired_cache()
RETURNS void AS $$
BEGIN
    DELETE FROM public.data_cache
    WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on new tables
ALTER TABLE public.sync_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_cache ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own sync status" ON public.sync_status
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sync queue" ON public.sync_queue
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own cache" ON public.data_cache
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Create indexes
CREATE INDEX IF NOT EXISTS sync_queue_status_priority_idx ON public.sync_queue(status, priority DESC, created_at ASC);
CREATE INDEX IF NOT EXISTS data_cache_key_user_expires_idx ON public.data_cache(cache_key, user_id, expires_at);
CREATE INDEX IF NOT EXISTS sync_status_user_type_idx ON public.sync_status(user_id, entity_type);
