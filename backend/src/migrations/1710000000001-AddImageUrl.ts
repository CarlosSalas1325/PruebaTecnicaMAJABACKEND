import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageUrl1710000000001 implements MigrationInterface {
  name = "AddImageUrl1710000000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "image_url" character varying(500)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN IF EXISTS "image_url"`);
  }
}
