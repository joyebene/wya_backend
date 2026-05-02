import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777727150841 implements MigrationInterface {
    name = 'Migration1777727150841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wya"."campaign_workers" DROP COLUMN "skills"`);
        await queryRunner.query(`ALTER TABLE "wya"."campaign_workers" ADD "polling_unit" character varying`);
        await queryRunner.query(`ALTER TABLE "wya"."campaign_workers" ADD "occupation" character varying`);
        await queryRunner.query(`ALTER TABLE "wya"."campaign_workers" ADD "age" integer`);
        await queryRunner.query(`ALTER TABLE "wya"."campaign_workers" ADD "gender" character varying`);
        await queryRunner.query(`ALTER TABLE "wya"."campaign_workers" ADD "address" text`);
        await queryRunner.query(`ALTER TABLE "wya"."campaign_workers" ADD "reason_to_join" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wya"."campaign_workers" DROP COLUMN "reason_to_join"`);
        await queryRunner.query(`ALTER TABLE "wya"."campaign_workers" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "wya"."campaign_workers" DROP COLUMN "gender"`);
        await queryRunner.query(`ALTER TABLE "wya"."campaign_workers" DROP COLUMN "age"`);
        await queryRunner.query(`ALTER TABLE "wya"."campaign_workers" DROP COLUMN "occupation"`);
        await queryRunner.query(`ALTER TABLE "wya"."campaign_workers" DROP COLUMN "polling_unit"`);
        await queryRunner.query(`ALTER TABLE "wya"."campaign_workers" ADD "skills" text`);
    }

}
