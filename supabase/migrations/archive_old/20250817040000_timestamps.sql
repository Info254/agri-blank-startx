-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for timestamp updates
CREATE TRIGGER set_timestamp_parcels
    BEFORE UPDATE ON public.parcels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_timestamp_yield_tracking
    BEFORE UPDATE ON public.yield_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_timestamp_resource_usage
    BEFORE UPDATE ON public.resource_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_timestamp_farm_statistics
    BEFORE UPDATE ON public.farm_statistics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
