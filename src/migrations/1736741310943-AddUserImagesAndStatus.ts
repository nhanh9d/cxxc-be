import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserImagesAndStatus1736741310943 implements MigrationInterface {
    name = 'AddUserImagesAndStatus1736741310943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "profileImages" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verificationImages" text array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verificationImages"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImages"`);
    }

}
