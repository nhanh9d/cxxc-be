import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserProfileImages1737253361465 implements MigrationInterface {
    name = 'UpdateUserProfileImages1737253361465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileImages" text NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImages"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileImages" text array NOT NULL DEFAULT '{}'`);
    }

}
