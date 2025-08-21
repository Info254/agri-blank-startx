

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."calculate_platform_yield_improvement"() RETURNS numeric
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    -- Your existing function logic here
    -- Example placeholder:
    RETURN 0.0;
END;
$$;


ALTER FUNCTION "public"."calculate_platform_yield_improvement"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."check_rate_limit"("p_user_id" "uuid", "p_subscription_type" "text", "p_time_window" interval DEFAULT '00:01:00'::interval) RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  request_count integer;
  rate_limit integer;
  reset_time timestamp with time zone;
BEGIN
  -- Set rate limits based on subscription type
  CASE p_subscription_type
    WHEN 'free' THEN rate_limit := 100;
    WHEN 'developer' THEN rate_limit := 500;
    WHEN 'enterprise' THEN rate_limit := 2000;
    ELSE rate_limit := 10; -- Very restrictive for invalid subscriptions
  END CASE;
  
  -- Calculate reset time (next minute boundary)
  reset_time := date_trunc('minute', now()) + interval '1 minute';
  
  -- Count requests in the current time window
  SELECT COUNT(*)
  INTO request_count
  FROM public.api_usage
  WHERE user_id = p_user_id
    AND created_at >= (now() - p_time_window);
  
  RETURN jsonb_build_object(
    'allowed', request_count < rate_limit,
    'limit', rate_limit,
    'remaining', GREATEST(0, rate_limit - request_count),
    'reset_time', reset_time,
    'current_usage', request_count
  );
END;
$$;


ALTER FUNCTION "public"."check_rate_limit"("p_user_id" "uuid", "p_subscription_type" "text", "p_time_window" interval) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_livestock_market_stats"("p_market_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_listings', COUNT(*),
    'average_price', AVG(price),
    'by_type', (
      SELECT jsonb_object_agg(
        type, 
        jsonb_build_object(
          'count', COUNT(*),
          'avg_price', AVG(price)
        )
      )
      FROM public.livestock_for_sale
      WHERE market_id = p_market_id
      GROUP BY type
    ),
    'by_breed', (
      SELECT jsonb_object_agg(
        breed, 
        jsonb_build_object(
          'count', COUNT(*),
          'avg_price', AVG(price)
        )
      )
      FROM public.livestock_for_sale
      WHERE market_id = p_market_id
      GROUP BY breed
    )
  ) INTO result
  FROM public.livestock_for_sale
  WHERE market_id = p_market_id;

  RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_livestock_market_stats"("p_market_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
    -- Function logic here
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_admin_action"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    INSERT INTO public.admin_action_logs (
        action_type, 
        table_name, 
        user_id
    ) VALUES (
        TG_OP, 
        TG_TABLE_NAME, 
        auth.uid()
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."log_admin_action"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_feature_request_user_id"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    -- Automatically set user_id to the current authenticated user
    NEW.user_id = auth.uid();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_feature_request_user_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
    -- Function logic here
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trigger_set_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."trigger_set_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_city_market_products_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_city_market_products_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_modified_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW; 
END;
$$;


ALTER FUNCTION "public"."update_modified_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_total_registered_farmers"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    -- Preserve the original function logic
    -- You'll need to replace this with the actual implementation
    RAISE NOTICE 'Function updated with fixed search path';
END;
$$;


ALTER FUNCTION "public"."update_total_registered_farmers"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_has_role"("required_role" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE 
    current_user_role text;
BEGIN
    current_user_role := current_setting('request.jwt.claims.app_metadata', true);
    RETURN (current_user_role::jsonb->>'role')::text = required_role;
EXCEPTION 
    WHEN others THEN 
        RETURN false;
END;
$$;


ALTER FUNCTION "public"."user_has_role"("required_role" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_api_key"("p_key_hash" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  key_record record;
  subscription_info record;
  result jsonb;
BEGIN
  -- Get API key info
  SELECT ak.*, p.id as profile_id, p.full_name, p.email
  INTO key_record
  FROM public.api_keys ak
  LEFT JOIN public.profiles p ON ak.user_id = p.id
  WHERE ak.key_hash = p_key_hash 
    AND ak.is_active = true
    AND (ak.expires_at IS NULL OR ak.expires_at > now());
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Invalid or expired API key');
  END IF;
  
  -- Get subscription info from business advertisements
  SELECT 
    CASE 
      WHEN MAX(amount_paid) >= 15000 THEN 'enterprise'
      WHEN MAX(amount_paid) >= 2500 THEN 'developer'
      ELSE 'free'
    END as subscription_type,
    COUNT(*) as active_ads
  INTO subscription_info
  FROM public.business_advertisements
  WHERE user_id = key_record.user_id
    AND payment_status = 'paid'
    AND expires_at > now()
    AND is_active = true;
  
  -- Update last used timestamp
  UPDATE public.api_keys 
  SET last_used_at = now() 
  WHERE id = key_record.id;
  
  result := jsonb_build_object(
    'valid', true,
    'user_id', key_record.user_id,
    'api_key_id', key_record.id,
    'subscription_type', COALESCE(subscription_info.subscription_type, 'free'),
    'user_name', key_record.full_name,
    'user_email', key_record.email
  );
  
  RETURN result;
END;
$$;


ALTER FUNCTION "public"."validate_api_key"("p_key_hash" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_action_logs" (
    "id" integer NOT NULL,
    "action_type" "text" NOT NULL,
    "table_name" "text" NOT NULL,
    "user_id" "uuid",
    "action_timestamp" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."admin_action_logs" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."admin_action_logs_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."admin_action_logs_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."admin_action_logs_id_seq" OWNED BY "public"."admin_action_logs"."id";



CREATE TABLE IF NOT EXISTS "public"."agents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "market_id" "uuid",
    "role" "text" NOT NULL,
    "profile_info" "text",
    "verified" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."agents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."aggregators" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "aggregator_name" "text" NOT NULL,
    "business_type" "text" DEFAULT 'aggregator'::"text" NOT NULL,
    "registration_number" "text",
    "contact_person" "text" NOT NULL,
    "contact_phone" "text" NOT NULL,
    "contact_email" "text" NOT NULL,
    "physical_address" "text" NOT NULL,
    "county" "text" NOT NULL,
    "sub_county" "text",
    "coordinates" "jsonb",
    "commodities_handled" "text"[] NOT NULL,
    "storage_capacity_tons" numeric(10,2) DEFAULT 0,
    "has_cold_storage" boolean DEFAULT false,
    "has_drying_facilities" boolean DEFAULT false,
    "has_packaging_facilities" boolean DEFAULT false,
    "collection_points" "text"[] DEFAULT '{}'::"text"[],
    "service_radius_km" integer DEFAULT 100,
    "minimum_quantity_tons" numeric(8,2) DEFAULT 1,
    "farmers_network_size" integer DEFAULT 0,
    "pricing_model" "text" DEFAULT 'market_based'::"text",
    "commission_rate_percent" numeric(5,2) DEFAULT 0,
    "payment_terms" "text"[] DEFAULT '{}'::"text"[],
    "certifications" "text"[] DEFAULT '{}'::"text"[],
    "is_verified" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "rating" numeric(3,2) DEFAULT 0.0,
    "total_transactions" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."aggregators" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."animal_health" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "animal_id" "uuid",
    "health_status" "text" NOT NULL,
    "notes" "text",
    "recorded_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."animal_health" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."animal_records" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "animal_id" "uuid",
    "record_type" "text" NOT NULL,
    "description" "text",
    "record_date" "date" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."animal_records" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."animal_sales" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "animal_id" "uuid",
    "sale_date" "date" NOT NULL,
    "buyer" "text",
    "price" numeric,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."animal_sales" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."animals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "name" "text" NOT NULL,
    "species" "text" NOT NULL,
    "breed" "text",
    "birth_date" "date",
    "acquisition_date" "date",
    "status" "text" DEFAULT 'active'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."animals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."api_keys" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "key_hash" "text" NOT NULL,
    "key_preview" "text" NOT NULL,
    "name" "text" DEFAULT 'Default API Key'::"text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "last_used_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone
);


ALTER TABLE "public"."api_keys" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."api_usage" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "api_key_id" "uuid" NOT NULL,
    "endpoint" "text" NOT NULL,
    "method" "text" DEFAULT 'GET'::"text" NOT NULL,
    "status_code" integer NOT NULL,
    "response_time_ms" integer,
    "request_size_bytes" integer DEFAULT 0,
    "response_size_bytes" integer DEFAULT 0,
    "ip_address" "inet",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."api_usage" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."market_details" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "market_name" "text" NOT NULL,
    "county_code" "text" NOT NULL,
    "county_name" "text" NOT NULL,
    "city" "text" NOT NULL,
    "market_type" "text",
    "primary_goods" "text"[],
    "operating_days" "text"[],
    "market_size" "text",
    "latitude" numeric(10,7),
    "longitude" numeric(10,7),
    "contact_phone" "text",
    "contact_email" "text",
    "is_active" boolean DEFAULT true,
    "market_description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."market_details" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."app_market_selection" AS
 SELECT "market_details"."id",
    "market_details"."market_name",
    "market_details"."city"
   FROM "public"."market_details"
  WHERE ("market_details"."is_active" = true);


ALTER TABLE "public"."app_market_selection" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."barter_listings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "commodity" "text" NOT NULL,
    "quantity" numeric NOT NULL,
    "unit" "text" DEFAULT 'kg'::"text" NOT NULL,
    "description" "text",
    "image_urls" "text"[] DEFAULT '{}'::"text"[],
    "location" "text" NOT NULL,
    "county" "text" NOT NULL,
    "seeking_commodities" "text"[] NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "expires_at" timestamp with time zone,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."barter_listings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."batch_tracking" (
    "batch_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "farmer_id" "uuid",
    "product_type" "text",
    "quantity" integer,
    "origin" "text",
    "destination" "text",
    "status" "text" DEFAULT 'created'::"text",
    "events" "jsonb",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."batch_tracking" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bulk_order_bids" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid",
    "farmer_id" "uuid",
    "price" numeric NOT NULL,
    "quality_offer" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."bulk_order_bids" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bulk_orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "buyer_id" "uuid",
    "produce_type" "text" NOT NULL,
    "quantity" integer NOT NULL,
    "quality" "text",
    "delivery_date" "date",
    "status" "text" DEFAULT 'open'::"text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."bulk_orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."business_advertisements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "business_name" "text" NOT NULL,
    "business_description" "text" NOT NULL,
    "business_category" "text" NOT NULL,
    "contact_email" "text" NOT NULL,
    "contact_phone" "text",
    "location" "text" NOT NULL,
    "website_url" "text",
    "image_url" "text",
    "ad_content" "text" NOT NULL,
    "target_audience" "text"[] DEFAULT '{}'::"text"[],
    "payment_status" "text" DEFAULT 'pending'::"text",
    "payment_id" "text",
    "amount_paid" numeric(10,2),
    "expires_at" timestamp with time zone,
    "is_active" boolean DEFAULT false,
    "views_count" integer DEFAULT 0,
    "clicks_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "business_advertisements_payment_status_check" CHECK (("payment_status" = ANY (ARRAY['pending'::"text", 'paid'::"text", 'expired'::"text"])))
);


ALTER TABLE "public"."business_advertisements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."business_matches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "business1_id" "uuid",
    "business2_id" "uuid",
    "match_type" "text",
    "status" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."business_matches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."carbon_forum_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "title" "text",
    "content" "text",
    "type" "text",
    "event_date" "date",
    "org_link" "text",
    "success_story" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."carbon_forum_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."city_market_auctions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid" NOT NULL,
    "auction_start" timestamp with time zone NOT NULL,
    "auction_end" timestamp with time zone NOT NULL,
    "starting_price" numeric NOT NULL,
    "current_bid" numeric,
    "winner_user_id" "uuid",
    "status" "text" DEFAULT 'open'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."city_market_auctions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."city_market_ban_recommendations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "market_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "reason" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."city_market_ban_recommendations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."city_market_bids" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "auction_id" "uuid" NOT NULL,
    "bidder_user_id" "uuid" NOT NULL,
    "bid_amount" numeric NOT NULL,
    "bid_time" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."city_market_bids" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."city_market_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "market_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "comment" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."city_market_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."city_market_donations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid",
    "home_id" "uuid",
    "agent_id" "uuid",
    "donated_at" timestamp without time zone DEFAULT "now"(),
    "recipient_type" "text",
    "recipient_id" "uuid",
    CONSTRAINT "city_market_donations_recipient_type_check" CHECK (("recipient_type" = ANY (ARRAY['school'::"text", 'CBO'::"text", 'hospital'::"text", 'church'::"text", 'hospice'::"text"])))
);


ALTER TABLE "public"."city_market_donations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."city_market_flags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "market_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "reason" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."city_market_flags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."city_market_likes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "market_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."city_market_likes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."city_market_products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "seller_user_id" "uuid" NOT NULL,
    "market_id" "uuid" NOT NULL,
    "product_type" "text" NOT NULL,
    "quantity" numeric NOT NULL,
    "price" numeric NOT NULL,
    "auction_status" "text" DEFAULT 'none'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "status" "text" DEFAULT 'fresh'::"text",
    "category" "text" DEFAULT 'standard'::"text",
    "posted_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."city_market_products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."city_market_ratings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "market_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "rating" integer NOT NULL,
    "comment" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "city_market_ratings_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."city_market_ratings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."city_markets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "market_name" "text" NOT NULL,
    "market_type" "text" NOT NULL,
    "city" "text" NOT NULL,
    "county" "text" NOT NULL,
    "physical_address" "text" NOT NULL,
    "coordinates" "jsonb" NOT NULL,
    "operating_hours" "text" NOT NULL,
    "operating_days" "text"[] NOT NULL,
    "market_fee_structure" "jsonb",
    "facilities" "text"[] DEFAULT '{}'::"text"[],
    "commodities_traded" "text"[] NOT NULL,
    "average_daily_traders" integer DEFAULT 0,
    "average_daily_buyers" integer DEFAULT 0,
    "established_year" integer,
    "market_authority" "text",
    "contact_phone" "text",
    "contact_email" "text",
    "website_url" "text",
    "social_media" "jsonb",
    "is_verified" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."city_markets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."collaboration_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "collaboration_id" "uuid" NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "sender_type" "text" NOT NULL,
    "message_content" "text" NOT NULL,
    "message_type" "text" DEFAULT 'text'::"text",
    "attachment_urls" "text"[],
    "is_read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."collaboration_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."collaboration_proposals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "collaboration_id" "uuid" NOT NULL,
    "exporter_id" "uuid" NOT NULL,
    "proposal_type" "text" NOT NULL,
    "proposed_price_per_unit" numeric,
    "proposed_total_value" numeric,
    "service_fees" numeric,
    "documentation_fee" numeric,
    "logistics_fee" numeric,
    "payment_terms" "text",
    "delivery_terms" "text",
    "quality_requirements" "text"[],
    "export_timeline" "text",
    "market_destination" "text"[],
    "services_included" "text"[],
    "terms_and_conditions" "text",
    "proposal_status" "text" DEFAULT 'pending'::"text",
    "farmer_response" "text",
    "exporter_notes" "text",
    "valid_until" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."collaboration_proposals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."community_polls" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid",
    "user_id" "uuid" NOT NULL,
    "question" "text" NOT NULL,
    "options" "jsonb" NOT NULL,
    "total_votes" integer DEFAULT 0,
    "ends_at" timestamp with time zone,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."community_polls" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."community_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "category" "text" DEFAULT 'general'::"text" NOT NULL,
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "likes_count" integer DEFAULT 0,
    "comments_count" integer DEFAULT 0,
    "location" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."community_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contract_applications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "contract_id" "uuid",
    "farmer_id" "uuid",
    "message" "text",
    "land_size" numeric(10,2),
    "experience_years" integer,
    "previous_contracts" integer DEFAULT 0,
    "status" "text" DEFAULT 'pending'::"text",
    "applied_at" timestamp with time zone DEFAULT "now"(),
    "reviewed_at" timestamp with time zone,
    "reviewed_by" "uuid",
    CONSTRAINT "contract_applications_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'accepted'::"text", 'rejected'::"text", 'withdrawn'::"text"])))
);


ALTER TABLE "public"."contract_applications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contract_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "contract_id" "uuid",
    "user_id" "uuid",
    "comment" "text" NOT NULL,
    "parent_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."contract_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contract_documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "contract_id" "uuid",
    "name" "text" NOT NULL,
    "url" "text" NOT NULL,
    "file_type" "text",
    "file_size" integer,
    "uploaded_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."contract_documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contract_farming_opportunities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "company_name" "text" NOT NULL,
    "location" "text" NOT NULL,
    "crop_type" "text" NOT NULL,
    "contract_duration" "text",
    "price_per_unit" numeric(10,2),
    "minimum_quantity" numeric(10,2),
    "maximum_quantity" numeric(10,2),
    "unit" "text",
    "requirements" "text",
    "benefits" "text",
    "contact_person" "text",
    "contact_email" "text",
    "contact_phone" "text",
    "status" "text" DEFAULT 'active'::"text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "expires_at" timestamp with time zone,
    CONSTRAINT "contract_farming_opportunities_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'inactive'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."contract_farming_opportunities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contract_flags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "contract_id" "uuid",
    "user_id" "uuid",
    "reason" "text" NOT NULL,
    "description" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "reviewed_at" timestamp with time zone,
    "reviewed_by" "uuid",
    CONSTRAINT "contract_flags_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'reviewed'::"text", 'resolved'::"text", 'dismissed'::"text"])))
);


ALTER TABLE "public"."contract_flags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contract_reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "contract_id" "uuid",
    "user_id" "uuid",
    "rating" integer NOT NULL,
    "comment" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "contract_reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."contract_reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contract_social_shares" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "contract_id" "uuid",
    "user_id" "uuid",
    "platform" "text" NOT NULL,
    "shared_at" timestamp with time zone DEFAULT "now"(),
    "ip_address" "inet",
    CONSTRAINT "contract_social_shares_platform_check" CHECK (("platform" = ANY (ARRAY['facebook'::"text", 'twitter'::"text", 'whatsapp'::"text", 'linkedin'::"text", 'email'::"text", 'other'::"text"])))
);


ALTER TABLE "public"."contract_social_shares" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."crop_tracking" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "parcel_id" "uuid",
    "crop_name" "text" NOT NULL,
    "variety" "text",
    "planting_date" "date" NOT NULL,
    "expected_harvest_date" "date",
    "actual_harvest_date" "date",
    "planted_area" numeric NOT NULL,
    "seeds_used" numeric,
    "fertilizer_applied" "jsonb",
    "pesticides_applied" "jsonb",
    "irrigation_schedule" "jsonb",
    "growth_stage" "text" DEFAULT 'planted'::"text",
    "estimated_yield" numeric,
    "actual_yield" numeric,
    "quality_grade" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."crop_tracking" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."crop_yields" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "crop_type" "text" NOT NULL,
    "planting_date" "date" NOT NULL,
    "expected_yield" numeric(10,2),
    "actual_yield" numeric(10,2),
    "yield_improvement" numeric(5,2) GENERATED ALWAYS AS (
CASE
    WHEN ("expected_yield" > (0)::numeric) THEN ((("actual_yield" - "expected_yield") / "expected_yield") * (100)::numeric)
    ELSE (0)::numeric
END) STORED,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."crop_yields" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."data_fetch_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "source" "text" NOT NULL,
    "status" "text" NOT NULL,
    "records_count" integer DEFAULT 0,
    "error_message" "text",
    "execution_time_ms" integer,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."data_fetch_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."equipment" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "category" "text" NOT NULL,
    "available_for" "text"[] NOT NULL,
    "price" numeric,
    "owner_id" "uuid",
    "location" "text",
    "county" "text",
    "contact_phone" "text",
    "contact_email" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."equipment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."equipment_ban_recommendations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "equipment_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "reason" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."equipment_ban_recommendations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."equipment_bookmarks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "equipment_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."equipment_bookmarks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."equipment_flags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "equipment_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "reason" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."equipment_flags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."equipment_likes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "equipment_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."equipment_likes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."equipment_ratings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "equipment_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "rating" integer NOT NULL,
    "comment" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "equipment_ratings_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."equipment_ratings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."export_documentation" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "export_opportunity_id" "uuid",
    "document_type" "text" NOT NULL,
    "required" boolean DEFAULT true,
    "uploaded_by" "uuid",
    "file_url" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."export_documentation" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."export_opportunities" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "buyer_name" "text" NOT NULL,
    "destination_country" "text" NOT NULL,
    "crop_type" "text" NOT NULL,
    "quantity_tons" numeric NOT NULL,
    "specifications" "text",
    "price_per_ton" numeric,
    "payment_terms" "text",
    "delivery_terms" "text",
    "required_certifications" "text"[],
    "min_order_quantity" numeric,
    "status" "text" DEFAULT 'open'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid",
    "opportunity_type" "text" DEFAULT 'buy'::"text",
    CONSTRAINT "export_opportunities_opportunity_type_check" CHECK (("opportunity_type" = ANY (ARRAY['buy'::"text", 'sell'::"text"])))
);


ALTER TABLE "public"."export_opportunities" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."export_orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "export_opportunity_id" "uuid",
    "consolidation_id" "uuid",
    "transporter_id" "uuid",
    "status" "text" DEFAULT 'pending'::"text",
    "shipping_date" "date",
    "tracking_link" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid"
);


ALTER TABLE "public"."export_orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exporter_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "company_name" "text" NOT NULL,
    "company_registration_number" "text",
    "business_license_number" "text",
    "export_license_number" "text",
    "company_description" "text",
    "contact_person_name" "text" NOT NULL,
    "contact_phone" "text" NOT NULL,
    "contact_email" "text" NOT NULL,
    "office_location" "text" NOT NULL,
    "office_county" "text" NOT NULL,
    "office_coordinates" "jsonb",
    "website_url" "text",
    "years_in_business" integer,
    "export_markets" "text"[] NOT NULL,
    "commodities_handled" "text"[] NOT NULL,
    "services_offered" "text"[] NOT NULL,
    "minimum_quantity_tons" numeric,
    "maximum_quantity_tons" numeric,
    "certifications" "text"[],
    "documentation_services" boolean DEFAULT true,
    "logistics_services" boolean DEFAULT false,
    "quality_assurance_services" boolean DEFAULT false,
    "financing_services" boolean DEFAULT false,
    "rating" numeric DEFAULT 0.0,
    "total_collaborations" integer DEFAULT 0,
    "successful_exports" integer DEFAULT 0,
    "is_verified" boolean DEFAULT false,
    "verification_documents" "text"[],
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."exporter_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exporter_reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "exporter_id" "uuid" NOT NULL,
    "farmer_id" "uuid" NOT NULL,
    "collaboration_id" "uuid",
    "rating" integer NOT NULL,
    "review_title" "text",
    "review_text" "text",
    "services_used" "text"[],
    "would_recommend" boolean DEFAULT true,
    "export_successful" boolean,
    "documentation_quality_rating" integer,
    "communication_rating" integer,
    "timeline_adherence_rating" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "exporter_reviews_communication_rating_check" CHECK ((("communication_rating" >= 1) AND ("communication_rating" <= 5))),
    CONSTRAINT "exporter_reviews_documentation_quality_rating_check" CHECK ((("documentation_quality_rating" >= 1) AND ("documentation_quality_rating" <= 5))),
    CONSTRAINT "exporter_reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5))),
    CONSTRAINT "exporter_reviews_timeline_adherence_rating_check" CHECK ((("timeline_adherence_rating" >= 1) AND ("timeline_adherence_rating" <= 5)))
);


ALTER TABLE "public"."exporter_reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farm_budgets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "year" integer NOT NULL,
    "category" "text" NOT NULL,
    "subcategory" "text",
    "planned_amount" numeric NOT NULL,
    "actual_amount" numeric,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."farm_budgets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farm_input_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."farm_input_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farm_input_order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "quantity" integer NOT NULL,
    "unit_price" numeric(10,2) NOT NULL,
    "total_price" numeric(10,2) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."farm_input_order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farm_input_orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "buyer_id" "uuid" NOT NULL,
    "supplier_id" "uuid" NOT NULL,
    "order_number" "text" DEFAULT ((((('FIO-'::"text" || EXTRACT(year FROM "now"())) || '-'::"text") || "lpad"((EXTRACT(doy FROM "now"()))::"text", 3, '0'::"text")) || '-'::"text") || "lpad"((EXTRACT(epoch FROM "now"()))::"text", 10, '0'::"text")) NOT NULL,
    "order_status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "total_amount" numeric(10,2) NOT NULL,
    "payment_status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "payment_method" "text",
    "delivery_method" "text" NOT NULL,
    "delivery_address" "text",
    "delivery_county" "text",
    "delivery_coordinates" "jsonb",
    "requested_delivery_date" "date",
    "actual_delivery_date" "date",
    "buyer_name" "text" NOT NULL,
    "buyer_phone" "text" NOT NULL,
    "buyer_email" "text",
    "special_instructions" "text",
    "order_notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."farm_input_orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farm_input_product_bookmarks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."farm_input_product_bookmarks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farm_input_product_likes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."farm_input_product_likes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farm_input_product_ratings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid",
    "user_id" "uuid",
    "rating" integer,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "comment" "text",
    CONSTRAINT "farm_input_product_ratings_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."farm_input_product_ratings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farm_input_products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "supplier_id" "uuid" NOT NULL,
    "product_name" "text" NOT NULL,
    "product_category" "text" NOT NULL,
    "product_subcategory" "text",
    "brand_name" "text",
    "product_description" "text",
    "specifications" "jsonb",
    "unit_of_measure" "text" NOT NULL,
    "price_per_unit" numeric(10,2) NOT NULL,
    "minimum_order_quantity" integer DEFAULT 1,
    "stock_quantity" integer DEFAULT 0,
    "restock_level" integer DEFAULT 10,
    "expiry_date" "date",
    "batch_number" "text",
    "manufacturer" "text",
    "country_of_origin" "text" DEFAULT 'Kenya'::"text",
    "organic_certified" boolean DEFAULT false,
    "image_urls" "text"[] DEFAULT '{}'::"text"[],
    "is_available" boolean DEFAULT true,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "category_id" "uuid"
);


ALTER TABLE "public"."farm_input_products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farm_input_supplier_likes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "supplier_id" "uuid",
    "user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."farm_input_supplier_likes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farm_input_supplier_ratings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "supplier_id" "uuid",
    "user_id" "uuid",
    "rating" integer,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "comment" "text",
    CONSTRAINT "farm_input_supplier_ratings_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."farm_input_supplier_ratings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farm_input_suppliers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "supplier_name" "text" NOT NULL,
    "business_registration_number" "text",
    "contact_person" "text" NOT NULL,
    "contact_phone" "text" NOT NULL,
    "contact_email" "text" NOT NULL,
    "physical_address" "text" NOT NULL,
    "county" "text" NOT NULL,
    "sub_county" "text",
    "specialization" "text"[] NOT NULL,
    "certifications" "text"[] DEFAULT '{}'::"text"[],
    "years_in_business" integer DEFAULT 0,
    "delivery_radius_km" integer DEFAULT 50,
    "minimum_order_value" numeric(10,2) DEFAULT 0,
    "payment_terms" "text"[] DEFAULT '{}'::"text"[],
    "is_verified" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "rating" numeric(3,2) DEFAULT 0.0,
    "total_orders" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "delivery_terms" "text",
    "average_delivery_days" integer
);


ALTER TABLE "public"."farm_input_suppliers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farm_parcels" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "parcel_name" "text" NOT NULL,
    "size_acres" numeric NOT NULL,
    "soil_type" "text",
    "slope_type" "text",
    "water_source" "text",
    "coordinates" "jsonb",
    "current_crop" "text",
    "planting_date" "date",
    "expected_harvest" "date",
    "irrigation_system" "text",
    "notes" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."farm_parcels" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farm_statistics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "monthly_revenue" numeric DEFAULT 0,
    "total_area" numeric DEFAULT 0,
    "average_yield" numeric DEFAULT 0,
    "active_alerts" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."farm_statistics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farm_tasks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "crop" "text" NOT NULL,
    "date" "text" NOT NULL,
    "priority" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "farm_tasks_priority_check" CHECK (("priority" = ANY (ARRAY['High'::"text", 'Medium'::"text", 'Low'::"text"]))),
    CONSTRAINT "farm_tasks_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."farm_tasks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farmer_consolidations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "export_opportunity_id" "uuid",
    "consolidator_id" "uuid",
    "farmer_ids" "uuid"[],
    "total_quantity_tons" numeric,
    "status" "text" DEFAULT 'forming'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."farmer_consolidations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farmer_contract_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "contract_network_id" "uuid",
    "farmer_id" "uuid",
    "joined_at" timestamp with time zone DEFAULT "now"(),
    "is_active" boolean DEFAULT true
);


ALTER TABLE "public"."farmer_contract_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farmer_contract_networks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lead_farmer_id" "uuid",
    "contract_title" "text" NOT NULL,
    "description" "text",
    "input_purchasing_terms" "text",
    "mentorship_terms" "text",
    "bargaining_terms" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."farmer_contract_networks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farmer_exporter_collaborations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "farmer_id" "uuid" NOT NULL,
    "exporter_id" "uuid",
    "farmer_name" "text" NOT NULL,
    "farmer_phone" "text" NOT NULL,
    "farmer_email" "text",
    "farmer_location" "text" NOT NULL,
    "farmer_county" "text" NOT NULL,
    "farmer_coordinates" "jsonb",
    "farm_size_acres" numeric,
    "commodity_name" "text" NOT NULL,
    "commodity_variety" "text",
    "estimated_quantity" numeric NOT NULL,
    "unit" "text" DEFAULT 'kg'::"text" NOT NULL,
    "quality_grade" "text",
    "harvest_date" "date",
    "availability_period" "text",
    "farmer_experience_years" integer,
    "has_export_documentation" boolean DEFAULT false,
    "documentation_needs" "text"[],
    "farmer_profile_description" "text",
    "collaboration_type" "text" DEFAULT 'supply_partnership'::"text",
    "target_markets" "text"[],
    "pricing_expectations" "text",
    "special_requirements" "text"[],
    "farmer_certifications" "text"[],
    "collaboration_status" "text" DEFAULT 'seeking_exporter'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '6 mons'::interval),
    "is_active" boolean DEFAULT true,
    "notes" "text"
);


ALTER TABLE "public"."farmer_exporter_collaborations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farmer_financial_transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "transaction_type" "text" NOT NULL,
    "amount" numeric(12,2) NOT NULL,
    "description" "text" NOT NULL,
    "category" "text" NOT NULL,
    "transaction_date" "date" DEFAULT CURRENT_DATE,
    "payment_method" "text",
    "reference_number" "text",
    "receipt_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "farmer_financial_transactions_transaction_type_check" CHECK (("transaction_type" = ANY (ARRAY['income'::"text", 'expense'::"text"])))
);


ALTER TABLE "public"."farmer_financial_transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."farmer_inventory" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "item_name" "text" NOT NULL,
    "category" "text" NOT NULL,
    "quantity" numeric(10,2) DEFAULT 0 NOT NULL,
    "unit" "text" DEFAULT 'kg'::"text",
    "unit_price" numeric(10,2),
    "total_value" numeric(12,2),
    "status" "text" DEFAULT 'in_stock'::"text",
    "expiry_date" "date",
    "location" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "farmer_inventory_status_check" CHECK (("status" = ANY (ARRAY['in_stock'::"text", 'low_stock'::"text", 'out_of_stock'::"text"])))
);


ALTER TABLE "public"."farmer_inventory" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."feature_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "email" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "status" "text" DEFAULT 'pending'::"text",
    "admin_comment" "text",
    "user_id" "uuid",
    "is_public" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."feature_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."financial_transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "transaction_type" "text" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "description" "text" NOT NULL,
    "category" "text" NOT NULL,
    "transaction_date" "date" NOT NULL,
    "payment_method" "text",
    "receipt_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "financial_transactions_transaction_type_check" CHECK (("transaction_type" = ANY (ARRAY['income'::"text", 'expense'::"text"])))
);


ALTER TABLE "public"."financial_transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."food_rescue_listings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "farmer_id" "uuid",
    "product" "text",
    "quantity" numeric,
    "unit" "text",
    "location" "text",
    "urgency" "text",
    "status" "text" DEFAULT 'available'::"text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."food_rescue_listings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."impact_metrics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "metric_name" "text" NOT NULL,
    "metric_value" "text" NOT NULL,
    "metric_description" "text",
    "display_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."impact_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."input_group_orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "input_type" "text" NOT NULL,
    "quantity" integer NOT NULL,
    "farmer_id" "uuid",
    "status" "text" DEFAULT 'open'::"text",
    "supplier_id" "uuid",
    "delivery_date" "date",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."input_group_orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."input_prices" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "input_type" "text" NOT NULL,
    "price" numeric NOT NULL,
    "region" "text",
    "reported_by" "uuid",
    "verified" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."input_prices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."input_pricing" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid",
    "supplier_id" "uuid",
    "price" numeric,
    "date" timestamp without time zone DEFAULT "now"(),
    "verified" boolean DEFAULT false,
    "crowdsource_source" "text"
);


ALTER TABLE "public"."input_pricing" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."input_reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "supplier_id" "uuid",
    "user_id" "uuid",
    "rating" integer,
    "review_text" "text",
    "date" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "input_reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."input_reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."input_supplier_reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "supplier_id" "uuid",
    "rating" integer,
    "review" "text",
    "photo_url" "text",
    "verified" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."input_supplier_reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."input_verifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "supplier_id" "uuid",
    "user_id" "uuid",
    "verification_type" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "date" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."input_verifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."inventory_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "item_name" "text" NOT NULL,
    "category" "text" NOT NULL,
    "quantity" numeric(10,2) NOT NULL,
    "unit" "text" NOT NULL,
    "unit_price" numeric(10,2) NOT NULL,
    "total_value" numeric(10,2) GENERATED ALWAYS AS (("quantity" * "unit_price")) STORED,
    "minimum_stock" numeric(10,2) DEFAULT 0,
    "supplier_name" "text",
    "purchase_date" "date",
    "expiry_date" "date",
    "status" "text" DEFAULT 'normal'::"text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "inventory_items_status_check" CHECK (("status" = ANY (ARRAY['normal'::"text", 'warning'::"text", 'critical'::"text"])))
);


ALTER TABLE "public"."inventory_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."invitations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "invited_email" "text" NOT NULL,
    "invited_by" "uuid",
    "contract_network_id" "uuid",
    "status" "text" DEFAULT 'pending'::"text",
    "sent_at" timestamp with time zone DEFAULT "now"(),
    "responded_at" timestamp with time zone
);


ALTER TABLE "public"."invitations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."kilimo_statistics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "external_id" "text",
    "name" "text" NOT NULL,
    "value" "text" NOT NULL,
    "category" "text" NOT NULL,
    "county" "text" NOT NULL,
    "unit" "text",
    "source" "text" DEFAULT 'Kilimo Statistics API'::"text",
    "verified" boolean DEFAULT true,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "fetch_date" "date" DEFAULT CURRENT_DATE
);


ALTER TABLE "public"."kilimo_statistics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."land_parcels" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "parcel_name" "text" NOT NULL,
    "size_acres" numeric(8,2) NOT NULL,
    "location" "text" NOT NULL,
    "coordinates" "jsonb",
    "soil_type" "text",
    "current_crop" "text",
    "crop_rotation_plan" "text"[],
    "last_soil_test_date" "date",
    "irrigation_system" "text",
    "notes" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."land_parcels" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."livestock_breeds" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "purpose" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "origin" "text",
    "characteristics" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."livestock_breeds" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."livestock_for_sale" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "market_id" "uuid",
    "seller_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "breed" "text" NOT NULL,
    "gender" "text" NOT NULL,
    "age" integer NOT NULL,
    "weight" numeric(10,2) NOT NULL,
    "health_status" "text" NOT NULL,
    "price" numeric(12,2) NOT NULL,
    "price_per_kg" numeric(10,2),
    "quantity" integer DEFAULT 1 NOT NULL,
    "description" "text",
    "images" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "is_halal" boolean DEFAULT false NOT NULL,
    "halal_certificate_number" "text",
    "halal_certification_body" "text",
    "vaccination_records" "jsonb"[] DEFAULT '{}'::"jsonb"[] NOT NULL,
    "breeding_history" "text",
    "color" "text",
    "special_features" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "tags" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "transport_requirements" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "special_handling_instructions" "text",
    "status" "text" DEFAULT 'available'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."livestock_for_sale" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."livestock_listings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "breed" "text" NOT NULL,
    "age" integer NOT NULL,
    "weight" numeric(10,2) NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "location" "text" NOT NULL,
    "description" "text",
    "image_url" "text",
    "halal_certified" boolean DEFAULT false,
    "certificate_number" "text",
    "seller_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."livestock_listings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."livestock_markets" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "county" "text" NOT NULL,
    "location" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "livestock_types" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "has_quarantine_facilities" boolean DEFAULT false NOT NULL,
    "has_veterinary_services" boolean DEFAULT false NOT NULL,
    "has_slaughter_facilities" boolean DEFAULT false NOT NULL,
    "slaughter_methods" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "halal_certified" boolean DEFAULT false NOT NULL,
    "halal_certification_body" "text",
    "certification_expiry_date" timestamp with time zone,
    "animal_welfare_standards" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "auction_days" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "special_handling_requirements" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "requires_health_certification" boolean DEFAULT false NOT NULL,
    "requires_movement_permit" boolean DEFAULT false NOT NULL,
    "maximum_transport_hours" integer,
    "market_hours" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."livestock_markets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."market_agents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "agent_name" "text" NOT NULL,
    "agent_phone" "text" NOT NULL,
    "agent_email" "text",
    "markets_covered" "uuid"[] NOT NULL,
    "agent_type" "text" NOT NULL,
    "commission_structure" "jsonb",
    "services_offered" "text"[] NOT NULL,
    "network_size" integer DEFAULT 0,
    "total_transactions" integer DEFAULT 0,
    "success_rate_percent" numeric(5,2) DEFAULT 0,
    "languages_spoken" "text"[] DEFAULT '{English,Swahili}'::"text"[],
    "is_verified" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "rating" numeric(3,2) DEFAULT 0.0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."market_agents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."market_demand_supply" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "market_id" "uuid" NOT NULL,
    "commodity_name" "text" NOT NULL,
    "entry_type" "text" NOT NULL,
    "quantity_needed" numeric(10,2),
    "quantity_available" numeric(10,2),
    "unit_of_measure" "text" NOT NULL,
    "price_range_min" numeric(8,2),
    "price_range_max" numeric(8,2),
    "quality_requirements" "text"[] DEFAULT '{}'::"text"[],
    "urgency_level" "text" DEFAULT 'normal'::"text",
    "valid_until" "date" NOT NULL,
    "contact_person" "text" NOT NULL,
    "contact_phone" "text" NOT NULL,
    "additional_notes" "text",
    "participant_id" "uuid",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."market_demand_supply" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."market_forecasts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "commodity_name" "text" NOT NULL,
    "county" "text" NOT NULL,
    "current_price" numeric NOT NULL,
    "forecast_price" numeric NOT NULL,
    "confidence_level" numeric DEFAULT 0.7 NOT NULL,
    "period" "text" DEFAULT '7 days'::"text" NOT NULL,
    "factors" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "valid_until" timestamp with time zone DEFAULT ("now"() + '7 days'::interval) NOT NULL
);


ALTER TABLE "public"."market_forecasts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."market_linkage_applications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "linkage_id" "uuid" NOT NULL,
    "application_status" "text" DEFAULT 'pending'::"text",
    "farmer_name" "text" NOT NULL,
    "contact_phone" "text" NOT NULL,
    "farm_size" numeric,
    "crops_to_supply" "text"[] NOT NULL,
    "estimated_quantity" numeric,
    "notes" "text",
    "applied_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "reviewed_at" timestamp with time zone,
    "reviewer_notes" "text"
);


ALTER TABLE "public"."market_linkage_applications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."market_linkages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_by" "uuid",
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "linkage_type" "text" NOT NULL,
    "crops_involved" "text"[] NOT NULL,
    "counties" "text"[] NOT NULL,
    "requirements" "text"[] DEFAULT '{}'::"text"[],
    "benefits" "text"[] DEFAULT '{}'::"text"[],
    "contact_info" "text" NOT NULL,
    "application_deadline" "date",
    "start_date" "date",
    "duration_months" integer,
    "minimum_quantity" numeric,
    "price_range" "text",
    "status" "text" DEFAULT 'active'::"text",
    "participants_count" integer DEFAULT 0,
    "max_participants" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "market_linkages_linkage_type_check" CHECK (("linkage_type" = ANY (ARRAY['buyer_seller'::"text", 'contract_farming'::"text", 'cooperative'::"text", 'export_opportunity'::"text", 'processing_partnership'::"text"]))),
    CONSTRAINT "market_linkages_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'closed'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."market_linkages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."market_participants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "agent_id" "uuid",
    "market_id" "uuid" NOT NULL,
    "participant_name" "text" NOT NULL,
    "participant_type" "text" NOT NULL,
    "contact_phone" "text" NOT NULL,
    "contact_email" "text",
    "business_name" "text",
    "specialization" "text"[] NOT NULL,
    "location_details" "text",
    "coordinates" "jsonb",
    "operating_schedule" "text",
    "capacity_description" "text",
    "price_range" "text",
    "quality_standards" "text"[] DEFAULT '{}'::"text"[],
    "payment_methods" "text"[] NOT NULL,
    "rating" numeric(3,2) DEFAULT 0.0,
    "total_transactions" integer DEFAULT 0,
    "is_verified" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "onboarded_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_active_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."market_participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."market_prices" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "commodity_name" "text" NOT NULL,
    "market_name" "text" NOT NULL,
    "county" "text" NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "unit" "text" NOT NULL,
    "market_id" "text" NOT NULL,
    "confidence_score" numeric(3,2) DEFAULT 0.85,
    "date_recorded" timestamp with time zone DEFAULT "now"(),
    "source" "text" DEFAULT 'KAMIS'::"text",
    "verified" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."market_prices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."market_sentiment" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "commodity_name" "text" NOT NULL,
    "county" "text" NOT NULL,
    "sentiment_score" numeric NOT NULL,
    "report_count" integer DEFAULT 1 NOT NULL,
    "tags" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "issues" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."market_sentiment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."marketplace_ban_recommendations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "entity_type" "text",
    "entity_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "reason" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    CONSTRAINT "marketplace_ban_recommendations_entity_type_check" CHECK (("entity_type" = ANY (ARRAY['supplier'::"text", 'product'::"text"])))
);


ALTER TABLE "public"."marketplace_ban_recommendations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."marketplace_flags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "entity_type" "text",
    "entity_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "reason" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    CONSTRAINT "marketplace_flags_entity_type_check" CHECK (("entity_type" = ANY (ARRAY['supplier'::"text", 'product'::"text"])))
);


ALTER TABLE "public"."marketplace_flags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mentorship_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "contract_network_id" "uuid",
    "mentor_id" "uuid",
    "mentee_id" "uuid",
    "session_date" timestamp with time zone,
    "topic" "text",
    "notes" "text",
    "outcome" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."mentorship_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mentorships" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "mentor_id" "uuid",
    "mentee_id" "uuid",
    "topic" "text",
    "status" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."mentorships" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content" "text",
    "sender_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "media_url" "text",
    "media_type" "text",
    "is_encrypted" boolean DEFAULT false
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."micro_creditors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "institution_name" "text" NOT NULL,
    "institution_type" "text" NOT NULL,
    "license_number" "text",
    "contact_person" "text" NOT NULL,
    "contact_phone" "text" NOT NULL,
    "contact_email" "text" NOT NULL,
    "physical_address" "text" NOT NULL,
    "county" "text" NOT NULL,
    "sub_county" "text",
    "coordinates" "jsonb",
    "loan_products" "jsonb" NOT NULL,
    "target_sectors" "text"[] NOT NULL,
    "minimum_loan_amount" numeric(10,2) NOT NULL,
    "maximum_loan_amount" numeric(10,2) NOT NULL,
    "interest_rate_range" "text" NOT NULL,
    "collateral_requirements" "text"[] DEFAULT '{}'::"text"[],
    "loan_processing_time_days" integer DEFAULT 7,
    "service_counties" "text"[] NOT NULL,
    "total_disbursed_amount" numeric(15,2) DEFAULT 0,
    "active_borrowers" integer DEFAULT 0,
    "default_rate_percent" numeric(5,2) DEFAULT 0,
    "is_licensed" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "rating" numeric(3,2) DEFAULT 0.0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."micro_creditors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."network_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text",
    "description" "text",
    "date" "date",
    "location" "text",
    "type" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."network_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notification_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "notification_type" "text" NOT NULL,
    "enabled" boolean DEFAULT true,
    "location_filter" "text"[],
    "crop_filter" "text"[],
    "price_threshold" numeric(10,2),
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."notification_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "message" "text" NOT NULL,
    "type" "text" NOT NULL,
    "is_read" boolean DEFAULT false,
    "action_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "related_id" "uuid",
    CONSTRAINT "notifications_type_check" CHECK (("type" = ANY (ARRAY['info'::"text", 'warning'::"text", 'error'::"text", 'success'::"text"])))
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."p2p_lending_offers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lender_id" "uuid" NOT NULL,
    "offer_title" "text" NOT NULL,
    "loan_amount" numeric(10,2) NOT NULL,
    "interest_rate_percent" numeric(5,2) NOT NULL,
    "loan_term_months" integer NOT NULL,
    "purpose_category" "text" NOT NULL,
    "specific_purpose" "text",
    "collateral_required" boolean DEFAULT false,
    "collateral_description" "text",
    "risk_level" "text" NOT NULL,
    "counties_served" "text"[] NOT NULL,
    "minimum_borrower_rating" numeric(3,2) DEFAULT 0.0,
    "application_deadline" "date",
    "funding_status" "text" DEFAULT 'available'::"text" NOT NULL,
    "borrower_requirements" "text"[] DEFAULT '{}'::"text"[],
    "lender_name" "text" NOT NULL,
    "lender_phone" "text" NOT NULL,
    "lender_email" "text" NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."p2p_lending_offers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."partner_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "partner_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "event_date" "date",
    "location" "text",
    "image_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."partner_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."partners" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "company_name" "text" NOT NULL,
    "contact_email" "text" NOT NULL,
    "contact_phone" "text",
    "website" "text",
    "description" "text",
    "logo_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."partners" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."partnerships" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "org1_id" "uuid",
    "org2_id" "uuid",
    "type" "text",
    "status" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."partnerships" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "advertisement_id" "uuid",
    "payment_provider" "text" NOT NULL,
    "transaction_id" "text" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "currency" "text" DEFAULT 'USD'::"text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "payment_details" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "payment_transactions_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'completed'::"text", 'failed'::"text", 'refunded'::"text"])))
);


ALTER TABLE "public"."payment_transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."permissions" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."permissions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."permissions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."permissions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."permissions_id_seq" OWNED BY "public"."permissions"."id";



CREATE TABLE IF NOT EXISTS "public"."poll_votes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "poll_id" "uuid",
    "user_id" "uuid" NOT NULL,
    "option_index" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."poll_votes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post_comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid",
    "user_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "parent_id" "uuid",
    "likes_count" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."post_comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."price_alerts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "commodity_name" "text" NOT NULL,
    "target_price" numeric(10,2) NOT NULL,
    "alert_type" "text" NOT NULL,
    "county" "text",
    "is_active" boolean DEFAULT true,
    "triggered_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "price_alerts_alert_type_check" CHECK (("alert_type" = ANY (ARRAY['above'::"text", 'below'::"text"])))
);


ALTER TABLE "public"."price_alerts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."price_comparisons" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "commodity_name" "text" NOT NULL,
    "domestic_price" numeric,
    "export_price" numeric,
    "market_id" "uuid",
    "export_opportunity_id" "uuid",
    "comparison_date" "date" DEFAULT CURRENT_DATE
);


ALTER TABLE "public"."price_comparisons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pricing_tiers" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "price" numeric NOT NULL,
    "currency" "text" DEFAULT 'KES'::"text" NOT NULL,
    "period" "text" NOT NULL,
    "requests" integer NOT NULL,
    "features" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "is_popular" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."pricing_tiers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."processing_matches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "bulk_order_id" "uuid",
    "farmer_id" "uuid",
    "offer_price" numeric,
    "status" "text" DEFAULT 'pending'::"text",
    "negotiation_log" "jsonb",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."processing_matches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."processors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "processor_name" "text" NOT NULL,
    "business_type" "text" DEFAULT 'processor'::"text" NOT NULL,
    "registration_number" "text",
    "contact_person" "text" NOT NULL,
    "contact_phone" "text" NOT NULL,
    "contact_email" "text" NOT NULL,
    "physical_address" "text" NOT NULL,
    "county" "text" NOT NULL,
    "sub_county" "text",
    "coordinates" "jsonb",
    "raw_materials_needed" "text"[] NOT NULL,
    "processed_products" "text"[] NOT NULL,
    "processing_capacity_tons_per_day" numeric(8,2) NOT NULL,
    "processing_methods" "text"[] DEFAULT '{}'::"text"[],
    "quality_standards" "text"[] DEFAULT '{}'::"text"[],
    "minimum_quantity_tons" numeric(8,2) DEFAULT 1,
    "service_radius_km" integer DEFAULT 200,
    "pricing_model" "text" DEFAULT 'market_based'::"text",
    "processing_fee_per_ton" numeric(8,2),
    "payment_terms" "text"[] DEFAULT '{}'::"text"[],
    "certifications" "text"[] DEFAULT '{}'::"text"[],
    "is_verified" boolean DEFAULT false,
    "is_active" boolean DEFAULT true,
    "rating" numeric(3,2) DEFAULT 0.0,
    "total_orders" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."processors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."produce_inventory" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "farmer_id" "uuid",
    "product_name" "text" NOT NULL,
    "variety" "text",
    "quantity" numeric NOT NULL,
    "unit" "text" DEFAULT 'kg'::"text" NOT NULL,
    "harvest_date" "date",
    "expiry_date" "date",
    "price_per_unit" numeric,
    "location" "text" NOT NULL,
    "storage_conditions" "text",
    "organic_certified" boolean DEFAULT false,
    "quality_grade" "text" DEFAULT 'A'::"text",
    "available_for_sale" boolean DEFAULT true,
    "description" "text",
    "images" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."produce_inventory" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "role" "text" DEFAULT 'user'::"text",
    "avatar_url" "text",
    "contact_number" "text",
    "email" "text",
    "county" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "bio" "text",
    "farm_size" numeric,
    "farm_type" "text",
    "experience_years" integer,
    "specialization" "text"[],
    "is_verified" boolean DEFAULT false
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."quality_control_discussions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "organizer" "text" NOT NULL,
    "date" "text" NOT NULL,
    "location" "text" NOT NULL,
    "county" "text" NOT NULL,
    "attendees" integer DEFAULT 0,
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "author_name" "text" NOT NULL,
    "author_type" "text" NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."quality_control_discussions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."recipients" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "location" "text",
    "contact" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "recipient_type" "text"
);


ALTER TABLE "public"."recipients" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rescue_matches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "listing_id" "uuid",
    "recipient_id" "uuid",
    "status" "text" DEFAULT 'pending'::"text",
    "pickup_time" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."rescue_matches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."research_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "requester_id" "uuid",
    "topic" "text",
    "details" "text",
    "status" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."research_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    "role_id" integer NOT NULL,
    "permission_id" integer NOT NULL
);


ALTER TABLE "public"."role_permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."roles_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."roles_id_seq" OWNED BY "public"."roles"."id";



CREATE TABLE IF NOT EXISTS "public"."service_provider_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."service_provider_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."service_provider_reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "provider_id" "uuid" NOT NULL,
    "rating" integer NOT NULL,
    "review_text" "text",
    "service_used" "text" NOT NULL,
    "would_recommend" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "service_provider_reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);


ALTER TABLE "public"."service_provider_reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."service_providers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "business_name" "text" NOT NULL,
    "name" "text",
    "description" "text" NOT NULL,
    "businesstype" "text" NOT NULL,
    "provider_category" "text" NOT NULL,
    "services" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "tags" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "location" "jsonb" NOT NULL,
    "contact" "jsonb" NOT NULL,
    "rating" numeric(3,2) DEFAULT 0.0,
    "reviewcount" integer DEFAULT 0,
    "verified" boolean DEFAULT false,
    "licenses" "text"[],
    "insurance_details" "text",
    "certifications" "text"[],
    "experience" "text",
    "pricing" "jsonb",
    "availability" "jsonb",
    "capacity" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "service_providers_businesstype_check" CHECK (("businesstype" = ANY (ARRAY['storage'::"text", 'transport'::"text", 'quality-control'::"text", 'market-linkage'::"text", 'training'::"text", 'input-supplier'::"text", 'inspector'::"text", 'insurance-provider'::"text", 'soil-testing-provider'::"text", 'drone-satellite-imagery-provider'::"text", 'iot-sensor-data-provider'::"text", 'export-transporters'::"text", 'shippers'::"text"])))
);


ALTER TABLE "public"."service_providers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscription_box_deliveries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "box_id" "uuid",
    "delivery_date" "date",
    "delivered" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."subscription_box_deliveries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscription_boxes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "consumer_id" "uuid",
    "farmer_id" "uuid",
    "box_type" "text",
    "frequency" "text",
    "next_delivery" "date",
    "status" "text" DEFAULT 'active'::"text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."subscription_boxes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."timeline_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "export_order_id" "uuid",
    "event_type" "text" NOT NULL,
    "event_description" "text",
    "event_time" timestamp with time zone DEFAULT "now"(),
    "actor_id" "uuid"
);


ALTER TABLE "public"."timeline_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tracking_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "export_order_id" "uuid",
    "event_time" timestamp with time zone DEFAULT "now"(),
    "location" "text",
    "gps_coordinates" "jsonb",
    "status" "text",
    "shared_with" "uuid"[],
    "notes" "text"
);


ALTER TABLE "public"."tracking_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."training_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organizer_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "event_type" "text" NOT NULL,
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone NOT NULL,
    "location" "text" NOT NULL,
    "county" "text" NOT NULL,
    "max_participants" integer,
    "current_participants" integer DEFAULT 0,
    "cost" numeric DEFAULT 0,
    "topics" "text"[] DEFAULT '{}'::"text"[],
    "target_audience" "text"[] DEFAULT '{}'::"text"[],
    "requirements" "text"[] DEFAULT '{}'::"text"[],
    "contact_info" "text" NOT NULL,
    "registration_deadline" timestamp with time zone,
    "is_online" boolean DEFAULT false,
    "meeting_link" "text",
    "materials_provided" boolean DEFAULT false,
    "certificate_provided" boolean DEFAULT false,
    "status" "text" DEFAULT 'upcoming'::"text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "training_events_status_check" CHECK (("status" = ANY (ARRAY['upcoming'::"text", 'ongoing'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."training_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."training_registrations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "training_id" "uuid" NOT NULL,
    "registration_status" "text" DEFAULT 'registered'::"text",
    "participant_name" "text" NOT NULL,
    "contact_phone" "text" NOT NULL,
    "organization" "text",
    "experience_level" "text",
    "specific_interests" "text",
    "registered_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "attended" boolean DEFAULT false,
    "feedback_rating" integer,
    "feedback_comments" "text"
);


ALTER TABLE "public"."training_registrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."transport_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "requester_id" "uuid",
    "transporter_id" "uuid",
    "pickup_location" "text" NOT NULL,
    "dropoff_location" "text" NOT NULL,
    "pickup_county" "text" NOT NULL,
    "dropoff_county" "text" NOT NULL,
    "cargo_type" "text" NOT NULL,
    "quantity" numeric NOT NULL,
    "unit" "text" DEFAULT 'kg'::"text" NOT NULL,
    "requested_date" timestamp with time zone NOT NULL,
    "flexible_timing" boolean DEFAULT false,
    "special_requirements" "text"[] DEFAULT '{}'::"text"[],
    "estimated_value" numeric,
    "insurance_required" boolean DEFAULT false,
    "contact_phone" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "quoted_price" numeric,
    "actual_price" numeric,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "transport_requests_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'accepted'::"text", 'in_transit'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."transport_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."transporter_bookings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "transporter_id" "uuid",
    "export_order_id" "uuid",
    "booking_date" "date",
    "cargo_type" "text",
    "distance_km" numeric,
    "price" numeric,
    "status" "text" DEFAULT 'pending'::"text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."transporter_bookings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."transporter_recommendations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "transporter_id" "uuid",
    "reviewer_id" "uuid",
    "rating" numeric NOT NULL,
    "review" "text",
    "reliability" integer,
    "pricing" integer,
    "timeliness" integer,
    "handling" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "transporter_recommendations_rating_check" CHECK ((("rating" >= (1)::numeric) AND ("rating" <= (5)::numeric)))
);


ALTER TABLE "public"."transporter_recommendations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."transporters" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "service_type" "text" NOT NULL,
    "counties" "text"[] NOT NULL,
    "contact_info" "text" NOT NULL,
    "capacity" "text" NOT NULL,
    "load_capacity" integer NOT NULL,
    "rates" "text" NOT NULL,
    "has_refrigeration" boolean DEFAULT false NOT NULL,
    "vehicle_type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."transporters" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_bookmarks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "bookmark_type" "text" NOT NULL,
    "resource_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "user_bookmarks_bookmark_type_check" CHECK (("bookmark_type" = ANY (ARRAY['market_data'::"text", 'service_provider'::"text", 'training_event'::"text"])))
);


ALTER TABLE "public"."user_bookmarks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_notification_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "price_alerts" boolean DEFAULT true,
    "market_updates" boolean DEFAULT true,
    "weather_alerts" boolean DEFAULT true,
    "training_notifications" boolean DEFAULT true,
    "preferred_counties" "text"[] DEFAULT '{}'::"text"[],
    "preferred_commodities" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_notification_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "notification_type" "text" NOT NULL,
    "title" "text" NOT NULL,
    "message" "text" NOT NULL,
    "data" "jsonb",
    "read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "user_notifications_notification_type_check" CHECK (("notification_type" = ANY (ARRAY['price_alert'::"text", 'weather_alert'::"text", 'purchase_request'::"text", 'comment_reply'::"text", 'system_notification'::"text"])))
);


ALTER TABLE "public"."user_notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "user_id" "uuid" NOT NULL,
    "role_id" integer NOT NULL
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."warehouse_bookings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "warehouse_id" "uuid",
    "start_date" "date" NOT NULL,
    "end_date" "date" NOT NULL,
    "quantity_tons" numeric NOT NULL,
    "produce_type" "text" NOT NULL,
    "special_requirements" "text"[] DEFAULT '{}'::"text"[],
    "total_cost" numeric NOT NULL,
    "contact_phone" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "payment_status" "text" DEFAULT 'pending'::"text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "warehouse_bookings_payment_status_check" CHECK (("payment_status" = ANY (ARRAY['pending'::"text", 'paid'::"text", 'partial'::"text", 'refunded'::"text"]))),
    CONSTRAINT "warehouse_bookings_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'confirmed'::"text", 'active'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."warehouse_bookings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."warehouses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "owner_id" "uuid",
    "location" "text" NOT NULL,
    "county" "text" NOT NULL,
    "latitude" numeric,
    "longitude" numeric,
    "capacity_tons" numeric NOT NULL,
    "has_refrigeration" boolean DEFAULT false,
    "has_security" boolean DEFAULT false,
    "certifications" "text"[] DEFAULT '{}'::"text"[],
    "storage_types" "text"[] DEFAULT '{}'::"text"[],
    "daily_rate_per_ton" numeric NOT NULL,
    "contact_info" "text" NOT NULL,
    "operating_hours" "text",
    "availability_status" "text" DEFAULT 'available'::"text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."warehouses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."weather_alerts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text" NOT NULL,
    "region" "text" NOT NULL,
    "severity" "text" NOT NULL,
    "description" "text" NOT NULL,
    "start_date" "text" NOT NULL,
    "end_date" "text" NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "weather_alerts_severity_check" CHECK (("severity" = ANY (ARRAY['critical'::"text", 'moderate'::"text", 'low'::"text"]))),
    CONSTRAINT "weather_alerts_type_check" CHECK (("type" = ANY (ARRAY['Cyclone'::"text", 'Rain'::"text", 'Drought'::"text"])))
);


ALTER TABLE "public"."weather_alerts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."weather_data" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "county" "text" NOT NULL,
    "date" "date" NOT NULL,
    "temperature_max" numeric,
    "temperature_min" numeric,
    "humidity" numeric,
    "rainfall" numeric,
    "wind_speed" numeric,
    "weather_condition" "text",
    "forecast_data" "jsonb",
    "source" "text" DEFAULT 'weather_api'::"text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."weather_data" OWNER TO "postgres";


ALTER TABLE ONLY "public"."admin_action_logs" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."admin_action_logs_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."permissions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."permissions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."roles" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."roles_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."admin_action_logs"
    ADD CONSTRAINT "admin_action_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."agents"
    ADD CONSTRAINT "agents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."aggregators"
    ADD CONSTRAINT "aggregators_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."animal_health"
    ADD CONSTRAINT "animal_health_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."animal_records"
    ADD CONSTRAINT "animal_records_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."animal_sales"
    ADD CONSTRAINT "animal_sales_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."animals"
    ADD CONSTRAINT "animals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."api_keys"
    ADD CONSTRAINT "api_keys_key_hash_key" UNIQUE ("key_hash");



ALTER TABLE ONLY "public"."api_keys"
    ADD CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."api_usage"
    ADD CONSTRAINT "api_usage_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."barter_listings"
    ADD CONSTRAINT "barter_listings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."batch_tracking"
    ADD CONSTRAINT "batch_tracking_pkey" PRIMARY KEY ("batch_id");



ALTER TABLE ONLY "public"."bulk_order_bids"
    ADD CONSTRAINT "bulk_order_bids_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bulk_orders"
    ADD CONSTRAINT "bulk_orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."business_advertisements"
    ADD CONSTRAINT "business_advertisements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."business_matches"
    ADD CONSTRAINT "business_matches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."carbon_forum_posts"
    ADD CONSTRAINT "carbon_forum_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."city_market_auctions"
    ADD CONSTRAINT "city_market_auctions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."city_market_ban_recommendations"
    ADD CONSTRAINT "city_market_ban_recommendations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."city_market_bids"
    ADD CONSTRAINT "city_market_bids_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."city_market_comments"
    ADD CONSTRAINT "city_market_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."city_market_donations"
    ADD CONSTRAINT "city_market_donations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."city_market_flags"
    ADD CONSTRAINT "city_market_flags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."city_market_likes"
    ADD CONSTRAINT "city_market_likes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."city_market_products"
    ADD CONSTRAINT "city_market_products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."city_market_ratings"
    ADD CONSTRAINT "city_market_ratings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."city_markets"
    ADD CONSTRAINT "city_markets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."collaboration_messages"
    ADD CONSTRAINT "collaboration_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."collaboration_proposals"
    ADD CONSTRAINT "collaboration_proposals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."community_polls"
    ADD CONSTRAINT "community_polls_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."community_posts"
    ADD CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contract_applications"
    ADD CONSTRAINT "contract_applications_contract_id_farmer_id_key" UNIQUE ("contract_id", "farmer_id");



ALTER TABLE ONLY "public"."contract_applications"
    ADD CONSTRAINT "contract_applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contract_comments"
    ADD CONSTRAINT "contract_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contract_documents"
    ADD CONSTRAINT "contract_documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contract_farming_opportunities"
    ADD CONSTRAINT "contract_farming_opportunities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contract_flags"
    ADD CONSTRAINT "contract_flags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contract_reviews"
    ADD CONSTRAINT "contract_reviews_contract_id_user_id_key" UNIQUE ("contract_id", "user_id");



ALTER TABLE ONLY "public"."contract_reviews"
    ADD CONSTRAINT "contract_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contract_social_shares"
    ADD CONSTRAINT "contract_social_shares_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."crop_tracking"
    ADD CONSTRAINT "crop_tracking_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."crop_yields"
    ADD CONSTRAINT "crop_yields_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."data_fetch_logs"
    ADD CONSTRAINT "data_fetch_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."equipment_ban_recommendations"
    ADD CONSTRAINT "equipment_ban_recommendations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."equipment_bookmarks"
    ADD CONSTRAINT "equipment_bookmarks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."equipment_flags"
    ADD CONSTRAINT "equipment_flags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."equipment_likes"
    ADD CONSTRAINT "equipment_likes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."equipment"
    ADD CONSTRAINT "equipment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."equipment_ratings"
    ADD CONSTRAINT "equipment_ratings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."export_documentation"
    ADD CONSTRAINT "export_documentation_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."export_opportunities"
    ADD CONSTRAINT "export_opportunities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."export_orders"
    ADD CONSTRAINT "export_orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exporter_profiles"
    ADD CONSTRAINT "exporter_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exporter_reviews"
    ADD CONSTRAINT "exporter_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farm_budgets"
    ADD CONSTRAINT "farm_budgets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farm_input_categories"
    ADD CONSTRAINT "farm_input_categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."farm_input_categories"
    ADD CONSTRAINT "farm_input_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farm_input_order_items"
    ADD CONSTRAINT "farm_input_order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farm_input_orders"
    ADD CONSTRAINT "farm_input_orders_order_number_key" UNIQUE ("order_number");



ALTER TABLE ONLY "public"."farm_input_orders"
    ADD CONSTRAINT "farm_input_orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farm_input_product_bookmarks"
    ADD CONSTRAINT "farm_input_product_bookmarks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farm_input_product_bookmarks"
    ADD CONSTRAINT "farm_input_product_bookmarks_product_id_user_id_key" UNIQUE ("product_id", "user_id");



ALTER TABLE ONLY "public"."farm_input_product_likes"
    ADD CONSTRAINT "farm_input_product_likes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farm_input_product_likes"
    ADD CONSTRAINT "farm_input_product_likes_product_id_user_id_key" UNIQUE ("product_id", "user_id");



ALTER TABLE ONLY "public"."farm_input_product_ratings"
    ADD CONSTRAINT "farm_input_product_ratings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farm_input_product_ratings"
    ADD CONSTRAINT "farm_input_product_ratings_product_id_user_id_key" UNIQUE ("product_id", "user_id");



ALTER TABLE ONLY "public"."farm_input_products"
    ADD CONSTRAINT "farm_input_products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farm_input_supplier_likes"
    ADD CONSTRAINT "farm_input_supplier_likes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farm_input_supplier_likes"
    ADD CONSTRAINT "farm_input_supplier_likes_supplier_id_user_id_key" UNIQUE ("supplier_id", "user_id");



ALTER TABLE ONLY "public"."farm_input_supplier_ratings"
    ADD CONSTRAINT "farm_input_supplier_ratings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farm_input_supplier_ratings"
    ADD CONSTRAINT "farm_input_supplier_ratings_supplier_id_user_id_key" UNIQUE ("supplier_id", "user_id");



ALTER TABLE ONLY "public"."farm_input_suppliers"
    ADD CONSTRAINT "farm_input_suppliers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farm_parcels"
    ADD CONSTRAINT "farm_parcels_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farm_statistics"
    ADD CONSTRAINT "farm_statistics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farm_tasks"
    ADD CONSTRAINT "farm_tasks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farmer_consolidations"
    ADD CONSTRAINT "farmer_consolidations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farmer_contract_members"
    ADD CONSTRAINT "farmer_contract_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farmer_contract_networks"
    ADD CONSTRAINT "farmer_contract_networks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farmer_exporter_collaborations"
    ADD CONSTRAINT "farmer_exporter_collaborations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farmer_financial_transactions"
    ADD CONSTRAINT "farmer_financial_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."farmer_inventory"
    ADD CONSTRAINT "farmer_inventory_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."feature_requests"
    ADD CONSTRAINT "feature_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."financial_transactions"
    ADD CONSTRAINT "financial_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."food_rescue_listings"
    ADD CONSTRAINT "food_rescue_listings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."impact_metrics"
    ADD CONSTRAINT "impact_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."input_group_orders"
    ADD CONSTRAINT "input_group_orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."input_prices"
    ADD CONSTRAINT "input_prices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."input_pricing"
    ADD CONSTRAINT "input_pricing_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."input_reviews"
    ADD CONSTRAINT "input_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."input_supplier_reviews"
    ADD CONSTRAINT "input_supplier_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."input_verifications"
    ADD CONSTRAINT "input_verifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."inventory_items"
    ADD CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invitations"
    ADD CONSTRAINT "invitations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."kilimo_statistics"
    ADD CONSTRAINT "kilimo_statistics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."land_parcels"
    ADD CONSTRAINT "land_parcels_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."livestock_breeds"
    ADD CONSTRAINT "livestock_breeds_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."livestock_for_sale"
    ADD CONSTRAINT "livestock_for_sale_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."livestock_listings"
    ADD CONSTRAINT "livestock_listings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."livestock_markets"
    ADD CONSTRAINT "livestock_markets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."market_agents"
    ADD CONSTRAINT "market_agents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."market_demand_supply"
    ADD CONSTRAINT "market_demand_supply_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."market_details"
    ADD CONSTRAINT "market_details_market_name_key" UNIQUE ("market_name");



ALTER TABLE ONLY "public"."market_details"
    ADD CONSTRAINT "market_details_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."market_forecasts"
    ADD CONSTRAINT "market_forecasts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."market_linkage_applications"
    ADD CONSTRAINT "market_linkage_applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."market_linkages"
    ADD CONSTRAINT "market_linkages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."market_participants"
    ADD CONSTRAINT "market_participants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."market_prices"
    ADD CONSTRAINT "market_prices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."market_sentiment"
    ADD CONSTRAINT "market_sentiment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."marketplace_ban_recommendations"
    ADD CONSTRAINT "marketplace_ban_recommendations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."marketplace_flags"
    ADD CONSTRAINT "marketplace_flags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mentorship_sessions"
    ADD CONSTRAINT "mentorship_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mentorships"
    ADD CONSTRAINT "mentorships_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."micro_creditors"
    ADD CONSTRAINT "micro_creditors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."network_events"
    ADD CONSTRAINT "network_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification_preferences"
    ADD CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notification_preferences"
    ADD CONSTRAINT "notification_preferences_user_id_notification_type_key" UNIQUE ("user_id", "notification_type");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."p2p_lending_offers"
    ADD CONSTRAINT "p2p_lending_offers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."partner_events"
    ADD CONSTRAINT "partner_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."partners"
    ADD CONSTRAINT "partners_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."partnerships"
    ADD CONSTRAINT "partnerships_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment_transactions"
    ADD CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."poll_votes"
    ADD CONSTRAINT "poll_votes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."poll_votes"
    ADD CONSTRAINT "poll_votes_poll_id_user_id_key" UNIQUE ("poll_id", "user_id");



ALTER TABLE ONLY "public"."post_comments"
    ADD CONSTRAINT "post_comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."price_alerts"
    ADD CONSTRAINT "price_alerts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."price_comparisons"
    ADD CONSTRAINT "price_comparisons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pricing_tiers"
    ADD CONSTRAINT "pricing_tiers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."processing_matches"
    ADD CONSTRAINT "processing_matches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."processors"
    ADD CONSTRAINT "processors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."produce_inventory"
    ADD CONSTRAINT "produce_inventory_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."quality_control_discussions"
    ADD CONSTRAINT "quality_control_discussions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."recipients"
    ADD CONSTRAINT "recipients_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rescue_matches"
    ADD CONSTRAINT "rescue_matches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."research_requests"
    ADD CONSTRAINT "research_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id", "permission_id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."service_provider_categories"
    ADD CONSTRAINT "service_provider_categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."service_provider_categories"
    ADD CONSTRAINT "service_provider_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."service_provider_reviews"
    ADD CONSTRAINT "service_provider_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."service_providers"
    ADD CONSTRAINT "service_providers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscription_box_deliveries"
    ADD CONSTRAINT "subscription_box_deliveries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscription_boxes"
    ADD CONSTRAINT "subscription_boxes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."timeline_events"
    ADD CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tracking_events"
    ADD CONSTRAINT "tracking_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."training_events"
    ADD CONSTRAINT "training_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."training_registrations"
    ADD CONSTRAINT "training_registrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."training_registrations"
    ADD CONSTRAINT "training_registrations_user_id_training_id_key" UNIQUE ("user_id", "training_id");



ALTER TABLE ONLY "public"."transport_requests"
    ADD CONSTRAINT "transport_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."transporter_bookings"
    ADD CONSTRAINT "transporter_bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."transporter_recommendations"
    ADD CONSTRAINT "transporter_recommendations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."transporters"
    ADD CONSTRAINT "transporters_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."impact_metrics"
    ADD CONSTRAINT "unique_metric_name" UNIQUE ("metric_name");



ALTER TABLE ONLY "public"."user_bookmarks"
    ADD CONSTRAINT "user_bookmarks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_notification_preferences"
    ADD CONSTRAINT "user_notification_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_notifications"
    ADD CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id", "role_id");



ALTER TABLE ONLY "public"."warehouse_bookings"
    ADD CONSTRAINT "warehouse_bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."warehouses"
    ADD CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."weather_alerts"
    ADD CONSTRAINT "weather_alerts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."weather_data"
    ADD CONSTRAINT "weather_data_county_date_key" UNIQUE ("county", "date");



ALTER TABLE ONLY "public"."weather_data"
    ADD CONSTRAINT "weather_data_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_aggregators_county" ON "public"."aggregators" USING "btree" ("county");



CREATE INDEX "idx_api_usage_key_date" ON "public"."api_usage" USING "btree" ("api_key_id", "created_at");



CREATE INDEX "idx_api_usage_user_date" ON "public"."api_usage" USING "btree" ("user_id", "created_at");



CREATE INDEX "idx_barter_listings_commodity" ON "public"."barter_listings" USING "btree" ("commodity");



CREATE INDEX "idx_barter_listings_county" ON "public"."barter_listings" USING "btree" ("county");



CREATE INDEX "idx_barter_listings_status" ON "public"."barter_listings" USING "btree" ("status");



CREATE INDEX "idx_bulk_orders_buyer_id" ON "public"."bulk_orders" USING "btree" ("buyer_id");



CREATE INDEX "idx_city_market_products_category" ON "public"."city_market_products" USING "btree" ("category");



CREATE INDEX "idx_city_markets_county" ON "public"."city_markets" USING "btree" ("county");



CREATE INDEX "idx_collaboration_messages_collaboration_id" ON "public"."collaboration_messages" USING "btree" ("collaboration_id");



CREATE INDEX "idx_collaboration_proposals_collaboration_id" ON "public"."collaboration_proposals" USING "btree" ("collaboration_id");



CREATE INDEX "idx_contract_applications_contract_id" ON "public"."contract_applications" USING "btree" ("contract_id");



CREATE INDEX "idx_contract_applications_farmer_id" ON "public"."contract_applications" USING "btree" ("farmer_id");



CREATE INDEX "idx_contract_applications_status" ON "public"."contract_applications" USING "btree" ("status");



CREATE INDEX "idx_contract_comments_contract_id" ON "public"."contract_comments" USING "btree" ("contract_id");



CREATE INDEX "idx_contract_comments_parent_id" ON "public"."contract_comments" USING "btree" ("parent_id");



CREATE INDEX "idx_contract_comments_user_id" ON "public"."contract_comments" USING "btree" ("user_id");



CREATE INDEX "idx_contract_farming_opportunities_created_by" ON "public"."contract_farming_opportunities" USING "btree" ("created_by");



CREATE INDEX "idx_contract_farming_opportunities_crop_type" ON "public"."contract_farming_opportunities" USING "btree" ("crop_type");



CREATE INDEX "idx_contract_farming_opportunities_expires_at" ON "public"."contract_farming_opportunities" USING "btree" ("expires_at");



CREATE INDEX "idx_contract_farming_opportunities_location" ON "public"."contract_farming_opportunities" USING "btree" ("location");



CREATE INDEX "idx_contract_farming_opportunities_status" ON "public"."contract_farming_opportunities" USING "btree" ("status");



CREATE INDEX "idx_contract_reviews_contract_id" ON "public"."contract_reviews" USING "btree" ("contract_id");



CREATE INDEX "idx_contract_reviews_rating" ON "public"."contract_reviews" USING "btree" ("rating");



CREATE INDEX "idx_contract_reviews_user_id" ON "public"."contract_reviews" USING "btree" ("user_id");



CREATE INDEX "idx_crop_tracking_user_id" ON "public"."crop_tracking" USING "btree" ("user_id");



CREATE INDEX "idx_export_opportunities_type_status" ON "public"."export_opportunities" USING "btree" ("opportunity_type", "status");



CREATE INDEX "idx_exporter_profiles_county" ON "public"."exporter_profiles" USING "btree" ("office_county");



CREATE INDEX "idx_exporter_profiles_user_id" ON "public"."exporter_profiles" USING "btree" ("user_id");



CREATE INDEX "idx_exporter_reviews_exporter_id" ON "public"."exporter_reviews" USING "btree" ("exporter_id");



CREATE INDEX "idx_farm_budgets_user_year" ON "public"."farm_budgets" USING "btree" ("user_id", "year");



CREATE INDEX "idx_farm_input_orders_buyer" ON "public"."farm_input_orders" USING "btree" ("buyer_id");



CREATE INDEX "idx_farm_input_orders_supplier" ON "public"."farm_input_orders" USING "btree" ("supplier_id");



CREATE INDEX "idx_farm_input_products_category" ON "public"."farm_input_products" USING "btree" ("product_category");



CREATE INDEX "idx_farm_input_products_category_id" ON "public"."farm_input_products" USING "btree" ("category_id");



CREATE INDEX "idx_farm_input_products_supplier" ON "public"."farm_input_products" USING "btree" ("supplier_id");



CREATE INDEX "idx_farm_parcels_user_id" ON "public"."farm_parcels" USING "btree" ("user_id");



CREATE INDEX "idx_farmer_exporter_collaborations_commodity" ON "public"."farmer_exporter_collaborations" USING "btree" ("commodity_name");



CREATE INDEX "idx_farmer_exporter_collaborations_county" ON "public"."farmer_exporter_collaborations" USING "btree" ("farmer_county");



CREATE INDEX "idx_farmer_exporter_collaborations_exporter_id" ON "public"."farmer_exporter_collaborations" USING "btree" ("exporter_id");



CREATE INDEX "idx_farmer_exporter_collaborations_farmer_id" ON "public"."farmer_exporter_collaborations" USING "btree" ("farmer_id");



CREATE INDEX "idx_farmer_exporter_collaborations_status" ON "public"."farmer_exporter_collaborations" USING "btree" ("collaboration_status");



CREATE INDEX "idx_farmer_inventory_user" ON "public"."farmer_inventory" USING "btree" ("user_id");



CREATE INDEX "idx_farmer_transactions_user" ON "public"."farmer_financial_transactions" USING "btree" ("user_id");



CREATE INDEX "idx_feature_requests_user_id" ON "public"."feature_requests" USING "btree" ("user_id");



CREATE INDEX "idx_kilimo_stats_category" ON "public"."kilimo_statistics" USING "btree" ("category");



CREATE INDEX "idx_kilimo_stats_county" ON "public"."kilimo_statistics" USING "btree" ("county");



CREATE INDEX "idx_kilimo_stats_fetch_date" ON "public"."kilimo_statistics" USING "btree" ("fetch_date");



CREATE INDEX "idx_land_parcels_user" ON "public"."land_parcels" USING "btree" ("user_id");



CREATE INDEX "idx_livestock_for_sale_breed" ON "public"."livestock_for_sale" USING "btree" ("breed");



CREATE INDEX "idx_livestock_for_sale_is_halal" ON "public"."livestock_for_sale" USING "btree" ("is_halal");



CREATE INDEX "idx_livestock_for_sale_market_id" ON "public"."livestock_for_sale" USING "btree" ("market_id");



CREATE INDEX "idx_livestock_for_sale_seller_id" ON "public"."livestock_for_sale" USING "btree" ("seller_id");



CREATE INDEX "idx_livestock_for_sale_status" ON "public"."livestock_for_sale" USING "btree" ("status");



CREATE INDEX "idx_livestock_for_sale_type" ON "public"."livestock_for_sale" USING "btree" ("type");



CREATE INDEX "idx_market_demand_supply_market" ON "public"."market_demand_supply" USING "btree" ("market_id");



CREATE INDEX "idx_market_details_county_code" ON "public"."market_details" USING "btree" ("county_code");



CREATE INDEX "idx_market_details_market_type" ON "public"."market_details" USING "btree" ("market_type");



CREATE INDEX "idx_market_forecasts_commodity" ON "public"."market_forecasts" USING "btree" ("commodity_name");



CREATE INDEX "idx_market_forecasts_county" ON "public"."market_forecasts" USING "btree" ("county");



CREATE INDEX "idx_market_linkage_applications_status" ON "public"."market_linkage_applications" USING "btree" ("application_status");



CREATE INDEX "idx_market_linkages_type" ON "public"."market_linkages" USING "btree" ("linkage_type");



CREATE INDEX "idx_market_participants_agent" ON "public"."market_participants" USING "btree" ("agent_id");



CREATE INDEX "idx_market_participants_market" ON "public"."market_participants" USING "btree" ("market_id");



CREATE INDEX "idx_market_prices_commodity" ON "public"."market_prices" USING "btree" ("commodity_name");



CREATE INDEX "idx_market_prices_county" ON "public"."market_prices" USING "btree" ("county");



CREATE INDEX "idx_market_prices_date" ON "public"."market_prices" USING "btree" ("date_recorded" DESC);



CREATE INDEX "idx_market_sentiment_commodity" ON "public"."market_sentiment" USING "btree" ("commodity_name");



CREATE INDEX "idx_market_sentiment_county" ON "public"."market_sentiment" USING "btree" ("county");



CREATE INDEX "idx_price_alerts_active" ON "public"."price_alerts" USING "btree" ("is_active");



CREATE INDEX "idx_price_alerts_user" ON "public"."price_alerts" USING "btree" ("user_id");



CREATE INDEX "idx_processing_matches_bulk_order_id" ON "public"."processing_matches" USING "btree" ("bulk_order_id");



CREATE INDEX "idx_processors_county" ON "public"."processors" USING "btree" ("county");



CREATE INDEX "idx_produce_location" ON "public"."produce_inventory" USING "btree" ("location");



CREATE INDEX "idx_produce_product_name" ON "public"."produce_inventory" USING "btree" ("product_name");



CREATE INDEX "idx_quality_control_discussions_county" ON "public"."quality_control_discussions" USING "btree" ("county");



CREATE INDEX "idx_service_provider_reviews_provider_id" ON "public"."service_provider_reviews" USING "btree" ("provider_id");



CREATE INDEX "idx_service_providers_county" ON "public"."service_providers" USING "btree" ((("location" ->> 'county'::"text")));



CREATE INDEX "idx_service_providers_type" ON "public"."service_providers" USING "btree" ("businesstype");



CREATE INDEX "idx_training_events_county" ON "public"."training_events" USING "btree" ("county");



CREATE INDEX "idx_training_events_date" ON "public"."training_events" USING "btree" ("start_date");



CREATE INDEX "idx_training_registrations_training_id" ON "public"."training_registrations" USING "btree" ("training_id");



CREATE INDEX "idx_transport_requests_status" ON "public"."transport_requests" USING "btree" ("status");



CREATE INDEX "idx_warehouse_bookings_status" ON "public"."warehouse_bookings" USING "btree" ("status");



CREATE INDEX "idx_warehouses_capacity" ON "public"."warehouses" USING "btree" ("capacity_tons");



CREATE INDEX "idx_warehouses_county" ON "public"."warehouses" USING "btree" ("county");



CREATE INDEX "idx_weather_data_county_date" ON "public"."weather_data" USING "btree" ("county", "date");



CREATE OR REPLACE TRIGGER "set_feature_request_user_id_trigger" BEFORE INSERT ON "public"."feature_requests" FOR EACH ROW EXECUTE FUNCTION "public"."set_feature_request_user_id"();



CREATE OR REPLACE TRIGGER "set_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_timestamp_market_linkages" BEFORE UPDATE ON "public"."market_linkages" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();



CREATE OR REPLACE TRIGGER "set_timestamp_produce_inventory" BEFORE UPDATE ON "public"."produce_inventory" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();



CREATE OR REPLACE TRIGGER "set_timestamp_training_events" BEFORE UPDATE ON "public"."training_events" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();



CREATE OR REPLACE TRIGGER "set_timestamp_transport_requests" BEFORE UPDATE ON "public"."transport_requests" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();



CREATE OR REPLACE TRIGGER "set_timestamp_warehouse_bookings" BEFORE UPDATE ON "public"."warehouse_bookings" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();



CREATE OR REPLACE TRIGGER "set_timestamp_warehouses" BEFORE UPDATE ON "public"."warehouses" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();



CREATE OR REPLACE TRIGGER "set_transporters_updated_at" BEFORE UPDATE ON "public"."transporters" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at_barter_listings" BEFORE UPDATE ON "public"."barter_listings" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();



CREATE OR REPLACE TRIGGER "set_updated_at_collaboration_proposals" BEFORE UPDATE ON "public"."collaboration_proposals" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();



CREATE OR REPLACE TRIGGER "set_updated_at_crop_tracking" BEFORE UPDATE ON "public"."crop_tracking" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();



CREATE OR REPLACE TRIGGER "set_updated_at_exporter_profiles" BEFORE UPDATE ON "public"."exporter_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();



CREATE OR REPLACE TRIGGER "set_updated_at_farm_parcels" BEFORE UPDATE ON "public"."farm_parcels" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();



CREATE OR REPLACE TRIGGER "set_updated_at_farmer_exporter_collaborations" BEFORE UPDATE ON "public"."farmer_exporter_collaborations" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();



CREATE OR REPLACE TRIGGER "set_updated_at_farmer_financial_transactions" BEFORE UPDATE ON "public"."farmer_financial_transactions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_updated_at_farmer_inventory" BEFORE UPDATE ON "public"."farmer_inventory" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_updated_at_land_parcels" BEFORE UPDATE ON "public"."land_parcels" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_updated_at_market_prices" BEFORE UPDATE ON "public"."market_prices" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_updated_at_quality_control_discussions" BEFORE UPDATE ON "public"."quality_control_discussions" FOR EACH ROW EXECUTE FUNCTION "public"."trigger_set_timestamp"();



CREATE OR REPLACE TRIGGER "set_updated_at_service_providers" BEFORE UPDATE ON "public"."service_providers" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_updated_at_user_notification_preferences" BEFORE UPDATE ON "public"."user_notification_preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "trigger_city_market_products_updated_at" BEFORE UPDATE ON "public"."city_market_products" FOR EACH ROW EXECUTE FUNCTION "public"."update_city_market_products_updated_at"();



CREATE OR REPLACE TRIGGER "update_business_advertisements_updated_at" BEFORE UPDATE ON "public"."business_advertisements" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_community_posts_updated_at" BEFORE UPDATE ON "public"."community_posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_contract_comments_updated_at" BEFORE UPDATE ON "public"."contract_comments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_contract_farming_opportunities_updated_at" BEFORE UPDATE ON "public"."contract_farming_opportunities" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_contract_reviews_updated_at" BEFORE UPDATE ON "public"."contract_reviews" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_crop_yields_updated_at" BEFORE UPDATE ON "public"."crop_yields" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_farm_statistics_updated_at" BEFORE UPDATE ON "public"."farm_statistics" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_farm_tasks_updated_at" BEFORE UPDATE ON "public"."farm_tasks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_financial_transactions_updated_at" BEFORE UPDATE ON "public"."financial_transactions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_impact_metrics_updated_at" BEFORE UPDATE ON "public"."impact_metrics" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_inventory_items_updated_at" BEFORE UPDATE ON "public"."inventory_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_kilimo_statistics_updated_at" BEFORE UPDATE ON "public"."kilimo_statistics" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_livestock_breeds_modtime" BEFORE UPDATE ON "public"."livestock_breeds" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



CREATE OR REPLACE TRIGGER "update_livestock_for_sale_modtime" BEFORE UPDATE ON "public"."livestock_for_sale" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



CREATE OR REPLACE TRIGGER "update_livestock_markets_modtime" BEFORE UPDATE ON "public"."livestock_markets" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



CREATE OR REPLACE TRIGGER "update_notification_preferences_updated_at" BEFORE UPDATE ON "public"."notification_preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_payment_transactions_updated_at" BEFORE UPDATE ON "public"."payment_transactions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_post_comments_updated_at" BEFORE UPDATE ON "public"."post_comments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."admin_action_logs"
    ADD CONSTRAINT "admin_action_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."agents"
    ADD CONSTRAINT "agents_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "public"."city_markets"("id");



ALTER TABLE ONLY "public"."aggregators"
    ADD CONSTRAINT "aggregators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."animal_health"
    ADD CONSTRAINT "animal_health_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."animal_records"
    ADD CONSTRAINT "animal_records_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."animal_sales"
    ADD CONSTRAINT "animal_sales_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "public"."animals"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."animals"
    ADD CONSTRAINT "animals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."api_keys"
    ADD CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."api_usage"
    ADD CONSTRAINT "api_usage_api_key_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "public"."api_keys"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."api_usage"
    ADD CONSTRAINT "api_usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."barter_listings"
    ADD CONSTRAINT "barter_listings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."batch_tracking"
    ADD CONSTRAINT "batch_tracking_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "public"."agents"("id");



ALTER TABLE ONLY "public"."bulk_order_bids"
    ADD CONSTRAINT "bulk_order_bids_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "public"."agents"("id");



ALTER TABLE ONLY "public"."bulk_order_bids"
    ADD CONSTRAINT "bulk_order_bids_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."bulk_orders"("id");



ALTER TABLE ONLY "public"."bulk_orders"
    ADD CONSTRAINT "bulk_orders_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "public"."agents"("id");



ALTER TABLE ONLY "public"."business_advertisements"
    ADD CONSTRAINT "business_advertisements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."city_market_auctions"
    ADD CONSTRAINT "city_market_auctions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."city_market_products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."city_market_ban_recommendations"
    ADD CONSTRAINT "city_market_ban_recommendations_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "public"."city_markets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."city_market_bids"
    ADD CONSTRAINT "city_market_bids_auction_id_fkey" FOREIGN KEY ("auction_id") REFERENCES "public"."city_market_auctions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."city_market_comments"
    ADD CONSTRAINT "city_market_comments_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "public"."city_markets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."city_market_donations"
    ADD CONSTRAINT "city_market_donations_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id");



ALTER TABLE ONLY "public"."city_market_donations"
    ADD CONSTRAINT "city_market_donations_home_id_fkey" FOREIGN KEY ("home_id") REFERENCES "public"."recipients"("id");



ALTER TABLE ONLY "public"."city_market_donations"
    ADD CONSTRAINT "city_market_donations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."city_market_products"("id");



ALTER TABLE ONLY "public"."city_market_flags"
    ADD CONSTRAINT "city_market_flags_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "public"."city_markets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."city_market_likes"
    ADD CONSTRAINT "city_market_likes_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "public"."city_markets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."city_market_products"
    ADD CONSTRAINT "city_market_products_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "public"."city_markets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."city_market_ratings"
    ADD CONSTRAINT "city_market_ratings_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "public"."city_markets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."collaboration_messages"
    ADD CONSTRAINT "collaboration_messages_collaboration_id_fkey" FOREIGN KEY ("collaboration_id") REFERENCES "public"."farmer_exporter_collaborations"("id");



ALTER TABLE ONLY "public"."collaboration_messages"
    ADD CONSTRAINT "collaboration_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."collaboration_proposals"
    ADD CONSTRAINT "collaboration_proposals_collaboration_id_fkey" FOREIGN KEY ("collaboration_id") REFERENCES "public"."farmer_exporter_collaborations"("id");



ALTER TABLE ONLY "public"."collaboration_proposals"
    ADD CONSTRAINT "collaboration_proposals_exporter_id_fkey" FOREIGN KEY ("exporter_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."community_polls"
    ADD CONSTRAINT "community_polls_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."community_polls"
    ADD CONSTRAINT "community_polls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."community_posts"
    ADD CONSTRAINT "community_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."contract_applications"
    ADD CONSTRAINT "contract_applications_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."contract_farming_opportunities"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contract_applications"
    ADD CONSTRAINT "contract_applications_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contract_applications"
    ADD CONSTRAINT "contract_applications_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."contract_comments"
    ADD CONSTRAINT "contract_comments_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."contract_farming_opportunities"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contract_comments"
    ADD CONSTRAINT "contract_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."contract_comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contract_comments"
    ADD CONSTRAINT "contract_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contract_documents"
    ADD CONSTRAINT "contract_documents_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."contract_farming_opportunities"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contract_documents"
    ADD CONSTRAINT "contract_documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."contract_farming_opportunities"
    ADD CONSTRAINT "contract_farming_opportunities_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contract_flags"
    ADD CONSTRAINT "contract_flags_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."contract_farming_opportunities"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contract_flags"
    ADD CONSTRAINT "contract_flags_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."contract_flags"
    ADD CONSTRAINT "contract_flags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contract_reviews"
    ADD CONSTRAINT "contract_reviews_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."contract_farming_opportunities"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contract_reviews"
    ADD CONSTRAINT "contract_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contract_social_shares"
    ADD CONSTRAINT "contract_social_shares_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "public"."contract_farming_opportunities"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contract_social_shares"
    ADD CONSTRAINT "contract_social_shares_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."crop_tracking"
    ADD CONSTRAINT "crop_tracking_parcel_id_fkey" FOREIGN KEY ("parcel_id") REFERENCES "public"."farm_parcels"("id");



ALTER TABLE ONLY "public"."crop_tracking"
    ADD CONSTRAINT "crop_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."crop_yields"
    ADD CONSTRAINT "crop_yields_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."equipment_ban_recommendations"
    ADD CONSTRAINT "equipment_ban_recommendations_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."equipment_bookmarks"
    ADD CONSTRAINT "equipment_bookmarks_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."equipment_flags"
    ADD CONSTRAINT "equipment_flags_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."equipment_likes"
    ADD CONSTRAINT "equipment_likes_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."equipment"
    ADD CONSTRAINT "equipment_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."equipment_ratings"
    ADD CONSTRAINT "equipment_ratings_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."export_documentation"
    ADD CONSTRAINT "export_documentation_export_opportunity_id_fkey" FOREIGN KEY ("export_opportunity_id") REFERENCES "public"."export_opportunities"("id");



ALTER TABLE ONLY "public"."export_documentation"
    ADD CONSTRAINT "export_documentation_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."export_orders"
    ADD CONSTRAINT "export_orders_consolidation_id_fkey" FOREIGN KEY ("consolidation_id") REFERENCES "public"."farmer_consolidations"("id");



ALTER TABLE ONLY "public"."export_orders"
    ADD CONSTRAINT "export_orders_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."export_orders"
    ADD CONSTRAINT "export_orders_export_opportunity_id_fkey" FOREIGN KEY ("export_opportunity_id") REFERENCES "public"."export_opportunities"("id");



ALTER TABLE ONLY "public"."exporter_profiles"
    ADD CONSTRAINT "exporter_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."exporter_reviews"
    ADD CONSTRAINT "exporter_reviews_collaboration_id_fkey" FOREIGN KEY ("collaboration_id") REFERENCES "public"."farmer_exporter_collaborations"("id");



ALTER TABLE ONLY "public"."exporter_reviews"
    ADD CONSTRAINT "exporter_reviews_exporter_id_fkey" FOREIGN KEY ("exporter_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."exporter_reviews"
    ADD CONSTRAINT "exporter_reviews_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."farm_budgets"
    ADD CONSTRAINT "farm_budgets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."farm_input_order_items"
    ADD CONSTRAINT "farm_input_order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."farm_input_orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."farm_input_order_items"
    ADD CONSTRAINT "farm_input_order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."farm_input_products"("id");



ALTER TABLE ONLY "public"."farm_input_orders"
    ADD CONSTRAINT "farm_input_orders_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."farm_input_orders"
    ADD CONSTRAINT "farm_input_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."farm_input_suppliers"("id");



ALTER TABLE ONLY "public"."farm_input_product_bookmarks"
    ADD CONSTRAINT "farm_input_product_bookmarks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."farm_input_products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."farm_input_product_bookmarks"
    ADD CONSTRAINT "farm_input_product_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."farm_input_product_likes"
    ADD CONSTRAINT "farm_input_product_likes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."farm_input_products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."farm_input_product_likes"
    ADD CONSTRAINT "farm_input_product_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."farm_input_product_ratings"
    ADD CONSTRAINT "farm_input_product_ratings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."farm_input_products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."farm_input_product_ratings"
    ADD CONSTRAINT "farm_input_product_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."farm_input_products"
    ADD CONSTRAINT "farm_input_products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."farm_input_categories"("id");



ALTER TABLE ONLY "public"."farm_input_products"
    ADD CONSTRAINT "farm_input_products_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."farm_input_suppliers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."farm_input_supplier_likes"
    ADD CONSTRAINT "farm_input_supplier_likes_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."farm_input_suppliers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."farm_input_supplier_likes"
    ADD CONSTRAINT "farm_input_supplier_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."farm_input_supplier_ratings"
    ADD CONSTRAINT "farm_input_supplier_ratings_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."farm_input_suppliers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."farm_input_supplier_ratings"
    ADD CONSTRAINT "farm_input_supplier_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."farm_input_suppliers"
    ADD CONSTRAINT "farm_input_suppliers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."farm_parcels"
    ADD CONSTRAINT "farm_parcels_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."farmer_consolidations"
    ADD CONSTRAINT "farmer_consolidations_consolidator_id_fkey" FOREIGN KEY ("consolidator_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."farmer_consolidations"
    ADD CONSTRAINT "farmer_consolidations_export_opportunity_id_fkey" FOREIGN KEY ("export_opportunity_id") REFERENCES "public"."export_opportunities"("id");



ALTER TABLE ONLY "public"."farmer_contract_members"
    ADD CONSTRAINT "farmer_contract_members_contract_network_id_fkey" FOREIGN KEY ("contract_network_id") REFERENCES "public"."farmer_contract_networks"("id");



ALTER TABLE ONLY "public"."farmer_contract_members"
    ADD CONSTRAINT "farmer_contract_members_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."farmer_contract_networks"
    ADD CONSTRAINT "farmer_contract_networks_lead_farmer_id_fkey" FOREIGN KEY ("lead_farmer_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."farmer_exporter_collaborations"
    ADD CONSTRAINT "farmer_exporter_collaborations_exporter_id_fkey" FOREIGN KEY ("exporter_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."farmer_exporter_collaborations"
    ADD CONSTRAINT "farmer_exporter_collaborations_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."feature_requests"
    ADD CONSTRAINT "feature_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."financial_transactions"
    ADD CONSTRAINT "financial_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."input_group_orders"
    ADD CONSTRAINT "input_group_orders_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "public"."agents"("id");



ALTER TABLE ONLY "public"."input_group_orders"
    ADD CONSTRAINT "input_group_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."agents"("id");



ALTER TABLE ONLY "public"."input_prices"
    ADD CONSTRAINT "input_prices_reported_by_fkey" FOREIGN KEY ("reported_by") REFERENCES "public"."agents"("id");



ALTER TABLE ONLY "public"."input_supplier_reviews"
    ADD CONSTRAINT "input_supplier_reviews_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."agents"("id");



ALTER TABLE ONLY "public"."inventory_items"
    ADD CONSTRAINT "inventory_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."invitations"
    ADD CONSTRAINT "invitations_contract_network_id_fkey" FOREIGN KEY ("contract_network_id") REFERENCES "public"."farmer_contract_networks"("id");



ALTER TABLE ONLY "public"."invitations"
    ADD CONSTRAINT "invitations_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."livestock_for_sale"
    ADD CONSTRAINT "livestock_for_sale_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "public"."livestock_markets"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."livestock_for_sale"
    ADD CONSTRAINT "livestock_for_sale_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."livestock_listings"
    ADD CONSTRAINT "livestock_listings_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."market_agents"
    ADD CONSTRAINT "market_agents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."market_demand_supply"
    ADD CONSTRAINT "market_demand_supply_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "public"."city_markets"("id");



ALTER TABLE ONLY "public"."market_demand_supply"
    ADD CONSTRAINT "market_demand_supply_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."market_participants"("id");



ALTER TABLE ONLY "public"."market_linkage_applications"
    ADD CONSTRAINT "market_linkage_applications_linkage_id_fkey" FOREIGN KEY ("linkage_id") REFERENCES "public"."market_linkages"("id");



ALTER TABLE ONLY "public"."market_linkage_applications"
    ADD CONSTRAINT "market_linkage_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."market_linkages"
    ADD CONSTRAINT "market_linkages_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."market_participants"
    ADD CONSTRAINT "market_participants_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "public"."market_agents"("id");



ALTER TABLE ONLY "public"."market_participants"
    ADD CONSTRAINT "market_participants_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "public"."city_markets"("id");



ALTER TABLE ONLY "public"."market_participants"
    ADD CONSTRAINT "market_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."marketplace_ban_recommendations"
    ADD CONSTRAINT "marketplace_ban_recommendations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."marketplace_flags"
    ADD CONSTRAINT "marketplace_flags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mentorship_sessions"
    ADD CONSTRAINT "mentorship_sessions_contract_network_id_fkey" FOREIGN KEY ("contract_network_id") REFERENCES "public"."farmer_contract_networks"("id");



ALTER TABLE ONLY "public"."mentorship_sessions"
    ADD CONSTRAINT "mentorship_sessions_mentee_id_fkey" FOREIGN KEY ("mentee_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."mentorship_sessions"
    ADD CONSTRAINT "mentorship_sessions_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."micro_creditors"
    ADD CONSTRAINT "micro_creditors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."notification_preferences"
    ADD CONSTRAINT "notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."p2p_lending_offers"
    ADD CONSTRAINT "p2p_lending_offers_lender_id_fkey" FOREIGN KEY ("lender_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."partner_events"
    ADD CONSTRAINT "partner_events_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."partners"
    ADD CONSTRAINT "partners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."payment_transactions"
    ADD CONSTRAINT "payment_transactions_advertisement_id_fkey" FOREIGN KEY ("advertisement_id") REFERENCES "public"."business_advertisements"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payment_transactions"
    ADD CONSTRAINT "payment_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."poll_votes"
    ADD CONSTRAINT "poll_votes_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "public"."community_polls"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."poll_votes"
    ADD CONSTRAINT "poll_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."post_comments"
    ADD CONSTRAINT "post_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."post_comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_comments"
    ADD CONSTRAINT "post_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_comments"
    ADD CONSTRAINT "post_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."price_comparisons"
    ADD CONSTRAINT "price_comparisons_export_opportunity_id_fkey" FOREIGN KEY ("export_opportunity_id") REFERENCES "public"."export_opportunities"("id");



ALTER TABLE ONLY "public"."price_comparisons"
    ADD CONSTRAINT "price_comparisons_market_id_fkey" FOREIGN KEY ("market_id") REFERENCES "public"."city_markets"("id");



ALTER TABLE ONLY "public"."processing_matches"
    ADD CONSTRAINT "processing_matches_bulk_order_id_fkey" FOREIGN KEY ("bulk_order_id") REFERENCES "public"."bulk_orders"("id");



ALTER TABLE ONLY "public"."processors"
    ADD CONSTRAINT "processors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."produce_inventory"
    ADD CONSTRAINT "produce_inventory_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."quality_control_discussions"
    ADD CONSTRAINT "quality_control_discussions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."rescue_matches"
    ADD CONSTRAINT "rescue_matches_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."food_rescue_listings"("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."service_provider_reviews"
    ADD CONSTRAINT "service_provider_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."subscription_box_deliveries"
    ADD CONSTRAINT "subscription_box_deliveries_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "public"."subscription_boxes"("id");



ALTER TABLE ONLY "public"."subscription_boxes"
    ADD CONSTRAINT "subscription_boxes_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "public"."agents"("id");



ALTER TABLE ONLY "public"."timeline_events"
    ADD CONSTRAINT "timeline_events_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."timeline_events"
    ADD CONSTRAINT "timeline_events_export_order_id_fkey" FOREIGN KEY ("export_order_id") REFERENCES "public"."export_orders"("id");



ALTER TABLE ONLY "public"."tracking_events"
    ADD CONSTRAINT "tracking_events_export_order_id_fkey" FOREIGN KEY ("export_order_id") REFERENCES "public"."export_orders"("id");



ALTER TABLE ONLY "public"."training_events"
    ADD CONSTRAINT "training_events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."training_registrations"
    ADD CONSTRAINT "training_registrations_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "public"."training_events"("id");



ALTER TABLE ONLY "public"."training_registrations"
    ADD CONSTRAINT "training_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."transport_requests"
    ADD CONSTRAINT "transport_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."transport_requests"
    ADD CONSTRAINT "transport_requests_transporter_id_fkey" FOREIGN KEY ("transporter_id") REFERENCES "public"."transporters"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."transporter_bookings"
    ADD CONSTRAINT "transporter_bookings_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."transporter_bookings"
    ADD CONSTRAINT "transporter_bookings_export_order_id_fkey" FOREIGN KEY ("export_order_id") REFERENCES "public"."export_orders"("id");



ALTER TABLE ONLY "public"."transporter_recommendations"
    ADD CONSTRAINT "transporter_recommendations_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."transporters"
    ADD CONSTRAINT "transporters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_notifications"
    ADD CONSTRAINT "user_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."warehouse_bookings"
    ADD CONSTRAINT "warehouse_bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."warehouse_bookings"
    ADD CONSTRAINT "warehouse_bookings_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."warehouses"
    ADD CONSTRAINT "warehouses_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admin only" ON "public"."admin_action_logs" USING (("auth"."role"() = 'admin'::"text"));



CREATE POLICY "Admins can manage all agent profiles" ON "public"."agents" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can manage all city market auctions" ON "public"."city_market_auctions" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can manage all city market ban recommendations" ON "public"."city_market_ban_recommendations" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can manage all city market bids" ON "public"."city_market_bids" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can manage all city market comments" ON "public"."city_market_comments" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can manage all city market flags" ON "public"."city_market_flags" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can manage all city market likes" ON "public"."city_market_likes" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can manage all city market products" ON "public"."city_market_products" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can manage all city market ratings" ON "public"."city_market_ratings" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can manage all equipment ban recommendations" ON "public"."equipment_ban_recommendations" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can manage all equipment bookmarks" ON "public"."equipment_bookmarks" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can manage all equipment flags" ON "public"."equipment_flags" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can manage all equipment likes" ON "public"."equipment_likes" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can manage all equipment ratings" ON "public"."equipment_ratings" USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can manage all feature requests" ON "public"."feature_requests" TO "authenticated" USING ((( SELECT (("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") AS "text") = 'admin'::"text"));



CREATE POLICY "Admins can manage market prices" ON "public"."market_prices" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can manage markets" ON "public"."city_markets" USING (("auth"."uid"() IN ( SELECT "users"."id"
   FROM "auth"."users"
  WHERE (("users"."email")::"text" ~~ '%@admin.%'::"text"))));



CREATE POLICY "Admins can update all ban recommendations" ON "public"."marketplace_ban_recommendations" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can update all feature requests" ON "public"."feature_requests" FOR UPDATE TO "authenticated" USING ((( SELECT (("auth"."jwt"() -> 'app_metadata'::"text") ->> 'role'::"text") AS "text") = 'admin'::"text"));



CREATE POLICY "Admins can update all flags" ON "public"."marketplace_flags" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can view all ban recommendations" ON "public"."marketplace_ban_recommendations" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can view all flags" ON "public"."marketplace_flags" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can view all product likes" ON "public"."farm_input_product_likes" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "auth"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND (("users"."role")::"text" = 'admin'::"text")))));



CREATE POLICY "Admins can view all transporters" ON "public"."transporters" FOR SELECT USING (("auth"."uid"() IN ( SELECT "users"."id"
   FROM "auth"."users"
  WHERE ("auth"."uid"() = "users"."id"))));



CREATE POLICY "Agents can manage their participants" ON "public"."market_participants" USING (("auth"."uid"() IN ( SELECT "market_agents"."user_id"
   FROM "public"."market_agents"
  WHERE ("market_agents"."id" = "market_participants"."agent_id"))));



CREATE POLICY "Allow admins full access" ON "public"."permissions" TO "authenticated" USING ((( SELECT "roles"."id"
   FROM "public"."roles"
  WHERE ("roles"."name" = 'admin'::"text")) IN ( SELECT "user_roles"."role_id"
   FROM "public"."user_roles"
  WHERE ("user_roles"."user_id" = "auth"."uid"()))));



CREATE POLICY "Allow admins full access" ON "public"."role_permissions" TO "authenticated" USING ((( SELECT "roles"."id"
   FROM "public"."roles"
  WHERE ("roles"."name" = 'admin'::"text")) IN ( SELECT "user_roles"."role_id"
   FROM "public"."user_roles"
  WHERE ("user_roles"."user_id" = "auth"."uid"()))));



CREATE POLICY "Allow admins full access" ON "public"."roles" TO "authenticated" USING ((( SELECT "roles_1"."id"
   FROM "public"."roles" "roles_1"
  WHERE ("roles_1"."name" = 'admin'::"text")) IN ( SELECT "user_roles"."role_id"
   FROM "public"."user_roles"
  WHERE ("user_roles"."user_id" = "auth"."uid"()))));



CREATE POLICY "Allow admins full access" ON "public"."user_roles" TO "authenticated" USING ((( SELECT "roles"."id"
   FROM "public"."roles"
  WHERE ("roles"."name" = 'admin'::"text")) IN ( SELECT "user_roles_1"."role_id"
   FROM "public"."user_roles" "user_roles_1"
  WHERE ("user_roles_1"."user_id" = "auth"."uid"()))));



CREATE POLICY "Allow authenticated users full access" ON "public"."equipment" USING (("auth"."uid"() IS NOT NULL)) WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Allow authenticated users to read permissions" ON "public"."permissions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to read roles" ON "public"."roles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow delete for admins only" ON "public"."feature_requests" FOR DELETE USING (("auth"."role"() = 'admin'::"text"));



CREATE POLICY "Allow delete own agent profile" ON "public"."agents" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow delete own auction" ON "public"."city_market_auctions" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."city_market_products"
  WHERE (("city_market_products"."id" = "city_market_auctions"."product_id") AND ("city_market_products"."seller_user_id" = "auth"."uid"())))));



CREATE POLICY "Allow delete own ban recommendation" ON "public"."city_market_ban_recommendations" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow delete own bid" ON "public"."city_market_bids" FOR DELETE USING (("bidder_user_id" = "auth"."uid"()));



CREATE POLICY "Allow delete own comment" ON "public"."city_market_comments" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow delete own flag" ON "public"."city_market_flags" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow delete own like" ON "public"."city_market_likes" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow delete own product" ON "public"."city_market_products" FOR DELETE USING (("seller_user_id" = "auth"."uid"()));



CREATE POLICY "Allow delete own rating" ON "public"."city_market_ratings" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow insert for authenticated users" ON "public"."feature_requests" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Allow insert own agent profile" ON "public"."agents" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow insert own auction" ON "public"."city_market_auctions" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."city_market_products"
  WHERE (("city_market_products"."id" = "city_market_auctions"."product_id") AND ("city_market_products"."seller_user_id" = "auth"."uid"())))));



CREATE POLICY "Allow insert own ban recommendation" ON "public"."city_market_ban_recommendations" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow insert own bid" ON "public"."city_market_bids" FOR INSERT WITH CHECK (("bidder_user_id" = "auth"."uid"()));



CREATE POLICY "Allow insert own comment" ON "public"."city_market_comments" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow insert own flag" ON "public"."city_market_flags" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow insert own like" ON "public"."city_market_likes" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow insert own product" ON "public"."city_market_products" FOR INSERT WITH CHECK (("seller_user_id" = "auth"."uid"()));



CREATE POLICY "Allow insert own rating" ON "public"."city_market_ratings" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow public read access to data fetch logs" ON "public"."data_fetch_logs" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to kilimo statistics" ON "public"."kilimo_statistics" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to market forecasts" ON "public"."market_forecasts" FOR SELECT USING (true);



CREATE POLICY "Allow public read access to market sentiment" ON "public"."market_sentiment" FOR SELECT USING (true);



CREATE POLICY "Allow select agent" ON "public"."agents" FOR SELECT USING (true);



CREATE POLICY "Allow select auction" ON "public"."city_market_auctions" FOR SELECT USING (true);



CREATE POLICY "Allow select bid" ON "public"."city_market_bids" FOR SELECT USING (true);



CREATE POLICY "Allow select own ban recommendation" ON "public"."city_market_ban_recommendations" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow select own comment" ON "public"."city_market_comments" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow select own flag" ON "public"."city_market_flags" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow select own like" ON "public"."city_market_likes" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow select own rating" ON "public"."city_market_ratings" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow select product" ON "public"."city_market_products" FOR SELECT USING (true);



CREATE POLICY "Allow service role full access to data fetch logs" ON "public"."data_fetch_logs" TO "service_role" USING (true);



CREATE POLICY "Allow service role full access to kilimo statistics" ON "public"."kilimo_statistics" TO "service_role" USING (true);



CREATE POLICY "Allow update for admins only" ON "public"."feature_requests" FOR UPDATE USING (("auth"."role"() = 'admin'::"text"));



CREATE POLICY "Allow update own agent profile" ON "public"."agents" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow update own auction" ON "public"."city_market_auctions" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."city_market_products"
  WHERE (("city_market_products"."id" = "city_market_auctions"."product_id") AND ("city_market_products"."seller_user_id" = "auth"."uid"())))));



CREATE POLICY "Allow update own bid" ON "public"."city_market_bids" FOR UPDATE USING (("bidder_user_id" = "auth"."uid"()));



CREATE POLICY "Allow update own comment" ON "public"."city_market_comments" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow update own product" ON "public"."city_market_products" FOR UPDATE USING (("seller_user_id" = "auth"."uid"()));



CREATE POLICY "Allow update own rating" ON "public"."city_market_ratings" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Allow users to see their own roles" ON "public"."user_roles" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Anyone can record social shares" ON "public"."contract_social_shares" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can view active aggregators" ON "public"."aggregators" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active collaborations" ON "public"."farmer_exporter_collaborations" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active comments" ON "public"."post_comments" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active community posts" ON "public"."community_posts" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active contract opportunities" ON "public"."contract_farming_opportunities" FOR SELECT USING (("status" = 'active'::"text"));



CREATE POLICY "Anyone can view active creditors" ON "public"."micro_creditors" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active demand/supply" ON "public"."market_demand_supply" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active exporter profiles" ON "public"."exporter_profiles" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active impact metrics" ON "public"."impact_metrics" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active lending offers" ON "public"."p2p_lending_offers" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active markets" ON "public"."city_markets" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active participants" ON "public"."market_participants" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active polls" ON "public"."community_polls" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active posts" ON "public"."community_posts" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active pricing tiers" ON "public"."pricing_tiers" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active processors" ON "public"."processors" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active suppliers" ON "public"."farm_input_suppliers" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active weather alerts" ON "public"."weather_alerts" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view available products" ON "public"."farm_input_products" FOR SELECT USING ((("is_available" = true) AND ("is_active" = true)));



CREATE POLICY "Anyone can view buy opportunities" ON "public"."export_opportunities" FOR SELECT USING ((("opportunity_type" = 'buy'::"text") AND ("status" = 'open'::"text")));



CREATE POLICY "Anyone can view comments" ON "public"."contract_comments" FOR SELECT USING (true);



CREATE POLICY "Anyone can view documents for active contracts" ON "public"."contract_documents" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."contract_farming_opportunities"
  WHERE (("contract_farming_opportunities"."id" = "contract_documents"."contract_id") AND ("contract_farming_opportunities"."status" = 'active'::"text")))));



CREATE POLICY "Anyone can view market prices" ON "public"."market_prices" FOR SELECT USING (true);



CREATE POLICY "Anyone can view messages" ON "public"."messages" FOR SELECT USING (true);



CREATE POLICY "Anyone can view poll votes" ON "public"."poll_votes" FOR SELECT USING (true);



CREATE POLICY "Anyone can view reviews" ON "public"."contract_reviews" FOR SELECT USING (true);



CREATE POLICY "Anyone can view reviews" ON "public"."exporter_reviews" FOR SELECT USING (true);



CREATE POLICY "Anyone can view verified agents" ON "public"."market_agents" FOR SELECT USING ((("is_verified" = true) AND ("is_active" = true)));



CREATE POLICY "Anyone can view verified service providers" ON "public"."service_providers" FOR SELECT USING (("verified" = true));



CREATE POLICY "Anyone can view weather data" ON "public"."weather_data" FOR SELECT USING (true);



CREATE POLICY "Authenticated users can apply to contracts" ON "public"."contract_applications" FOR INSERT WITH CHECK (("auth"."uid"() = "farmer_id"));



CREATE POLICY "Authenticated users can create comments" ON "public"."contract_comments" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Authenticated users can create reviews" ON "public"."contract_reviews" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Collaboration participants can send messages" ON "public"."collaboration_messages" FOR INSERT WITH CHECK ((("auth"."uid"() = "sender_id") AND ("auth"."uid"() IN ( SELECT "farmer_exporter_collaborations"."farmer_id"
   FROM "public"."farmer_exporter_collaborations"
  WHERE ("farmer_exporter_collaborations"."id" = "collaboration_messages"."collaboration_id")
UNION
 SELECT "farmer_exporter_collaborations"."exporter_id"
   FROM "public"."farmer_exporter_collaborations"
  WHERE ("farmer_exporter_collaborations"."id" = "collaboration_messages"."collaboration_id")))));



CREATE POLICY "Collaboration participants can update proposals" ON "public"."collaboration_proposals" FOR UPDATE USING (("auth"."uid"() IN ( SELECT "farmer_exporter_collaborations"."farmer_id"
   FROM "public"."farmer_exporter_collaborations"
  WHERE ("farmer_exporter_collaborations"."id" = "collaboration_proposals"."collaboration_id")
UNION
 SELECT "farmer_exporter_collaborations"."exporter_id"
   FROM "public"."farmer_exporter_collaborations"
  WHERE ("farmer_exporter_collaborations"."id" = "collaboration_proposals"."collaboration_id"))));



CREATE POLICY "Collaboration participants can view messages" ON "public"."collaboration_messages" FOR SELECT USING (("auth"."uid"() IN ( SELECT "farmer_exporter_collaborations"."farmer_id"
   FROM "public"."farmer_exporter_collaborations"
  WHERE ("farmer_exporter_collaborations"."id" = "collaboration_messages"."collaboration_id")
UNION
 SELECT "farmer_exporter_collaborations"."exporter_id"
   FROM "public"."farmer_exporter_collaborations"
  WHERE ("farmer_exporter_collaborations"."id" = "collaboration_messages"."collaboration_id"))));



CREATE POLICY "Collaboration participants can view proposals" ON "public"."collaboration_proposals" FOR SELECT USING (("auth"."uid"() IN ( SELECT "farmer_exporter_collaborations"."farmer_id"
   FROM "public"."farmer_exporter_collaborations"
  WHERE ("farmer_exporter_collaborations"."id" = "collaboration_proposals"."collaboration_id")
UNION
 SELECT "farmer_exporter_collaborations"."exporter_id"
   FROM "public"."farmer_exporter_collaborations"
  WHERE ("farmer_exporter_collaborations"."id" = "collaboration_proposals"."collaboration_id"))));



CREATE POLICY "Consolidations: delete own" ON "public"."farmer_consolidations" FOR DELETE USING (("consolidator_id" = "auth"."uid"()));



CREATE POLICY "Consolidations: insert own" ON "public"."farmer_consolidations" FOR INSERT WITH CHECK (("consolidator_id" = "auth"."uid"()));



CREATE POLICY "Consolidations: select own" ON "public"."farmer_consolidations" FOR SELECT USING (("consolidator_id" = "auth"."uid"()));



CREATE POLICY "Consolidations: update own" ON "public"."farmer_consolidations" FOR UPDATE USING (("consolidator_id" = "auth"."uid"()));



CREATE POLICY "Contract owners can manage documents" ON "public"."contract_documents" USING ((EXISTS ( SELECT 1
   FROM "public"."contract_farming_opportunities"
  WHERE (("contract_farming_opportunities"."id" = "contract_documents"."contract_id") AND ("contract_farming_opportunities"."created_by" = "auth"."uid"())))));



CREATE POLICY "Contract owners can update application status" ON "public"."contract_applications" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."contract_farming_opportunities"
  WHERE (("contract_farming_opportunities"."id" = "contract_applications"."contract_id") AND ("contract_farming_opportunities"."created_by" = "auth"."uid"())))));



CREATE POLICY "Contract owners can view applications to their contracts" ON "public"."contract_applications" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."contract_farming_opportunities"
  WHERE (("contract_farming_opportunities"."id" = "contract_applications"."contract_id") AND ("contract_farming_opportunities"."created_by" = "auth"."uid"())))));



CREATE POLICY "Delete own or admin" ON "public"."farm_budgets" FOR DELETE USING ((("user_id" = "auth"."uid"()) OR ("auth"."role"() = 'admin'::"text")));



CREATE POLICY "Enable delete for listing owners" ON "public"."livestock_listings" FOR DELETE USING (("auth"."uid"() = "seller_id"));



CREATE POLICY "Enable insert for authenticated users" ON "public"."livestock_listings" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable read access for all users" ON "public"."livestock_listings" FOR SELECT USING (true);



CREATE POLICY "Enable update for listing owners" ON "public"."livestock_listings" FOR UPDATE USING (("auth"."uid"() = "seller_id"));



CREATE POLICY "Export docs: delete own" ON "public"."export_documentation" FOR DELETE USING (("uploaded_by" = "auth"."uid"()));



CREATE POLICY "Export docs: insert own" ON "public"."export_documentation" FOR INSERT WITH CHECK (("uploaded_by" = "auth"."uid"()));



CREATE POLICY "Export docs: select own" ON "public"."export_documentation" FOR SELECT USING (("uploaded_by" = "auth"."uid"()));



CREATE POLICY "Export docs: update own" ON "public"."export_documentation" FOR UPDATE USING (("uploaded_by" = "auth"."uid"()));



CREATE POLICY "Export: delete own" ON "public"."export_opportunities" FOR DELETE USING (("created_by" = "auth"."uid"()));



CREATE POLICY "Export: insert own" ON "public"."export_opportunities" FOR INSERT WITH CHECK (("created_by" = "auth"."uid"()));



CREATE POLICY "Export: select open or own" ON "public"."export_opportunities" FOR SELECT USING ((("status" = 'open'::"text") OR ("created_by" = "auth"."uid"())));



CREATE POLICY "Export: update own" ON "public"."export_opportunities" FOR UPDATE USING (("created_by" = "auth"."uid"()));



CREATE POLICY "Exporters can create proposals" ON "public"."collaboration_proposals" FOR INSERT WITH CHECK (("auth"."uid"() = "exporter_id"));



CREATE POLICY "Exporters can create their own profile" ON "public"."exporter_profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Exporters can update collaborations they're part of" ON "public"."farmer_exporter_collaborations" FOR UPDATE USING (("auth"."uid"() = "exporter_id"));



CREATE POLICY "Exporters can update their own profile" ON "public"."exporter_profiles" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Farmers can create collaborations" ON "public"."farmer_exporter_collaborations" FOR INSERT WITH CHECK (("auth"."uid"() = "farmer_id"));



CREATE POLICY "Farmers can create reviews" ON "public"."exporter_reviews" FOR INSERT WITH CHECK (("auth"."uid"() = "farmer_id"));



CREATE POLICY "Farmers can update their own applications" ON "public"."contract_applications" FOR UPDATE USING (("farmer_id" = "auth"."uid"()));



CREATE POLICY "Farmers can update their own collaborations" ON "public"."farmer_exporter_collaborations" FOR UPDATE USING (("auth"."uid"() = "farmer_id"));



CREATE POLICY "Farmers can update their own reviews" ON "public"."exporter_reviews" FOR UPDATE USING (("auth"."uid"() = "farmer_id"));



CREATE POLICY "Farmers can view their own applications" ON "public"."contract_applications" FOR SELECT USING (("farmer_id" = "auth"."uid"()));



CREATE POLICY "Insert own or admin" ON "public"."farm_budgets" FOR INSERT WITH CHECK ((("user_id" = "auth"."uid"()) OR ("auth"."role"() = 'admin'::"text")));



CREATE POLICY "Order items visible to order participants" ON "public"."farm_input_order_items" FOR SELECT USING (("order_id" IN ( SELECT "farm_input_orders"."id"
   FROM "public"."farm_input_orders"
  WHERE (("auth"."uid"() = "farm_input_orders"."buyer_id") OR ("auth"."uid"() IN ( SELECT "farm_input_suppliers"."user_id"
           FROM "public"."farm_input_suppliers"
          WHERE ("farm_input_suppliers"."id" = "farm_input_orders"."supplier_id")))))));



CREATE POLICY "Participants can manage their listings" ON "public"."market_demand_supply" USING (("auth"."uid"() IN ( SELECT COALESCE("market_participants"."user_id", ( SELECT "market_agents"."user_id"
           FROM "public"."market_agents"
          WHERE ("market_agents"."id" = "market_participants"."agent_id"))) AS "coalesce"
   FROM "public"."market_participants"
  WHERE ("market_participants"."id" = "market_demand_supply"."participant_id"))));



CREATE POLICY "Partner Events: Only partner owner can view/edit" ON "public"."partner_events" USING ((EXISTS ( SELECT 1
   FROM "public"."partners" "p"
  WHERE (("p"."id" = "partner_events"."partner_id") AND ("p"."user_id" = "auth"."uid"())))));



CREATE POLICY "Partners: Only owner can view/edit" ON "public"."partners" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Public can view farm input categories" ON "public"."farm_input_categories" FOR SELECT USING (true);



CREATE POLICY "Select own or admin" ON "public"."farm_budgets" FOR SELECT USING ((("user_id" = "auth"."uid"()) OR ("auth"."role"() = 'admin'::"text")));



CREATE POLICY "Suppliers can manage their products" ON "public"."farm_input_products" USING (("auth"."uid"() IN ( SELECT "farm_input_suppliers"."user_id"
   FROM "public"."farm_input_suppliers"
  WHERE ("farm_input_suppliers"."id" = "farm_input_products"."supplier_id"))));



CREATE POLICY "Update own or admin" ON "public"."farm_budgets" FOR UPDATE USING ((("user_id" = "auth"."uid"()) OR ("auth"."role"() = 'admin'::"text")));



CREATE POLICY "User can delete their own export order" ON "public"."export_orders" FOR DELETE USING ((("auth"."uid"() = "created_by") OR ("auth"."role"() = 'admin'::"text")));



CREATE POLICY "Users can create agent profile" ON "public"."market_agents" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create applications" ON "public"."market_linkage_applications" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create comments" ON "public"."post_comments" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create community posts" ON "public"."community_posts" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create contract opportunities" ON "public"."contract_farming_opportunities" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Users can create discussions" ON "public"."quality_control_discussions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create flags" ON "public"."contract_flags" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create lending offers" ON "public"."p2p_lending_offers" FOR INSERT WITH CHECK (("auth"."uid"() = "lender_id"));



CREATE POLICY "Users can create market linkages" ON "public"."market_linkages" FOR INSERT WITH CHECK (("auth"."uid"() = "created_by"));



CREATE POLICY "Users can create orders" ON "public"."farm_input_orders" FOR INSERT WITH CHECK (("auth"."uid"() = "buyer_id"));



CREATE POLICY "Users can create participant profile" ON "public"."market_participants" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") OR ("auth"."uid"() IN ( SELECT "market_agents"."user_id"
   FROM "public"."market_agents"
  WHERE ("market_agents"."id" = "market_participants"."agent_id")))));



CREATE POLICY "Users can create polls on their posts" ON "public"."community_polls" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create registrations" ON "public"."training_registrations" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create reviews" ON "public"."service_provider_reviews" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their aggregator profile" ON "public"."aggregators" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their creditor profile" ON "public"."micro_creditors" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own API keys" ON "public"."api_keys" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own advertisements" ON "public"."business_advertisements" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own barter listings" ON "public"."barter_listings" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own crop tracking" ON "public"."crop_tracking" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own farm statistics" ON "public"."farm_statistics" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own farm tasks" ON "public"."farm_tasks" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own financial transactions" ON "public"."financial_transactions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own parcels" ON "public"."farm_parcels" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own posts" ON "public"."community_posts" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own produce listings" ON "public"."produce_inventory" FOR INSERT WITH CHECK (("auth"."uid"() = "farmer_id"));



CREATE POLICY "Users can create their own transactions" ON "public"."payment_transactions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their own warehouse" ON "public"."warehouses" FOR INSERT WITH CHECK (("auth"."uid"() = "owner_id"));



CREATE POLICY "Users can create their processor profile" ON "public"."processors" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create their supplier profile" ON "public"."farm_input_suppliers" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can create training events" ON "public"."training_events" FOR INSERT WITH CHECK (("auth"."uid"() = "organizer_id"));



CREATE POLICY "Users can create transport requests" ON "public"."transport_requests" FOR INSERT WITH CHECK (("auth"."uid"() = "requester_id"));



CREATE POLICY "Users can create warehouse bookings" ON "public"."warehouse_bookings" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own API keys" ON "public"."api_keys" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own advertisements" ON "public"."business_advertisements" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own barter listings" ON "public"."barter_listings" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own comments" ON "public"."contract_comments" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can delete their own comments" ON "public"."post_comments" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own community posts" ON "public"."community_posts" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own crop tracking" ON "public"."crop_tracking" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own farm tasks" ON "public"."farm_tasks" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own financial transactions" ON "public"."financial_transactions" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own market linkages" ON "public"."market_linkages" FOR DELETE USING (("auth"."uid"() = "created_by"));



CREATE POLICY "Users can delete their own opportunities" ON "public"."contract_farming_opportunities" FOR DELETE USING (("created_by" = "auth"."uid"()));



CREATE POLICY "Users can delete their own parcels" ON "public"."farm_parcels" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own posts" ON "public"."community_posts" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own produce listings" ON "public"."produce_inventory" FOR DELETE USING (("auth"."uid"() = "farmer_id"));



CREATE POLICY "Users can delete their own reviews" ON "public"."contract_reviews" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can delete their own training events" ON "public"."training_events" FOR DELETE USING (("auth"."uid"() = "organizer_id"));



CREATE POLICY "Users can delete their own transporters" ON "public"."transporters" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own warehouse" ON "public"."warehouses" FOR DELETE USING (("auth"."uid"() = "owner_id"));



CREATE POLICY "Users can insert their own ban recommendations" ON "public"."marketplace_ban_recommendations" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can insert their own feature requests" ON "public"."feature_requests" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can insert their own flags" ON "public"."marketplace_flags" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can insert their own messages" ON "public"."messages" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "sender_id"));



CREATE POLICY "Users can insert their own transporters" ON "public"."transporters" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their bookmarks" ON "public"."user_bookmarks" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their financial transactions" ON "public"."farmer_financial_transactions" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their inventory" ON "public"."farmer_inventory" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their land parcels" ON "public"."land_parcels" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their notification preferences" ON "public"."user_notification_preferences" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own agent profile" ON "public"."agents" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage their own city market auctions" ON "public"."city_market_auctions" USING ((EXISTS ( SELECT 1
   FROM "public"."city_market_products"
  WHERE (("city_market_products"."id" = "city_market_auctions"."product_id") AND ("city_market_products"."seller_user_id" = "auth"."uid"())))));



CREATE POLICY "Users can manage their own city market ban recommendations" ON "public"."city_market_ban_recommendations" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage their own city market bids" ON "public"."city_market_bids" USING (("bidder_user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage their own city market comments" ON "public"."city_market_comments" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage their own city market flags" ON "public"."city_market_flags" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage their own city market likes" ON "public"."city_market_likes" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage their own city market products" ON "public"."city_market_products" USING (("seller_user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage their own city market ratings" ON "public"."city_market_ratings" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage their own crop yields" ON "public"."crop_yields" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own equipment ban recommendations" ON "public"."equipment_ban_recommendations" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage their own equipment bookmarks" ON "public"."equipment_bookmarks" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage their own equipment flags" ON "public"."equipment_flags" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage their own equipment likes" ON "public"."equipment_likes" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage their own equipment ratings" ON "public"."equipment_ratings" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can manage their own notification preferences" ON "public"."notification_preferences" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their price alerts" ON "public"."price_alerts" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their service provider profiles" ON "public"."service_providers" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their agent profile" ON "public"."market_agents" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their aggregator profile" ON "public"."aggregators" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their creditor profile" ON "public"."micro_creditors" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their lending offers" ON "public"."p2p_lending_offers" FOR UPDATE USING (("auth"."uid"() = "lender_id"));



CREATE POLICY "Users can update their orders" ON "public"."farm_input_orders" FOR UPDATE USING ((("auth"."uid"() = "buyer_id") OR ("auth"."uid"() IN ( SELECT "farm_input_suppliers"."user_id"
   FROM "public"."farm_input_suppliers"
  WHERE ("farm_input_suppliers"."id" = "farm_input_orders"."supplier_id")))));



CREATE POLICY "Users can update their own API keys" ON "public"."api_keys" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own advertisements" ON "public"."business_advertisements" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own applications" ON "public"."market_linkage_applications" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own ban recommendations" ON "public"."marketplace_ban_recommendations" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update their own barter listings" ON "public"."barter_listings" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own bookings" ON "public"."warehouse_bookings" FOR UPDATE USING ((("auth"."uid"() = "user_id") OR ("auth"."uid"() IN ( SELECT "warehouses"."owner_id"
   FROM "public"."warehouses"
  WHERE ("warehouses"."id" = "warehouse_bookings"."warehouse_id")))));



CREATE POLICY "Users can update their own comments" ON "public"."contract_comments" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update their own comments" ON "public"."post_comments" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own community posts" ON "public"."community_posts" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own crop tracking" ON "public"."crop_tracking" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own discussions" ON "public"."quality_control_discussions" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own farm statistics" ON "public"."farm_statistics" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own farm tasks" ON "public"."farm_tasks" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own feature requests" ON "public"."feature_requests" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update their own financial transactions" ON "public"."financial_transactions" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own flags" ON "public"."marketplace_flags" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update their own market linkages" ON "public"."market_linkages" FOR UPDATE USING (("auth"."uid"() = "created_by"));



CREATE POLICY "Users can update their own notifications" ON "public"."notifications" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own opportunities" ON "public"."contract_farming_opportunities" FOR UPDATE USING (("created_by" = "auth"."uid"()));



CREATE POLICY "Users can update their own parcels" ON "public"."farm_parcels" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own polls" ON "public"."community_polls" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own posts" ON "public"."community_posts" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own produce listings" ON "public"."produce_inventory" FOR UPDATE USING (("auth"."uid"() = "farmer_id"));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update their own registrations" ON "public"."training_registrations" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own reviews" ON "public"."contract_reviews" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update their own reviews" ON "public"."service_provider_reviews" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own training events" ON "public"."training_events" FOR UPDATE USING (("auth"."uid"() = "organizer_id"));



CREATE POLICY "Users can update their own transport requests" ON "public"."transport_requests" FOR UPDATE USING ((("auth"."uid"() = "requester_id") OR ("auth"."uid"() IN ( SELECT "transporters"."user_id"
   FROM "public"."transporters"
  WHERE ("transporters"."id" = "transport_requests"."transporter_id")))));



CREATE POLICY "Users can update their own transporters" ON "public"."transporters" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own votes" ON "public"."poll_votes" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own warehouse" ON "public"."warehouses" FOR UPDATE USING (("auth"."uid"() = "owner_id"));



CREATE POLICY "Users can update their processor profile" ON "public"."processors" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their supplier profile" ON "public"."farm_input_suppliers" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view active advertisements" ON "public"."business_advertisements" FOR SELECT USING ((("is_active" = true) AND ("payment_status" = 'paid'::"text")));



CREATE POLICY "Users can view all active barter listings" ON "public"."barter_listings" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Users can view all discussions" ON "public"."quality_control_discussions" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Users can view all market linkages" ON "public"."market_linkages" FOR SELECT USING (true);



CREATE POLICY "Users can view all produce" ON "public"."produce_inventory" FOR SELECT USING (true);



CREATE POLICY "Users can view all reviews" ON "public"."service_provider_reviews" FOR SELECT USING (true);



CREATE POLICY "Users can view all training events" ON "public"."training_events" FOR SELECT USING (true);



CREATE POLICY "Users can view all warehouses" ON "public"."warehouses" FOR SELECT USING (true);



CREATE POLICY "Users can view social share stats" ON "public"."contract_social_shares" FOR SELECT USING (true);



CREATE POLICY "Users can view their orders" ON "public"."farm_input_orders" FOR SELECT USING ((("auth"."uid"() = "buyer_id") OR ("auth"."uid"() IN ( SELECT "farm_input_suppliers"."user_id"
   FROM "public"."farm_input_suppliers"
  WHERE ("farm_input_suppliers"."id" = "farm_input_orders"."supplier_id")))));



CREATE POLICY "Users can view their own API keys" ON "public"."api_keys" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own API usage" ON "public"."api_usage" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own advertisements" ON "public"."business_advertisements" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own applications" ON "public"."market_linkage_applications" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own ban recommendations" ON "public"."marketplace_ban_recommendations" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own bookings" ON "public"."warehouse_bookings" FOR SELECT USING ((("auth"."uid"() = "user_id") OR ("auth"."uid"() IN ( SELECT "warehouses"."owner_id"
   FROM "public"."warehouses"
  WHERE ("warehouses"."id" = "warehouse_bookings"."warehouse_id")))));



CREATE POLICY "Users can view their own crop tracking" ON "public"."crop_tracking" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own farm statistics" ON "public"."farm_statistics" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own farm tasks" ON "public"."farm_tasks" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own feature requests" ON "public"."feature_requests" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own financial transactions" ON "public"."financial_transactions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own flags" ON "public"."contract_flags" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own flags" ON "public"."marketplace_flags" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own notifications" ON "public"."notifications" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own notifications" ON "public"."user_notifications" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own parcels" ON "public"."farm_parcels" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own registrations" ON "public"."training_registrations" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own transactions" ON "public"."payment_transactions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own transporters" ON "public"."transporters" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view transport requests" ON "public"."transport_requests" FOR SELECT USING (true);



CREATE POLICY "Users can vote on polls" ON "public"."poll_votes" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage own product bookmarks" ON "public"."farm_input_product_bookmarks" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage own product likes" ON "public"."farm_input_product_likes" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage own product ratings" ON "public"."farm_input_product_ratings" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage own supplier likes" ON "public"."farm_input_supplier_likes" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users manage own supplier ratings" ON "public"."farm_input_supplier_ratings" USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."admin_action_logs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "admin_manage_recipients" ON "public"."recipients" USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "admin_verify_price" ON "public"."input_prices" FOR UPDATE USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "admin_verify_review" ON "public"."input_supplier_reviews" FOR UPDATE USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "agent_delete_product" ON "public"."city_market_products" FOR DELETE USING (("auth"."uid"() = "seller_user_id"));



CREATE POLICY "agent_donate_product" ON "public"."city_market_donations" FOR INSERT WITH CHECK (("auth"."uid"() = "agent_id"));



CREATE POLICY "agent_public_donate" ON "public"."city_market_donations" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "agent_update_product_status" ON "public"."city_market_products" FOR UPDATE USING (("auth"."uid"() = "seller_user_id"));



ALTER TABLE "public"."agents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."aggregators" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "all_select_bulk_order" ON "public"."bulk_orders" FOR SELECT USING (true);



CREATE POLICY "all_select_input_pricing" ON "public"."input_pricing" FOR SELECT USING (true);



CREATE POLICY "all_select_input_review" ON "public"."input_reviews" FOR SELECT USING (true);



CREATE POLICY "all_select_input_verification" ON "public"."input_verifications" FOR SELECT USING (true);



CREATE POLICY "all_select_match" ON "public"."processing_matches" FOR SELECT USING (true);



CREATE POLICY "all_select_match" ON "public"."rescue_matches" FOR SELECT USING (true);



CREATE POLICY "all_select_rescue" ON "public"."food_rescue_listings" FOR SELECT USING (true);



CREATE POLICY "all_view_business_match" ON "public"."business_matches" FOR SELECT USING (true);



CREATE POLICY "all_view_forum_post" ON "public"."carbon_forum_posts" FOR SELECT USING (true);



CREATE POLICY "all_view_mentorship" ON "public"."mentorships" FOR SELECT USING (true);



CREATE POLICY "all_view_network_event" ON "public"."network_events" FOR SELECT USING (true);



CREATE POLICY "all_view_partnership" ON "public"."partnerships" FOR SELECT USING (true);



CREATE POLICY "all_view_research_request" ON "public"."research_requests" FOR SELECT USING (true);



ALTER TABLE "public"."animal_records" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."animals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."api_keys" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."api_usage" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."barter_listings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."batch_tracking" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bulk_order_bids" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bulk_orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."business_advertisements" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "business_create_match" ON "public"."business_matches" FOR INSERT WITH CHECK ((("auth"."uid"() = "business1_id") OR ("auth"."uid"() = "business2_id")));



ALTER TABLE "public"."business_matches" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "business_update_match" ON "public"."business_matches" FOR UPDATE USING ((("auth"."uid"() = "business1_id") OR ("auth"."uid"() = "business2_id")));



CREATE POLICY "buyer_accept_bid" ON "public"."bulk_order_bids" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."bulk_orders"
  WHERE (("bulk_orders"."id" = "bulk_order_bids"."order_id") AND ("bulk_orders"."buyer_id" = "auth"."uid"())))));



CREATE POLICY "buyer_create_bulk_order" ON "public"."bulk_orders" FOR INSERT WITH CHECK (("auth"."uid"() = "buyer_id"));



CREATE POLICY "buyer_delete_bulk_order" ON "public"."bulk_orders" FOR DELETE USING (("auth"."uid"() = "buyer_id"));



CREATE POLICY "buyer_insert_bulk_order" ON "public"."bulk_orders" FOR INSERT WITH CHECK (("auth"."uid"() = "buyer_id"));



CREATE POLICY "buyer_update_bulk_order" ON "public"."bulk_orders" FOR UPDATE USING (("auth"."uid"() = "buyer_id"));



ALTER TABLE "public"."carbon_forum_posts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "cbo_view_donations" ON "public"."city_market_donations" FOR SELECT USING ((("recipient_type" = 'CBO'::"text") AND ("recipient_id" = "auth"."uid"())));



CREATE POLICY "church_view_donations" ON "public"."city_market_donations" FOR SELECT USING ((("recipient_type" = 'church'::"text") AND ("recipient_id" = "auth"."uid"())));



ALTER TABLE "public"."city_market_auctions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."city_market_ban_recommendations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."city_market_bids" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."city_market_comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."city_market_donations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."city_market_flags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."city_market_likes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."city_market_products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."city_market_ratings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."city_markets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."collaboration_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."collaboration_proposals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."community_polls" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."community_posts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "consumer_subscribe_box" ON "public"."subscription_boxes" FOR INSERT WITH CHECK (("auth"."uid"() = "consumer_id"));



CREATE POLICY "consumer_update_box" ON "public"."subscription_boxes" FOR UPDATE USING (("auth"."uid"() = "consumer_id"));



ALTER TABLE "public"."contract_applications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contract_comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contract_documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contract_farming_opportunities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contract_flags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contract_reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contract_social_shares" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."crop_tracking" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."crop_yields" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."data_fetch_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."equipment" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."equipment_ban_recommendations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."equipment_bookmarks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."equipment_flags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."equipment_likes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."equipment_ratings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."export_documentation" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."export_opportunities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."export_orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exporter_profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exporter_reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."farm_budgets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."farm_input_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."farm_input_order_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."farm_input_orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."farm_input_product_bookmarks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."farm_input_product_likes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."farm_input_product_ratings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."farm_input_products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."farm_input_supplier_likes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."farm_input_supplier_ratings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."farm_input_suppliers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."farm_parcels" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."farm_statistics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."farm_tasks" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "farmer_bid_bulk_order" ON "public"."bulk_order_bids" FOR INSERT WITH CHECK (("auth"."uid"() = "farmer_id"));



ALTER TABLE "public"."farmer_consolidations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."farmer_contract_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."farmer_contract_networks" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "farmer_create_batch" ON "public"."batch_tracking" FOR INSERT WITH CHECK (("auth"."uid"() = "farmer_id"));



CREATE POLICY "farmer_create_group_order" ON "public"."input_group_orders" FOR INSERT WITH CHECK (("auth"."uid"() = "farmer_id"));



CREATE POLICY "farmer_delete_match" ON "public"."processing_matches" FOR DELETE USING (("auth"."uid"() = "farmer_id"));



CREATE POLICY "farmer_delete_rescue" ON "public"."food_rescue_listings" FOR DELETE USING (("auth"."uid"() = "farmer_id"));



ALTER TABLE "public"."farmer_exporter_collaborations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."farmer_financial_transactions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "farmer_insert_match" ON "public"."processing_matches" FOR INSERT WITH CHECK (("auth"."uid"() = "farmer_id"));



CREATE POLICY "farmer_insert_rescue" ON "public"."food_rescue_listings" FOR INSERT WITH CHECK (("auth"."uid"() = "farmer_id"));



ALTER TABLE "public"."farmer_inventory" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "farmer_mark_delivery" ON "public"."subscription_box_deliveries" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."subscription_boxes"
  WHERE (("subscription_boxes"."id" = "subscription_box_deliveries"."box_id") AND ("subscription_boxes"."farmer_id" = "auth"."uid"())))));



CREATE POLICY "farmer_report_price" ON "public"."input_prices" FOR INSERT WITH CHECK (("auth"."uid"() = "reported_by"));



CREATE POLICY "farmer_review_supplier" ON "public"."input_supplier_reviews" FOR INSERT WITH CHECK (("auth"."uid"() = "supplier_id"));



CREATE POLICY "farmer_update_batch" ON "public"."batch_tracking" FOR UPDATE USING (("auth"."uid"() = "farmer_id"));



CREATE POLICY "farmer_update_box" ON "public"."subscription_boxes" FOR UPDATE USING (("auth"."uid"() = "farmer_id"));



CREATE POLICY "farmer_update_match" ON "public"."processing_matches" FOR UPDATE USING (("auth"."uid"() = "farmer_id"));



CREATE POLICY "farmer_update_rescue" ON "public"."food_rescue_listings" FOR UPDATE USING (("auth"."uid"() = "farmer_id"));



ALTER TABLE "public"."feature_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."financial_transactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."food_rescue_listings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "hospice_view_donations" ON "public"."city_market_donations" FOR SELECT USING ((("recipient_type" = 'hospice'::"text") AND ("recipient_id" = "auth"."uid"())));



CREATE POLICY "hospital_view_donations" ON "public"."city_market_donations" FOR SELECT USING ((("recipient_type" = 'hospital'::"text") AND ("recipient_id" = "auth"."uid"())));



ALTER TABLE "public"."impact_metrics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."input_group_orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."input_prices" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."input_pricing" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."input_reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."input_supplier_reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."input_verifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."inventory_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invitations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."kilimo_statistics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."land_parcels" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."livestock_breeds" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."livestock_for_sale" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."livestock_listings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."livestock_markets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."market_agents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."market_demand_supply" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."market_details" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."market_forecasts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."market_linkage_applications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."market_linkages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."market_participants" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."market_prices" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."market_sentiment" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."marketplace_ban_recommendations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."marketplace_flags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mentorship_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mentorships" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."micro_creditors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."network_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notification_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "org_create_partnership" ON "public"."partnerships" FOR INSERT WITH CHECK ((("auth"."uid"() = "org1_id") OR ("auth"."uid"() = "org2_id")));



CREATE POLICY "org_update_partnership" ON "public"."partnerships" FOR UPDATE USING ((("auth"."uid"() = "org1_id") OR ("auth"."uid"() = "org2_id")));



ALTER TABLE "public"."p2p_lending_offers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."partner_events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "partner_view_batch" ON "public"."batch_tracking" FOR SELECT USING (true);



ALTER TABLE "public"."partners" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."partnerships" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payment_transactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."permissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."poll_votes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."post_comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."price_alerts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."price_comparisons" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pricing_tiers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."processing_matches" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."processors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."produce_inventory" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."quality_control_discussions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "recipient_feedback_update" ON "public"."city_market_donations" FOR UPDATE USING (("recipient_id" = "auth"."uid"()));



CREATE POLICY "recipient_insert_match" ON "public"."rescue_matches" FOR INSERT WITH CHECK (("auth"."uid"() = "recipient_id"));



CREATE POLICY "recipient_update_match" ON "public"."rescue_matches" FOR UPDATE USING (("auth"."uid"() = "recipient_id"));



ALTER TABLE "public"."recipients" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rescue_matches" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."research_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."role_permissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "school_view_donations" ON "public"."city_market_donations" FOR SELECT USING ((("recipient_type" = 'school'::"text") AND ("recipient_id" = "auth"."uid"())));



ALTER TABLE "public"."service_provider_reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."service_providers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subscription_box_deliveries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subscription_boxes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "supplier_update_group_order" ON "public"."input_group_orders" FOR UPDATE USING (("auth"."uid"() = "supplier_id"));



ALTER TABLE "public"."timeline_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tracking_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."training_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."training_registrations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."transport_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."transporter_bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."transporter_recommendations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."transporters" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_bookmarks" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_create_forum_post" ON "public"."carbon_forum_posts" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "user_create_mentorship" ON "public"."mentorships" FOR INSERT WITH CHECK ((("auth"."uid"() = "mentor_id") OR ("auth"."uid"() = "mentee_id")));



CREATE POLICY "user_create_network_event" ON "public"."network_events" FOR INSERT WITH CHECK (true);



CREATE POLICY "user_create_research_request" ON "public"."research_requests" FOR INSERT WITH CHECK (("auth"."uid"() = "requester_id"));



CREATE POLICY "user_delete_forum_post" ON "public"."carbon_forum_posts" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "user_insert_input_pricing" ON "public"."input_pricing" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "user_insert_input_review" ON "public"."input_reviews" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "user_insert_input_verification" ON "public"."input_verifications" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."user_notification_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_update_forum_post" ON "public"."carbon_forum_posts" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "user_update_input_pricing" ON "public"."input_pricing" FOR UPDATE USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "user_update_input_review" ON "public"."input_reviews" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "user_update_input_verification" ON "public"."input_verifications" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "user_update_mentorship" ON "public"."mentorships" FOR UPDATE USING ((("auth"."uid"() = "mentor_id") OR ("auth"."uid"() = "mentee_id")));



CREATE POLICY "user_update_network_event" ON "public"."network_events" FOR UPDATE USING (true);



CREATE POLICY "user_update_research_request" ON "public"."research_requests" FOR UPDATE USING (("auth"."uid"() = "requester_id"));



ALTER TABLE "public"."warehouse_bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."warehouses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."weather_alerts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."weather_data" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."calculate_platform_yield_improvement"() TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_platform_yield_improvement"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_platform_yield_improvement"() TO "service_role";



GRANT ALL ON FUNCTION "public"."check_rate_limit"("p_user_id" "uuid", "p_subscription_type" "text", "p_time_window" interval) TO "anon";
GRANT ALL ON FUNCTION "public"."check_rate_limit"("p_user_id" "uuid", "p_subscription_type" "text", "p_time_window" interval) TO "authenticated";
GRANT ALL ON FUNCTION "public"."check_rate_limit"("p_user_id" "uuid", "p_subscription_type" "text", "p_time_window" interval) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_livestock_market_stats"("p_market_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_livestock_market_stats"("p_market_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_livestock_market_stats"("p_market_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_admin_action"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_admin_action"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_admin_action"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_feature_request_user_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_feature_request_user_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_feature_request_user_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trigger_set_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."trigger_set_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."trigger_set_timestamp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_city_market_products_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_city_market_products_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_city_market_products_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_total_registered_farmers"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_total_registered_farmers"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_total_registered_farmers"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."user_has_role"("required_role" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."user_has_role"("required_role" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_has_role"("required_role" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_api_key"("p_key_hash" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."validate_api_key"("p_key_hash" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_api_key"("p_key_hash" "text") TO "service_role";



























GRANT ALL ON TABLE "public"."admin_action_logs" TO "anon";
GRANT ALL ON TABLE "public"."admin_action_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_action_logs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."admin_action_logs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."admin_action_logs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."admin_action_logs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."agents" TO "anon";
GRANT ALL ON TABLE "public"."agents" TO "authenticated";
GRANT ALL ON TABLE "public"."agents" TO "service_role";



GRANT ALL ON TABLE "public"."aggregators" TO "anon";
GRANT ALL ON TABLE "public"."aggregators" TO "authenticated";
GRANT ALL ON TABLE "public"."aggregators" TO "service_role";



GRANT ALL ON TABLE "public"."animal_health" TO "anon";
GRANT ALL ON TABLE "public"."animal_health" TO "authenticated";
GRANT ALL ON TABLE "public"."animal_health" TO "service_role";



GRANT ALL ON TABLE "public"."animal_records" TO "anon";
GRANT ALL ON TABLE "public"."animal_records" TO "authenticated";
GRANT ALL ON TABLE "public"."animal_records" TO "service_role";



GRANT ALL ON TABLE "public"."animal_sales" TO "anon";
GRANT ALL ON TABLE "public"."animal_sales" TO "authenticated";
GRANT ALL ON TABLE "public"."animal_sales" TO "service_role";



GRANT ALL ON TABLE "public"."animals" TO "anon";
GRANT ALL ON TABLE "public"."animals" TO "authenticated";
GRANT ALL ON TABLE "public"."animals" TO "service_role";



GRANT ALL ON TABLE "public"."api_keys" TO "anon";
GRANT ALL ON TABLE "public"."api_keys" TO "authenticated";
GRANT ALL ON TABLE "public"."api_keys" TO "service_role";



GRANT ALL ON TABLE "public"."api_usage" TO "anon";
GRANT ALL ON TABLE "public"."api_usage" TO "authenticated";
GRANT ALL ON TABLE "public"."api_usage" TO "service_role";



GRANT ALL ON TABLE "public"."market_details" TO "anon";
GRANT ALL ON TABLE "public"."market_details" TO "authenticated";
GRANT ALL ON TABLE "public"."market_details" TO "service_role";



GRANT ALL ON TABLE "public"."app_market_selection" TO "anon";
GRANT ALL ON TABLE "public"."app_market_selection" TO "authenticated";
GRANT ALL ON TABLE "public"."app_market_selection" TO "service_role";



GRANT ALL ON TABLE "public"."barter_listings" TO "anon";
GRANT ALL ON TABLE "public"."barter_listings" TO "authenticated";
GRANT ALL ON TABLE "public"."barter_listings" TO "service_role";



GRANT ALL ON TABLE "public"."batch_tracking" TO "anon";
GRANT ALL ON TABLE "public"."batch_tracking" TO "authenticated";
GRANT ALL ON TABLE "public"."batch_tracking" TO "service_role";



GRANT ALL ON TABLE "public"."bulk_order_bids" TO "anon";
GRANT ALL ON TABLE "public"."bulk_order_bids" TO "authenticated";
GRANT ALL ON TABLE "public"."bulk_order_bids" TO "service_role";



GRANT ALL ON TABLE "public"."bulk_orders" TO "anon";
GRANT ALL ON TABLE "public"."bulk_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."bulk_orders" TO "service_role";



GRANT ALL ON TABLE "public"."business_advertisements" TO "anon";
GRANT ALL ON TABLE "public"."business_advertisements" TO "authenticated";
GRANT ALL ON TABLE "public"."business_advertisements" TO "service_role";



GRANT ALL ON TABLE "public"."business_matches" TO "anon";
GRANT ALL ON TABLE "public"."business_matches" TO "authenticated";
GRANT ALL ON TABLE "public"."business_matches" TO "service_role";



GRANT ALL ON TABLE "public"."carbon_forum_posts" TO "anon";
GRANT ALL ON TABLE "public"."carbon_forum_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."carbon_forum_posts" TO "service_role";



GRANT ALL ON TABLE "public"."city_market_auctions" TO "anon";
GRANT ALL ON TABLE "public"."city_market_auctions" TO "authenticated";
GRANT ALL ON TABLE "public"."city_market_auctions" TO "service_role";



GRANT ALL ON TABLE "public"."city_market_ban_recommendations" TO "anon";
GRANT ALL ON TABLE "public"."city_market_ban_recommendations" TO "authenticated";
GRANT ALL ON TABLE "public"."city_market_ban_recommendations" TO "service_role";



GRANT ALL ON TABLE "public"."city_market_bids" TO "anon";
GRANT ALL ON TABLE "public"."city_market_bids" TO "authenticated";
GRANT ALL ON TABLE "public"."city_market_bids" TO "service_role";



GRANT ALL ON TABLE "public"."city_market_comments" TO "anon";
GRANT ALL ON TABLE "public"."city_market_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."city_market_comments" TO "service_role";



GRANT ALL ON TABLE "public"."city_market_donations" TO "anon";
GRANT ALL ON TABLE "public"."city_market_donations" TO "authenticated";
GRANT ALL ON TABLE "public"."city_market_donations" TO "service_role";



GRANT ALL ON TABLE "public"."city_market_flags" TO "anon";
GRANT ALL ON TABLE "public"."city_market_flags" TO "authenticated";
GRANT ALL ON TABLE "public"."city_market_flags" TO "service_role";



GRANT ALL ON TABLE "public"."city_market_likes" TO "anon";
GRANT ALL ON TABLE "public"."city_market_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."city_market_likes" TO "service_role";



GRANT ALL ON TABLE "public"."city_market_products" TO "anon";
GRANT ALL ON TABLE "public"."city_market_products" TO "authenticated";
GRANT ALL ON TABLE "public"."city_market_products" TO "service_role";



GRANT ALL ON TABLE "public"."city_market_ratings" TO "anon";
GRANT ALL ON TABLE "public"."city_market_ratings" TO "authenticated";
GRANT ALL ON TABLE "public"."city_market_ratings" TO "service_role";



GRANT ALL ON TABLE "public"."city_markets" TO "anon";
GRANT ALL ON TABLE "public"."city_markets" TO "authenticated";
GRANT ALL ON TABLE "public"."city_markets" TO "service_role";



GRANT ALL ON TABLE "public"."collaboration_messages" TO "anon";
GRANT ALL ON TABLE "public"."collaboration_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."collaboration_messages" TO "service_role";



GRANT ALL ON TABLE "public"."collaboration_proposals" TO "anon";
GRANT ALL ON TABLE "public"."collaboration_proposals" TO "authenticated";
GRANT ALL ON TABLE "public"."collaboration_proposals" TO "service_role";



GRANT ALL ON TABLE "public"."community_polls" TO "anon";
GRANT ALL ON TABLE "public"."community_polls" TO "authenticated";
GRANT ALL ON TABLE "public"."community_polls" TO "service_role";



GRANT ALL ON TABLE "public"."community_posts" TO "anon";
GRANT ALL ON TABLE "public"."community_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."community_posts" TO "service_role";



GRANT ALL ON TABLE "public"."contract_applications" TO "anon";
GRANT ALL ON TABLE "public"."contract_applications" TO "authenticated";
GRANT ALL ON TABLE "public"."contract_applications" TO "service_role";



GRANT ALL ON TABLE "public"."contract_comments" TO "anon";
GRANT ALL ON TABLE "public"."contract_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."contract_comments" TO "service_role";



GRANT ALL ON TABLE "public"."contract_documents" TO "anon";
GRANT ALL ON TABLE "public"."contract_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."contract_documents" TO "service_role";



GRANT ALL ON TABLE "public"."contract_farming_opportunities" TO "anon";
GRANT ALL ON TABLE "public"."contract_farming_opportunities" TO "authenticated";
GRANT ALL ON TABLE "public"."contract_farming_opportunities" TO "service_role";



GRANT ALL ON TABLE "public"."contract_flags" TO "anon";
GRANT ALL ON TABLE "public"."contract_flags" TO "authenticated";
GRANT ALL ON TABLE "public"."contract_flags" TO "service_role";



GRANT ALL ON TABLE "public"."contract_reviews" TO "anon";
GRANT ALL ON TABLE "public"."contract_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."contract_reviews" TO "service_role";



GRANT ALL ON TABLE "public"."contract_social_shares" TO "anon";
GRANT ALL ON TABLE "public"."contract_social_shares" TO "authenticated";
GRANT ALL ON TABLE "public"."contract_social_shares" TO "service_role";



GRANT ALL ON TABLE "public"."crop_tracking" TO "anon";
GRANT ALL ON TABLE "public"."crop_tracking" TO "authenticated";
GRANT ALL ON TABLE "public"."crop_tracking" TO "service_role";



GRANT ALL ON TABLE "public"."crop_yields" TO "anon";
GRANT ALL ON TABLE "public"."crop_yields" TO "authenticated";
GRANT ALL ON TABLE "public"."crop_yields" TO "service_role";



GRANT ALL ON TABLE "public"."data_fetch_logs" TO "anon";
GRANT ALL ON TABLE "public"."data_fetch_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."data_fetch_logs" TO "service_role";



GRANT ALL ON TABLE "public"."equipment" TO "anon";
GRANT ALL ON TABLE "public"."equipment" TO "authenticated";
GRANT ALL ON TABLE "public"."equipment" TO "service_role";



GRANT ALL ON TABLE "public"."equipment_ban_recommendations" TO "anon";
GRANT ALL ON TABLE "public"."equipment_ban_recommendations" TO "authenticated";
GRANT ALL ON TABLE "public"."equipment_ban_recommendations" TO "service_role";



GRANT ALL ON TABLE "public"."equipment_bookmarks" TO "anon";
GRANT ALL ON TABLE "public"."equipment_bookmarks" TO "authenticated";
GRANT ALL ON TABLE "public"."equipment_bookmarks" TO "service_role";



GRANT ALL ON TABLE "public"."equipment_flags" TO "anon";
GRANT ALL ON TABLE "public"."equipment_flags" TO "authenticated";
GRANT ALL ON TABLE "public"."equipment_flags" TO "service_role";



GRANT ALL ON TABLE "public"."equipment_likes" TO "anon";
GRANT ALL ON TABLE "public"."equipment_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."equipment_likes" TO "service_role";



GRANT ALL ON TABLE "public"."equipment_ratings" TO "anon";
GRANT ALL ON TABLE "public"."equipment_ratings" TO "authenticated";
GRANT ALL ON TABLE "public"."equipment_ratings" TO "service_role";



GRANT ALL ON TABLE "public"."export_documentation" TO "anon";
GRANT ALL ON TABLE "public"."export_documentation" TO "authenticated";
GRANT ALL ON TABLE "public"."export_documentation" TO "service_role";



GRANT ALL ON TABLE "public"."export_opportunities" TO "anon";
GRANT ALL ON TABLE "public"."export_opportunities" TO "authenticated";
GRANT ALL ON TABLE "public"."export_opportunities" TO "service_role";



GRANT ALL ON TABLE "public"."export_orders" TO "anon";
GRANT ALL ON TABLE "public"."export_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."export_orders" TO "service_role";



GRANT ALL ON TABLE "public"."exporter_profiles" TO "anon";
GRANT ALL ON TABLE "public"."exporter_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."exporter_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."exporter_reviews" TO "anon";
GRANT ALL ON TABLE "public"."exporter_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."exporter_reviews" TO "service_role";



GRANT ALL ON TABLE "public"."farm_budgets" TO "anon";
GRANT ALL ON TABLE "public"."farm_budgets" TO "authenticated";
GRANT ALL ON TABLE "public"."farm_budgets" TO "service_role";



GRANT ALL ON TABLE "public"."farm_input_categories" TO "anon";
GRANT ALL ON TABLE "public"."farm_input_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."farm_input_categories" TO "service_role";



GRANT ALL ON TABLE "public"."farm_input_order_items" TO "anon";
GRANT ALL ON TABLE "public"."farm_input_order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."farm_input_order_items" TO "service_role";



GRANT ALL ON TABLE "public"."farm_input_orders" TO "anon";
GRANT ALL ON TABLE "public"."farm_input_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."farm_input_orders" TO "service_role";



GRANT ALL ON TABLE "public"."farm_input_product_bookmarks" TO "anon";
GRANT ALL ON TABLE "public"."farm_input_product_bookmarks" TO "authenticated";
GRANT ALL ON TABLE "public"."farm_input_product_bookmarks" TO "service_role";



GRANT ALL ON TABLE "public"."farm_input_product_likes" TO "anon";
GRANT ALL ON TABLE "public"."farm_input_product_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."farm_input_product_likes" TO "service_role";



GRANT ALL ON TABLE "public"."farm_input_product_ratings" TO "anon";
GRANT ALL ON TABLE "public"."farm_input_product_ratings" TO "authenticated";
GRANT ALL ON TABLE "public"."farm_input_product_ratings" TO "service_role";



GRANT ALL ON TABLE "public"."farm_input_products" TO "anon";
GRANT ALL ON TABLE "public"."farm_input_products" TO "authenticated";
GRANT ALL ON TABLE "public"."farm_input_products" TO "service_role";



GRANT ALL ON TABLE "public"."farm_input_supplier_likes" TO "anon";
GRANT ALL ON TABLE "public"."farm_input_supplier_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."farm_input_supplier_likes" TO "service_role";



GRANT ALL ON TABLE "public"."farm_input_supplier_ratings" TO "anon";
GRANT ALL ON TABLE "public"."farm_input_supplier_ratings" TO "authenticated";
GRANT ALL ON TABLE "public"."farm_input_supplier_ratings" TO "service_role";



GRANT ALL ON TABLE "public"."farm_input_suppliers" TO "anon";
GRANT ALL ON TABLE "public"."farm_input_suppliers" TO "authenticated";
GRANT ALL ON TABLE "public"."farm_input_suppliers" TO "service_role";



GRANT ALL ON TABLE "public"."farm_parcels" TO "anon";
GRANT ALL ON TABLE "public"."farm_parcels" TO "authenticated";
GRANT ALL ON TABLE "public"."farm_parcels" TO "service_role";



GRANT ALL ON TABLE "public"."farm_statistics" TO "anon";
GRANT ALL ON TABLE "public"."farm_statistics" TO "authenticated";
GRANT ALL ON TABLE "public"."farm_statistics" TO "service_role";



GRANT ALL ON TABLE "public"."farm_tasks" TO "anon";
GRANT ALL ON TABLE "public"."farm_tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."farm_tasks" TO "service_role";



GRANT ALL ON TABLE "public"."farmer_consolidations" TO "anon";
GRANT ALL ON TABLE "public"."farmer_consolidations" TO "authenticated";
GRANT ALL ON TABLE "public"."farmer_consolidations" TO "service_role";



GRANT ALL ON TABLE "public"."farmer_contract_members" TO "anon";
GRANT ALL ON TABLE "public"."farmer_contract_members" TO "authenticated";
GRANT ALL ON TABLE "public"."farmer_contract_members" TO "service_role";



GRANT ALL ON TABLE "public"."farmer_contract_networks" TO "anon";
GRANT ALL ON TABLE "public"."farmer_contract_networks" TO "authenticated";
GRANT ALL ON TABLE "public"."farmer_contract_networks" TO "service_role";



GRANT ALL ON TABLE "public"."farmer_exporter_collaborations" TO "anon";
GRANT ALL ON TABLE "public"."farmer_exporter_collaborations" TO "authenticated";
GRANT ALL ON TABLE "public"."farmer_exporter_collaborations" TO "service_role";



GRANT ALL ON TABLE "public"."farmer_financial_transactions" TO "anon";
GRANT ALL ON TABLE "public"."farmer_financial_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."farmer_financial_transactions" TO "service_role";



GRANT ALL ON TABLE "public"."farmer_inventory" TO "anon";
GRANT ALL ON TABLE "public"."farmer_inventory" TO "authenticated";
GRANT ALL ON TABLE "public"."farmer_inventory" TO "service_role";



GRANT ALL ON TABLE "public"."feature_requests" TO "anon";
GRANT ALL ON TABLE "public"."feature_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."feature_requests" TO "service_role";



GRANT ALL ON TABLE "public"."financial_transactions" TO "anon";
GRANT ALL ON TABLE "public"."financial_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."financial_transactions" TO "service_role";



GRANT ALL ON TABLE "public"."food_rescue_listings" TO "anon";
GRANT ALL ON TABLE "public"."food_rescue_listings" TO "authenticated";
GRANT ALL ON TABLE "public"."food_rescue_listings" TO "service_role";



GRANT ALL ON TABLE "public"."impact_metrics" TO "anon";
GRANT ALL ON TABLE "public"."impact_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."impact_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."input_group_orders" TO "anon";
GRANT ALL ON TABLE "public"."input_group_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."input_group_orders" TO "service_role";



GRANT ALL ON TABLE "public"."input_prices" TO "anon";
GRANT ALL ON TABLE "public"."input_prices" TO "authenticated";
GRANT ALL ON TABLE "public"."input_prices" TO "service_role";



GRANT ALL ON TABLE "public"."input_pricing" TO "anon";
GRANT ALL ON TABLE "public"."input_pricing" TO "authenticated";
GRANT ALL ON TABLE "public"."input_pricing" TO "service_role";



GRANT ALL ON TABLE "public"."input_reviews" TO "anon";
GRANT ALL ON TABLE "public"."input_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."input_reviews" TO "service_role";



GRANT ALL ON TABLE "public"."input_supplier_reviews" TO "anon";
GRANT ALL ON TABLE "public"."input_supplier_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."input_supplier_reviews" TO "service_role";



GRANT ALL ON TABLE "public"."input_verifications" TO "anon";
GRANT ALL ON TABLE "public"."input_verifications" TO "authenticated";
GRANT ALL ON TABLE "public"."input_verifications" TO "service_role";



GRANT ALL ON TABLE "public"."inventory_items" TO "anon";
GRANT ALL ON TABLE "public"."inventory_items" TO "authenticated";
GRANT ALL ON TABLE "public"."inventory_items" TO "service_role";



GRANT ALL ON TABLE "public"."invitations" TO "anon";
GRANT ALL ON TABLE "public"."invitations" TO "authenticated";
GRANT ALL ON TABLE "public"."invitations" TO "service_role";



GRANT ALL ON TABLE "public"."kilimo_statistics" TO "anon";
GRANT ALL ON TABLE "public"."kilimo_statistics" TO "authenticated";
GRANT ALL ON TABLE "public"."kilimo_statistics" TO "service_role";



GRANT ALL ON TABLE "public"."land_parcels" TO "anon";
GRANT ALL ON TABLE "public"."land_parcels" TO "authenticated";
GRANT ALL ON TABLE "public"."land_parcels" TO "service_role";



GRANT ALL ON TABLE "public"."livestock_breeds" TO "anon";
GRANT ALL ON TABLE "public"."livestock_breeds" TO "authenticated";
GRANT ALL ON TABLE "public"."livestock_breeds" TO "service_role";



GRANT ALL ON TABLE "public"."livestock_for_sale" TO "anon";
GRANT ALL ON TABLE "public"."livestock_for_sale" TO "authenticated";
GRANT ALL ON TABLE "public"."livestock_for_sale" TO "service_role";



GRANT ALL ON TABLE "public"."livestock_listings" TO "anon";
GRANT ALL ON TABLE "public"."livestock_listings" TO "authenticated";
GRANT ALL ON TABLE "public"."livestock_listings" TO "service_role";



GRANT ALL ON TABLE "public"."livestock_markets" TO "anon";
GRANT ALL ON TABLE "public"."livestock_markets" TO "authenticated";
GRANT ALL ON TABLE "public"."livestock_markets" TO "service_role";



GRANT ALL ON TABLE "public"."market_agents" TO "anon";
GRANT ALL ON TABLE "public"."market_agents" TO "authenticated";
GRANT ALL ON TABLE "public"."market_agents" TO "service_role";



GRANT ALL ON TABLE "public"."market_demand_supply" TO "anon";
GRANT ALL ON TABLE "public"."market_demand_supply" TO "authenticated";
GRANT ALL ON TABLE "public"."market_demand_supply" TO "service_role";



GRANT ALL ON TABLE "public"."market_forecasts" TO "anon";
GRANT ALL ON TABLE "public"."market_forecasts" TO "authenticated";
GRANT ALL ON TABLE "public"."market_forecasts" TO "service_role";



GRANT ALL ON TABLE "public"."market_linkage_applications" TO "anon";
GRANT ALL ON TABLE "public"."market_linkage_applications" TO "authenticated";
GRANT ALL ON TABLE "public"."market_linkage_applications" TO "service_role";



GRANT ALL ON TABLE "public"."market_linkages" TO "anon";
GRANT ALL ON TABLE "public"."market_linkages" TO "authenticated";
GRANT ALL ON TABLE "public"."market_linkages" TO "service_role";



GRANT ALL ON TABLE "public"."market_participants" TO "anon";
GRANT ALL ON TABLE "public"."market_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."market_participants" TO "service_role";



GRANT ALL ON TABLE "public"."market_prices" TO "anon";
GRANT ALL ON TABLE "public"."market_prices" TO "authenticated";
GRANT ALL ON TABLE "public"."market_prices" TO "service_role";



GRANT ALL ON TABLE "public"."market_sentiment" TO "anon";
GRANT ALL ON TABLE "public"."market_sentiment" TO "authenticated";
GRANT ALL ON TABLE "public"."market_sentiment" TO "service_role";



GRANT ALL ON TABLE "public"."marketplace_ban_recommendations" TO "anon";
GRANT ALL ON TABLE "public"."marketplace_ban_recommendations" TO "authenticated";
GRANT ALL ON TABLE "public"."marketplace_ban_recommendations" TO "service_role";



GRANT ALL ON TABLE "public"."marketplace_flags" TO "anon";
GRANT ALL ON TABLE "public"."marketplace_flags" TO "authenticated";
GRANT ALL ON TABLE "public"."marketplace_flags" TO "service_role";



GRANT ALL ON TABLE "public"."mentorship_sessions" TO "anon";
GRANT ALL ON TABLE "public"."mentorship_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."mentorship_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."mentorships" TO "anon";
GRANT ALL ON TABLE "public"."mentorships" TO "authenticated";
GRANT ALL ON TABLE "public"."mentorships" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON TABLE "public"."micro_creditors" TO "anon";
GRANT ALL ON TABLE "public"."micro_creditors" TO "authenticated";
GRANT ALL ON TABLE "public"."micro_creditors" TO "service_role";



GRANT ALL ON TABLE "public"."network_events" TO "anon";
GRANT ALL ON TABLE "public"."network_events" TO "authenticated";
GRANT ALL ON TABLE "public"."network_events" TO "service_role";



GRANT ALL ON TABLE "public"."notification_preferences" TO "anon";
GRANT ALL ON TABLE "public"."notification_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."notification_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."p2p_lending_offers" TO "anon";
GRANT ALL ON TABLE "public"."p2p_lending_offers" TO "authenticated";
GRANT ALL ON TABLE "public"."p2p_lending_offers" TO "service_role";



GRANT ALL ON TABLE "public"."partner_events" TO "anon";
GRANT ALL ON TABLE "public"."partner_events" TO "authenticated";
GRANT ALL ON TABLE "public"."partner_events" TO "service_role";



GRANT ALL ON TABLE "public"."partners" TO "anon";
GRANT ALL ON TABLE "public"."partners" TO "authenticated";
GRANT ALL ON TABLE "public"."partners" TO "service_role";



GRANT ALL ON TABLE "public"."partnerships" TO "anon";
GRANT ALL ON TABLE "public"."partnerships" TO "authenticated";
GRANT ALL ON TABLE "public"."partnerships" TO "service_role";



GRANT ALL ON TABLE "public"."payment_transactions" TO "anon";
GRANT ALL ON TABLE "public"."payment_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_transactions" TO "service_role";



GRANT ALL ON TABLE "public"."permissions" TO "anon";
GRANT ALL ON TABLE "public"."permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."permissions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."permissions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."permissions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."permissions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."poll_votes" TO "anon";
GRANT ALL ON TABLE "public"."poll_votes" TO "authenticated";
GRANT ALL ON TABLE "public"."poll_votes" TO "service_role";



GRANT ALL ON TABLE "public"."post_comments" TO "anon";
GRANT ALL ON TABLE "public"."post_comments" TO "authenticated";
GRANT ALL ON TABLE "public"."post_comments" TO "service_role";



GRANT ALL ON TABLE "public"."price_alerts" TO "anon";
GRANT ALL ON TABLE "public"."price_alerts" TO "authenticated";
GRANT ALL ON TABLE "public"."price_alerts" TO "service_role";



GRANT ALL ON TABLE "public"."price_comparisons" TO "anon";
GRANT ALL ON TABLE "public"."price_comparisons" TO "authenticated";
GRANT ALL ON TABLE "public"."price_comparisons" TO "service_role";



GRANT ALL ON TABLE "public"."pricing_tiers" TO "anon";
GRANT ALL ON TABLE "public"."pricing_tiers" TO "authenticated";
GRANT ALL ON TABLE "public"."pricing_tiers" TO "service_role";



GRANT ALL ON TABLE "public"."processing_matches" TO "anon";
GRANT ALL ON TABLE "public"."processing_matches" TO "authenticated";
GRANT ALL ON TABLE "public"."processing_matches" TO "service_role";



GRANT ALL ON TABLE "public"."processors" TO "anon";
GRANT ALL ON TABLE "public"."processors" TO "authenticated";
GRANT ALL ON TABLE "public"."processors" TO "service_role";



GRANT ALL ON TABLE "public"."produce_inventory" TO "anon";
GRANT ALL ON TABLE "public"."produce_inventory" TO "authenticated";
GRANT ALL ON TABLE "public"."produce_inventory" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."quality_control_discussions" TO "anon";
GRANT ALL ON TABLE "public"."quality_control_discussions" TO "authenticated";
GRANT ALL ON TABLE "public"."quality_control_discussions" TO "service_role";



GRANT ALL ON TABLE "public"."recipients" TO "anon";
GRANT ALL ON TABLE "public"."recipients" TO "authenticated";
GRANT ALL ON TABLE "public"."recipients" TO "service_role";



GRANT ALL ON TABLE "public"."rescue_matches" TO "anon";
GRANT ALL ON TABLE "public"."rescue_matches" TO "authenticated";
GRANT ALL ON TABLE "public"."rescue_matches" TO "service_role";



GRANT ALL ON TABLE "public"."research_requests" TO "anon";
GRANT ALL ON TABLE "public"."research_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."research_requests" TO "service_role";



GRANT ALL ON TABLE "public"."role_permissions" TO "anon";
GRANT ALL ON TABLE "public"."role_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."role_permissions" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."roles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."service_provider_categories" TO "anon";
GRANT ALL ON TABLE "public"."service_provider_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."service_provider_categories" TO "service_role";



GRANT ALL ON TABLE "public"."service_provider_reviews" TO "anon";
GRANT ALL ON TABLE "public"."service_provider_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."service_provider_reviews" TO "service_role";



GRANT ALL ON TABLE "public"."service_providers" TO "anon";
GRANT ALL ON TABLE "public"."service_providers" TO "authenticated";
GRANT ALL ON TABLE "public"."service_providers" TO "service_role";



GRANT ALL ON TABLE "public"."subscription_box_deliveries" TO "anon";
GRANT ALL ON TABLE "public"."subscription_box_deliveries" TO "authenticated";
GRANT ALL ON TABLE "public"."subscription_box_deliveries" TO "service_role";



GRANT ALL ON TABLE "public"."subscription_boxes" TO "anon";
GRANT ALL ON TABLE "public"."subscription_boxes" TO "authenticated";
GRANT ALL ON TABLE "public"."subscription_boxes" TO "service_role";



GRANT ALL ON TABLE "public"."timeline_events" TO "anon";
GRANT ALL ON TABLE "public"."timeline_events" TO "authenticated";
GRANT ALL ON TABLE "public"."timeline_events" TO "service_role";



GRANT ALL ON TABLE "public"."tracking_events" TO "anon";
GRANT ALL ON TABLE "public"."tracking_events" TO "authenticated";
GRANT ALL ON TABLE "public"."tracking_events" TO "service_role";



GRANT ALL ON TABLE "public"."training_events" TO "anon";
GRANT ALL ON TABLE "public"."training_events" TO "authenticated";
GRANT ALL ON TABLE "public"."training_events" TO "service_role";



GRANT ALL ON TABLE "public"."training_registrations" TO "anon";
GRANT ALL ON TABLE "public"."training_registrations" TO "authenticated";
GRANT ALL ON TABLE "public"."training_registrations" TO "service_role";



GRANT ALL ON TABLE "public"."transport_requests" TO "anon";
GRANT ALL ON TABLE "public"."transport_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."transport_requests" TO "service_role";



GRANT ALL ON TABLE "public"."transporter_bookings" TO "anon";
GRANT ALL ON TABLE "public"."transporter_bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."transporter_bookings" TO "service_role";



GRANT ALL ON TABLE "public"."transporter_recommendations" TO "anon";
GRANT ALL ON TABLE "public"."transporter_recommendations" TO "authenticated";
GRANT ALL ON TABLE "public"."transporter_recommendations" TO "service_role";



GRANT ALL ON TABLE "public"."transporters" TO "anon";
GRANT ALL ON TABLE "public"."transporters" TO "authenticated";
GRANT ALL ON TABLE "public"."transporters" TO "service_role";



GRANT ALL ON TABLE "public"."user_bookmarks" TO "anon";
GRANT ALL ON TABLE "public"."user_bookmarks" TO "authenticated";
GRANT ALL ON TABLE "public"."user_bookmarks" TO "service_role";



GRANT ALL ON TABLE "public"."user_notification_preferences" TO "anon";
GRANT ALL ON TABLE "public"."user_notification_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."user_notification_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."user_notifications" TO "anon";
GRANT ALL ON TABLE "public"."user_notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."user_notifications" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";



GRANT ALL ON TABLE "public"."warehouse_bookings" TO "anon";
GRANT ALL ON TABLE "public"."warehouse_bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."warehouse_bookings" TO "service_role";



GRANT ALL ON TABLE "public"."warehouses" TO "anon";
GRANT ALL ON TABLE "public"."warehouses" TO "authenticated";
GRANT ALL ON TABLE "public"."warehouses" TO "service_role";



GRANT ALL ON TABLE "public"."weather_alerts" TO "anon";
GRANT ALL ON TABLE "public"."weather_alerts" TO "authenticated";
GRANT ALL ON TABLE "public"."weather_alerts" TO "service_role";



GRANT ALL ON TABLE "public"."weather_data" TO "anon";
GRANT ALL ON TABLE "public"."weather_data" TO "authenticated";
GRANT ALL ON TABLE "public"."weather_data" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
