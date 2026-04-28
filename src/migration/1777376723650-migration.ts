import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777376723650 implements MigrationInterface {
    name = 'Migration1777376723650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wya"."setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "siteTitle" character varying, "contactEmail" character varying, "phone" character varying, "address" character varying, CONSTRAINT "PK_fcb21187dc6094e24a48f677bed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "wya"."admin" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "wya"."admin" ADD "phone" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wya"."admin" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "wya"."admin" DROP COLUMN "name"`);
        await queryRunner.query(`DROP TABLE "wya"."setting"`);
    }

}
