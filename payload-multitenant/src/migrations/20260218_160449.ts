import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published', 'archived');
  ALTER TABLE "pages" ADD COLUMN "status" "enum_pages_status" DEFAULT 'draft';
  ALTER TABLE "posts" ADD COLUMN "status" "enum_posts_status" DEFAULT 'draft';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "status";
  ALTER TABLE "posts" DROP COLUMN "status";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum_posts_status";`)
}
