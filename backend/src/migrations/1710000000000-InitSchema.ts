import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1710000000000 implements MigrationInterface {
  name = "InitSchema1710000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("CREATE EXTENSION IF NOT EXISTS \"pgcrypto\"");

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying(80) NOT NULL,
        "email" character varying(140) NOT NULL,
        "password_hash" character varying NOT NULL,
        "role" character varying(20) NOT NULL DEFAULT 'author',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying(60) NOT NULL,
        "description" character varying(200),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_categories_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_categories_name" UNIQUE ("name")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "posts" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "title" character varying(150) NOT NULL,
        "content" text NOT NULL,
        "status" character varying(20) NOT NULL DEFAULT 'draft',
        "author_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_posts_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_posts_author" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "posts_categories" (
        "post_id" uuid NOT NULL,
        "category_id" uuid NOT NULL,
        CONSTRAINT "PK_posts_categories" PRIMARY KEY ("post_id", "category_id"),
        CONSTRAINT "FK_post_category_post" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_post_category_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "comments" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "content" text NOT NULL,
        "author_id" uuid,
        "post_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_comments_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_comments_author" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_comments_post" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query("CREATE INDEX \"IDX_posts_created_at\" ON \"posts\" (\"created_at\")");
    await queryRunner.query("CREATE INDEX \"IDX_posts_title\" ON \"posts\" (\"title\")");
    await queryRunner.query("CREATE INDEX \"IDX_posts_author\" ON \"posts\" (\"author_id\")");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP INDEX IF EXISTS \"IDX_posts_author\"");
    await queryRunner.query("DROP INDEX IF EXISTS \"IDX_posts_title\"");
    await queryRunner.query("DROP INDEX IF EXISTS \"IDX_posts_created_at\"");
    await queryRunner.query("DROP TABLE IF EXISTS \"comments\"");
    await queryRunner.query("DROP TABLE IF EXISTS \"posts_categories\"");
    await queryRunner.query("DROP TABLE IF EXISTS \"posts\"");
    await queryRunner.query("DROP TABLE IF EXISTS \"categories\"");
    await queryRunner.query("DROP TABLE IF EXISTS \"users\"");
  }
}
