import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEvent1741257817903 implements MigrationInterface {
    name = 'AddEvent1741257817903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event_rule" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "icon" character varying NOT NULL, "eventId" integer NOT NULL, CONSTRAINT "PK_af487d526551bb3a9135c276766" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."event_status_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "event" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "banner" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "startLocation" character varying NOT NULL, "description" character varying, "size" integer NOT NULL, "status" "public"."event_status_enum" NOT NULL DEFAULT '0', CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_invitation" ("id" SERIAL NOT NULL, "status" integer NOT NULL, "eventId" integer NOT NULL, "userId" integer NOT NULL, "memberId" integer, CONSTRAINT "REL_742c47278cdaa787edc1444097" UNIQUE ("eventId"), CONSTRAINT "REL_1c34f8133652f00bb30a7fb76d" UNIQUE ("memberId"), CONSTRAINT "PK_e0263312dc6afcb62916431fc54" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_member" ("id" SERIAL NOT NULL, "status" integer NOT NULL, "memberRole" integer NOT NULL, "eventId" integer NOT NULL, "userId" integer NOT NULL, "memberId" integer, CONSTRAINT "REL_69d029e67ea56f5deecd76efc2" UNIQUE ("eventId"), CONSTRAINT "REL_5064eb0d8bc1644f3a38fd2f2d" UNIQUE ("memberId"), CONSTRAINT "PK_7f0294bd68161038c7d28943380" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "event_invitation" ADD CONSTRAINT "FK_742c47278cdaa787edc14440973" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_invitation" ADD CONSTRAINT "FK_1c34f8133652f00bb30a7fb76d8" FOREIGN KEY ("memberId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD CONSTRAINT "FK_69d029e67ea56f5deecd76efc20" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD CONSTRAINT "FK_5064eb0d8bc1644f3a38fd2f2d8" FOREIGN KEY ("memberId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_member" DROP CONSTRAINT "FK_5064eb0d8bc1644f3a38fd2f2d8"`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP CONSTRAINT "FK_69d029e67ea56f5deecd76efc20"`);
        await queryRunner.query(`ALTER TABLE "event_invitation" DROP CONSTRAINT "FK_1c34f8133652f00bb30a7fb76d8"`);
        await queryRunner.query(`ALTER TABLE "event_invitation" DROP CONSTRAINT "FK_742c47278cdaa787edc14440973"`);
        await queryRunner.query(`DROP TABLE "event_member"`);
        await queryRunner.query(`DROP TABLE "event_invitation"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TYPE "public"."event_status_enum"`);
        await queryRunner.query(`DROP TABLE "event_rule"`);
    }

}
