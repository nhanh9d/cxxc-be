import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserImagesType1737253856952 implements MigrationInterface {
    name = 'UpdateUserImagesType1737253856952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileImages" text array`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verificationImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verificationImages" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verificationImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verificationImages" text NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileImages" text NOT NULL DEFAULT '[]'`);
    }

}
