import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustRelationship1742627870036 implements MigrationInterface {
    name = 'AdjustRelationship1742627870036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event_rule" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event_rule" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event_invitation" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event_invitation" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "vehicle" ADD CONSTRAINT "FK_86aea53f0b2b4f046e25e8315d1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vehicle" DROP CONSTRAINT "FK_86aea53f0b2b4f046e25e8315d1"`);
        await queryRunner.query(`ALTER TABLE "vehicle" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "event_invitation" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "event_invitation" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "event_rule" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "event_rule" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "createdAt"`);
    }

}
