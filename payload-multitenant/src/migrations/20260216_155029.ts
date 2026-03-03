import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Add columns to users table if they don't exist
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'enable_a_p_i_key') THEN
        ALTER TABLE "users" ADD COLUMN "enable_a_p_i_key" boolean;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'api_key') THEN
        ALTER TABLE "users" ADD COLUMN "api_key" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'api_key_index') THEN
        ALTER TABLE "users" ADD COLUMN "api_key_index" varchar;
      END IF;
    END $$;
  `)

  // Add columns to proposals table if they don't exist
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'rejection_reason') THEN
        ALTER TABLE "proposals" ADD COLUMN "rejection_reason" varchar;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'access_pass') THEN
        ALTER TABLE "proposals" ADD COLUMN "access_pass" varchar NOT NULL DEFAULT 'TEMP123';
      END IF;
    END $$;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'enable_a_p_i_key') THEN
        ALTER TABLE "users" DROP COLUMN "enable_a_p_i_key";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'api_key') THEN
        ALTER TABLE "users" DROP COLUMN "api_key";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'api_key_index') THEN
        ALTER TABLE "users" DROP COLUMN "api_key_index";
      END IF;
    END $$;
  `)
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'rejection_reason') THEN
        ALTER TABLE "proposals" DROP COLUMN "rejection_reason";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proposals' AND column_name = 'access_pass') THEN
        ALTER TABLE "proposals" DROP COLUMN "access_pass";
      END IF;
    END $$;
  `)
}
