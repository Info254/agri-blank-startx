create extension if not exists "pgjwt" with schema "extensions";


create sequence "public"."admin_action_logs_id_seq";

drop trigger if exists "set_timestamp_animals" on "public"."animals";

drop trigger if exists "set_timestamp_delivery_requests" on "public"."delivery_requests";

drop trigger if exists "set_timestamp_logistics_providers" on "public"."logistics_providers";

drop trigger if exists "update_p2p_lenders_updated_at" on "public"."p2p_lenders";

drop trigger if exists "profiles_audit_trigger" on "public"."profiles";

drop trigger if exists "set_updated_at_barter_listings" on "public"."barter_listings";

drop trigger if exists "set_updated_at_collaboration_proposals" on "public"."collaboration_proposals";

drop trigger if exists "set_updated_at_crop_tracking" on "public"."crop_tracking";

drop trigger if exists "set_updated_at_exporter_profiles" on "public"."exporter_profiles";

drop trigger if exists "set_updated_at_farm_parcels" on "public"."farm_parcels";

drop trigger if exists "set_updated_at_farmer_exporter_collaborations" on "public"."farmer_exporter_collaborations";

drop trigger if exists "set_timestamp_market_linkages" on "public"."market_linkages";

drop trigger if exists "set_timestamp_produce_inventory" on "public"."produce_inventory";

drop trigger if exists "set_updated_at_quality_control_discussions" on "public"."quality_control_discussions";

drop trigger if exists "set_timestamp_training_events" on "public"."training_events";

drop trigger if exists "set_timestamp_transport_requests" on "public"."transport_requests";

drop trigger if exists "set_timestamp_warehouse_bookings" on "public"."warehouse_bookings";

drop trigger if exists "set_timestamp_warehouses" on "public"."warehouses";

drop policy "Users can manage their own animal health records" on "public"."animal_health";

drop policy "Users can manage their own animal records" on "public"."animal_records";

drop policy "Users can manage their own animal sales" on "public"."animal_sales";

drop policy "Users can manage their own animals" on "public"."animals";

drop policy "Anyone can view active networks" on "public"."contract_farming_networks";

drop policy "Buyers can manage their own networks" on "public"."contract_farming_networks";

drop policy "Requesters and providers can update delivery requests" on "public"."delivery_requests";

drop policy "Users can create delivery requests" on "public"."delivery_requests";

drop policy "Users can view their own delivery requests" on "public"."delivery_requests";

drop policy "Admins can manage all documentation" on "public"."export_documentation";

drop policy "Users can upload documentation" on "public"."export_documentation";

drop policy "Users can view export documentation" on "public"."export_documentation";

drop policy "Admins can manage export opportunities" on "public"."export_opportunities";

drop policy "Anyone can view export opportunities" on "public"."export_opportunities";

drop policy "Consolidators can manage their consolidations" on "public"."farmer_consolidations";

drop policy "Farmers can view consolidations they're part of" on "public"."farmer_consolidations";

drop policy "Farmers can manage their own memberships" on "public"."farmer_contract_members";

drop policy "Users can manage their own inventory" on "public"."inventory_items";

drop policy "Anyone can view active logistics providers" on "public"."logistics_providers";

drop policy "Users can create logistics provider profiles" on "public"."logistics_providers";

drop policy "Users can update their logistics provider profiles" on "public"."logistics_providers";

drop policy "Anyone can view active P2P lenders" on "public"."p2p_lenders";

drop policy "Users can create their P2P lender profile" on "public"."p2p_lenders";

drop policy "Users can update their P2P lender profile" on "public"."p2p_lenders";

drop policy "Users can insert their own profile" on "public"."profiles";

drop policy "Users can update their own profile (except role)" on "public"."profiles";

drop policy "Users can view all profiles" on "public"."profiles";

drop policy "Only admins can view security audit logs" on "public"."security_audit_log";

drop policy "Users can update their own transport requests" on "public"."transport_requests";

revoke delete on table "public"."app_market_selection" from "anon";

revoke insert on table "public"."app_market_selection" from "anon";

revoke references on table "public"."app_market_selection" from "anon";

revoke select on table "public"."app_market_selection" from "anon";

revoke trigger on table "public"."app_market_selection" from "anon";

revoke truncate on table "public"."app_market_selection" from "anon";

revoke update on table "public"."app_market_selection" from "anon";

revoke delete on table "public"."app_market_selection" from "authenticated";

revoke insert on table "public"."app_market_selection" from "authenticated";

revoke references on table "public"."app_market_selection" from "authenticated";

revoke select on table "public"."app_market_selection" from "authenticated";

revoke trigger on table "public"."app_market_selection" from "authenticated";

revoke truncate on table "public"."app_market_selection" from "authenticated";

revoke update on table "public"."app_market_selection" from "authenticated";

revoke delete on table "public"."app_market_selection" from "service_role";

revoke insert on table "public"."app_market_selection" from "service_role";

revoke references on table "public"."app_market_selection" from "service_role";

revoke select on table "public"."app_market_selection" from "service_role";

revoke trigger on table "public"."app_market_selection" from "service_role";

revoke truncate on table "public"."app_market_selection" from "service_role";

revoke update on table "public"."app_market_selection" from "service_role";

revoke delete on table "public"."contract_farming_networks" from "anon";

revoke insert on table "public"."contract_farming_networks" from "anon";

revoke references on table "public"."contract_farming_networks" from "anon";

revoke select on table "public"."contract_farming_networks" from "anon";

revoke trigger on table "public"."contract_farming_networks" from "anon";

revoke truncate on table "public"."contract_farming_networks" from "anon";

revoke update on table "public"."contract_farming_networks" from "anon";

revoke delete on table "public"."contract_farming_networks" from "authenticated";

revoke insert on table "public"."contract_farming_networks" from "authenticated";

revoke references on table "public"."contract_farming_networks" from "authenticated";

revoke select on table "public"."contract_farming_networks" from "authenticated";

revoke trigger on table "public"."contract_farming_networks" from "authenticated";

revoke truncate on table "public"."contract_farming_networks" from "authenticated";

revoke update on table "public"."contract_farming_networks" from "authenticated";

revoke delete on table "public"."contract_farming_networks" from "service_role";

revoke insert on table "public"."contract_farming_networks" from "service_role";

revoke references on table "public"."contract_farming_networks" from "service_role";

revoke select on table "public"."contract_farming_networks" from "service_role";

revoke trigger on table "public"."contract_farming_networks" from "service_role";

revoke truncate on table "public"."contract_farming_networks" from "service_role";

revoke update on table "public"."contract_farming_networks" from "service_role";

revoke delete on table "public"."delivery_requests" from "anon";

revoke insert on table "public"."delivery_requests" from "anon";

revoke references on table "public"."delivery_requests" from "anon";

revoke select on table "public"."delivery_requests" from "anon";

revoke trigger on table "public"."delivery_requests" from "anon";

revoke truncate on table "public"."delivery_requests" from "anon";

revoke update on table "public"."delivery_requests" from "anon";

revoke delete on table "public"."delivery_requests" from "authenticated";

revoke insert on table "public"."delivery_requests" from "authenticated";

revoke references on table "public"."delivery_requests" from "authenticated";

revoke select on table "public"."delivery_requests" from "authenticated";

revoke trigger on table "public"."delivery_requests" from "authenticated";

revoke truncate on table "public"."delivery_requests" from "authenticated";

revoke update on table "public"."delivery_requests" from "authenticated";

revoke delete on table "public"."delivery_requests" from "service_role";

revoke insert on table "public"."delivery_requests" from "service_role";

revoke references on table "public"."delivery_requests" from "service_role";

revoke select on table "public"."delivery_requests" from "service_role";

revoke trigger on table "public"."delivery_requests" from "service_role";

revoke truncate on table "public"."delivery_requests" from "service_role";

revoke update on table "public"."delivery_requests" from "service_role";

revoke delete on table "public"."logistics_providers" from "anon";

revoke insert on table "public"."logistics_providers" from "anon";

revoke references on table "public"."logistics_providers" from "anon";

revoke select on table "public"."logistics_providers" from "anon";

revoke trigger on table "public"."logistics_providers" from "anon";

revoke truncate on table "public"."logistics_providers" from "anon";

revoke update on table "public"."logistics_providers" from "anon";

revoke delete on table "public"."logistics_providers" from "authenticated";

revoke insert on table "public"."logistics_providers" from "authenticated";

revoke references on table "public"."logistics_providers" from "authenticated";

revoke select on table "public"."logistics_providers" from "authenticated";

revoke trigger on table "public"."logistics_providers" from "authenticated";

revoke truncate on table "public"."logistics_providers" from "authenticated";

revoke update on table "public"."logistics_providers" from "authenticated";

revoke delete on table "public"."logistics_providers" from "service_role";

revoke insert on table "public"."logistics_providers" from "service_role";

revoke references on table "public"."logistics_providers" from "service_role";

revoke select on table "public"."logistics_providers" from "service_role";

revoke trigger on table "public"."logistics_providers" from "service_role";

revoke truncate on table "public"."logistics_providers" from "service_role";

revoke update on table "public"."logistics_providers" from "service_role";

revoke delete on table "public"."p2p_lenders" from "anon";

revoke insert on table "public"."p2p_lenders" from "anon";

revoke references on table "public"."p2p_lenders" from "anon";

revoke select on table "public"."p2p_lenders" from "anon";

revoke trigger on table "public"."p2p_lenders" from "anon";

revoke truncate on table "public"."p2p_lenders" from "anon";

revoke update on table "public"."p2p_lenders" from "anon";

revoke delete on table "public"."p2p_lenders" from "authenticated";

revoke insert on table "public"."p2p_lenders" from "authenticated";

revoke references on table "public"."p2p_lenders" from "authenticated";

revoke select on table "public"."p2p_lenders" from "authenticated";

revoke trigger on table "public"."p2p_lenders" from "authenticated";

revoke truncate on table "public"."p2p_lenders" from "authenticated";

revoke update on table "public"."p2p_lenders" from "authenticated";

revoke delete on table "public"."p2p_lenders" from "service_role";

revoke insert on table "public"."p2p_lenders" from "service_role";

revoke references on table "public"."p2p_lenders" from "service_role";

revoke select on table "public"."p2p_lenders" from "service_role";

revoke trigger on table "public"."p2p_lenders" from "service_role";

revoke truncate on table "public"."p2p_lenders" from "service_role";

revoke update on table "public"."p2p_lenders" from "service_role";

revoke delete on table "public"."security_audit_log" from "anon";

revoke insert on table "public"."security_audit_log" from "anon";

revoke references on table "public"."security_audit_log" from "anon";

revoke select on table "public"."security_audit_log" from "anon";

revoke trigger on table "public"."security_audit_log" from "anon";

revoke truncate on table "public"."security_audit_log" from "anon";

revoke update on table "public"."security_audit_log" from "anon";

revoke delete on table "public"."security_audit_log" from "authenticated";

revoke insert on table "public"."security_audit_log" from "authenticated";

revoke references on table "public"."security_audit_log" from "authenticated";

revoke select on table "public"."security_audit_log" from "authenticated";

revoke trigger on table "public"."security_audit_log" from "authenticated";

revoke truncate on table "public"."security_audit_log" from "authenticated";

revoke update on table "public"."security_audit_log" from "authenticated";

revoke delete on table "public"."security_audit_log" from "service_role";

revoke insert on table "public"."security_audit_log" from "service_role";

revoke references on table "public"."security_audit_log" from "service_role";

revoke select on table "public"."security_audit_log" from "service_role";

revoke trigger on table "public"."security_audit_log" from "service_role";

revoke truncate on table "public"."security_audit_log" from "service_role";

revoke update on table "public"."security_audit_log" from "service_role";

alter table "public"."contract_farming_networks" drop constraint "contract_farming_networks_buyer_id_fkey";

alter table "public"."delivery_requests" drop constraint "delivery_requests_provider_id_fkey";

alter table "public"."delivery_requests" drop constraint "delivery_requests_requester_id_fkey";

alter table "public"."export_orders" drop constraint "export_orders_transporter_id_fkey";

alter table "public"."logistics_providers" drop constraint "logistics_providers_user_id_fkey";

alter table "public"."profiles" drop constraint "profiles_role_check";

alter table "public"."transporter_bookings" drop constraint "transporter_bookings_transporter_id_fkey";

alter table "public"."transporter_recommendations" drop constraint "transporter_recommendations_transporter_id_fkey";

alter table "public"."animals" drop constraint "animals_user_id_fkey";

alter table "public"."profiles" drop constraint "profiles_id_fkey";

alter table "public"."transport_requests" drop constraint "transport_requests_transporter_id_fkey";

drop function if exists "public"."get_current_user_role"();

drop function if exists "public"."get_user_permissions"(p_user_id uuid);

drop function if exists "public"."log_security_action"();

drop function if exists "public"."user_has_permission"(required_role text);

alter table "public"."app_market_selection" drop constraint "app_market_selection_pkey";

alter table "public"."contract_farming_networks" drop constraint "contract_farming_networks_pkey";

alter table "public"."delivery_requests" drop constraint "delivery_requests_pkey";

alter table "public"."logistics_providers" drop constraint "logistics_providers_pkey";

alter table "public"."p2p_lenders" drop constraint "p2p_lenders_pkey";

alter table "public"."security_audit_log" drop constraint "security_audit_log_pkey";

drop index if exists "public"."app_market_selection_pkey";

drop index if exists "public"."contract_farming_networks_pkey";

drop index if exists "public"."delivery_requests_pkey";

drop index if exists "public"."idx_farm_input_orders_status";

drop index if exists "public"."idx_p2p_lenders_county";

drop index if exists "public"."idx_p2p_lenders_loan_amounts";

drop index if exists "public"."idx_profiles_county";

drop index if exists "public"."idx_profiles_farm_type";

drop index if exists "public"."logistics_providers_pkey";

drop index if exists "public"."p2p_lenders_pkey";

drop index if exists "public"."security_audit_log_pkey";

drop table "public"."app_market_selection";

drop table "public"."contract_farming_networks";

drop table "public"."delivery_requests";

drop table "public"."logistics_providers";

drop table "public"."p2p_lenders";

drop table "public"."security_audit_log";

create table "public"."admin_action_logs" (
    "id" integer not null default nextval('admin_action_logs_id_seq'::regclass),
    "action_type" text not null,
    "table_name" text not null,
    "user_id" uuid,
    "action_timestamp" timestamp with time zone default now()
);


alter table "public"."admin_action_logs" enable row level security;

create table "public"."batch_tracking" (
    "batch_id" uuid not null default gen_random_uuid(),
    "farmer_id" uuid,
    "product_type" text,
    "quantity" integer,
    "origin" text,
    "destination" text,
    "status" text default 'created'::text,
    "events" jsonb,
    "created_at" timestamp without time zone default now()
);


alter table "public"."batch_tracking" enable row level security;

create table "public"."bulk_order_bids" (
    "id" uuid not null default gen_random_uuid(),
    "order_id" uuid,
    "farmer_id" uuid,
    "price" numeric not null,
    "quality_offer" text,
    "status" text default 'pending'::text,
    "created_at" timestamp without time zone default now()
);


alter table "public"."bulk_order_bids" enable row level security;

create table "public"."bulk_orders" (
    "id" uuid not null default gen_random_uuid(),
    "buyer_id" uuid,
    "produce_type" text not null,
    "quantity" integer not null,
    "quality" text,
    "delivery_date" date,
    "status" text default 'open'::text,
    "created_at" timestamp without time zone default now()
);


alter table "public"."bulk_orders" enable row level security;

create table "public"."business_advertisements" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "business_name" text not null,
    "business_description" text not null,
    "business_category" text not null,
    "contact_email" text not null,
    "contact_phone" text,
    "location" text not null,
    "website_url" text,
    "image_url" text,
    "ad_content" text not null,
    "target_audience" text[] default '{}'::text[],
    "payment_status" text default 'pending'::text,
    "payment_id" text,
    "amount_paid" numeric(10,2),
    "expires_at" timestamp with time zone,
    "is_active" boolean default false,
    "views_count" integer default 0,
    "clicks_count" integer default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."business_advertisements" enable row level security;

create table "public"."business_matches" (
    "id" uuid not null default gen_random_uuid(),
    "business1_id" uuid,
    "business2_id" uuid,
    "match_type" text,
    "status" text,
    "created_at" timestamp without time zone default now()
);


alter table "public"."business_matches" enable row level security;

create table "public"."carbon_forum_posts" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "title" text,
    "content" text,
    "type" text,
    "event_date" date,
    "org_link" text,
    "success_story" text,
    "created_at" timestamp without time zone default now()
);


alter table "public"."carbon_forum_posts" enable row level security;

create table "public"."city_market_donations" (
    "id" uuid not null default gen_random_uuid(),
    "product_id" uuid,
    "home_id" uuid,
    "agent_id" uuid,
    "donated_at" timestamp without time zone default now(),
    "recipient_type" text,
    "recipient_id" uuid
);


alter table "public"."city_market_donations" enable row level security;

create table "public"."contract_applications" (
    "id" uuid not null default gen_random_uuid(),
    "contract_id" uuid,
    "farmer_id" uuid,
    "message" text,
    "land_size" numeric(10,2),
    "experience_years" integer,
    "previous_contracts" integer default 0,
    "status" text default 'pending'::text,
    "applied_at" timestamp with time zone default now(),
    "reviewed_at" timestamp with time zone,
    "reviewed_by" uuid
);


alter table "public"."contract_applications" enable row level security;

create table "public"."contract_comments" (
    "id" uuid not null default gen_random_uuid(),
    "contract_id" uuid,
    "user_id" uuid,
    "comment" text not null,
    "parent_id" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."contract_comments" enable row level security;

create table "public"."contract_documents" (
    "id" uuid not null default gen_random_uuid(),
    "contract_id" uuid,
    "name" text not null,
    "url" text not null,
    "file_type" text,
    "file_size" integer,
    "uploaded_by" uuid,
    "created_at" timestamp with time zone default now()
);


alter table "public"."contract_documents" enable row level security;

create table "public"."contract_farming_opportunities" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text not null,
    "company_name" text not null,
    "location" text not null,
    "crop_type" text not null,
    "contract_duration" text,
    "price_per_unit" numeric(10,2),
    "minimum_quantity" numeric(10,2),
    "maximum_quantity" numeric(10,2),
    "unit" text,
    "requirements" text,
    "benefits" text,
    "contact_person" text,
    "contact_email" text,
    "contact_phone" text,
    "status" text default 'active'::text,
    "created_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "expires_at" timestamp with time zone
);


alter table "public"."contract_farming_opportunities" enable row level security;

create table "public"."contract_flags" (
    "id" uuid not null default gen_random_uuid(),
    "contract_id" uuid,
    "user_id" uuid,
    "reason" text not null,
    "description" text,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone default now(),
    "reviewed_at" timestamp with time zone,
    "reviewed_by" uuid
);


alter table "public"."contract_flags" enable row level security;

create table "public"."contract_reviews" (
    "id" uuid not null default gen_random_uuid(),
    "contract_id" uuid,
    "user_id" uuid,
    "rating" integer not null,
    "comment" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."contract_reviews" enable row level security;

create table "public"."contract_social_shares" (
    "id" uuid not null default gen_random_uuid(),
    "contract_id" uuid,
    "user_id" uuid,
    "platform" text not null,
    "shared_at" timestamp with time zone default now(),
    "ip_address" inet
);


alter table "public"."contract_social_shares" enable row level security;

create table "public"."crop_yields" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "crop_type" text not null,
    "planting_date" date not null,
    "expected_yield" numeric(10,2),
    "actual_yield" numeric(10,2),
    "yield_improvement" numeric(5,2) generated always as (
CASE
    WHEN (expected_yield > (0)::numeric) THEN (((actual_yield - expected_yield) / expected_yield) * (100)::numeric)
    ELSE (0)::numeric
END) stored,
    "notes" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."crop_yields" enable row level security;

create table "public"."data_fetch_logs" (
    "id" uuid not null default gen_random_uuid(),
    "source" text not null,
    "status" text not null,
    "records_count" integer default 0,
    "error_message" text,
    "execution_time_ms" integer,
    "created_at" timestamp with time zone default now()
);


alter table "public"."data_fetch_logs" enable row level security;

create table "public"."financial_transactions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "transaction_type" text not null,
    "amount" numeric(10,2) not null,
    "description" text not null,
    "category" text not null,
    "transaction_date" date not null,
    "payment_method" text,
    "receipt_url" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."financial_transactions" enable row level security;

create table "public"."food_rescue_listings" (
    "id" uuid not null default gen_random_uuid(),
    "farmer_id" uuid,
    "product" text,
    "quantity" numeric,
    "unit" text,
    "location" text,
    "urgency" text,
    "status" text default 'available'::text,
    "created_at" timestamp without time zone default now()
);


alter table "public"."food_rescue_listings" enable row level security;

create table "public"."impact_metrics" (
    "id" uuid not null default gen_random_uuid(),
    "metric_name" text not null,
    "metric_value" text not null,
    "metric_description" text,
    "display_order" integer default 0,
    "is_active" boolean default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."impact_metrics" enable row level security;

create table "public"."input_group_orders" (
    "id" uuid not null default gen_random_uuid(),
    "input_type" text not null,
    "quantity" integer not null,
    "farmer_id" uuid,
    "status" text default 'open'::text,
    "supplier_id" uuid,
    "delivery_date" date,
    "created_at" timestamp without time zone default now()
);


alter table "public"."input_group_orders" enable row level security;

create table "public"."input_prices" (
    "id" uuid not null default gen_random_uuid(),
    "input_type" text not null,
    "price" numeric not null,
    "region" text,
    "reported_by" uuid,
    "verified" boolean default false,
    "created_at" timestamp without time zone default now()
);


alter table "public"."input_prices" enable row level security;

create table "public"."input_pricing" (
    "id" uuid not null default gen_random_uuid(),
    "product_id" uuid,
    "supplier_id" uuid,
    "price" numeric,
    "date" timestamp without time zone default now(),
    "verified" boolean default false,
    "crowdsource_source" text
);


alter table "public"."input_pricing" enable row level security;

create table "public"."input_reviews" (
    "id" uuid not null default gen_random_uuid(),
    "supplier_id" uuid,
    "user_id" uuid,
    "rating" integer,
    "review_text" text,
    "date" timestamp without time zone default now()
);


alter table "public"."input_reviews" enable row level security;

create table "public"."input_supplier_reviews" (
    "id" uuid not null default gen_random_uuid(),
    "supplier_id" uuid,
    "rating" integer,
    "review" text,
    "photo_url" text,
    "verified" boolean default false,
    "created_at" timestamp without time zone default now()
);


alter table "public"."input_supplier_reviews" enable row level security;

create table "public"."input_verifications" (
    "id" uuid not null default gen_random_uuid(),
    "supplier_id" uuid,
    "user_id" uuid,
    "verification_type" text,
    "status" text default 'pending'::text,
    "date" timestamp without time zone default now()
);


alter table "public"."input_verifications" enable row level security;

create table "public"."kilimo_statistics" (
    "id" uuid not null default gen_random_uuid(),
    "external_id" text,
    "name" text not null,
    "value" text not null,
    "category" text not null,
    "county" text not null,
    "unit" text,
    "source" text default 'Kilimo Statistics API'::text,
    "verified" boolean default true,
    "metadata" jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "fetch_date" date default CURRENT_DATE
);


alter table "public"."kilimo_statistics" enable row level security;

create table "public"."livestock_breeds" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "type" text not null,
    "purpose" text[] not null default '{}'::text[],
    "origin" text,
    "characteristics" text[] not null default '{}'::text[],
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."livestock_breeds" enable row level security;

create table "public"."livestock_for_sale" (
    "id" uuid not null default uuid_generate_v4(),
    "market_id" uuid,
    "seller_id" uuid not null,
    "type" text not null,
    "breed" text not null,
    "gender" text not null,
    "age" integer not null,
    "weight" numeric(10,2) not null,
    "health_status" text not null,
    "price" numeric(12,2) not null,
    "price_per_kg" numeric(10,2),
    "quantity" integer not null default 1,
    "description" text,
    "images" text[] not null default '{}'::text[],
    "is_halal" boolean not null default false,
    "halal_certificate_number" text,
    "halal_certification_body" text,
    "vaccination_records" jsonb[] not null default '{}'::jsonb[],
    "breeding_history" text,
    "color" text,
    "special_features" text[] not null default '{}'::text[],
    "tags" text[] not null default '{}'::text[],
    "transport_requirements" text[] not null default '{}'::text[],
    "special_handling_instructions" text,
    "status" text not null default 'available'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."livestock_for_sale" enable row level security;

create table "public"."livestock_listings" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "type" text not null,
    "breed" text not null,
    "age" integer not null,
    "weight" numeric(10,2) not null,
    "price" numeric(10,2) not null,
    "location" text not null,
    "description" text,
    "image_url" text,
    "halal_certified" boolean default false,
    "certificate_number" text,
    "seller_id" uuid not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."livestock_listings" enable row level security;

create table "public"."livestock_markets" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text,
    "county" text not null,
    "location" jsonb not null default '{}'::jsonb,
    "livestock_types" text[] not null default '{}'::text[],
    "has_quarantine_facilities" boolean not null default false,
    "has_veterinary_services" boolean not null default false,
    "has_slaughter_facilities" boolean not null default false,
    "slaughter_methods" text[] not null default '{}'::text[],
    "halal_certified" boolean not null default false,
    "halal_certification_body" text,
    "certification_expiry_date" timestamp with time zone,
    "animal_welfare_standards" text[] not null default '{}'::text[],
    "auction_days" text[] not null default '{}'::text[],
    "special_handling_requirements" text[] not null default '{}'::text[],
    "requires_health_certification" boolean not null default false,
    "requires_movement_permit" boolean not null default false,
    "maximum_transport_hours" integer,
    "market_hours" jsonb not null default '{}'::jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."livestock_markets" enable row level security;

create table "public"."market_forecasts" (
    "id" uuid not null default gen_random_uuid(),
    "commodity_name" text not null,
    "county" text not null,
    "current_price" numeric not null,
    "forecast_price" numeric not null,
    "confidence_level" numeric not null default 0.7,
    "period" text not null default '7 days'::text,
    "factors" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "valid_until" timestamp with time zone not null default (now() + '7 days'::interval)
);


alter table "public"."market_forecasts" enable row level security;

create table "public"."market_sentiment" (
    "id" uuid not null default gen_random_uuid(),
    "commodity_name" text not null,
    "county" text not null,
    "sentiment_score" numeric not null,
    "report_count" integer not null default 1,
    "tags" text[] not null default '{}'::text[],
    "issues" text[] not null default '{}'::text[],
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."market_sentiment" enable row level security;

create table "public"."mentorships" (
    "id" uuid not null default gen_random_uuid(),
    "mentor_id" uuid,
    "mentee_id" uuid,
    "topic" text,
    "status" text,
    "created_at" timestamp without time zone default now()
);


alter table "public"."mentorships" enable row level security;

create table "public"."messages" (
    "id" uuid not null default gen_random_uuid(),
    "content" text,
    "sender_id" uuid,
    "created_at" timestamp with time zone default now(),
    "media_url" text,
    "media_type" text,
    "is_encrypted" boolean default false
);


alter table "public"."messages" enable row level security;

create table "public"."network_events" (
    "id" uuid not null default gen_random_uuid(),
    "title" text,
    "description" text,
    "date" date,
    "location" text,
    "type" text,
    "created_at" timestamp without time zone default now()
);


alter table "public"."network_events" enable row level security;

create table "public"."notification_preferences" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "notification_type" text not null,
    "enabled" boolean default true,
    "location_filter" text[],
    "crop_filter" text[],
    "price_threshold" numeric(10,2),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."notification_preferences" enable row level security;

create table "public"."partner_events" (
    "id" uuid not null default gen_random_uuid(),
    "partner_id" uuid,
    "title" text not null,
    "description" text,
    "event_date" date,
    "location" text,
    "image_url" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."partner_events" enable row level security;

create table "public"."partners" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "company_name" text not null,
    "contact_email" text not null,
    "contact_phone" text,
    "website" text,
    "description" text,
    "logo_url" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."partners" enable row level security;

create table "public"."partnerships" (
    "id" uuid not null default gen_random_uuid(),
    "org1_id" uuid,
    "org2_id" uuid,
    "type" text,
    "status" text,
    "created_at" timestamp without time zone default now()
);


alter table "public"."partnerships" enable row level security;

create table "public"."payment_transactions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "advertisement_id" uuid,
    "payment_provider" text not null,
    "transaction_id" text not null,
    "amount" numeric(10,2) not null,
    "currency" text not null default 'USD'::text,
    "status" text default 'pending'::text,
    "payment_details" jsonb,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."payment_transactions" enable row level security;

create table "public"."processing_matches" (
    "id" uuid not null default gen_random_uuid(),
    "bulk_order_id" uuid,
    "farmer_id" uuid,
    "offer_price" numeric,
    "status" text default 'pending'::text,
    "negotiation_log" jsonb,
    "created_at" timestamp without time zone default now()
);


alter table "public"."processing_matches" enable row level security;

create table "public"."recipients" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "type" text not null,
    "location" text,
    "contact" text,
    "created_at" timestamp without time zone default now(),
    "recipient_type" text
);


alter table "public"."recipients" enable row level security;

create table "public"."rescue_matches" (
    "id" uuid not null default gen_random_uuid(),
    "listing_id" uuid,
    "recipient_id" uuid,
    "status" text default 'pending'::text,
    "pickup_time" timestamp without time zone,
    "created_at" timestamp without time zone default now()
);


alter table "public"."rescue_matches" enable row level security;

create table "public"."research_requests" (
    "id" uuid not null default gen_random_uuid(),
    "requester_id" uuid,
    "topic" text,
    "details" text,
    "status" text,
    "created_at" timestamp without time zone default now()
);


alter table "public"."research_requests" enable row level security;

create table "public"."service_provider_categories" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "created_at" timestamp with time zone default now()
);


create table "public"."subscription_box_deliveries" (
    "id" uuid not null default gen_random_uuid(),
    "box_id" uuid,
    "delivery_date" date,
    "delivered" boolean default false,
    "created_at" timestamp without time zone default now()
);


alter table "public"."subscription_box_deliveries" enable row level security;

create table "public"."subscription_boxes" (
    "id" uuid not null default gen_random_uuid(),
    "consumer_id" uuid,
    "farmer_id" uuid,
    "box_type" text,
    "frequency" text,
    "next_delivery" date,
    "status" text default 'active'::text,
    "created_at" timestamp without time zone default now()
);


alter table "public"."subscription_boxes" enable row level security;

create table "public"."transporters" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "name" text not null,
    "service_type" text not null,
    "counties" text[] not null,
    "contact_info" text not null,
    "capacity" text not null,
    "load_capacity" integer not null,
    "rates" text not null,
    "has_refrigeration" boolean not null default false,
    "vehicle_type" text not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."transporters" enable row level security;

create table "public"."user_notifications" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "notification_type" text not null,
    "title" text not null,
    "message" text not null,
    "data" jsonb,
    "read" boolean default false,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."user_notifications" enable row level security;

alter table "public"."animal_health" drop column "created_at";

alter table "public"."animal_health" drop column "next_checkup";

alter table "public"."animal_health" drop column "treatment_date";

alter table "public"."animal_health" drop column "updated_at";

alter table "public"."animal_health" drop column "user_id";

alter table "public"."animal_health" drop column "vaccination_record";

alter table "public"."animal_health" drop column "veterinarian_notes";

alter table "public"."animal_health" add column "notes" text;

alter table "public"."animal_health" add column "recorded_at" timestamp with time zone default now();

alter table "public"."animal_health" disable row level security;

alter table "public"."animal_records" drop column "notes";

alter table "public"."animal_records" drop column "record_data";

alter table "public"."animal_records" drop column "updated_at";

alter table "public"."animal_records" drop column "user_id";

alter table "public"."animal_records" add column "description" text;

alter table "public"."animal_records" add column "record_date" date not null;

alter table "public"."animal_sales" drop column "buyer_name";

alter table "public"."animal_sales" drop column "payment_status";

alter table "public"."animal_sales" drop column "sale_price";

alter table "public"."animal_sales" drop column "updated_at";

alter table "public"."animal_sales" drop column "user_id";

alter table "public"."animal_sales" add column "buyer" text;

alter table "public"."animal_sales" add column "price" numeric;

alter table "public"."animal_sales" disable row level security;

alter table "public"."animals" drop column "age_months";

alter table "public"."animals" drop column "animal_type";

alter table "public"."animals" drop column "current_value";

alter table "public"."animals" drop column "health_status";

alter table "public"."animals" drop column "identification_number";

alter table "public"."animals" drop column "is_active";

alter table "public"."animals" drop column "location";

alter table "public"."animals" drop column "purchase_date";

alter table "public"."animals" drop column "purchase_price";

alter table "public"."animals" drop column "updated_at";

alter table "public"."animals" drop column "weight_kg";

alter table "public"."animals" add column "acquisition_date" date;

alter table "public"."animals" add column "birth_date" date;

alter table "public"."animals" add column "name" text not null;

alter table "public"."animals" add column "species" text not null;

alter table "public"."animals" add column "status" text default 'active'::text;

alter table "public"."animals" alter column "created_at" drop not null;

alter table "public"."city_market_products" add column "category" text default 'standard'::text;

alter table "public"."city_market_products" add column "posted_at" timestamp with time zone default now();

alter table "public"."city_market_products" add column "status" text default 'fresh'::text;

alter table "public"."city_market_products" add column "updated_at" timestamp with time zone default now();

alter table "public"."equipment" enable row level security;

alter table "public"."export_opportunities" add column "opportunity_type" text default 'buy'::text;

alter table "public"."export_orders" enable row level security;

alter table "public"."farm_budgets" enable row level security;

alter table "public"."farm_input_orders" drop column "status";

alter table "public"."farm_input_product_bookmarks" enable row level security;

alter table "public"."farm_input_product_likes" enable row level security;

alter table "public"."farm_input_product_ratings" enable row level security;

alter table "public"."farm_input_supplier_likes" enable row level security;

alter table "public"."farm_input_supplier_ratings" enable row level security;

alter table "public"."farmer_contract_networks" enable row level security;

alter table "public"."feature_requests" add column "is_public" boolean not null default false;

alter table "public"."feature_requests" add column "user_id" uuid;

alter table "public"."feature_requests" enable row level security;

alter table "public"."inventory_items" drop column "cost_per_unit";

alter table "public"."inventory_items" drop column "location";

alter table "public"."inventory_items" drop column "notes";

alter table "public"."inventory_items" drop column "supplier";

alter table "public"."inventory_items" add column "minimum_stock" numeric(10,2) default 0;

alter table "public"."inventory_items" add column "status" text default 'normal'::text;

alter table "public"."inventory_items" add column "supplier_name" text;

alter table "public"."inventory_items" add column "unit_price" numeric(10,2) not null;

alter table "public"."inventory_items" add column "total_value" numeric(10,2) generated always as ((quantity * unit_price)) stored;

alter table "public"."inventory_items" alter column "created_at" set not null;

alter table "public"."inventory_items" alter column "quantity" drop default;

alter table "public"."inventory_items" alter column "quantity" set data type numeric(10,2) using "quantity"::numeric(10,2);

alter table "public"."inventory_items" alter column "updated_at" set not null;

alter table "public"."invitations" enable row level security;

alter table "public"."market_details" add column "contact_email" text;

alter table "public"."market_details" add column "contact_phone" text;

alter table "public"."market_details" add column "county_code" text not null;

alter table "public"."market_details" add column "is_active" boolean default true;

alter table "public"."market_details" add column "latitude" numeric(10,7);

alter table "public"."market_details" add column "longitude" numeric(10,7);

alter table "public"."market_details" add column "market_size" text;

alter table "public"."market_details" alter column "city" set not null;

alter table "public"."market_details" enable row level security;

alter table "public"."mentorship_sessions" enable row level security;

alter table "public"."notifications" add column "related_id" uuid;

alter table "public"."price_comparisons" enable row level security;

alter table "public"."profiles" alter column "created_at" set not null;

alter table "public"."profiles" alter column "updated_at" set not null;

alter table "public"."timeline_events" enable row level security;

alter table "public"."tracking_events" enable row level security;

alter table "public"."transporter_bookings" enable row level security;

alter table "public"."transporter_recommendations" enable row level security;

alter sequence "public"."admin_action_logs_id_seq" owned by "public"."admin_action_logs"."id";

CREATE UNIQUE INDEX admin_action_logs_pkey ON public.admin_action_logs USING btree (id);

CREATE UNIQUE INDEX batch_tracking_pkey ON public.batch_tracking USING btree (batch_id);

CREATE UNIQUE INDEX bulk_order_bids_pkey ON public.bulk_order_bids USING btree (id);

CREATE UNIQUE INDEX bulk_orders_pkey ON public.bulk_orders USING btree (id);

CREATE UNIQUE INDEX business_advertisements_pkey ON public.business_advertisements USING btree (id);

CREATE UNIQUE INDEX business_matches_pkey ON public.business_matches USING btree (id);

CREATE UNIQUE INDEX carbon_forum_posts_pkey ON public.carbon_forum_posts USING btree (id);

CREATE UNIQUE INDEX city_market_donations_pkey ON public.city_market_donations USING btree (id);

CREATE UNIQUE INDEX contract_applications_contract_id_farmer_id_key ON public.contract_applications USING btree (contract_id, farmer_id);

CREATE UNIQUE INDEX contract_applications_pkey ON public.contract_applications USING btree (id);

CREATE UNIQUE INDEX contract_comments_pkey ON public.contract_comments USING btree (id);

CREATE UNIQUE INDEX contract_documents_pkey ON public.contract_documents USING btree (id);

CREATE UNIQUE INDEX contract_farming_opportunities_pkey ON public.contract_farming_opportunities USING btree (id);

CREATE UNIQUE INDEX contract_flags_pkey ON public.contract_flags USING btree (id);

CREATE UNIQUE INDEX contract_reviews_contract_id_user_id_key ON public.contract_reviews USING btree (contract_id, user_id);

CREATE UNIQUE INDEX contract_reviews_pkey ON public.contract_reviews USING btree (id);

CREATE UNIQUE INDEX contract_social_shares_pkey ON public.contract_social_shares USING btree (id);

CREATE UNIQUE INDEX crop_yields_pkey ON public.crop_yields USING btree (id);

CREATE UNIQUE INDEX data_fetch_logs_pkey ON public.data_fetch_logs USING btree (id);

CREATE UNIQUE INDEX financial_transactions_pkey ON public.financial_transactions USING btree (id);

CREATE UNIQUE INDEX food_rescue_listings_pkey ON public.food_rescue_listings USING btree (id);

CREATE INDEX idx_bulk_orders_buyer_id ON public.bulk_orders USING btree (buyer_id);

CREATE INDEX idx_city_market_products_category ON public.city_market_products USING btree (category);

CREATE INDEX idx_contract_applications_contract_id ON public.contract_applications USING btree (contract_id);

CREATE INDEX idx_contract_applications_farmer_id ON public.contract_applications USING btree (farmer_id);

CREATE INDEX idx_contract_applications_status ON public.contract_applications USING btree (status);

CREATE INDEX idx_contract_comments_contract_id ON public.contract_comments USING btree (contract_id);

CREATE INDEX idx_contract_comments_parent_id ON public.contract_comments USING btree (parent_id);

CREATE INDEX idx_contract_comments_user_id ON public.contract_comments USING btree (user_id);

CREATE INDEX idx_contract_farming_opportunities_created_by ON public.contract_farming_opportunities USING btree (created_by);

CREATE INDEX idx_contract_farming_opportunities_crop_type ON public.contract_farming_opportunities USING btree (crop_type);

CREATE INDEX idx_contract_farming_opportunities_expires_at ON public.contract_farming_opportunities USING btree (expires_at);

CREATE INDEX idx_contract_farming_opportunities_location ON public.contract_farming_opportunities USING btree (location);

CREATE INDEX idx_contract_farming_opportunities_status ON public.contract_farming_opportunities USING btree (status);

CREATE INDEX idx_contract_reviews_contract_id ON public.contract_reviews USING btree (contract_id);

CREATE INDEX idx_contract_reviews_rating ON public.contract_reviews USING btree (rating);

CREATE INDEX idx_contract_reviews_user_id ON public.contract_reviews USING btree (user_id);

CREATE INDEX idx_export_opportunities_type_status ON public.export_opportunities USING btree (opportunity_type, status);

CREATE INDEX idx_feature_requests_user_id ON public.feature_requests USING btree (user_id);

CREATE INDEX idx_kilimo_stats_category ON public.kilimo_statistics USING btree (category);

CREATE INDEX idx_kilimo_stats_county ON public.kilimo_statistics USING btree (county);

CREATE INDEX idx_kilimo_stats_fetch_date ON public.kilimo_statistics USING btree (fetch_date);

CREATE INDEX idx_livestock_for_sale_breed ON public.livestock_for_sale USING btree (breed);

CREATE INDEX idx_livestock_for_sale_is_halal ON public.livestock_for_sale USING btree (is_halal);

CREATE INDEX idx_livestock_for_sale_market_id ON public.livestock_for_sale USING btree (market_id);

CREATE INDEX idx_livestock_for_sale_seller_id ON public.livestock_for_sale USING btree (seller_id);

CREATE INDEX idx_livestock_for_sale_status ON public.livestock_for_sale USING btree (status);

CREATE INDEX idx_livestock_for_sale_type ON public.livestock_for_sale USING btree (type);

CREATE INDEX idx_market_details_county_code ON public.market_details USING btree (county_code);

CREATE INDEX idx_market_details_market_type ON public.market_details USING btree (market_type);

CREATE INDEX idx_market_forecasts_commodity ON public.market_forecasts USING btree (commodity_name);

CREATE INDEX idx_market_forecasts_county ON public.market_forecasts USING btree (county);

CREATE INDEX idx_market_sentiment_commodity ON public.market_sentiment USING btree (commodity_name);

CREATE INDEX idx_market_sentiment_county ON public.market_sentiment USING btree (county);

CREATE INDEX idx_processing_matches_bulk_order_id ON public.processing_matches USING btree (bulk_order_id);

CREATE UNIQUE INDEX impact_metrics_pkey ON public.impact_metrics USING btree (id);

CREATE UNIQUE INDEX input_group_orders_pkey ON public.input_group_orders USING btree (id);

CREATE UNIQUE INDEX input_prices_pkey ON public.input_prices USING btree (id);

CREATE UNIQUE INDEX input_pricing_pkey ON public.input_pricing USING btree (id);

CREATE UNIQUE INDEX input_reviews_pkey ON public.input_reviews USING btree (id);

CREATE UNIQUE INDEX input_supplier_reviews_pkey ON public.input_supplier_reviews USING btree (id);

CREATE UNIQUE INDEX input_verifications_pkey ON public.input_verifications USING btree (id);

CREATE UNIQUE INDEX kilimo_statistics_pkey ON public.kilimo_statistics USING btree (id);

CREATE UNIQUE INDEX livestock_breeds_pkey ON public.livestock_breeds USING btree (id);

CREATE UNIQUE INDEX livestock_for_sale_pkey ON public.livestock_for_sale USING btree (id);

CREATE UNIQUE INDEX livestock_listings_pkey ON public.livestock_listings USING btree (id);

CREATE UNIQUE INDEX livestock_markets_pkey ON public.livestock_markets USING btree (id);

CREATE UNIQUE INDEX market_details_market_name_key ON public.market_details USING btree (market_name);

CREATE UNIQUE INDEX market_forecasts_pkey ON public.market_forecasts USING btree (id);

CREATE UNIQUE INDEX market_sentiment_pkey ON public.market_sentiment USING btree (id);

CREATE UNIQUE INDEX mentorships_pkey ON public.mentorships USING btree (id);

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

CREATE UNIQUE INDEX network_events_pkey ON public.network_events USING btree (id);

CREATE UNIQUE INDEX notification_preferences_pkey ON public.notification_preferences USING btree (id);

CREATE UNIQUE INDEX notification_preferences_user_id_notification_type_key ON public.notification_preferences USING btree (user_id, notification_type);

CREATE UNIQUE INDEX partner_events_pkey ON public.partner_events USING btree (id);

CREATE UNIQUE INDEX partners_pkey ON public.partners USING btree (id);

CREATE UNIQUE INDEX partnerships_pkey ON public.partnerships USING btree (id);

CREATE UNIQUE INDEX payment_transactions_pkey ON public.payment_transactions USING btree (id);

CREATE UNIQUE INDEX processing_matches_pkey ON public.processing_matches USING btree (id);

CREATE UNIQUE INDEX recipients_pkey ON public.recipients USING btree (id);

CREATE UNIQUE INDEX rescue_matches_pkey ON public.rescue_matches USING btree (id);

CREATE UNIQUE INDEX research_requests_pkey ON public.research_requests USING btree (id);

CREATE UNIQUE INDEX service_provider_categories_name_key ON public.service_provider_categories USING btree (name);

CREATE UNIQUE INDEX service_provider_categories_pkey ON public.service_provider_categories USING btree (id);

CREATE UNIQUE INDEX subscription_box_deliveries_pkey ON public.subscription_box_deliveries USING btree (id);

CREATE UNIQUE INDEX subscription_boxes_pkey ON public.subscription_boxes USING btree (id);

CREATE UNIQUE INDEX transporters_pkey ON public.transporters USING btree (id);

CREATE UNIQUE INDEX unique_metric_name ON public.impact_metrics USING btree (metric_name);

CREATE UNIQUE INDEX user_notifications_pkey ON public.user_notifications USING btree (id);

alter table "public"."admin_action_logs" add constraint "admin_action_logs_pkey" PRIMARY KEY using index "admin_action_logs_pkey";

alter table "public"."batch_tracking" add constraint "batch_tracking_pkey" PRIMARY KEY using index "batch_tracking_pkey";

alter table "public"."bulk_order_bids" add constraint "bulk_order_bids_pkey" PRIMARY KEY using index "bulk_order_bids_pkey";

alter table "public"."bulk_orders" add constraint "bulk_orders_pkey" PRIMARY KEY using index "bulk_orders_pkey";

alter table "public"."business_advertisements" add constraint "business_advertisements_pkey" PRIMARY KEY using index "business_advertisements_pkey";

alter table "public"."business_matches" add constraint "business_matches_pkey" PRIMARY KEY using index "business_matches_pkey";

alter table "public"."carbon_forum_posts" add constraint "carbon_forum_posts_pkey" PRIMARY KEY using index "carbon_forum_posts_pkey";

alter table "public"."city_market_donations" add constraint "city_market_donations_pkey" PRIMARY KEY using index "city_market_donations_pkey";

alter table "public"."contract_applications" add constraint "contract_applications_pkey" PRIMARY KEY using index "contract_applications_pkey";

alter table "public"."contract_comments" add constraint "contract_comments_pkey" PRIMARY KEY using index "contract_comments_pkey";

alter table "public"."contract_documents" add constraint "contract_documents_pkey" PRIMARY KEY using index "contract_documents_pkey";

alter table "public"."contract_farming_opportunities" add constraint "contract_farming_opportunities_pkey" PRIMARY KEY using index "contract_farming_opportunities_pkey";

alter table "public"."contract_flags" add constraint "contract_flags_pkey" PRIMARY KEY using index "contract_flags_pkey";

alter table "public"."contract_reviews" add constraint "contract_reviews_pkey" PRIMARY KEY using index "contract_reviews_pkey";

alter table "public"."contract_social_shares" add constraint "contract_social_shares_pkey" PRIMARY KEY using index "contract_social_shares_pkey";

alter table "public"."crop_yields" add constraint "crop_yields_pkey" PRIMARY KEY using index "crop_yields_pkey";

alter table "public"."data_fetch_logs" add constraint "data_fetch_logs_pkey" PRIMARY KEY using index "data_fetch_logs_pkey";

alter table "public"."financial_transactions" add constraint "financial_transactions_pkey" PRIMARY KEY using index "financial_transactions_pkey";

alter table "public"."food_rescue_listings" add constraint "food_rescue_listings_pkey" PRIMARY KEY using index "food_rescue_listings_pkey";

alter table "public"."impact_metrics" add constraint "impact_metrics_pkey" PRIMARY KEY using index "impact_metrics_pkey";

alter table "public"."input_group_orders" add constraint "input_group_orders_pkey" PRIMARY KEY using index "input_group_orders_pkey";

alter table "public"."input_prices" add constraint "input_prices_pkey" PRIMARY KEY using index "input_prices_pkey";

alter table "public"."input_pricing" add constraint "input_pricing_pkey" PRIMARY KEY using index "input_pricing_pkey";

alter table "public"."input_reviews" add constraint "input_reviews_pkey" PRIMARY KEY using index "input_reviews_pkey";

alter table "public"."input_supplier_reviews" add constraint "input_supplier_reviews_pkey" PRIMARY KEY using index "input_supplier_reviews_pkey";

alter table "public"."input_verifications" add constraint "input_verifications_pkey" PRIMARY KEY using index "input_verifications_pkey";

alter table "public"."kilimo_statistics" add constraint "kilimo_statistics_pkey" PRIMARY KEY using index "kilimo_statistics_pkey";

alter table "public"."livestock_breeds" add constraint "livestock_breeds_pkey" PRIMARY KEY using index "livestock_breeds_pkey";

alter table "public"."livestock_for_sale" add constraint "livestock_for_sale_pkey" PRIMARY KEY using index "livestock_for_sale_pkey";

alter table "public"."livestock_listings" add constraint "livestock_listings_pkey" PRIMARY KEY using index "livestock_listings_pkey";

alter table "public"."livestock_markets" add constraint "livestock_markets_pkey" PRIMARY KEY using index "livestock_markets_pkey";

alter table "public"."market_forecasts" add constraint "market_forecasts_pkey" PRIMARY KEY using index "market_forecasts_pkey";

alter table "public"."market_sentiment" add constraint "market_sentiment_pkey" PRIMARY KEY using index "market_sentiment_pkey";

alter table "public"."mentorships" add constraint "mentorships_pkey" PRIMARY KEY using index "mentorships_pkey";

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."network_events" add constraint "network_events_pkey" PRIMARY KEY using index "network_events_pkey";

alter table "public"."notification_preferences" add constraint "notification_preferences_pkey" PRIMARY KEY using index "notification_preferences_pkey";

alter table "public"."partner_events" add constraint "partner_events_pkey" PRIMARY KEY using index "partner_events_pkey";

alter table "public"."partners" add constraint "partners_pkey" PRIMARY KEY using index "partners_pkey";

alter table "public"."partnerships" add constraint "partnerships_pkey" PRIMARY KEY using index "partnerships_pkey";

alter table "public"."payment_transactions" add constraint "payment_transactions_pkey" PRIMARY KEY using index "payment_transactions_pkey";

alter table "public"."processing_matches" add constraint "processing_matches_pkey" PRIMARY KEY using index "processing_matches_pkey";

alter table "public"."recipients" add constraint "recipients_pkey" PRIMARY KEY using index "recipients_pkey";

alter table "public"."rescue_matches" add constraint "rescue_matches_pkey" PRIMARY KEY using index "rescue_matches_pkey";

alter table "public"."research_requests" add constraint "research_requests_pkey" PRIMARY KEY using index "research_requests_pkey";

alter table "public"."service_provider_categories" add constraint "service_provider_categories_pkey" PRIMARY KEY using index "service_provider_categories_pkey";

alter table "public"."subscription_box_deliveries" add constraint "subscription_box_deliveries_pkey" PRIMARY KEY using index "subscription_box_deliveries_pkey";

alter table "public"."subscription_boxes" add constraint "subscription_boxes_pkey" PRIMARY KEY using index "subscription_boxes_pkey";

alter table "public"."transporters" add constraint "transporters_pkey" PRIMARY KEY using index "transporters_pkey";

alter table "public"."user_notifications" add constraint "user_notifications_pkey" PRIMARY KEY using index "user_notifications_pkey";

alter table "public"."admin_action_logs" add constraint "admin_action_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."admin_action_logs" validate constraint "admin_action_logs_user_id_fkey";

alter table "public"."batch_tracking" add constraint "batch_tracking_farmer_id_fkey" FOREIGN KEY (farmer_id) REFERENCES agents(id) not valid;

alter table "public"."batch_tracking" validate constraint "batch_tracking_farmer_id_fkey";

alter table "public"."bulk_order_bids" add constraint "bulk_order_bids_farmer_id_fkey" FOREIGN KEY (farmer_id) REFERENCES agents(id) not valid;

alter table "public"."bulk_order_bids" validate constraint "bulk_order_bids_farmer_id_fkey";

alter table "public"."bulk_order_bids" add constraint "bulk_order_bids_order_id_fkey" FOREIGN KEY (order_id) REFERENCES bulk_orders(id) not valid;

alter table "public"."bulk_order_bids" validate constraint "bulk_order_bids_order_id_fkey";

alter table "public"."bulk_orders" add constraint "bulk_orders_buyer_id_fkey" FOREIGN KEY (buyer_id) REFERENCES agents(id) not valid;

alter table "public"."bulk_orders" validate constraint "bulk_orders_buyer_id_fkey";

alter table "public"."business_advertisements" add constraint "business_advertisements_payment_status_check" CHECK ((payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'expired'::text]))) not valid;

alter table "public"."business_advertisements" validate constraint "business_advertisements_payment_status_check";

alter table "public"."business_advertisements" add constraint "business_advertisements_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."business_advertisements" validate constraint "business_advertisements_user_id_fkey";

alter table "public"."city_market_donations" add constraint "city_market_donations_agent_id_fkey" FOREIGN KEY (agent_id) REFERENCES agents(id) not valid;

alter table "public"."city_market_donations" validate constraint "city_market_donations_agent_id_fkey";

alter table "public"."city_market_donations" add constraint "city_market_donations_home_id_fkey" FOREIGN KEY (home_id) REFERENCES recipients(id) not valid;

alter table "public"."city_market_donations" validate constraint "city_market_donations_home_id_fkey";

alter table "public"."city_market_donations" add constraint "city_market_donations_product_id_fkey" FOREIGN KEY (product_id) REFERENCES city_market_products(id) not valid;

alter table "public"."city_market_donations" validate constraint "city_market_donations_product_id_fkey";

alter table "public"."city_market_donations" add constraint "city_market_donations_recipient_type_check" CHECK ((recipient_type = ANY (ARRAY['school'::text, 'CBO'::text, 'hospital'::text, 'church'::text, 'hospice'::text]))) not valid;

alter table "public"."city_market_donations" validate constraint "city_market_donations_recipient_type_check";

alter table "public"."contract_applications" add constraint "contract_applications_contract_id_farmer_id_key" UNIQUE using index "contract_applications_contract_id_farmer_id_key";

alter table "public"."contract_applications" add constraint "contract_applications_contract_id_fkey" FOREIGN KEY (contract_id) REFERENCES contract_farming_opportunities(id) ON DELETE CASCADE not valid;

alter table "public"."contract_applications" validate constraint "contract_applications_contract_id_fkey";

alter table "public"."contract_applications" add constraint "contract_applications_farmer_id_fkey" FOREIGN KEY (farmer_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."contract_applications" validate constraint "contract_applications_farmer_id_fkey";

alter table "public"."contract_applications" add constraint "contract_applications_reviewed_by_fkey" FOREIGN KEY (reviewed_by) REFERENCES auth.users(id) not valid;

alter table "public"."contract_applications" validate constraint "contract_applications_reviewed_by_fkey";

alter table "public"."contract_applications" add constraint "contract_applications_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'withdrawn'::text]))) not valid;

alter table "public"."contract_applications" validate constraint "contract_applications_status_check";

alter table "public"."contract_comments" add constraint "contract_comments_contract_id_fkey" FOREIGN KEY (contract_id) REFERENCES contract_farming_opportunities(id) ON DELETE CASCADE not valid;

alter table "public"."contract_comments" validate constraint "contract_comments_contract_id_fkey";

alter table "public"."contract_comments" add constraint "contract_comments_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES contract_comments(id) ON DELETE CASCADE not valid;

alter table "public"."contract_comments" validate constraint "contract_comments_parent_id_fkey";

alter table "public"."contract_comments" add constraint "contract_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."contract_comments" validate constraint "contract_comments_user_id_fkey";

alter table "public"."contract_documents" add constraint "contract_documents_contract_id_fkey" FOREIGN KEY (contract_id) REFERENCES contract_farming_opportunities(id) ON DELETE CASCADE not valid;

alter table "public"."contract_documents" validate constraint "contract_documents_contract_id_fkey";

alter table "public"."contract_documents" add constraint "contract_documents_uploaded_by_fkey" FOREIGN KEY (uploaded_by) REFERENCES auth.users(id) not valid;

alter table "public"."contract_documents" validate constraint "contract_documents_uploaded_by_fkey";

alter table "public"."contract_farming_opportunities" add constraint "contract_farming_opportunities_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."contract_farming_opportunities" validate constraint "contract_farming_opportunities_created_by_fkey";

alter table "public"."contract_farming_opportunities" add constraint "contract_farming_opportunities_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'completed'::text, 'cancelled'::text]))) not valid;

alter table "public"."contract_farming_opportunities" validate constraint "contract_farming_opportunities_status_check";

alter table "public"."contract_flags" add constraint "contract_flags_contract_id_fkey" FOREIGN KEY (contract_id) REFERENCES contract_farming_opportunities(id) ON DELETE CASCADE not valid;

alter table "public"."contract_flags" validate constraint "contract_flags_contract_id_fkey";

alter table "public"."contract_flags" add constraint "contract_flags_reviewed_by_fkey" FOREIGN KEY (reviewed_by) REFERENCES auth.users(id) not valid;

alter table "public"."contract_flags" validate constraint "contract_flags_reviewed_by_fkey";

alter table "public"."contract_flags" add constraint "contract_flags_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'reviewed'::text, 'resolved'::text, 'dismissed'::text]))) not valid;

alter table "public"."contract_flags" validate constraint "contract_flags_status_check";

alter table "public"."contract_flags" add constraint "contract_flags_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."contract_flags" validate constraint "contract_flags_user_id_fkey";

alter table "public"."contract_reviews" add constraint "contract_reviews_contract_id_fkey" FOREIGN KEY (contract_id) REFERENCES contract_farming_opportunities(id) ON DELETE CASCADE not valid;

alter table "public"."contract_reviews" validate constraint "contract_reviews_contract_id_fkey";

alter table "public"."contract_reviews" add constraint "contract_reviews_contract_id_user_id_key" UNIQUE using index "contract_reviews_contract_id_user_id_key";

alter table "public"."contract_reviews" add constraint "contract_reviews_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."contract_reviews" validate constraint "contract_reviews_rating_check";

alter table "public"."contract_reviews" add constraint "contract_reviews_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."contract_reviews" validate constraint "contract_reviews_user_id_fkey";

alter table "public"."contract_social_shares" add constraint "contract_social_shares_contract_id_fkey" FOREIGN KEY (contract_id) REFERENCES contract_farming_opportunities(id) ON DELETE CASCADE not valid;

alter table "public"."contract_social_shares" validate constraint "contract_social_shares_contract_id_fkey";

alter table "public"."contract_social_shares" add constraint "contract_social_shares_platform_check" CHECK ((platform = ANY (ARRAY['facebook'::text, 'twitter'::text, 'whatsapp'::text, 'linkedin'::text, 'email'::text, 'other'::text]))) not valid;

alter table "public"."contract_social_shares" validate constraint "contract_social_shares_platform_check";

alter table "public"."contract_social_shares" add constraint "contract_social_shares_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."contract_social_shares" validate constraint "contract_social_shares_user_id_fkey";

alter table "public"."crop_yields" add constraint "crop_yields_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."crop_yields" validate constraint "crop_yields_user_id_fkey";

alter table "public"."export_opportunities" add constraint "export_opportunities_opportunity_type_check" CHECK ((opportunity_type = ANY (ARRAY['buy'::text, 'sell'::text]))) not valid;

alter table "public"."export_opportunities" validate constraint "export_opportunities_opportunity_type_check";

alter table "public"."feature_requests" add constraint "feature_requests_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."feature_requests" validate constraint "feature_requests_user_id_fkey";

alter table "public"."financial_transactions" add constraint "financial_transactions_transaction_type_check" CHECK ((transaction_type = ANY (ARRAY['income'::text, 'expense'::text]))) not valid;

alter table "public"."financial_transactions" validate constraint "financial_transactions_transaction_type_check";

alter table "public"."financial_transactions" add constraint "financial_transactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."financial_transactions" validate constraint "financial_transactions_user_id_fkey";

alter table "public"."impact_metrics" add constraint "unique_metric_name" UNIQUE using index "unique_metric_name";

alter table "public"."input_group_orders" add constraint "input_group_orders_farmer_id_fkey" FOREIGN KEY (farmer_id) REFERENCES agents(id) not valid;

alter table "public"."input_group_orders" validate constraint "input_group_orders_farmer_id_fkey";

alter table "public"."input_group_orders" add constraint "input_group_orders_supplier_id_fkey" FOREIGN KEY (supplier_id) REFERENCES agents(id) not valid;

alter table "public"."input_group_orders" validate constraint "input_group_orders_supplier_id_fkey";

alter table "public"."input_prices" add constraint "input_prices_reported_by_fkey" FOREIGN KEY (reported_by) REFERENCES agents(id) not valid;

alter table "public"."input_prices" validate constraint "input_prices_reported_by_fkey";

alter table "public"."input_reviews" add constraint "input_reviews_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."input_reviews" validate constraint "input_reviews_rating_check";

alter table "public"."input_supplier_reviews" add constraint "input_supplier_reviews_supplier_id_fkey" FOREIGN KEY (supplier_id) REFERENCES agents(id) not valid;

alter table "public"."input_supplier_reviews" validate constraint "input_supplier_reviews_supplier_id_fkey";

alter table "public"."inventory_items" add constraint "inventory_items_status_check" CHECK ((status = ANY (ARRAY['normal'::text, 'warning'::text, 'critical'::text]))) not valid;

alter table "public"."inventory_items" validate constraint "inventory_items_status_check";

alter table "public"."inventory_items" add constraint "inventory_items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."inventory_items" validate constraint "inventory_items_user_id_fkey";

alter table "public"."livestock_for_sale" add constraint "livestock_for_sale_market_id_fkey" FOREIGN KEY (market_id) REFERENCES livestock_markets(id) ON DELETE SET NULL not valid;

alter table "public"."livestock_for_sale" validate constraint "livestock_for_sale_market_id_fkey";

alter table "public"."livestock_for_sale" add constraint "livestock_for_sale_seller_id_fkey" FOREIGN KEY (seller_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."livestock_for_sale" validate constraint "livestock_for_sale_seller_id_fkey";

alter table "public"."livestock_listings" add constraint "livestock_listings_seller_id_fkey" FOREIGN KEY (seller_id) REFERENCES auth.users(id) not valid;

alter table "public"."livestock_listings" validate constraint "livestock_listings_seller_id_fkey";

alter table "public"."market_details" add constraint "market_details_market_name_key" UNIQUE using index "market_details_market_name_key";

alter table "public"."messages" add constraint "messages_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES auth.users(id) not valid;

alter table "public"."messages" validate constraint "messages_sender_id_fkey";

alter table "public"."notification_preferences" add constraint "notification_preferences_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."notification_preferences" validate constraint "notification_preferences_user_id_fkey";

alter table "public"."notification_preferences" add constraint "notification_preferences_user_id_notification_type_key" UNIQUE using index "notification_preferences_user_id_notification_type_key";

alter table "public"."partner_events" add constraint "partner_events_partner_id_fkey" FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE not valid;

alter table "public"."partner_events" validate constraint "partner_events_partner_id_fkey";

alter table "public"."partners" add constraint "partners_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."partners" validate constraint "partners_user_id_fkey";

alter table "public"."payment_transactions" add constraint "payment_transactions_advertisement_id_fkey" FOREIGN KEY (advertisement_id) REFERENCES business_advertisements(id) ON DELETE CASCADE not valid;

alter table "public"."payment_transactions" validate constraint "payment_transactions_advertisement_id_fkey";

alter table "public"."payment_transactions" add constraint "payment_transactions_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'refunded'::text]))) not valid;

alter table "public"."payment_transactions" validate constraint "payment_transactions_status_check";

alter table "public"."payment_transactions" add constraint "payment_transactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."payment_transactions" validate constraint "payment_transactions_user_id_fkey";

alter table "public"."processing_matches" add constraint "processing_matches_bulk_order_id_fkey" FOREIGN KEY (bulk_order_id) REFERENCES bulk_orders(id) not valid;

alter table "public"."processing_matches" validate constraint "processing_matches_bulk_order_id_fkey";

alter table "public"."rescue_matches" add constraint "rescue_matches_listing_id_fkey" FOREIGN KEY (listing_id) REFERENCES food_rescue_listings(id) not valid;

alter table "public"."rescue_matches" validate constraint "rescue_matches_listing_id_fkey";

alter table "public"."service_provider_categories" add constraint "service_provider_categories_name_key" UNIQUE using index "service_provider_categories_name_key";

alter table "public"."subscription_box_deliveries" add constraint "subscription_box_deliveries_box_id_fkey" FOREIGN KEY (box_id) REFERENCES subscription_boxes(id) not valid;

alter table "public"."subscription_box_deliveries" validate constraint "subscription_box_deliveries_box_id_fkey";

alter table "public"."subscription_boxes" add constraint "subscription_boxes_farmer_id_fkey" FOREIGN KEY (farmer_id) REFERENCES agents(id) not valid;

alter table "public"."subscription_boxes" validate constraint "subscription_boxes_farmer_id_fkey";

alter table "public"."transporters" add constraint "transporters_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."transporters" validate constraint "transporters_user_id_fkey";

alter table "public"."user_notifications" add constraint "user_notifications_notification_type_check" CHECK ((notification_type = ANY (ARRAY['price_alert'::text, 'weather_alert'::text, 'purchase_request'::text, 'comment_reply'::text, 'system_notification'::text]))) not valid;

alter table "public"."user_notifications" validate constraint "user_notifications_notification_type_check";

alter table "public"."user_notifications" add constraint "user_notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_notifications" validate constraint "user_notifications_user_id_fkey";

alter table "public"."animals" add constraint "animals_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."animals" validate constraint "animals_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."transport_requests" add constraint "transport_requests_transporter_id_fkey" FOREIGN KEY (transporter_id) REFERENCES transporters(id) ON DELETE SET NULL not valid;

alter table "public"."transport_requests" validate constraint "transport_requests_transporter_id_fkey";

set check_function_bodies = off;

create or replace view "public"."app_market_selection" as  SELECT market_details.id,
    market_details.market_name,
    market_details.city
   FROM market_details
  WHERE (market_details.is_active = true);


CREATE OR REPLACE FUNCTION public.calculate_platform_yield_improvement()
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    -- Your existing function logic here
    -- Example placeholder:
    RETURN 0.0;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_livestock_market_stats(p_market_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
    -- Function logic here
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.log_admin_action()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.set_feature_request_user_id()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    -- Automatically set user_id to the current authenticated user
    NEW.user_id = auth.uid();
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
    -- Function logic here
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_city_market_products_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_modified_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW; 
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_total_registered_farmers()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    -- Preserve the original function logic
    -- You'll need to replace this with the actual implementation
    RAISE NOTICE 'Function updated with fixed search path';
END;
$function$
;

CREATE OR REPLACE FUNCTION public.user_has_role(required_role text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE 
    current_user_role text;
BEGIN
    current_user_role := current_setting('request.jwt.claims.app_metadata', true);
    RETURN (current_user_role::jsonb->>'role')::text = required_role;
EXCEPTION 
    WHEN others THEN 
        RETURN false;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_rate_limit(p_user_id uuid, p_subscription_type text, p_time_window interval DEFAULT '00:01:00'::interval)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.validate_api_key(p_key_hash text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$
;

grant delete on table "public"."admin_action_logs" to "anon";

grant insert on table "public"."admin_action_logs" to "anon";

grant references on table "public"."admin_action_logs" to "anon";

grant select on table "public"."admin_action_logs" to "anon";

grant trigger on table "public"."admin_action_logs" to "anon";

grant truncate on table "public"."admin_action_logs" to "anon";

grant update on table "public"."admin_action_logs" to "anon";

grant delete on table "public"."admin_action_logs" to "authenticated";

grant insert on table "public"."admin_action_logs" to "authenticated";

grant references on table "public"."admin_action_logs" to "authenticated";

grant select on table "public"."admin_action_logs" to "authenticated";

grant trigger on table "public"."admin_action_logs" to "authenticated";

grant truncate on table "public"."admin_action_logs" to "authenticated";

grant update on table "public"."admin_action_logs" to "authenticated";

grant delete on table "public"."admin_action_logs" to "service_role";

grant insert on table "public"."admin_action_logs" to "service_role";

grant references on table "public"."admin_action_logs" to "service_role";

grant select on table "public"."admin_action_logs" to "service_role";

grant trigger on table "public"."admin_action_logs" to "service_role";

grant truncate on table "public"."admin_action_logs" to "service_role";

grant update on table "public"."admin_action_logs" to "service_role";

grant delete on table "public"."batch_tracking" to "anon";

grant insert on table "public"."batch_tracking" to "anon";

grant references on table "public"."batch_tracking" to "anon";

grant select on table "public"."batch_tracking" to "anon";

grant trigger on table "public"."batch_tracking" to "anon";

grant truncate on table "public"."batch_tracking" to "anon";

grant update on table "public"."batch_tracking" to "anon";

grant delete on table "public"."batch_tracking" to "authenticated";

grant insert on table "public"."batch_tracking" to "authenticated";

grant references on table "public"."batch_tracking" to "authenticated";

grant select on table "public"."batch_tracking" to "authenticated";

grant trigger on table "public"."batch_tracking" to "authenticated";

grant truncate on table "public"."batch_tracking" to "authenticated";

grant update on table "public"."batch_tracking" to "authenticated";

grant delete on table "public"."batch_tracking" to "service_role";

grant insert on table "public"."batch_tracking" to "service_role";

grant references on table "public"."batch_tracking" to "service_role";

grant select on table "public"."batch_tracking" to "service_role";

grant trigger on table "public"."batch_tracking" to "service_role";

grant truncate on table "public"."batch_tracking" to "service_role";

grant update on table "public"."batch_tracking" to "service_role";

grant delete on table "public"."bulk_order_bids" to "anon";

grant insert on table "public"."bulk_order_bids" to "anon";

grant references on table "public"."bulk_order_bids" to "anon";

grant select on table "public"."bulk_order_bids" to "anon";

grant trigger on table "public"."bulk_order_bids" to "anon";

grant truncate on table "public"."bulk_order_bids" to "anon";

grant update on table "public"."bulk_order_bids" to "anon";

grant delete on table "public"."bulk_order_bids" to "authenticated";

grant insert on table "public"."bulk_order_bids" to "authenticated";

grant references on table "public"."bulk_order_bids" to "authenticated";

grant select on table "public"."bulk_order_bids" to "authenticated";

grant trigger on table "public"."bulk_order_bids" to "authenticated";

grant truncate on table "public"."bulk_order_bids" to "authenticated";

grant update on table "public"."bulk_order_bids" to "authenticated";

grant delete on table "public"."bulk_order_bids" to "service_role";

grant insert on table "public"."bulk_order_bids" to "service_role";

grant references on table "public"."bulk_order_bids" to "service_role";

grant select on table "public"."bulk_order_bids" to "service_role";

grant trigger on table "public"."bulk_order_bids" to "service_role";

grant truncate on table "public"."bulk_order_bids" to "service_role";

grant update on table "public"."bulk_order_bids" to "service_role";

grant delete on table "public"."bulk_orders" to "anon";

grant insert on table "public"."bulk_orders" to "anon";

grant references on table "public"."bulk_orders" to "anon";

grant select on table "public"."bulk_orders" to "anon";

grant trigger on table "public"."bulk_orders" to "anon";

grant truncate on table "public"."bulk_orders" to "anon";

grant update on table "public"."bulk_orders" to "anon";

grant delete on table "public"."bulk_orders" to "authenticated";

grant insert on table "public"."bulk_orders" to "authenticated";

grant references on table "public"."bulk_orders" to "authenticated";

grant select on table "public"."bulk_orders" to "authenticated";

grant trigger on table "public"."bulk_orders" to "authenticated";

grant truncate on table "public"."bulk_orders" to "authenticated";

grant update on table "public"."bulk_orders" to "authenticated";

grant delete on table "public"."bulk_orders" to "service_role";

grant insert on table "public"."bulk_orders" to "service_role";

grant references on table "public"."bulk_orders" to "service_role";

grant select on table "public"."bulk_orders" to "service_role";

grant trigger on table "public"."bulk_orders" to "service_role";

grant truncate on table "public"."bulk_orders" to "service_role";

grant update on table "public"."bulk_orders" to "service_role";

grant delete on table "public"."business_advertisements" to "anon";

grant insert on table "public"."business_advertisements" to "anon";

grant references on table "public"."business_advertisements" to "anon";

grant select on table "public"."business_advertisements" to "anon";

grant trigger on table "public"."business_advertisements" to "anon";

grant truncate on table "public"."business_advertisements" to "anon";

grant update on table "public"."business_advertisements" to "anon";

grant delete on table "public"."business_advertisements" to "authenticated";

grant insert on table "public"."business_advertisements" to "authenticated";

grant references on table "public"."business_advertisements" to "authenticated";

grant select on table "public"."business_advertisements" to "authenticated";

grant trigger on table "public"."business_advertisements" to "authenticated";

grant truncate on table "public"."business_advertisements" to "authenticated";

grant update on table "public"."business_advertisements" to "authenticated";

grant delete on table "public"."business_advertisements" to "service_role";

grant insert on table "public"."business_advertisements" to "service_role";

grant references on table "public"."business_advertisements" to "service_role";

grant select on table "public"."business_advertisements" to "service_role";

grant trigger on table "public"."business_advertisements" to "service_role";

grant truncate on table "public"."business_advertisements" to "service_role";

grant update on table "public"."business_advertisements" to "service_role";

grant delete on table "public"."business_matches" to "anon";

grant insert on table "public"."business_matches" to "anon";

grant references on table "public"."business_matches" to "anon";

grant select on table "public"."business_matches" to "anon";

grant trigger on table "public"."business_matches" to "anon";

grant truncate on table "public"."business_matches" to "anon";

grant update on table "public"."business_matches" to "anon";

grant delete on table "public"."business_matches" to "authenticated";

grant insert on table "public"."business_matches" to "authenticated";

grant references on table "public"."business_matches" to "authenticated";

grant select on table "public"."business_matches" to "authenticated";

grant trigger on table "public"."business_matches" to "authenticated";

grant truncate on table "public"."business_matches" to "authenticated";

grant update on table "public"."business_matches" to "authenticated";

grant delete on table "public"."business_matches" to "service_role";

grant insert on table "public"."business_matches" to "service_role";

grant references on table "public"."business_matches" to "service_role";

grant select on table "public"."business_matches" to "service_role";

grant trigger on table "public"."business_matches" to "service_role";

grant truncate on table "public"."business_matches" to "service_role";

grant update on table "public"."business_matches" to "service_role";

grant delete on table "public"."carbon_forum_posts" to "anon";

grant insert on table "public"."carbon_forum_posts" to "anon";

grant references on table "public"."carbon_forum_posts" to "anon";

grant select on table "public"."carbon_forum_posts" to "anon";

grant trigger on table "public"."carbon_forum_posts" to "anon";

grant truncate on table "public"."carbon_forum_posts" to "anon";

grant update on table "public"."carbon_forum_posts" to "anon";

grant delete on table "public"."carbon_forum_posts" to "authenticated";

grant insert on table "public"."carbon_forum_posts" to "authenticated";

grant references on table "public"."carbon_forum_posts" to "authenticated";

grant select on table "public"."carbon_forum_posts" to "authenticated";

grant trigger on table "public"."carbon_forum_posts" to "authenticated";

grant truncate on table "public"."carbon_forum_posts" to "authenticated";

grant update on table "public"."carbon_forum_posts" to "authenticated";

grant delete on table "public"."carbon_forum_posts" to "service_role";

grant insert on table "public"."carbon_forum_posts" to "service_role";

grant references on table "public"."carbon_forum_posts" to "service_role";

grant select on table "public"."carbon_forum_posts" to "service_role";

grant trigger on table "public"."carbon_forum_posts" to "service_role";

grant truncate on table "public"."carbon_forum_posts" to "service_role";

grant update on table "public"."carbon_forum_posts" to "service_role";

grant delete on table "public"."city_market_donations" to "anon";

grant insert on table "public"."city_market_donations" to "anon";

grant references on table "public"."city_market_donations" to "anon";

grant select on table "public"."city_market_donations" to "anon";

grant trigger on table "public"."city_market_donations" to "anon";

grant truncate on table "public"."city_market_donations" to "anon";

grant update on table "public"."city_market_donations" to "anon";

grant delete on table "public"."city_market_donations" to "authenticated";

grant insert on table "public"."city_market_donations" to "authenticated";

grant references on table "public"."city_market_donations" to "authenticated";

grant select on table "public"."city_market_donations" to "authenticated";

grant trigger on table "public"."city_market_donations" to "authenticated";

grant truncate on table "public"."city_market_donations" to "authenticated";

grant update on table "public"."city_market_donations" to "authenticated";

grant delete on table "public"."city_market_donations" to "service_role";

grant insert on table "public"."city_market_donations" to "service_role";

grant references on table "public"."city_market_donations" to "service_role";

grant select on table "public"."city_market_donations" to "service_role";

grant trigger on table "public"."city_market_donations" to "service_role";

grant truncate on table "public"."city_market_donations" to "service_role";

grant update on table "public"."city_market_donations" to "service_role";

grant delete on table "public"."contract_applications" to "anon";

grant insert on table "public"."contract_applications" to "anon";

grant references on table "public"."contract_applications" to "anon";

grant select on table "public"."contract_applications" to "anon";

grant trigger on table "public"."contract_applications" to "anon";

grant truncate on table "public"."contract_applications" to "anon";

grant update on table "public"."contract_applications" to "anon";

grant delete on table "public"."contract_applications" to "authenticated";

grant insert on table "public"."contract_applications" to "authenticated";

grant references on table "public"."contract_applications" to "authenticated";

grant select on table "public"."contract_applications" to "authenticated";

grant trigger on table "public"."contract_applications" to "authenticated";

grant truncate on table "public"."contract_applications" to "authenticated";

grant update on table "public"."contract_applications" to "authenticated";

grant delete on table "public"."contract_applications" to "service_role";

grant insert on table "public"."contract_applications" to "service_role";

grant references on table "public"."contract_applications" to "service_role";

grant select on table "public"."contract_applications" to "service_role";

grant trigger on table "public"."contract_applications" to "service_role";

grant truncate on table "public"."contract_applications" to "service_role";

grant update on table "public"."contract_applications" to "service_role";

grant delete on table "public"."contract_comments" to "anon";

grant insert on table "public"."contract_comments" to "anon";

grant references on table "public"."contract_comments" to "anon";

grant select on table "public"."contract_comments" to "anon";

grant trigger on table "public"."contract_comments" to "anon";

grant truncate on table "public"."contract_comments" to "anon";

grant update on table "public"."contract_comments" to "anon";

grant delete on table "public"."contract_comments" to "authenticated";

grant insert on table "public"."contract_comments" to "authenticated";

grant references on table "public"."contract_comments" to "authenticated";

grant select on table "public"."contract_comments" to "authenticated";

grant trigger on table "public"."contract_comments" to "authenticated";

grant truncate on table "public"."contract_comments" to "authenticated";

grant update on table "public"."contract_comments" to "authenticated";

grant delete on table "public"."contract_comments" to "service_role";

grant insert on table "public"."contract_comments" to "service_role";

grant references on table "public"."contract_comments" to "service_role";

grant select on table "public"."contract_comments" to "service_role";

grant trigger on table "public"."contract_comments" to "service_role";

grant truncate on table "public"."contract_comments" to "service_role";

grant update on table "public"."contract_comments" to "service_role";

grant delete on table "public"."contract_documents" to "anon";

grant insert on table "public"."contract_documents" to "anon";

grant references on table "public"."contract_documents" to "anon";

grant select on table "public"."contract_documents" to "anon";

grant trigger on table "public"."contract_documents" to "anon";

grant truncate on table "public"."contract_documents" to "anon";

grant update on table "public"."contract_documents" to "anon";

grant delete on table "public"."contract_documents" to "authenticated";

grant insert on table "public"."contract_documents" to "authenticated";

grant references on table "public"."contract_documents" to "authenticated";

grant select on table "public"."contract_documents" to "authenticated";

grant trigger on table "public"."contract_documents" to "authenticated";

grant truncate on table "public"."contract_documents" to "authenticated";

grant update on table "public"."contract_documents" to "authenticated";

grant delete on table "public"."contract_documents" to "service_role";

grant insert on table "public"."contract_documents" to "service_role";

grant references on table "public"."contract_documents" to "service_role";

grant select on table "public"."contract_documents" to "service_role";

grant trigger on table "public"."contract_documents" to "service_role";

grant truncate on table "public"."contract_documents" to "service_role";

grant update on table "public"."contract_documents" to "service_role";

grant delete on table "public"."contract_farming_opportunities" to "anon";

grant insert on table "public"."contract_farming_opportunities" to "anon";

grant references on table "public"."contract_farming_opportunities" to "anon";

grant select on table "public"."contract_farming_opportunities" to "anon";

grant trigger on table "public"."contract_farming_opportunities" to "anon";

grant truncate on table "public"."contract_farming_opportunities" to "anon";

grant update on table "public"."contract_farming_opportunities" to "anon";

grant delete on table "public"."contract_farming_opportunities" to "authenticated";

grant insert on table "public"."contract_farming_opportunities" to "authenticated";

grant references on table "public"."contract_farming_opportunities" to "authenticated";

grant select on table "public"."contract_farming_opportunities" to "authenticated";

grant trigger on table "public"."contract_farming_opportunities" to "authenticated";

grant truncate on table "public"."contract_farming_opportunities" to "authenticated";

grant update on table "public"."contract_farming_opportunities" to "authenticated";

grant delete on table "public"."contract_farming_opportunities" to "service_role";

grant insert on table "public"."contract_farming_opportunities" to "service_role";

grant references on table "public"."contract_farming_opportunities" to "service_role";

grant select on table "public"."contract_farming_opportunities" to "service_role";

grant trigger on table "public"."contract_farming_opportunities" to "service_role";

grant truncate on table "public"."contract_farming_opportunities" to "service_role";

grant update on table "public"."contract_farming_opportunities" to "service_role";

grant delete on table "public"."contract_flags" to "anon";

grant insert on table "public"."contract_flags" to "anon";

grant references on table "public"."contract_flags" to "anon";

grant select on table "public"."contract_flags" to "anon";

grant trigger on table "public"."contract_flags" to "anon";

grant truncate on table "public"."contract_flags" to "anon";

grant update on table "public"."contract_flags" to "anon";

grant delete on table "public"."contract_flags" to "authenticated";

grant insert on table "public"."contract_flags" to "authenticated";

grant references on table "public"."contract_flags" to "authenticated";

grant select on table "public"."contract_flags" to "authenticated";

grant trigger on table "public"."contract_flags" to "authenticated";

grant truncate on table "public"."contract_flags" to "authenticated";

grant update on table "public"."contract_flags" to "authenticated";

grant delete on table "public"."contract_flags" to "service_role";

grant insert on table "public"."contract_flags" to "service_role";

grant references on table "public"."contract_flags" to "service_role";

grant select on table "public"."contract_flags" to "service_role";

grant trigger on table "public"."contract_flags" to "service_role";

grant truncate on table "public"."contract_flags" to "service_role";

grant update on table "public"."contract_flags" to "service_role";

grant delete on table "public"."contract_reviews" to "anon";

grant insert on table "public"."contract_reviews" to "anon";

grant references on table "public"."contract_reviews" to "anon";

grant select on table "public"."contract_reviews" to "anon";

grant trigger on table "public"."contract_reviews" to "anon";

grant truncate on table "public"."contract_reviews" to "anon";

grant update on table "public"."contract_reviews" to "anon";

grant delete on table "public"."contract_reviews" to "authenticated";

grant insert on table "public"."contract_reviews" to "authenticated";

grant references on table "public"."contract_reviews" to "authenticated";

grant select on table "public"."contract_reviews" to "authenticated";

grant trigger on table "public"."contract_reviews" to "authenticated";

grant truncate on table "public"."contract_reviews" to "authenticated";

grant update on table "public"."contract_reviews" to "authenticated";

grant delete on table "public"."contract_reviews" to "service_role";

grant insert on table "public"."contract_reviews" to "service_role";

grant references on table "public"."contract_reviews" to "service_role";

grant select on table "public"."contract_reviews" to "service_role";

grant trigger on table "public"."contract_reviews" to "service_role";

grant truncate on table "public"."contract_reviews" to "service_role";

grant update on table "public"."contract_reviews" to "service_role";

grant delete on table "public"."contract_social_shares" to "anon";

grant insert on table "public"."contract_social_shares" to "anon";

grant references on table "public"."contract_social_shares" to "anon";

grant select on table "public"."contract_social_shares" to "anon";

grant trigger on table "public"."contract_social_shares" to "anon";

grant truncate on table "public"."contract_social_shares" to "anon";

grant update on table "public"."contract_social_shares" to "anon";

grant delete on table "public"."contract_social_shares" to "authenticated";

grant insert on table "public"."contract_social_shares" to "authenticated";

grant references on table "public"."contract_social_shares" to "authenticated";

grant select on table "public"."contract_social_shares" to "authenticated";

grant trigger on table "public"."contract_social_shares" to "authenticated";

grant truncate on table "public"."contract_social_shares" to "authenticated";

grant update on table "public"."contract_social_shares" to "authenticated";

grant delete on table "public"."contract_social_shares" to "service_role";

grant insert on table "public"."contract_social_shares" to "service_role";

grant references on table "public"."contract_social_shares" to "service_role";

grant select on table "public"."contract_social_shares" to "service_role";

grant trigger on table "public"."contract_social_shares" to "service_role";

grant truncate on table "public"."contract_social_shares" to "service_role";

grant update on table "public"."contract_social_shares" to "service_role";

grant delete on table "public"."crop_yields" to "anon";

grant insert on table "public"."crop_yields" to "anon";

grant references on table "public"."crop_yields" to "anon";

grant select on table "public"."crop_yields" to "anon";

grant trigger on table "public"."crop_yields" to "anon";

grant truncate on table "public"."crop_yields" to "anon";

grant update on table "public"."crop_yields" to "anon";

grant delete on table "public"."crop_yields" to "authenticated";

grant insert on table "public"."crop_yields" to "authenticated";

grant references on table "public"."crop_yields" to "authenticated";

grant select on table "public"."crop_yields" to "authenticated";

grant trigger on table "public"."crop_yields" to "authenticated";

grant truncate on table "public"."crop_yields" to "authenticated";

grant update on table "public"."crop_yields" to "authenticated";

grant delete on table "public"."crop_yields" to "service_role";

grant insert on table "public"."crop_yields" to "service_role";

grant references on table "public"."crop_yields" to "service_role";

grant select on table "public"."crop_yields" to "service_role";

grant trigger on table "public"."crop_yields" to "service_role";

grant truncate on table "public"."crop_yields" to "service_role";

grant update on table "public"."crop_yields" to "service_role";

grant delete on table "public"."data_fetch_logs" to "anon";

grant insert on table "public"."data_fetch_logs" to "anon";

grant references on table "public"."data_fetch_logs" to "anon";

grant select on table "public"."data_fetch_logs" to "anon";

grant trigger on table "public"."data_fetch_logs" to "anon";

grant truncate on table "public"."data_fetch_logs" to "anon";

grant update on table "public"."data_fetch_logs" to "anon";

grant delete on table "public"."data_fetch_logs" to "authenticated";

grant insert on table "public"."data_fetch_logs" to "authenticated";

grant references on table "public"."data_fetch_logs" to "authenticated";

grant select on table "public"."data_fetch_logs" to "authenticated";

grant trigger on table "public"."data_fetch_logs" to "authenticated";

grant truncate on table "public"."data_fetch_logs" to "authenticated";

grant update on table "public"."data_fetch_logs" to "authenticated";

grant delete on table "public"."data_fetch_logs" to "service_role";

grant insert on table "public"."data_fetch_logs" to "service_role";

grant references on table "public"."data_fetch_logs" to "service_role";

grant select on table "public"."data_fetch_logs" to "service_role";

grant trigger on table "public"."data_fetch_logs" to "service_role";

grant truncate on table "public"."data_fetch_logs" to "service_role";

grant update on table "public"."data_fetch_logs" to "service_role";

grant delete on table "public"."financial_transactions" to "anon";

grant insert on table "public"."financial_transactions" to "anon";

grant references on table "public"."financial_transactions" to "anon";

grant select on table "public"."financial_transactions" to "anon";

grant trigger on table "public"."financial_transactions" to "anon";

grant truncate on table "public"."financial_transactions" to "anon";

grant update on table "public"."financial_transactions" to "anon";

grant delete on table "public"."financial_transactions" to "authenticated";

grant insert on table "public"."financial_transactions" to "authenticated";

grant references on table "public"."financial_transactions" to "authenticated";

grant select on table "public"."financial_transactions" to "authenticated";

grant trigger on table "public"."financial_transactions" to "authenticated";

grant truncate on table "public"."financial_transactions" to "authenticated";

grant update on table "public"."financial_transactions" to "authenticated";

grant delete on table "public"."financial_transactions" to "service_role";

grant insert on table "public"."financial_transactions" to "service_role";

grant references on table "public"."financial_transactions" to "service_role";

grant select on table "public"."financial_transactions" to "service_role";

grant trigger on table "public"."financial_transactions" to "service_role";

grant truncate on table "public"."financial_transactions" to "service_role";

grant update on table "public"."financial_transactions" to "service_role";

grant delete on table "public"."food_rescue_listings" to "anon";

grant insert on table "public"."food_rescue_listings" to "anon";

grant references on table "public"."food_rescue_listings" to "anon";

grant select on table "public"."food_rescue_listings" to "anon";

grant trigger on table "public"."food_rescue_listings" to "anon";

grant truncate on table "public"."food_rescue_listings" to "anon";

grant update on table "public"."food_rescue_listings" to "anon";

grant delete on table "public"."food_rescue_listings" to "authenticated";

grant insert on table "public"."food_rescue_listings" to "authenticated";

grant references on table "public"."food_rescue_listings" to "authenticated";

grant select on table "public"."food_rescue_listings" to "authenticated";

grant trigger on table "public"."food_rescue_listings" to "authenticated";

grant truncate on table "public"."food_rescue_listings" to "authenticated";

grant update on table "public"."food_rescue_listings" to "authenticated";

grant delete on table "public"."food_rescue_listings" to "service_role";

grant insert on table "public"."food_rescue_listings" to "service_role";

grant references on table "public"."food_rescue_listings" to "service_role";

grant select on table "public"."food_rescue_listings" to "service_role";

grant trigger on table "public"."food_rescue_listings" to "service_role";

grant truncate on table "public"."food_rescue_listings" to "service_role";

grant update on table "public"."food_rescue_listings" to "service_role";

grant delete on table "public"."impact_metrics" to "anon";

grant insert on table "public"."impact_metrics" to "anon";

grant references on table "public"."impact_metrics" to "anon";

grant select on table "public"."impact_metrics" to "anon";

grant trigger on table "public"."impact_metrics" to "anon";

grant truncate on table "public"."impact_metrics" to "anon";

grant update on table "public"."impact_metrics" to "anon";

grant delete on table "public"."impact_metrics" to "authenticated";

grant insert on table "public"."impact_metrics" to "authenticated";

grant references on table "public"."impact_metrics" to "authenticated";

grant select on table "public"."impact_metrics" to "authenticated";

grant trigger on table "public"."impact_metrics" to "authenticated";

grant truncate on table "public"."impact_metrics" to "authenticated";

grant update on table "public"."impact_metrics" to "authenticated";

grant delete on table "public"."impact_metrics" to "service_role";

grant insert on table "public"."impact_metrics" to "service_role";

grant references on table "public"."impact_metrics" to "service_role";

grant select on table "public"."impact_metrics" to "service_role";

grant trigger on table "public"."impact_metrics" to "service_role";

grant truncate on table "public"."impact_metrics" to "service_role";

grant update on table "public"."impact_metrics" to "service_role";

grant delete on table "public"."input_group_orders" to "anon";

grant insert on table "public"."input_group_orders" to "anon";

grant references on table "public"."input_group_orders" to "anon";

grant select on table "public"."input_group_orders" to "anon";

grant trigger on table "public"."input_group_orders" to "anon";

grant truncate on table "public"."input_group_orders" to "anon";

grant update on table "public"."input_group_orders" to "anon";

grant delete on table "public"."input_group_orders" to "authenticated";

grant insert on table "public"."input_group_orders" to "authenticated";

grant references on table "public"."input_group_orders" to "authenticated";

grant select on table "public"."input_group_orders" to "authenticated";

grant trigger on table "public"."input_group_orders" to "authenticated";

grant truncate on table "public"."input_group_orders" to "authenticated";

grant update on table "public"."input_group_orders" to "authenticated";

grant delete on table "public"."input_group_orders" to "service_role";

grant insert on table "public"."input_group_orders" to "service_role";

grant references on table "public"."input_group_orders" to "service_role";

grant select on table "public"."input_group_orders" to "service_role";

grant trigger on table "public"."input_group_orders" to "service_role";

grant truncate on table "public"."input_group_orders" to "service_role";

grant update on table "public"."input_group_orders" to "service_role";

grant delete on table "public"."input_prices" to "anon";

grant insert on table "public"."input_prices" to "anon";

grant references on table "public"."input_prices" to "anon";

grant select on table "public"."input_prices" to "anon";

grant trigger on table "public"."input_prices" to "anon";

grant truncate on table "public"."input_prices" to "anon";

grant update on table "public"."input_prices" to "anon";

grant delete on table "public"."input_prices" to "authenticated";

grant insert on table "public"."input_prices" to "authenticated";

grant references on table "public"."input_prices" to "authenticated";

grant select on table "public"."input_prices" to "authenticated";

grant trigger on table "public"."input_prices" to "authenticated";

grant truncate on table "public"."input_prices" to "authenticated";

grant update on table "public"."input_prices" to "authenticated";

grant delete on table "public"."input_prices" to "service_role";

grant insert on table "public"."input_prices" to "service_role";

grant references on table "public"."input_prices" to "service_role";

grant select on table "public"."input_prices" to "service_role";

grant trigger on table "public"."input_prices" to "service_role";

grant truncate on table "public"."input_prices" to "service_role";

grant update on table "public"."input_prices" to "service_role";

grant delete on table "public"."input_pricing" to "anon";

grant insert on table "public"."input_pricing" to "anon";

grant references on table "public"."input_pricing" to "anon";

grant select on table "public"."input_pricing" to "anon";

grant trigger on table "public"."input_pricing" to "anon";

grant truncate on table "public"."input_pricing" to "anon";

grant update on table "public"."input_pricing" to "anon";

grant delete on table "public"."input_pricing" to "authenticated";

grant insert on table "public"."input_pricing" to "authenticated";

grant references on table "public"."input_pricing" to "authenticated";

grant select on table "public"."input_pricing" to "authenticated";

grant trigger on table "public"."input_pricing" to "authenticated";

grant truncate on table "public"."input_pricing" to "authenticated";

grant update on table "public"."input_pricing" to "authenticated";

grant delete on table "public"."input_pricing" to "service_role";

grant insert on table "public"."input_pricing" to "service_role";

grant references on table "public"."input_pricing" to "service_role";

grant select on table "public"."input_pricing" to "service_role";

grant trigger on table "public"."input_pricing" to "service_role";

grant truncate on table "public"."input_pricing" to "service_role";

grant update on table "public"."input_pricing" to "service_role";

grant delete on table "public"."input_reviews" to "anon";

grant insert on table "public"."input_reviews" to "anon";

grant references on table "public"."input_reviews" to "anon";

grant select on table "public"."input_reviews" to "anon";

grant trigger on table "public"."input_reviews" to "anon";

grant truncate on table "public"."input_reviews" to "anon";

grant update on table "public"."input_reviews" to "anon";

grant delete on table "public"."input_reviews" to "authenticated";

grant insert on table "public"."input_reviews" to "authenticated";

grant references on table "public"."input_reviews" to "authenticated";

grant select on table "public"."input_reviews" to "authenticated";

grant trigger on table "public"."input_reviews" to "authenticated";

grant truncate on table "public"."input_reviews" to "authenticated";

grant update on table "public"."input_reviews" to "authenticated";

grant delete on table "public"."input_reviews" to "service_role";

grant insert on table "public"."input_reviews" to "service_role";

grant references on table "public"."input_reviews" to "service_role";

grant select on table "public"."input_reviews" to "service_role";

grant trigger on table "public"."input_reviews" to "service_role";

grant truncate on table "public"."input_reviews" to "service_role";

grant update on table "public"."input_reviews" to "service_role";

grant delete on table "public"."input_supplier_reviews" to "anon";

grant insert on table "public"."input_supplier_reviews" to "anon";

grant references on table "public"."input_supplier_reviews" to "anon";

grant select on table "public"."input_supplier_reviews" to "anon";

grant trigger on table "public"."input_supplier_reviews" to "anon";

grant truncate on table "public"."input_supplier_reviews" to "anon";

grant update on table "public"."input_supplier_reviews" to "anon";

grant delete on table "public"."input_supplier_reviews" to "authenticated";

grant insert on table "public"."input_supplier_reviews" to "authenticated";

grant references on table "public"."input_supplier_reviews" to "authenticated";

grant select on table "public"."input_supplier_reviews" to "authenticated";

grant trigger on table "public"."input_supplier_reviews" to "authenticated";

grant truncate on table "public"."input_supplier_reviews" to "authenticated";

grant update on table "public"."input_supplier_reviews" to "authenticated";

grant delete on table "public"."input_supplier_reviews" to "service_role";

grant insert on table "public"."input_supplier_reviews" to "service_role";

grant references on table "public"."input_supplier_reviews" to "service_role";

grant select on table "public"."input_supplier_reviews" to "service_role";

grant trigger on table "public"."input_supplier_reviews" to "service_role";

grant truncate on table "public"."input_supplier_reviews" to "service_role";

grant update on table "public"."input_supplier_reviews" to "service_role";

grant delete on table "public"."input_verifications" to "anon";

grant insert on table "public"."input_verifications" to "anon";

grant references on table "public"."input_verifications" to "anon";

grant select on table "public"."input_verifications" to "anon";

grant trigger on table "public"."input_verifications" to "anon";

grant truncate on table "public"."input_verifications" to "anon";

grant update on table "public"."input_verifications" to "anon";

grant delete on table "public"."input_verifications" to "authenticated";

grant insert on table "public"."input_verifications" to "authenticated";

grant references on table "public"."input_verifications" to "authenticated";

grant select on table "public"."input_verifications" to "authenticated";

grant trigger on table "public"."input_verifications" to "authenticated";

grant truncate on table "public"."input_verifications" to "authenticated";

grant update on table "public"."input_verifications" to "authenticated";

grant delete on table "public"."input_verifications" to "service_role";

grant insert on table "public"."input_verifications" to "service_role";

grant references on table "public"."input_verifications" to "service_role";

grant select on table "public"."input_verifications" to "service_role";

grant trigger on table "public"."input_verifications" to "service_role";

grant truncate on table "public"."input_verifications" to "service_role";

grant update on table "public"."input_verifications" to "service_role";

grant delete on table "public"."kilimo_statistics" to "anon";

grant insert on table "public"."kilimo_statistics" to "anon";

grant references on table "public"."kilimo_statistics" to "anon";

grant select on table "public"."kilimo_statistics" to "anon";

grant trigger on table "public"."kilimo_statistics" to "anon";

grant truncate on table "public"."kilimo_statistics" to "anon";

grant update on table "public"."kilimo_statistics" to "anon";

grant delete on table "public"."kilimo_statistics" to "authenticated";

grant insert on table "public"."kilimo_statistics" to "authenticated";

grant references on table "public"."kilimo_statistics" to "authenticated";

grant select on table "public"."kilimo_statistics" to "authenticated";

grant trigger on table "public"."kilimo_statistics" to "authenticated";

grant truncate on table "public"."kilimo_statistics" to "authenticated";

grant update on table "public"."kilimo_statistics" to "authenticated";

grant delete on table "public"."kilimo_statistics" to "service_role";

grant insert on table "public"."kilimo_statistics" to "service_role";

grant references on table "public"."kilimo_statistics" to "service_role";

grant select on table "public"."kilimo_statistics" to "service_role";

grant trigger on table "public"."kilimo_statistics" to "service_role";

grant truncate on table "public"."kilimo_statistics" to "service_role";

grant update on table "public"."kilimo_statistics" to "service_role";

grant delete on table "public"."livestock_breeds" to "anon";

grant insert on table "public"."livestock_breeds" to "anon";

grant references on table "public"."livestock_breeds" to "anon";

grant select on table "public"."livestock_breeds" to "anon";

grant trigger on table "public"."livestock_breeds" to "anon";

grant truncate on table "public"."livestock_breeds" to "anon";

grant update on table "public"."livestock_breeds" to "anon";

grant delete on table "public"."livestock_breeds" to "authenticated";

grant insert on table "public"."livestock_breeds" to "authenticated";

grant references on table "public"."livestock_breeds" to "authenticated";

grant select on table "public"."livestock_breeds" to "authenticated";

grant trigger on table "public"."livestock_breeds" to "authenticated";

grant truncate on table "public"."livestock_breeds" to "authenticated";

grant update on table "public"."livestock_breeds" to "authenticated";

grant delete on table "public"."livestock_breeds" to "service_role";

grant insert on table "public"."livestock_breeds" to "service_role";

grant references on table "public"."livestock_breeds" to "service_role";

grant select on table "public"."livestock_breeds" to "service_role";

grant trigger on table "public"."livestock_breeds" to "service_role";

grant truncate on table "public"."livestock_breeds" to "service_role";

grant update on table "public"."livestock_breeds" to "service_role";

grant delete on table "public"."livestock_for_sale" to "anon";

grant insert on table "public"."livestock_for_sale" to "anon";

grant references on table "public"."livestock_for_sale" to "anon";

grant select on table "public"."livestock_for_sale" to "anon";

grant trigger on table "public"."livestock_for_sale" to "anon";

grant truncate on table "public"."livestock_for_sale" to "anon";

grant update on table "public"."livestock_for_sale" to "anon";

grant delete on table "public"."livestock_for_sale" to "authenticated";

grant insert on table "public"."livestock_for_sale" to "authenticated";

grant references on table "public"."livestock_for_sale" to "authenticated";

grant select on table "public"."livestock_for_sale" to "authenticated";

grant trigger on table "public"."livestock_for_sale" to "authenticated";

grant truncate on table "public"."livestock_for_sale" to "authenticated";

grant update on table "public"."livestock_for_sale" to "authenticated";

grant delete on table "public"."livestock_for_sale" to "service_role";

grant insert on table "public"."livestock_for_sale" to "service_role";

grant references on table "public"."livestock_for_sale" to "service_role";

grant select on table "public"."livestock_for_sale" to "service_role";

grant trigger on table "public"."livestock_for_sale" to "service_role";

grant truncate on table "public"."livestock_for_sale" to "service_role";

grant update on table "public"."livestock_for_sale" to "service_role";

grant delete on table "public"."livestock_listings" to "anon";

grant insert on table "public"."livestock_listings" to "anon";

grant references on table "public"."livestock_listings" to "anon";

grant select on table "public"."livestock_listings" to "anon";

grant trigger on table "public"."livestock_listings" to "anon";

grant truncate on table "public"."livestock_listings" to "anon";

grant update on table "public"."livestock_listings" to "anon";

grant delete on table "public"."livestock_listings" to "authenticated";

grant insert on table "public"."livestock_listings" to "authenticated";

grant references on table "public"."livestock_listings" to "authenticated";

grant select on table "public"."livestock_listings" to "authenticated";

grant trigger on table "public"."livestock_listings" to "authenticated";

grant truncate on table "public"."livestock_listings" to "authenticated";

grant update on table "public"."livestock_listings" to "authenticated";

grant delete on table "public"."livestock_listings" to "service_role";

grant insert on table "public"."livestock_listings" to "service_role";

grant references on table "public"."livestock_listings" to "service_role";

grant select on table "public"."livestock_listings" to "service_role";

grant trigger on table "public"."livestock_listings" to "service_role";

grant truncate on table "public"."livestock_listings" to "service_role";

grant update on table "public"."livestock_listings" to "service_role";

grant delete on table "public"."livestock_markets" to "anon";

grant insert on table "public"."livestock_markets" to "anon";

grant references on table "public"."livestock_markets" to "anon";

grant select on table "public"."livestock_markets" to "anon";

grant trigger on table "public"."livestock_markets" to "anon";

grant truncate on table "public"."livestock_markets" to "anon";

grant update on table "public"."livestock_markets" to "anon";

grant delete on table "public"."livestock_markets" to "authenticated";

grant insert on table "public"."livestock_markets" to "authenticated";

grant references on table "public"."livestock_markets" to "authenticated";

grant select on table "public"."livestock_markets" to "authenticated";

grant trigger on table "public"."livestock_markets" to "authenticated";

grant truncate on table "public"."livestock_markets" to "authenticated";

grant update on table "public"."livestock_markets" to "authenticated";

grant delete on table "public"."livestock_markets" to "service_role";

grant insert on table "public"."livestock_markets" to "service_role";

grant references on table "public"."livestock_markets" to "service_role";

grant select on table "public"."livestock_markets" to "service_role";

grant trigger on table "public"."livestock_markets" to "service_role";

grant truncate on table "public"."livestock_markets" to "service_role";

grant update on table "public"."livestock_markets" to "service_role";

grant delete on table "public"."market_forecasts" to "anon";

grant insert on table "public"."market_forecasts" to "anon";

grant references on table "public"."market_forecasts" to "anon";

grant select on table "public"."market_forecasts" to "anon";

grant trigger on table "public"."market_forecasts" to "anon";

grant truncate on table "public"."market_forecasts" to "anon";

grant update on table "public"."market_forecasts" to "anon";

grant delete on table "public"."market_forecasts" to "authenticated";

grant insert on table "public"."market_forecasts" to "authenticated";

grant references on table "public"."market_forecasts" to "authenticated";

grant select on table "public"."market_forecasts" to "authenticated";

grant trigger on table "public"."market_forecasts" to "authenticated";

grant truncate on table "public"."market_forecasts" to "authenticated";

grant update on table "public"."market_forecasts" to "authenticated";

grant delete on table "public"."market_forecasts" to "service_role";

grant insert on table "public"."market_forecasts" to "service_role";

grant references on table "public"."market_forecasts" to "service_role";

grant select on table "public"."market_forecasts" to "service_role";

grant trigger on table "public"."market_forecasts" to "service_role";

grant truncate on table "public"."market_forecasts" to "service_role";

grant update on table "public"."market_forecasts" to "service_role";

grant delete on table "public"."market_sentiment" to "anon";

grant insert on table "public"."market_sentiment" to "anon";

grant references on table "public"."market_sentiment" to "anon";

grant select on table "public"."market_sentiment" to "anon";

grant trigger on table "public"."market_sentiment" to "anon";

grant truncate on table "public"."market_sentiment" to "anon";

grant update on table "public"."market_sentiment" to "anon";

grant delete on table "public"."market_sentiment" to "authenticated";

grant insert on table "public"."market_sentiment" to "authenticated";

grant references on table "public"."market_sentiment" to "authenticated";

grant select on table "public"."market_sentiment" to "authenticated";

grant trigger on table "public"."market_sentiment" to "authenticated";

grant truncate on table "public"."market_sentiment" to "authenticated";

grant update on table "public"."market_sentiment" to "authenticated";

grant delete on table "public"."market_sentiment" to "service_role";

grant insert on table "public"."market_sentiment" to "service_role";

grant references on table "public"."market_sentiment" to "service_role";

grant select on table "public"."market_sentiment" to "service_role";

grant trigger on table "public"."market_sentiment" to "service_role";

grant truncate on table "public"."market_sentiment" to "service_role";

grant update on table "public"."market_sentiment" to "service_role";

grant delete on table "public"."mentorships" to "anon";

grant insert on table "public"."mentorships" to "anon";

grant references on table "public"."mentorships" to "anon";

grant select on table "public"."mentorships" to "anon";

grant trigger on table "public"."mentorships" to "anon";

grant truncate on table "public"."mentorships" to "anon";

grant update on table "public"."mentorships" to "anon";

grant delete on table "public"."mentorships" to "authenticated";

grant insert on table "public"."mentorships" to "authenticated";

grant references on table "public"."mentorships" to "authenticated";

grant select on table "public"."mentorships" to "authenticated";

grant trigger on table "public"."mentorships" to "authenticated";

grant truncate on table "public"."mentorships" to "authenticated";

grant update on table "public"."mentorships" to "authenticated";

grant delete on table "public"."mentorships" to "service_role";

grant insert on table "public"."mentorships" to "service_role";

grant references on table "public"."mentorships" to "service_role";

grant select on table "public"."mentorships" to "service_role";

grant trigger on table "public"."mentorships" to "service_role";

grant truncate on table "public"."mentorships" to "service_role";

grant update on table "public"."mentorships" to "service_role";

grant delete on table "public"."messages" to "anon";

grant insert on table "public"."messages" to "anon";

grant references on table "public"."messages" to "anon";

grant select on table "public"."messages" to "anon";

grant trigger on table "public"."messages" to "anon";

grant truncate on table "public"."messages" to "anon";

grant update on table "public"."messages" to "anon";

grant delete on table "public"."messages" to "authenticated";

grant insert on table "public"."messages" to "authenticated";

grant references on table "public"."messages" to "authenticated";

grant select on table "public"."messages" to "authenticated";

grant trigger on table "public"."messages" to "authenticated";

grant truncate on table "public"."messages" to "authenticated";

grant update on table "public"."messages" to "authenticated";

grant delete on table "public"."messages" to "service_role";

grant insert on table "public"."messages" to "service_role";

grant references on table "public"."messages" to "service_role";

grant select on table "public"."messages" to "service_role";

grant trigger on table "public"."messages" to "service_role";

grant truncate on table "public"."messages" to "service_role";

grant update on table "public"."messages" to "service_role";

grant delete on table "public"."network_events" to "anon";

grant insert on table "public"."network_events" to "anon";

grant references on table "public"."network_events" to "anon";

grant select on table "public"."network_events" to "anon";

grant trigger on table "public"."network_events" to "anon";

grant truncate on table "public"."network_events" to "anon";

grant update on table "public"."network_events" to "anon";

grant delete on table "public"."network_events" to "authenticated";

grant insert on table "public"."network_events" to "authenticated";

grant references on table "public"."network_events" to "authenticated";

grant select on table "public"."network_events" to "authenticated";

grant trigger on table "public"."network_events" to "authenticated";

grant truncate on table "public"."network_events" to "authenticated";

grant update on table "public"."network_events" to "authenticated";

grant delete on table "public"."network_events" to "service_role";

grant insert on table "public"."network_events" to "service_role";

grant references on table "public"."network_events" to "service_role";

grant select on table "public"."network_events" to "service_role";

grant trigger on table "public"."network_events" to "service_role";

grant truncate on table "public"."network_events" to "service_role";

grant update on table "public"."network_events" to "service_role";

grant delete on table "public"."notification_preferences" to "anon";

grant insert on table "public"."notification_preferences" to "anon";

grant references on table "public"."notification_preferences" to "anon";

grant select on table "public"."notification_preferences" to "anon";

grant trigger on table "public"."notification_preferences" to "anon";

grant truncate on table "public"."notification_preferences" to "anon";

grant update on table "public"."notification_preferences" to "anon";

grant delete on table "public"."notification_preferences" to "authenticated";

grant insert on table "public"."notification_preferences" to "authenticated";

grant references on table "public"."notification_preferences" to "authenticated";

grant select on table "public"."notification_preferences" to "authenticated";

grant trigger on table "public"."notification_preferences" to "authenticated";

grant truncate on table "public"."notification_preferences" to "authenticated";

grant update on table "public"."notification_preferences" to "authenticated";

grant delete on table "public"."notification_preferences" to "service_role";

grant insert on table "public"."notification_preferences" to "service_role";

grant references on table "public"."notification_preferences" to "service_role";

grant select on table "public"."notification_preferences" to "service_role";

grant trigger on table "public"."notification_preferences" to "service_role";

grant truncate on table "public"."notification_preferences" to "service_role";

grant update on table "public"."notification_preferences" to "service_role";

grant delete on table "public"."partner_events" to "anon";

grant insert on table "public"."partner_events" to "anon";

grant references on table "public"."partner_events" to "anon";

grant select on table "public"."partner_events" to "anon";

grant trigger on table "public"."partner_events" to "anon";

grant truncate on table "public"."partner_events" to "anon";

grant update on table "public"."partner_events" to "anon";

grant delete on table "public"."partner_events" to "authenticated";

grant insert on table "public"."partner_events" to "authenticated";

grant references on table "public"."partner_events" to "authenticated";

grant select on table "public"."partner_events" to "authenticated";

grant trigger on table "public"."partner_events" to "authenticated";

grant truncate on table "public"."partner_events" to "authenticated";

grant update on table "public"."partner_events" to "authenticated";

grant delete on table "public"."partner_events" to "service_role";

grant insert on table "public"."partner_events" to "service_role";

grant references on table "public"."partner_events" to "service_role";

grant select on table "public"."partner_events" to "service_role";

grant trigger on table "public"."partner_events" to "service_role";

grant truncate on table "public"."partner_events" to "service_role";

grant update on table "public"."partner_events" to "service_role";

grant delete on table "public"."partners" to "anon";

grant insert on table "public"."partners" to "anon";

grant references on table "public"."partners" to "anon";

grant select on table "public"."partners" to "anon";

grant trigger on table "public"."partners" to "anon";

grant truncate on table "public"."partners" to "anon";

grant update on table "public"."partners" to "anon";

grant delete on table "public"."partners" to "authenticated";

grant insert on table "public"."partners" to "authenticated";

grant references on table "public"."partners" to "authenticated";

grant select on table "public"."partners" to "authenticated";

grant trigger on table "public"."partners" to "authenticated";

grant truncate on table "public"."partners" to "authenticated";

grant update on table "public"."partners" to "authenticated";

grant delete on table "public"."partners" to "service_role";

grant insert on table "public"."partners" to "service_role";

grant references on table "public"."partners" to "service_role";

grant select on table "public"."partners" to "service_role";

grant trigger on table "public"."partners" to "service_role";

grant truncate on table "public"."partners" to "service_role";

grant update on table "public"."partners" to "service_role";

grant delete on table "public"."partnerships" to "anon";

grant insert on table "public"."partnerships" to "anon";

grant references on table "public"."partnerships" to "anon";

grant select on table "public"."partnerships" to "anon";

grant trigger on table "public"."partnerships" to "anon";

grant truncate on table "public"."partnerships" to "anon";

grant update on table "public"."partnerships" to "anon";

grant delete on table "public"."partnerships" to "authenticated";

grant insert on table "public"."partnerships" to "authenticated";

grant references on table "public"."partnerships" to "authenticated";

grant select on table "public"."partnerships" to "authenticated";

grant trigger on table "public"."partnerships" to "authenticated";

grant truncate on table "public"."partnerships" to "authenticated";

grant update on table "public"."partnerships" to "authenticated";

grant delete on table "public"."partnerships" to "service_role";

grant insert on table "public"."partnerships" to "service_role";

grant references on table "public"."partnerships" to "service_role";

grant select on table "public"."partnerships" to "service_role";

grant trigger on table "public"."partnerships" to "service_role";

grant truncate on table "public"."partnerships" to "service_role";

grant update on table "public"."partnerships" to "service_role";

grant delete on table "public"."payment_transactions" to "anon";

grant insert on table "public"."payment_transactions" to "anon";

grant references on table "public"."payment_transactions" to "anon";

grant select on table "public"."payment_transactions" to "anon";

grant trigger on table "public"."payment_transactions" to "anon";

grant truncate on table "public"."payment_transactions" to "anon";

grant update on table "public"."payment_transactions" to "anon";

grant delete on table "public"."payment_transactions" to "authenticated";

grant insert on table "public"."payment_transactions" to "authenticated";

grant references on table "public"."payment_transactions" to "authenticated";

grant select on table "public"."payment_transactions" to "authenticated";

grant trigger on table "public"."payment_transactions" to "authenticated";

grant truncate on table "public"."payment_transactions" to "authenticated";

grant update on table "public"."payment_transactions" to "authenticated";

grant delete on table "public"."payment_transactions" to "service_role";

grant insert on table "public"."payment_transactions" to "service_role";

grant references on table "public"."payment_transactions" to "service_role";

grant select on table "public"."payment_transactions" to "service_role";

grant trigger on table "public"."payment_transactions" to "service_role";

grant truncate on table "public"."payment_transactions" to "service_role";

grant update on table "public"."payment_transactions" to "service_role";

grant delete on table "public"."processing_matches" to "anon";

grant insert on table "public"."processing_matches" to "anon";

grant references on table "public"."processing_matches" to "anon";

grant select on table "public"."processing_matches" to "anon";

grant trigger on table "public"."processing_matches" to "anon";

grant truncate on table "public"."processing_matches" to "anon";

grant update on table "public"."processing_matches" to "anon";

grant delete on table "public"."processing_matches" to "authenticated";

grant insert on table "public"."processing_matches" to "authenticated";

grant references on table "public"."processing_matches" to "authenticated";

grant select on table "public"."processing_matches" to "authenticated";

grant trigger on table "public"."processing_matches" to "authenticated";

grant truncate on table "public"."processing_matches" to "authenticated";

grant update on table "public"."processing_matches" to "authenticated";

grant delete on table "public"."processing_matches" to "service_role";

grant insert on table "public"."processing_matches" to "service_role";

grant references on table "public"."processing_matches" to "service_role";

grant select on table "public"."processing_matches" to "service_role";

grant trigger on table "public"."processing_matches" to "service_role";

grant truncate on table "public"."processing_matches" to "service_role";

grant update on table "public"."processing_matches" to "service_role";

grant delete on table "public"."recipients" to "anon";

grant insert on table "public"."recipients" to "anon";

grant references on table "public"."recipients" to "anon";

grant select on table "public"."recipients" to "anon";

grant trigger on table "public"."recipients" to "anon";

grant truncate on table "public"."recipients" to "anon";

grant update on table "public"."recipients" to "anon";

grant delete on table "public"."recipients" to "authenticated";

grant insert on table "public"."recipients" to "authenticated";

grant references on table "public"."recipients" to "authenticated";

grant select on table "public"."recipients" to "authenticated";

grant trigger on table "public"."recipients" to "authenticated";

grant truncate on table "public"."recipients" to "authenticated";

grant update on table "public"."recipients" to "authenticated";

grant delete on table "public"."recipients" to "service_role";

grant insert on table "public"."recipients" to "service_role";

grant references on table "public"."recipients" to "service_role";

grant select on table "public"."recipients" to "service_role";

grant trigger on table "public"."recipients" to "service_role";

grant truncate on table "public"."recipients" to "service_role";

grant update on table "public"."recipients" to "service_role";

grant delete on table "public"."rescue_matches" to "anon";

grant insert on table "public"."rescue_matches" to "anon";

grant references on table "public"."rescue_matches" to "anon";

grant select on table "public"."rescue_matches" to "anon";

grant trigger on table "public"."rescue_matches" to "anon";

grant truncate on table "public"."rescue_matches" to "anon";

grant update on table "public"."rescue_matches" to "anon";

grant delete on table "public"."rescue_matches" to "authenticated";

grant insert on table "public"."rescue_matches" to "authenticated";

grant references on table "public"."rescue_matches" to "authenticated";

grant select on table "public"."rescue_matches" to "authenticated";

grant trigger on table "public"."rescue_matches" to "authenticated";

grant truncate on table "public"."rescue_matches" to "authenticated";

grant update on table "public"."rescue_matches" to "authenticated";

grant delete on table "public"."rescue_matches" to "service_role";

grant insert on table "public"."rescue_matches" to "service_role";

grant references on table "public"."rescue_matches" to "service_role";

grant select on table "public"."rescue_matches" to "service_role";

grant trigger on table "public"."rescue_matches" to "service_role";

grant truncate on table "public"."rescue_matches" to "service_role";

grant update on table "public"."rescue_matches" to "service_role";

grant delete on table "public"."research_requests" to "anon";

grant insert on table "public"."research_requests" to "anon";

grant references on table "public"."research_requests" to "anon";

grant select on table "public"."research_requests" to "anon";

grant trigger on table "public"."research_requests" to "anon";

grant truncate on table "public"."research_requests" to "anon";

grant update on table "public"."research_requests" to "anon";

grant delete on table "public"."research_requests" to "authenticated";

grant insert on table "public"."research_requests" to "authenticated";

grant references on table "public"."research_requests" to "authenticated";

grant select on table "public"."research_requests" to "authenticated";

grant trigger on table "public"."research_requests" to "authenticated";

grant truncate on table "public"."research_requests" to "authenticated";

grant update on table "public"."research_requests" to "authenticated";

grant delete on table "public"."research_requests" to "service_role";

grant insert on table "public"."research_requests" to "service_role";

grant references on table "public"."research_requests" to "service_role";

grant select on table "public"."research_requests" to "service_role";

grant trigger on table "public"."research_requests" to "service_role";

grant truncate on table "public"."research_requests" to "service_role";

grant update on table "public"."research_requests" to "service_role";

grant delete on table "public"."service_provider_categories" to "anon";

grant insert on table "public"."service_provider_categories" to "anon";

grant references on table "public"."service_provider_categories" to "anon";

grant select on table "public"."service_provider_categories" to "anon";

grant trigger on table "public"."service_provider_categories" to "anon";

grant truncate on table "public"."service_provider_categories" to "anon";

grant update on table "public"."service_provider_categories" to "anon";

grant delete on table "public"."service_provider_categories" to "authenticated";

grant insert on table "public"."service_provider_categories" to "authenticated";

grant references on table "public"."service_provider_categories" to "authenticated";

grant select on table "public"."service_provider_categories" to "authenticated";

grant trigger on table "public"."service_provider_categories" to "authenticated";

grant truncate on table "public"."service_provider_categories" to "authenticated";

grant update on table "public"."service_provider_categories" to "authenticated";

grant delete on table "public"."service_provider_categories" to "service_role";

grant insert on table "public"."service_provider_categories" to "service_role";

grant references on table "public"."service_provider_categories" to "service_role";

grant select on table "public"."service_provider_categories" to "service_role";

grant trigger on table "public"."service_provider_categories" to "service_role";

grant truncate on table "public"."service_provider_categories" to "service_role";

grant update on table "public"."service_provider_categories" to "service_role";

grant delete on table "public"."subscription_box_deliveries" to "anon";

grant insert on table "public"."subscription_box_deliveries" to "anon";

grant references on table "public"."subscription_box_deliveries" to "anon";

grant select on table "public"."subscription_box_deliveries" to "anon";

grant trigger on table "public"."subscription_box_deliveries" to "anon";

grant truncate on table "public"."subscription_box_deliveries" to "anon";

grant update on table "public"."subscription_box_deliveries" to "anon";

grant delete on table "public"."subscription_box_deliveries" to "authenticated";

grant insert on table "public"."subscription_box_deliveries" to "authenticated";

grant references on table "public"."subscription_box_deliveries" to "authenticated";

grant select on table "public"."subscription_box_deliveries" to "authenticated";

grant trigger on table "public"."subscription_box_deliveries" to "authenticated";

grant truncate on table "public"."subscription_box_deliveries" to "authenticated";

grant update on table "public"."subscription_box_deliveries" to "authenticated";

grant delete on table "public"."subscription_box_deliveries" to "service_role";

grant insert on table "public"."subscription_box_deliveries" to "service_role";

grant references on table "public"."subscription_box_deliveries" to "service_role";

grant select on table "public"."subscription_box_deliveries" to "service_role";

grant trigger on table "public"."subscription_box_deliveries" to "service_role";

grant truncate on table "public"."subscription_box_deliveries" to "service_role";

grant update on table "public"."subscription_box_deliveries" to "service_role";

grant delete on table "public"."subscription_boxes" to "anon";

grant insert on table "public"."subscription_boxes" to "anon";

grant references on table "public"."subscription_boxes" to "anon";

grant select on table "public"."subscription_boxes" to "anon";

grant trigger on table "public"."subscription_boxes" to "anon";

grant truncate on table "public"."subscription_boxes" to "anon";

grant update on table "public"."subscription_boxes" to "anon";

grant delete on table "public"."subscription_boxes" to "authenticated";

grant insert on table "public"."subscription_boxes" to "authenticated";

grant references on table "public"."subscription_boxes" to "authenticated";

grant select on table "public"."subscription_boxes" to "authenticated";

grant trigger on table "public"."subscription_boxes" to "authenticated";

grant truncate on table "public"."subscription_boxes" to "authenticated";

grant update on table "public"."subscription_boxes" to "authenticated";

grant delete on table "public"."subscription_boxes" to "service_role";

grant insert on table "public"."subscription_boxes" to "service_role";

grant references on table "public"."subscription_boxes" to "service_role";

grant select on table "public"."subscription_boxes" to "service_role";

grant trigger on table "public"."subscription_boxes" to "service_role";

grant truncate on table "public"."subscription_boxes" to "service_role";

grant update on table "public"."subscription_boxes" to "service_role";

grant delete on table "public"."transporters" to "anon";

grant insert on table "public"."transporters" to "anon";

grant references on table "public"."transporters" to "anon";

grant select on table "public"."transporters" to "anon";

grant trigger on table "public"."transporters" to "anon";

grant truncate on table "public"."transporters" to "anon";

grant update on table "public"."transporters" to "anon";

grant delete on table "public"."transporters" to "authenticated";

grant insert on table "public"."transporters" to "authenticated";

grant references on table "public"."transporters" to "authenticated";

grant select on table "public"."transporters" to "authenticated";

grant trigger on table "public"."transporters" to "authenticated";

grant truncate on table "public"."transporters" to "authenticated";

grant update on table "public"."transporters" to "authenticated";

grant delete on table "public"."transporters" to "service_role";

grant insert on table "public"."transporters" to "service_role";

grant references on table "public"."transporters" to "service_role";

grant select on table "public"."transporters" to "service_role";

grant trigger on table "public"."transporters" to "service_role";

grant truncate on table "public"."transporters" to "service_role";

grant update on table "public"."transporters" to "service_role";

grant delete on table "public"."user_notifications" to "anon";

grant insert on table "public"."user_notifications" to "anon";

grant references on table "public"."user_notifications" to "anon";

grant select on table "public"."user_notifications" to "anon";

grant trigger on table "public"."user_notifications" to "anon";

grant truncate on table "public"."user_notifications" to "anon";

grant update on table "public"."user_notifications" to "anon";

grant delete on table "public"."user_notifications" to "authenticated";

grant insert on table "public"."user_notifications" to "authenticated";

grant references on table "public"."user_notifications" to "authenticated";

grant select on table "public"."user_notifications" to "authenticated";

grant trigger on table "public"."user_notifications" to "authenticated";

grant truncate on table "public"."user_notifications" to "authenticated";

grant update on table "public"."user_notifications" to "authenticated";

grant delete on table "public"."user_notifications" to "service_role";

grant insert on table "public"."user_notifications" to "service_role";

grant references on table "public"."user_notifications" to "service_role";

grant select on table "public"."user_notifications" to "service_role";

grant trigger on table "public"."user_notifications" to "service_role";

grant truncate on table "public"."user_notifications" to "service_role";

grant update on table "public"."user_notifications" to "service_role";

create policy "Admin only"
on "public"."admin_action_logs"
as permissive
for all
to public
using ((auth.role() = 'admin'::text));


create policy "Allow delete own agent profile"
on "public"."agents"
as permissive
for delete
to public
using ((user_id = auth.uid()));


create policy "Allow insert own agent profile"
on "public"."agents"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "Allow select agent"
on "public"."agents"
as permissive
for select
to public
using (true);


create policy "Allow update own agent profile"
on "public"."agents"
as permissive
for update
to public
using ((user_id = auth.uid()));


create policy "farmer_create_batch"
on "public"."batch_tracking"
as permissive
for insert
to public
with check ((auth.uid() = farmer_id));


create policy "farmer_update_batch"
on "public"."batch_tracking"
as permissive
for update
to public
using ((auth.uid() = farmer_id));


create policy "partner_view_batch"
on "public"."batch_tracking"
as permissive
for select
to public
using (true);


create policy "buyer_accept_bid"
on "public"."bulk_order_bids"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM bulk_orders
  WHERE ((bulk_orders.id = bulk_order_bids.order_id) AND (bulk_orders.buyer_id = auth.uid())))));


create policy "farmer_bid_bulk_order"
on "public"."bulk_order_bids"
as permissive
for insert
to public
with check ((auth.uid() = farmer_id));


create policy "all_select_bulk_order"
on "public"."bulk_orders"
as permissive
for select
to public
using (true);


create policy "buyer_create_bulk_order"
on "public"."bulk_orders"
as permissive
for insert
to public
with check ((auth.uid() = buyer_id));


create policy "buyer_delete_bulk_order"
on "public"."bulk_orders"
as permissive
for delete
to public
using ((auth.uid() = buyer_id));


create policy "buyer_insert_bulk_order"
on "public"."bulk_orders"
as permissive
for insert
to public
with check ((auth.uid() = buyer_id));


create policy "buyer_update_bulk_order"
on "public"."bulk_orders"
as permissive
for update
to public
using ((auth.uid() = buyer_id));


create policy "Users can create their own advertisements"
on "public"."business_advertisements"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can delete their own advertisements"
on "public"."business_advertisements"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can update their own advertisements"
on "public"."business_advertisements"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view active advertisements"
on "public"."business_advertisements"
as permissive
for select
to public
using (((is_active = true) AND (payment_status = 'paid'::text)));


create policy "Users can view their own advertisements"
on "public"."business_advertisements"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "all_view_business_match"
on "public"."business_matches"
as permissive
for select
to public
using (true);


create policy "business_create_match"
on "public"."business_matches"
as permissive
for insert
to public
with check (((auth.uid() = business1_id) OR (auth.uid() = business2_id)));


create policy "business_update_match"
on "public"."business_matches"
as permissive
for update
to public
using (((auth.uid() = business1_id) OR (auth.uid() = business2_id)));


create policy "all_view_forum_post"
on "public"."carbon_forum_posts"
as permissive
for select
to public
using (true);


create policy "user_create_forum_post"
on "public"."carbon_forum_posts"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "user_delete_forum_post"
on "public"."carbon_forum_posts"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "user_update_forum_post"
on "public"."carbon_forum_posts"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Allow delete own auction"
on "public"."city_market_auctions"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM city_market_products
  WHERE ((city_market_products.id = city_market_auctions.product_id) AND (city_market_products.seller_user_id = auth.uid())))));


create policy "Allow insert own auction"
on "public"."city_market_auctions"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM city_market_products
  WHERE ((city_market_products.id = city_market_auctions.product_id) AND (city_market_products.seller_user_id = auth.uid())))));


create policy "Allow select auction"
on "public"."city_market_auctions"
as permissive
for select
to public
using (true);


create policy "Allow update own auction"
on "public"."city_market_auctions"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM city_market_products
  WHERE ((city_market_products.id = city_market_auctions.product_id) AND (city_market_products.seller_user_id = auth.uid())))));


create policy "Allow delete own ban recommendation"
on "public"."city_market_ban_recommendations"
as permissive
for delete
to public
using ((user_id = auth.uid()));


create policy "Allow insert own ban recommendation"
on "public"."city_market_ban_recommendations"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "Allow select own ban recommendation"
on "public"."city_market_ban_recommendations"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "Allow delete own bid"
on "public"."city_market_bids"
as permissive
for delete
to public
using ((bidder_user_id = auth.uid()));


create policy "Allow insert own bid"
on "public"."city_market_bids"
as permissive
for insert
to public
with check ((bidder_user_id = auth.uid()));


create policy "Allow select bid"
on "public"."city_market_bids"
as permissive
for select
to public
using (true);


create policy "Allow update own bid"
on "public"."city_market_bids"
as permissive
for update
to public
using ((bidder_user_id = auth.uid()));


create policy "Allow delete own comment"
on "public"."city_market_comments"
as permissive
for delete
to public
using ((user_id = auth.uid()));


create policy "Allow insert own comment"
on "public"."city_market_comments"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "Allow select own comment"
on "public"."city_market_comments"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "Allow update own comment"
on "public"."city_market_comments"
as permissive
for update
to public
using ((user_id = auth.uid()));


create policy "agent_donate_product"
on "public"."city_market_donations"
as permissive
for insert
to public
with check ((auth.uid() = agent_id));


create policy "agent_public_donate"
on "public"."city_market_donations"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "cbo_view_donations"
on "public"."city_market_donations"
as permissive
for select
to public
using (((recipient_type = 'CBO'::text) AND (recipient_id = auth.uid())));


create policy "church_view_donations"
on "public"."city_market_donations"
as permissive
for select
to public
using (((recipient_type = 'church'::text) AND (recipient_id = auth.uid())));


create policy "hospice_view_donations"
on "public"."city_market_donations"
as permissive
for select
to public
using (((recipient_type = 'hospice'::text) AND (recipient_id = auth.uid())));


create policy "hospital_view_donations"
on "public"."city_market_donations"
as permissive
for select
to public
using (((recipient_type = 'hospital'::text) AND (recipient_id = auth.uid())));


create policy "recipient_feedback_update"
on "public"."city_market_donations"
as permissive
for update
to public
using ((recipient_id = auth.uid()));


create policy "school_view_donations"
on "public"."city_market_donations"
as permissive
for select
to public
using (((recipient_type = 'school'::text) AND (recipient_id = auth.uid())));


create policy "Allow delete own flag"
on "public"."city_market_flags"
as permissive
for delete
to public
using ((user_id = auth.uid()));


create policy "Allow insert own flag"
on "public"."city_market_flags"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "Allow select own flag"
on "public"."city_market_flags"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "Allow delete own like"
on "public"."city_market_likes"
as permissive
for delete
to public
using ((user_id = auth.uid()));


create policy "Allow insert own like"
on "public"."city_market_likes"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "Allow select own like"
on "public"."city_market_likes"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "Allow delete own product"
on "public"."city_market_products"
as permissive
for delete
to public
using ((seller_user_id = auth.uid()));


create policy "Allow insert own product"
on "public"."city_market_products"
as permissive
for insert
to public
with check ((seller_user_id = auth.uid()));


create policy "Allow select product"
on "public"."city_market_products"
as permissive
for select
to public
using (true);


create policy "Allow update own product"
on "public"."city_market_products"
as permissive
for update
to public
using ((seller_user_id = auth.uid()));


create policy "agent_delete_product"
on "public"."city_market_products"
as permissive
for delete
to public
using ((auth.uid() = seller_user_id));


create policy "agent_update_product_status"
on "public"."city_market_products"
as permissive
for update
to public
using ((auth.uid() = seller_user_id));


create policy "Allow delete own rating"
on "public"."city_market_ratings"
as permissive
for delete
to public
using ((user_id = auth.uid()));


create policy "Allow insert own rating"
on "public"."city_market_ratings"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "Allow select own rating"
on "public"."city_market_ratings"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "Allow update own rating"
on "public"."city_market_ratings"
as permissive
for update
to public
using ((user_id = auth.uid()));


create policy "Anyone can view active community posts"
on "public"."community_posts"
as permissive
for select
to public
using ((is_active = true));


create policy "Users can create community posts"
on "public"."community_posts"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can delete their own community posts"
on "public"."community_posts"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can update their own community posts"
on "public"."community_posts"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Authenticated users can apply to contracts"
on "public"."contract_applications"
as permissive
for insert
to public
with check ((auth.uid() = farmer_id));


create policy "Contract owners can update application status"
on "public"."contract_applications"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM contract_farming_opportunities
  WHERE ((contract_farming_opportunities.id = contract_applications.contract_id) AND (contract_farming_opportunities.created_by = auth.uid())))));


create policy "Contract owners can view applications to their contracts"
on "public"."contract_applications"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM contract_farming_opportunities
  WHERE ((contract_farming_opportunities.id = contract_applications.contract_id) AND (contract_farming_opportunities.created_by = auth.uid())))));


create policy "Farmers can update their own applications"
on "public"."contract_applications"
as permissive
for update
to public
using ((farmer_id = auth.uid()));


create policy "Farmers can view their own applications"
on "public"."contract_applications"
as permissive
for select
to public
using ((farmer_id = auth.uid()));


create policy "Anyone can view comments"
on "public"."contract_comments"
as permissive
for select
to public
using (true);


create policy "Authenticated users can create comments"
on "public"."contract_comments"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can delete their own comments"
on "public"."contract_comments"
as permissive
for delete
to public
using ((user_id = auth.uid()));


create policy "Users can update their own comments"
on "public"."contract_comments"
as permissive
for update
to public
using ((user_id = auth.uid()));


create policy "Anyone can view documents for active contracts"
on "public"."contract_documents"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM contract_farming_opportunities
  WHERE ((contract_farming_opportunities.id = contract_documents.contract_id) AND (contract_farming_opportunities.status = 'active'::text)))));


create policy "Contract owners can manage documents"
on "public"."contract_documents"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM contract_farming_opportunities
  WHERE ((contract_farming_opportunities.id = contract_documents.contract_id) AND (contract_farming_opportunities.created_by = auth.uid())))));


create policy "Anyone can view active contract opportunities"
on "public"."contract_farming_opportunities"
as permissive
for select
to public
using ((status = 'active'::text));


create policy "Users can create contract opportunities"
on "public"."contract_farming_opportunities"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "Users can delete their own opportunities"
on "public"."contract_farming_opportunities"
as permissive
for delete
to public
using ((created_by = auth.uid()));


create policy "Users can update their own opportunities"
on "public"."contract_farming_opportunities"
as permissive
for update
to public
using ((created_by = auth.uid()));


create policy "Users can create flags"
on "public"."contract_flags"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can view their own flags"
on "public"."contract_flags"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "Anyone can view reviews"
on "public"."contract_reviews"
as permissive
for select
to public
using (true);


create policy "Authenticated users can create reviews"
on "public"."contract_reviews"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can delete their own reviews"
on "public"."contract_reviews"
as permissive
for delete
to public
using ((user_id = auth.uid()));


create policy "Users can update their own reviews"
on "public"."contract_reviews"
as permissive
for update
to public
using ((user_id = auth.uid()));


create policy "Anyone can record social shares"
on "public"."contract_social_shares"
as permissive
for insert
to public
with check (true);


create policy "Users can view social share stats"
on "public"."contract_social_shares"
as permissive
for select
to public
using (true);


create policy "Users can manage their own crop yields"
on "public"."crop_yields"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "Allow public read access to data fetch logs"
on "public"."data_fetch_logs"
as permissive
for select
to public
using (true);


create policy "Allow service role full access to data fetch logs"
on "public"."data_fetch_logs"
as permissive
for all
to service_role
using (true);


create policy "Allow authenticated users full access"
on "public"."equipment"
as permissive
for all
to public
using ((auth.uid() IS NOT NULL))
with check ((auth.uid() IS NOT NULL));


create policy "Anyone can view buy opportunities"
on "public"."export_opportunities"
as permissive
for select
to public
using (((opportunity_type = 'buy'::text) AND (status = 'open'::text)));


create policy "Delete own or admin"
on "public"."farm_budgets"
as permissive
for delete
to public
using (((user_id = auth.uid()) OR (auth.role() = 'admin'::text)));


create policy "Insert own or admin"
on "public"."farm_budgets"
as permissive
for insert
to public
with check (((user_id = auth.uid()) OR (auth.role() = 'admin'::text)));


create policy "Select own or admin"
on "public"."farm_budgets"
as permissive
for select
to public
using (((user_id = auth.uid()) OR (auth.role() = 'admin'::text)));


create policy "Update own or admin"
on "public"."farm_budgets"
as permissive
for update
to public
using (((user_id = auth.uid()) OR (auth.role() = 'admin'::text)));


create policy "Users manage own product bookmarks"
on "public"."farm_input_product_bookmarks"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "Admins can view all product likes"
on "public"."farm_input_product_likes"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM auth.users
  WHERE ((users.id = auth.uid()) AND ((users.role)::text = 'admin'::text)))));


create policy "Users manage own product likes"
on "public"."farm_input_product_likes"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "Users manage own product ratings"
on "public"."farm_input_product_ratings"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "Users manage own supplier likes"
on "public"."farm_input_supplier_likes"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "Users manage own supplier ratings"
on "public"."farm_input_supplier_ratings"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "Admins can manage all feature requests"
on "public"."feature_requests"
as permissive
for all
to authenticated
using ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) AS text) = 'admin'::text));


create policy "Admins can update all feature requests"
on "public"."feature_requests"
as permissive
for update
to authenticated
using ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) AS text) = 'admin'::text));


create policy "Allow delete for admins only"
on "public"."feature_requests"
as permissive
for delete
to public
using ((auth.role() = 'admin'::text));


create policy "Allow insert for authenticated users"
on "public"."feature_requests"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "Allow update for admins only"
on "public"."feature_requests"
as permissive
for update
to public
using ((auth.role() = 'admin'::text));


create policy "Users can insert their own feature requests"
on "public"."feature_requests"
as permissive
for insert
to authenticated
with check ((user_id = auth.uid()));


create policy "Users can update their own feature requests"
on "public"."feature_requests"
as permissive
for update
to authenticated
using ((user_id = auth.uid()));


create policy "Users can view their own feature requests"
on "public"."feature_requests"
as permissive
for select
to authenticated
using ((user_id = auth.uid()));


create policy "Users can create their own financial transactions"
on "public"."financial_transactions"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can delete their own financial transactions"
on "public"."financial_transactions"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can update their own financial transactions"
on "public"."financial_transactions"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own financial transactions"
on "public"."financial_transactions"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "all_select_rescue"
on "public"."food_rescue_listings"
as permissive
for select
to public
using (true);


create policy "farmer_delete_rescue"
on "public"."food_rescue_listings"
as permissive
for delete
to public
using ((auth.uid() = farmer_id));


create policy "farmer_insert_rescue"
on "public"."food_rescue_listings"
as permissive
for insert
to public
with check ((auth.uid() = farmer_id));


create policy "farmer_update_rescue"
on "public"."food_rescue_listings"
as permissive
for update
to public
using ((auth.uid() = farmer_id));


create policy "Anyone can view active impact metrics"
on "public"."impact_metrics"
as permissive
for select
to public
using ((is_active = true));


create policy "farmer_create_group_order"
on "public"."input_group_orders"
as permissive
for insert
to public
with check ((auth.uid() = farmer_id));


create policy "supplier_update_group_order"
on "public"."input_group_orders"
as permissive
for update
to public
using ((auth.uid() = supplier_id));


create policy "admin_verify_price"
on "public"."input_prices"
as permissive
for update
to public
using (((auth.jwt() ->> 'role'::text) = 'admin'::text));


create policy "farmer_report_price"
on "public"."input_prices"
as permissive
for insert
to public
with check ((auth.uid() = reported_by));


create policy "all_select_input_pricing"
on "public"."input_pricing"
as permissive
for select
to public
using (true);


create policy "user_insert_input_pricing"
on "public"."input_pricing"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "user_update_input_pricing"
on "public"."input_pricing"
as permissive
for update
to public
using ((auth.uid() IS NOT NULL));


create policy "all_select_input_review"
on "public"."input_reviews"
as permissive
for select
to public
using (true);


create policy "user_insert_input_review"
on "public"."input_reviews"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "user_update_input_review"
on "public"."input_reviews"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "admin_verify_review"
on "public"."input_supplier_reviews"
as permissive
for update
to public
using (((auth.jwt() ->> 'role'::text) = 'admin'::text));


create policy "farmer_review_supplier"
on "public"."input_supplier_reviews"
as permissive
for insert
to public
with check ((auth.uid() = supplier_id));


create policy "all_select_input_verification"
on "public"."input_verifications"
as permissive
for select
to public
using (true);


create policy "user_insert_input_verification"
on "public"."input_verifications"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "user_update_input_verification"
on "public"."input_verifications"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Allow public read access to kilimo statistics"
on "public"."kilimo_statistics"
as permissive
for select
to public
using (true);


create policy "Allow service role full access to kilimo statistics"
on "public"."kilimo_statistics"
as permissive
for all
to service_role
using (true);


create policy "Enable delete for listing owners"
on "public"."livestock_listings"
as permissive
for delete
to public
using ((auth.uid() = seller_id));


create policy "Enable insert for authenticated users"
on "public"."livestock_listings"
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text));


create policy "Enable read access for all users"
on "public"."livestock_listings"
as permissive
for select
to public
using (true);


create policy "Enable update for listing owners"
on "public"."livestock_listings"
as permissive
for update
to public
using ((auth.uid() = seller_id));


create policy "Allow public read access to market forecasts"
on "public"."market_forecasts"
as permissive
for select
to public
using (true);


create policy "Allow public read access to market sentiment"
on "public"."market_sentiment"
as permissive
for select
to public
using (true);


create policy "all_view_mentorship"
on "public"."mentorships"
as permissive
for select
to public
using (true);


create policy "user_create_mentorship"
on "public"."mentorships"
as permissive
for insert
to public
with check (((auth.uid() = mentor_id) OR (auth.uid() = mentee_id)));


create policy "user_update_mentorship"
on "public"."mentorships"
as permissive
for update
to public
using (((auth.uid() = mentor_id) OR (auth.uid() = mentee_id)));


create policy "Anyone can view messages"
on "public"."messages"
as permissive
for select
to public
using (true);


create policy "Users can insert their own messages"
on "public"."messages"
as permissive
for insert
to authenticated
with check ((auth.uid() = sender_id));


create policy "all_view_network_event"
on "public"."network_events"
as permissive
for select
to public
using (true);


create policy "user_create_network_event"
on "public"."network_events"
as permissive
for insert
to public
with check (true);


create policy "user_update_network_event"
on "public"."network_events"
as permissive
for update
to public
using (true);


create policy "Users can manage their own notification preferences"
on "public"."notification_preferences"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "Partner Events: Only partner owner can view/edit"
on "public"."partner_events"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM partners p
  WHERE ((p.id = partner_events.partner_id) AND (p.user_id = auth.uid())))));


create policy "Partners: Only owner can view/edit"
on "public"."partners"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "all_view_partnership"
on "public"."partnerships"
as permissive
for select
to public
using (true);


create policy "org_create_partnership"
on "public"."partnerships"
as permissive
for insert
to public
with check (((auth.uid() = org1_id) OR (auth.uid() = org2_id)));


create policy "org_update_partnership"
on "public"."partnerships"
as permissive
for update
to public
using (((auth.uid() = org1_id) OR (auth.uid() = org2_id)));


create policy "Users can create their own transactions"
on "public"."payment_transactions"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can view their own transactions"
on "public"."payment_transactions"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "all_select_match"
on "public"."processing_matches"
as permissive
for select
to public
using (true);


create policy "farmer_delete_match"
on "public"."processing_matches"
as permissive
for delete
to public
using ((auth.uid() = farmer_id));


create policy "farmer_insert_match"
on "public"."processing_matches"
as permissive
for insert
to public
with check ((auth.uid() = farmer_id));


create policy "farmer_update_match"
on "public"."processing_matches"
as permissive
for update
to public
using ((auth.uid() = farmer_id));


create policy "Users can update their own profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can view their own profile"
on "public"."profiles"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "admin_manage_recipients"
on "public"."recipients"
as permissive
for all
to public
using (((auth.jwt() ->> 'role'::text) = 'admin'::text));


create policy "all_select_match"
on "public"."rescue_matches"
as permissive
for select
to public
using (true);


create policy "recipient_insert_match"
on "public"."rescue_matches"
as permissive
for insert
to public
with check ((auth.uid() = recipient_id));


create policy "recipient_update_match"
on "public"."rescue_matches"
as permissive
for update
to public
using ((auth.uid() = recipient_id));


create policy "all_view_research_request"
on "public"."research_requests"
as permissive
for select
to public
using (true);


create policy "user_create_research_request"
on "public"."research_requests"
as permissive
for insert
to public
with check ((auth.uid() = requester_id));


create policy "user_update_research_request"
on "public"."research_requests"
as permissive
for update
to public
using ((auth.uid() = requester_id));


create policy "farmer_mark_delivery"
on "public"."subscription_box_deliveries"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM subscription_boxes
  WHERE ((subscription_boxes.id = subscription_box_deliveries.box_id) AND (subscription_boxes.farmer_id = auth.uid())))));


create policy "consumer_subscribe_box"
on "public"."subscription_boxes"
as permissive
for insert
to public
with check ((auth.uid() = consumer_id));


create policy "consumer_update_box"
on "public"."subscription_boxes"
as permissive
for update
to public
using ((auth.uid() = consumer_id));


create policy "farmer_update_box"
on "public"."subscription_boxes"
as permissive
for update
to public
using ((auth.uid() = farmer_id));


create policy "Admins can view all transporters"
on "public"."transporters"
as permissive
for select
to public
using ((auth.uid() IN ( SELECT users.id
   FROM auth.users
  WHERE (auth.uid() = users.id))));


create policy "Users can delete their own transporters"
on "public"."transporters"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can insert their own transporters"
on "public"."transporters"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their own transporters"
on "public"."transporters"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own transporters"
on "public"."transporters"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can view their own notifications"
on "public"."user_notifications"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can update their own transport requests"
on "public"."transport_requests"
as permissive
for update
to public
using (((auth.uid() = requester_id) OR (auth.uid() IN ( SELECT transporters.user_id
   FROM transporters
  WHERE (transporters.id = transport_requests.transporter_id)))));


CREATE TRIGGER update_business_advertisements_updated_at BEFORE UPDATE ON public.business_advertisements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_city_market_products_updated_at BEFORE UPDATE ON public.city_market_products FOR EACH ROW EXECUTE FUNCTION update_city_market_products_updated_at();

CREATE TRIGGER update_contract_comments_updated_at BEFORE UPDATE ON public.contract_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contract_farming_opportunities_updated_at BEFORE UPDATE ON public.contract_farming_opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contract_reviews_updated_at BEFORE UPDATE ON public.contract_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crop_yields_updated_at BEFORE UPDATE ON public.crop_yields FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_feature_request_user_id_trigger BEFORE INSERT ON public.feature_requests FOR EACH ROW EXECUTE FUNCTION set_feature_request_user_id();

CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON public.financial_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_impact_metrics_updated_at BEFORE UPDATE ON public.impact_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON public.inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kilimo_statistics_updated_at BEFORE UPDATE ON public.kilimo_statistics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_livestock_breeds_modtime BEFORE UPDATE ON public.livestock_breeds FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_livestock_for_sale_modtime BEFORE UPDATE ON public.livestock_for_sale FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_livestock_markets_modtime BEFORE UPDATE ON public.livestock_markets FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON public.payment_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_transporters_updated_at BEFORE UPDATE ON public.transporters FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at_barter_listings BEFORE UPDATE ON public.barter_listings FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_updated_at_collaboration_proposals BEFORE UPDATE ON public.collaboration_proposals FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_updated_at_crop_tracking BEFORE UPDATE ON public.crop_tracking FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_updated_at_exporter_profiles BEFORE UPDATE ON public.exporter_profiles FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_updated_at_farm_parcels BEFORE UPDATE ON public.farm_parcels FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_updated_at_farmer_exporter_collaborations BEFORE UPDATE ON public.farmer_exporter_collaborations FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_market_linkages BEFORE UPDATE ON public.market_linkages FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_produce_inventory BEFORE UPDATE ON public.produce_inventory FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_updated_at_quality_control_discussions BEFORE UPDATE ON public.quality_control_discussions FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_training_events BEFORE UPDATE ON public.training_events FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_transport_requests BEFORE UPDATE ON public.transport_requests FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_warehouse_bookings BEFORE UPDATE ON public.warehouse_bookings FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_warehouses BEFORE UPDATE ON public.warehouses FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


