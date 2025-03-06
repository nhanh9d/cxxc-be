import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTestEntity1738662278059 implements MigrationInterface {
    name = 'AddTestEntity1738662278059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "test" ("id" SERIAL NOT NULL, "profileImages" character varying array, CONSTRAINT "PK_5417af0062cf987495b611b59c7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "test"`);
    }

}
