import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserImagesType21737386418852 implements MigrationInterface {
    name = 'UpdateUserImagesType21737386418852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileImages" jsonb`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verificationImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verificationImages" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verificationImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verificationImages" text array`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileImages" text array`);
    }

}
