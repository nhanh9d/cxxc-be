import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustVerificationImages1738662655108 implements MigrationInterface {
    name = 'AdjustVerificationImages1738662655108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verificationImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verificationImages" character varying array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verificationImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verificationImages" jsonb array`);
    }

}
