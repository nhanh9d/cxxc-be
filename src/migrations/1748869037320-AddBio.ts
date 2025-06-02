import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBio1748869037320 implements MigrationInterface {
    name = 'AddBio1748869037320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "bio" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`);
    }

}
