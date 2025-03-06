import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustImages1738662627197 implements MigrationInterface {
    name = 'AdjustImages1738662627197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileImages" character varying array`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verificationImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verificationImages" jsonb array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verificationImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verificationImages" jsonb`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileImages" jsonb`);
    }

}
