import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSystemConfig1742868698652 implements MigrationInterface {
    name = 'AddSystemConfig1742868698652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."system_config_type_enum" AS ENUM('GENERAL', 'NOTIFICATION', 'SECURITY', 'FEATURE_FLAG')`);
        await queryRunner.query(`CREATE TYPE "public"."system_config_datatype_enum" AS ENUM('STRING', 'NUMBER', 'BOOLEAN', 'JSON')`);
        await queryRunner.query(`CREATE TABLE "system_config" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "key" character varying NOT NULL, "description" text, "type" "public"."system_config_type_enum" NOT NULL, "dataType" "public"."system_config_datatype_enum" NOT NULL, "value" text NOT NULL, "isEncrypted" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_eedd3cd0f227c7fb5eff2204e93" UNIQUE ("key"), CONSTRAINT "PK_db4e70ac0d27e588176e9bb44a0" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "system_config"`);
        await queryRunner.query(`DROP TYPE "public"."system_config_datatype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."system_config_type_enum"`);
    }

}
