import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserVerificationImages1737253430463 implements MigrationInterface {
    name = 'UpdateUserVerificationImages1737253430463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verificationImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verificationImages" text NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verificationImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verificationImages" text array NOT NULL DEFAULT '{}'`);
    }

}
