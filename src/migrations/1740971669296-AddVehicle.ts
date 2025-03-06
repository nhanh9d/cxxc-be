import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVehicle1740971669296 implements MigrationInterface {
    name = 'AddVehicle1740971669296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."vehicle_status_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "vehicle" ("id" SERIAL NOT NULL, "fullname" character varying NOT NULL, "cylinderCapacity" character varying NOT NULL, "status" "public"."vehicle_status_enum" NOT NULL DEFAULT '1', "images" character varying array, "userId" integer NOT NULL, CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "vehicle"`);
        await queryRunner.query(`DROP TYPE "public"."vehicle_status_enum"`);
    }

}
