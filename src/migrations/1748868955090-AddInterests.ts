import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInterests1748868955090 implements MigrationInterface {
    name = 'AddInterests1748868955090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" RENAME COLUMN "status" TO "type"`);
        await queryRunner.query(`ALTER TYPE "public"."vehicle_status_enum" RENAME TO "vehicle_type_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "interests" character varying array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "interests"`);
        await queryRunner.query(`ALTER TYPE "public"."vehicle_type_enum" RENAME TO "vehicle_status_enum"`);
        await queryRunner.query(`ALTER TABLE "vehicle" RENAME COLUMN "type" TO "status"`);
    }

}
