import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('superAdmin', 'tenantAdmin', 'tenantEditor', 'tenantViewer');
  CREATE TYPE "public"."enum_proposals_included_items_icon" AS ENUM('Document', 'Microphone', 'UserGroup', 'Scale', 'Briefcase', 'Chart', 'Cog', 'Globe');
  CREATE TYPE "public"."enum_proposals_status" AS ENUM('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired');
  CREATE TYPE "public"."enum_proposals_version_type" AS ENUM('express', 'complete', 'both');
  CREATE TYPE "public"."enum_proposal_templates_category" AS ENUM('webDesign', 'itServices', 'consulting', 'custom');
  CREATE TYPE "public"."enum_proposal_templates_niche" AS ENUM('advocacia', 'retalho', 'tecnologia', 'saude', 'geral');
  CREATE TYPE "public"."enum_motores_icon" AS ENUM('Document', 'Microphone', 'UserGroup', 'Scale', 'Briefcase', 'Chart', 'Cog', 'Globe');
  CREATE TYPE "public"."enum_addons_category" AS ENUM('automation', 'seo', 'content', 'integration', 'support', 'other');
  CREATE TYPE "public"."enum_testimonials_niche" AS ENUM('advocacia', 'retalho', 'tecnologia', 'saude', 'geral');
  CREATE TYPE "public"."enum_faqs_category" AS ENUM('direitos', 'deveres', 'suporte', 'tecnico', 'financeiro', 'general');
  CREATE TYPE "public"."enum_faqs_niche" AS ENUM('advocacia', 'retalho', 'tecnologia', 'saude', 'geral');
  CREATE TABLE "users_tenants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"role" "enum_users_role" DEFAULT 'tenantViewer' NOT NULL,
  	"avatar_id" integer,
  	"onboarding_has_seen_welcome" boolean DEFAULT false,
  	"onboarding_welcome_seen_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "tenants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"domain" varchar,
  	"logo_id" integer,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar,
  	"content" jsonb NOT NULL,
  	"featured_image_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_config_header_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "site_config_footer_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"site_name" varchar NOT NULL,
  	"site_description" varchar,
  	"logo_id" integer,
  	"favicon_id" integer,
  	"social_twitter" varchar,
  	"social_facebook" varchar,
  	"social_instagram" varchar,
  	"social_linkedin" varchar,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"contact_whatsapp" varchar,
  	"contact_address" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"footer_copyright" varchar,
  	"analytics_google_analytics_id" varchar,
  	"analytics_google_tag_manager_id" varchar,
  	"welcome_headline" varchar,
  	"welcome_subheadline" varchar,
  	"welcome_show_onboarding_steps" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "proposals_pricing_tiers_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL
  );
  
  CREATE TABLE "proposals_pricing_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"setup_price" numeric NOT NULL,
  	"monthly_price" numeric NOT NULL,
  	"recommended" boolean DEFAULT false
  );
  
  CREATE TABLE "proposals_roadmap_phases_agency_tasks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"task" varchar NOT NULL
  );
  
  CREATE TABLE "proposals_roadmap_phases_client_tasks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"task" varchar NOT NULL
  );
  
  CREATE TABLE "proposals_roadmap_phases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"phase" numeric NOT NULL,
  	"title" varchar NOT NULL,
  	"duration" varchar NOT NULL
  );
  
  CREATE TABLE "proposals_included_items_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature_text" varchar NOT NULL
  );
  
  CREATE TABLE "proposals_included_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_proposals_included_items_icon" DEFAULT 'Document' NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"order" numeric
  );
  
  CREATE TABLE "proposals_variable_costs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"estimated_cost" numeric NOT NULL,
  	"description" varchar,
  	"required" boolean DEFAULT false
  );
  
  CREATE TABLE "proposals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_proposals_status" DEFAULT 'draft' NOT NULL,
  	"version_type" "enum_proposals_version_type" DEFAULT 'complete',
  	"client_name" varchar NOT NULL,
  	"client_email" varchar NOT NULL,
  	"client_company" varchar,
  	"client_phone" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_description" varchar,
  	"hero_loom_url" varchar,
  	"hero_thumbnail_image_id" integer,
  	"diagnostic_problem_label" varchar DEFAULT 'Desafios & Riscos',
  	"diagnostic_problem" varchar,
  	"diagnostic_solution_label" varchar DEFAULT 'Soberania & Performance',
  	"diagnostic_solution" varchar,
  	"pricing_setup_price" numeric NOT NULL,
  	"pricing_monthly_base" numeric NOT NULL,
  	"pricing_setup_label" varchar DEFAULT 'Alinhado',
  	"pricing_notes" jsonb,
  	"template_id" integer,
  	"valid_until" timestamp(3) with time zone,
  	"sent_at" timestamp(3) with time zone,
  	"viewed_at" timestamp(3) with time zone,
  	"responded_at" timestamp(3) with time zone,
  	"public_token" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "proposals_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"motores_id" integer,
  	"addons_id" integer,
  	"testimonials_id" integer,
  	"team_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "proposal_templates_default_pricing_tiers_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL
  );
  
  CREATE TABLE "proposal_templates_default_pricing_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"setup_price" numeric NOT NULL,
  	"monthly_price" numeric NOT NULL,
  	"recommended" boolean DEFAULT false
  );
  
  CREATE TABLE "proposal_templates_default_roadmap_agency_tasks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"task" varchar NOT NULL
  );
  
  CREATE TABLE "proposal_templates_default_roadmap_client_tasks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"task" varchar NOT NULL
  );
  
  CREATE TABLE "proposal_templates_default_roadmap" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"phase" numeric NOT NULL,
  	"title" varchar NOT NULL,
  	"duration" varchar NOT NULL
  );
  
  CREATE TABLE "proposal_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"category" "enum_proposal_templates_category" DEFAULT 'itServices',
  	"niche" "enum_proposal_templates_niche" DEFAULT 'geral',
  	"default_hero_title" varchar,
  	"default_hero_description" varchar,
  	"default_diagnostic_problem" varchar,
  	"default_diagnostic_solution" varchar,
  	"default_pricing_setup_price" numeric,
  	"default_pricing_monthly_base" numeric,
  	"default_pricing_setup_label" varchar DEFAULT 'Alinhado',
  	"active" boolean DEFAULT true,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "proposal_templates_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"motores_id" integer,
  	"addons_id" integer,
  	"testimonials_id" integer,
  	"team_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "motores_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature_text" varchar NOT NULL
  );
  
  CREATE TABLE "motores" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon" "enum_motores_icon" DEFAULT 'Document' NOT NULL,
  	"active" boolean DEFAULT true,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "addons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"setup_price" numeric NOT NULL,
  	"monthly_price" numeric NOT NULL,
  	"hours_saved" numeric,
  	"retention_boost" numeric,
  	"detailed_solution" jsonb,
  	"roi_impact" jsonb,
  	"third_party_costs" jsonb,
  	"category" "enum_addons_category" DEFAULT 'automation',
  	"active" boolean DEFAULT true,
  	"popular" boolean DEFAULT false,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"quote" varchar NOT NULL,
  	"logo_id" integer,
  	"photo_id" integer,
  	"niche" "enum_testimonials_niche",
  	"active" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"bio" varchar NOT NULL,
  	"photo_id" integer NOT NULL,
  	"email" varchar,
  	"linkedin" varchar,
  	"active" boolean DEFAULT true,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"category" "enum_faqs_category" DEFAULT 'general' NOT NULL,
  	"niche" "enum_faqs_niche" DEFAULT 'geral',
  	"active" boolean DEFAULT true,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"tenants_id" integer,
  	"pages_id" integer,
  	"posts_id" integer,
  	"categories_id" integer,
  	"site_config_id" integer,
  	"proposals_id" integer,
  	"proposal_templates_id" integer,
  	"motores_id" integer,
  	"addons_id" integer,
  	"testimonials_id" integer,
  	"team_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenants" ADD CONSTRAINT "tenants_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_config_header_navigation" ADD CONSTRAINT "site_config_header_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config_footer_navigation" ADD CONSTRAINT "site_config_footer_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config" ADD CONSTRAINT "site_config_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_config" ADD CONSTRAINT "site_config_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_config" ADD CONSTRAINT "site_config_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_config" ADD CONSTRAINT "site_config_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proposals_pricing_tiers_features" ADD CONSTRAINT "proposals_pricing_tiers_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proposals_pricing_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposals_pricing_tiers" ADD CONSTRAINT "proposals_pricing_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proposals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposals_roadmap_phases_agency_tasks" ADD CONSTRAINT "proposals_roadmap_phases_agency_tasks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proposals_roadmap_phases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposals_roadmap_phases_client_tasks" ADD CONSTRAINT "proposals_roadmap_phases_client_tasks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proposals_roadmap_phases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposals_roadmap_phases" ADD CONSTRAINT "proposals_roadmap_phases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proposals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposals_included_items_features" ADD CONSTRAINT "proposals_included_items_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proposals_included_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposals_included_items" ADD CONSTRAINT "proposals_included_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proposals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposals_variable_costs" ADD CONSTRAINT "proposals_variable_costs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proposals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposals" ADD CONSTRAINT "proposals_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proposals" ADD CONSTRAINT "proposals_hero_thumbnail_image_id_media_id_fk" FOREIGN KEY ("hero_thumbnail_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proposals" ADD CONSTRAINT "proposals_template_id_proposal_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."proposal_templates"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proposals_rels" ADD CONSTRAINT "proposals_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."proposals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposals_rels" ADD CONSTRAINT "proposals_rels_motores_fk" FOREIGN KEY ("motores_id") REFERENCES "public"."motores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposals_rels" ADD CONSTRAINT "proposals_rels_addons_fk" FOREIGN KEY ("addons_id") REFERENCES "public"."addons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposals_rels" ADD CONSTRAINT "proposals_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposals_rels" ADD CONSTRAINT "proposals_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposals_rels" ADD CONSTRAINT "proposals_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposal_templates_default_pricing_tiers_features" ADD CONSTRAINT "proposal_templates_default_pricing_tiers_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proposal_templates_default_pricing_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposal_templates_default_pricing_tiers" ADD CONSTRAINT "proposal_templates_default_pricing_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proposal_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposal_templates_default_roadmap_agency_tasks" ADD CONSTRAINT "proposal_templates_default_roadmap_agency_tasks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proposal_templates_default_roadmap"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposal_templates_default_roadmap_client_tasks" ADD CONSTRAINT "proposal_templates_default_roadmap_client_tasks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proposal_templates_default_roadmap"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposal_templates_default_roadmap" ADD CONSTRAINT "proposal_templates_default_roadmap_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."proposal_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposal_templates_rels" ADD CONSTRAINT "proposal_templates_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."proposal_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposal_templates_rels" ADD CONSTRAINT "proposal_templates_rels_motores_fk" FOREIGN KEY ("motores_id") REFERENCES "public"."motores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposal_templates_rels" ADD CONSTRAINT "proposal_templates_rels_addons_fk" FOREIGN KEY ("addons_id") REFERENCES "public"."addons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposal_templates_rels" ADD CONSTRAINT "proposal_templates_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposal_templates_rels" ADD CONSTRAINT "proposal_templates_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "proposal_templates_rels" ADD CONSTRAINT "proposal_templates_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "motores_features" ADD CONSTRAINT "motores_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."motores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team" ADD CONSTRAINT "team_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_config_fk" FOREIGN KEY ("site_config_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_proposals_fk" FOREIGN KEY ("proposals_id") REFERENCES "public"."proposals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_proposal_templates_fk" FOREIGN KEY ("proposal_templates_id") REFERENCES "public"."proposal_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_motores_fk" FOREIGN KEY ("motores_id") REFERENCES "public"."motores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_addons_fk" FOREIGN KEY ("addons_id") REFERENCES "public"."addons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_tenants_order_idx" ON "users_tenants" USING btree ("_order");
  CREATE INDEX "users_tenants_parent_id_idx" ON "users_tenants" USING btree ("_parent_id");
  CREATE INDEX "users_tenants_tenant_idx" ON "users_tenants" USING btree ("tenant_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_tenant_idx" ON "media" USING btree ("tenant_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "tenants_slug_idx" ON "tenants" USING btree ("slug");
  CREATE INDEX "tenants_logo_idx" ON "tenants" USING btree ("logo_id");
  CREATE INDEX "tenants_updated_at_idx" ON "tenants" USING btree ("updated_at");
  CREATE INDEX "tenants_created_at_idx" ON "tenants" USING btree ("created_at");
  CREATE INDEX "pages_tenant_idx" ON "pages" USING btree ("tenant_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "posts_tenant_idx" ON "posts" USING btree ("tenant_id");
  CREATE INDEX "posts_featured_image_idx" ON "posts" USING btree ("featured_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "categories_tenant_idx" ON "categories" USING btree ("tenant_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "site_config_header_navigation_order_idx" ON "site_config_header_navigation" USING btree ("_order");
  CREATE INDEX "site_config_header_navigation_parent_id_idx" ON "site_config_header_navigation" USING btree ("_parent_id");
  CREATE INDEX "site_config_footer_navigation_order_idx" ON "site_config_footer_navigation" USING btree ("_order");
  CREATE INDEX "site_config_footer_navigation_parent_id_idx" ON "site_config_footer_navigation" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_config_tenant_idx" ON "site_config" USING btree ("tenant_id");
  CREATE INDEX "site_config_logo_idx" ON "site_config" USING btree ("logo_id");
  CREATE INDEX "site_config_favicon_idx" ON "site_config" USING btree ("favicon_id");
  CREATE INDEX "site_config_seo_seo_og_image_idx" ON "site_config" USING btree ("seo_og_image_id");
  CREATE INDEX "site_config_updated_at_idx" ON "site_config" USING btree ("updated_at");
  CREATE INDEX "site_config_created_at_idx" ON "site_config" USING btree ("created_at");
  CREATE INDEX "proposals_pricing_tiers_features_order_idx" ON "proposals_pricing_tiers_features" USING btree ("_order");
  CREATE INDEX "proposals_pricing_tiers_features_parent_id_idx" ON "proposals_pricing_tiers_features" USING btree ("_parent_id");
  CREATE INDEX "proposals_pricing_tiers_order_idx" ON "proposals_pricing_tiers" USING btree ("_order");
  CREATE INDEX "proposals_pricing_tiers_parent_id_idx" ON "proposals_pricing_tiers" USING btree ("_parent_id");
  CREATE INDEX "proposals_roadmap_phases_agency_tasks_order_idx" ON "proposals_roadmap_phases_agency_tasks" USING btree ("_order");
  CREATE INDEX "proposals_roadmap_phases_agency_tasks_parent_id_idx" ON "proposals_roadmap_phases_agency_tasks" USING btree ("_parent_id");
  CREATE INDEX "proposals_roadmap_phases_client_tasks_order_idx" ON "proposals_roadmap_phases_client_tasks" USING btree ("_order");
  CREATE INDEX "proposals_roadmap_phases_client_tasks_parent_id_idx" ON "proposals_roadmap_phases_client_tasks" USING btree ("_parent_id");
  CREATE INDEX "proposals_roadmap_phases_order_idx" ON "proposals_roadmap_phases" USING btree ("_order");
  CREATE INDEX "proposals_roadmap_phases_parent_id_idx" ON "proposals_roadmap_phases" USING btree ("_parent_id");
  CREATE INDEX "proposals_included_items_features_order_idx" ON "proposals_included_items_features" USING btree ("_order");
  CREATE INDEX "proposals_included_items_features_parent_id_idx" ON "proposals_included_items_features" USING btree ("_parent_id");
  CREATE INDEX "proposals_included_items_order_idx" ON "proposals_included_items" USING btree ("_order");
  CREATE INDEX "proposals_included_items_parent_id_idx" ON "proposals_included_items" USING btree ("_parent_id");
  CREATE INDEX "proposals_variable_costs_order_idx" ON "proposals_variable_costs" USING btree ("_order");
  CREATE INDEX "proposals_variable_costs_parent_id_idx" ON "proposals_variable_costs" USING btree ("_parent_id");
  CREATE INDEX "proposals_tenant_idx" ON "proposals" USING btree ("tenant_id");
  CREATE UNIQUE INDEX "proposals_slug_idx" ON "proposals" USING btree ("slug");
  CREATE INDEX "proposals_hero_hero_thumbnail_image_idx" ON "proposals" USING btree ("hero_thumbnail_image_id");
  CREATE INDEX "proposals_template_idx" ON "proposals" USING btree ("template_id");
  CREATE INDEX "proposals_updated_at_idx" ON "proposals" USING btree ("updated_at");
  CREATE INDEX "proposals_created_at_idx" ON "proposals" USING btree ("created_at");
  CREATE INDEX "proposals_rels_order_idx" ON "proposals_rels" USING btree ("order");
  CREATE INDEX "proposals_rels_parent_idx" ON "proposals_rels" USING btree ("parent_id");
  CREATE INDEX "proposals_rels_path_idx" ON "proposals_rels" USING btree ("path");
  CREATE INDEX "proposals_rels_motores_id_idx" ON "proposals_rels" USING btree ("motores_id");
  CREATE INDEX "proposals_rels_addons_id_idx" ON "proposals_rels" USING btree ("addons_id");
  CREATE INDEX "proposals_rels_testimonials_id_idx" ON "proposals_rels" USING btree ("testimonials_id");
  CREATE INDEX "proposals_rels_team_id_idx" ON "proposals_rels" USING btree ("team_id");
  CREATE INDEX "proposals_rels_faqs_id_idx" ON "proposals_rels" USING btree ("faqs_id");
  CREATE INDEX "proposal_templates_default_pricing_tiers_features_order_idx" ON "proposal_templates_default_pricing_tiers_features" USING btree ("_order");
  CREATE INDEX "proposal_templates_default_pricing_tiers_features_parent_id_idx" ON "proposal_templates_default_pricing_tiers_features" USING btree ("_parent_id");
  CREATE INDEX "proposal_templates_default_pricing_tiers_order_idx" ON "proposal_templates_default_pricing_tiers" USING btree ("_order");
  CREATE INDEX "proposal_templates_default_pricing_tiers_parent_id_idx" ON "proposal_templates_default_pricing_tiers" USING btree ("_parent_id");
  CREATE INDEX "proposal_templates_default_roadmap_agency_tasks_order_idx" ON "proposal_templates_default_roadmap_agency_tasks" USING btree ("_order");
  CREATE INDEX "proposal_templates_default_roadmap_agency_tasks_parent_id_idx" ON "proposal_templates_default_roadmap_agency_tasks" USING btree ("_parent_id");
  CREATE INDEX "proposal_templates_default_roadmap_client_tasks_order_idx" ON "proposal_templates_default_roadmap_client_tasks" USING btree ("_order");
  CREATE INDEX "proposal_templates_default_roadmap_client_tasks_parent_id_idx" ON "proposal_templates_default_roadmap_client_tasks" USING btree ("_parent_id");
  CREATE INDEX "proposal_templates_default_roadmap_order_idx" ON "proposal_templates_default_roadmap" USING btree ("_order");
  CREATE INDEX "proposal_templates_default_roadmap_parent_id_idx" ON "proposal_templates_default_roadmap" USING btree ("_parent_id");
  CREATE INDEX "proposal_templates_updated_at_idx" ON "proposal_templates" USING btree ("updated_at");
  CREATE INDEX "proposal_templates_created_at_idx" ON "proposal_templates" USING btree ("created_at");
  CREATE INDEX "proposal_templates_rels_order_idx" ON "proposal_templates_rels" USING btree ("order");
  CREATE INDEX "proposal_templates_rels_parent_idx" ON "proposal_templates_rels" USING btree ("parent_id");
  CREATE INDEX "proposal_templates_rels_path_idx" ON "proposal_templates_rels" USING btree ("path");
  CREATE INDEX "proposal_templates_rels_motores_id_idx" ON "proposal_templates_rels" USING btree ("motores_id");
  CREATE INDEX "proposal_templates_rels_addons_id_idx" ON "proposal_templates_rels" USING btree ("addons_id");
  CREATE INDEX "proposal_templates_rels_testimonials_id_idx" ON "proposal_templates_rels" USING btree ("testimonials_id");
  CREATE INDEX "proposal_templates_rels_team_id_idx" ON "proposal_templates_rels" USING btree ("team_id");
  CREATE INDEX "proposal_templates_rels_faqs_id_idx" ON "proposal_templates_rels" USING btree ("faqs_id");
  CREATE INDEX "motores_features_order_idx" ON "motores_features" USING btree ("_order");
  CREATE INDEX "motores_features_parent_id_idx" ON "motores_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "motores_slug_idx" ON "motores" USING btree ("slug");
  CREATE INDEX "motores_updated_at_idx" ON "motores" USING btree ("updated_at");
  CREATE INDEX "motores_created_at_idx" ON "motores" USING btree ("created_at");
  CREATE UNIQUE INDEX "addons_slug_idx" ON "addons" USING btree ("slug");
  CREATE INDEX "addons_updated_at_idx" ON "addons" USING btree ("updated_at");
  CREATE INDEX "addons_created_at_idx" ON "addons" USING btree ("created_at");
  CREATE INDEX "testimonials_logo_idx" ON "testimonials" USING btree ("logo_id");
  CREATE INDEX "testimonials_photo_idx" ON "testimonials" USING btree ("photo_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "team_photo_idx" ON "team" USING btree ("photo_id");
  CREATE INDEX "team_updated_at_idx" ON "team" USING btree ("updated_at");
  CREATE INDEX "team_created_at_idx" ON "team" USING btree ("created_at");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_tenants_id_idx" ON "payload_locked_documents_rels" USING btree ("tenants_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_site_config_id_idx" ON "payload_locked_documents_rels" USING btree ("site_config_id");
  CREATE INDEX "payload_locked_documents_rels_proposals_id_idx" ON "payload_locked_documents_rels" USING btree ("proposals_id");
  CREATE INDEX "payload_locked_documents_rels_proposal_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("proposal_templates_id");
  CREATE INDEX "payload_locked_documents_rels_motores_id_idx" ON "payload_locked_documents_rels" USING btree ("motores_id");
  CREATE INDEX "payload_locked_documents_rels_addons_id_idx" ON "payload_locked_documents_rels" USING btree ("addons_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_team_id_idx" ON "payload_locked_documents_rels" USING btree ("team_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_tenants" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "tenants" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "site_config_header_navigation" CASCADE;
  DROP TABLE "site_config_footer_navigation" CASCADE;
  DROP TABLE "site_config" CASCADE;
  DROP TABLE "proposals_pricing_tiers_features" CASCADE;
  DROP TABLE "proposals_pricing_tiers" CASCADE;
  DROP TABLE "proposals_roadmap_phases_agency_tasks" CASCADE;
  DROP TABLE "proposals_roadmap_phases_client_tasks" CASCADE;
  DROP TABLE "proposals_roadmap_phases" CASCADE;
  DROP TABLE "proposals_included_items_features" CASCADE;
  DROP TABLE "proposals_included_items" CASCADE;
  DROP TABLE "proposals_variable_costs" CASCADE;
  DROP TABLE "proposals" CASCADE;
  DROP TABLE "proposals_rels" CASCADE;
  DROP TABLE "proposal_templates_default_pricing_tiers_features" CASCADE;
  DROP TABLE "proposal_templates_default_pricing_tiers" CASCADE;
  DROP TABLE "proposal_templates_default_roadmap_agency_tasks" CASCADE;
  DROP TABLE "proposal_templates_default_roadmap_client_tasks" CASCADE;
  DROP TABLE "proposal_templates_default_roadmap" CASCADE;
  DROP TABLE "proposal_templates" CASCADE;
  DROP TABLE "proposal_templates_rels" CASCADE;
  DROP TABLE "motores_features" CASCADE;
  DROP TABLE "motores" CASCADE;
  DROP TABLE "addons" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "team" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_proposals_included_items_icon";
  DROP TYPE "public"."enum_proposals_status";
  DROP TYPE "public"."enum_proposals_version_type";
  DROP TYPE "public"."enum_proposal_templates_category";
  DROP TYPE "public"."enum_proposal_templates_niche";
  DROP TYPE "public"."enum_motores_icon";
  DROP TYPE "public"."enum_addons_category";
  DROP TYPE "public"."enum_testimonials_niche";
  DROP TYPE "public"."enum_faqs_category";
  DROP TYPE "public"."enum_faqs_niche";`)
}
