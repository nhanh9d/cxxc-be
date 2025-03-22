import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEventCreator1742180195255 implements MigrationInterface {
    name = 'AddEventCreator1742180195255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_member" DROP CONSTRAINT "FK_69d029e67ea56f5deecd76efc20"`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP CONSTRAINT "FK_5064eb0d8bc1644f3a38fd2f2d8"`);
        await queryRunner.query(`ALTER TABLE "event_invitation" DROP CONSTRAINT "FK_742c47278cdaa787edc14440973"`);
        await queryRunner.query(`ALTER TABLE "event_invitation" DROP CONSTRAINT "FK_1c34f8133652f00bb30a7fb76d8"`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP CONSTRAINT "REL_5064eb0d8bc1644f3a38fd2f2d"`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP COLUMN "memberId"`);
        await queryRunner.query(`ALTER TABLE "event_invitation" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "event_invitation" DROP CONSTRAINT "REL_1c34f8133652f00bb30a7fb76d"`);
        await queryRunner.query(`ALTER TABLE "event_invitation" DROP COLUMN "memberId"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "creatorId" integer`);
        await queryRunner.query(`ALTER TABLE "event_invitation" ADD "invitorId" integer`);
        await queryRunner.query(`ALTER TABLE "event_invitation" ADD "inviteeId" integer`);
        await queryRunner.query(`ALTER TABLE "event_member" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_member" ALTER COLUMN "eventId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP CONSTRAINT "REL_69d029e67ea56f5deecd76efc2"`);
        await queryRunner.query(`ALTER TABLE "event_rule" ALTER COLUMN "eventId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_invitation" ALTER COLUMN "eventId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_invitation" DROP CONSTRAINT "REL_742c47278cdaa787edc1444097"`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_7a773352fcf1271324f2e5a3e41" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD CONSTRAINT "FK_1791f560d1344e6c4ef3c64d2be" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD CONSTRAINT "FK_69d029e67ea56f5deecd76efc20" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_rule" ADD CONSTRAINT "FK_15dc5d3bd08df5bcc6829ab9af2" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_invitation" ADD CONSTRAINT "FK_742c47278cdaa787edc14440973" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_invitation" ADD CONSTRAINT "FK_38d7f554bcbf2fa72c00e744073" FOREIGN KEY ("invitorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_invitation" ADD CONSTRAINT "FK_c404daae859e25442753cce4ef6" FOREIGN KEY ("inviteeId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_invitation" DROP CONSTRAINT "FK_c404daae859e25442753cce4ef6"`);
        await queryRunner.query(`ALTER TABLE "event_invitation" DROP CONSTRAINT "FK_38d7f554bcbf2fa72c00e744073"`);
        await queryRunner.query(`ALTER TABLE "event_invitation" DROP CONSTRAINT "FK_742c47278cdaa787edc14440973"`);
        await queryRunner.query(`ALTER TABLE "event_rule" DROP CONSTRAINT "FK_15dc5d3bd08df5bcc6829ab9af2"`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP CONSTRAINT "FK_69d029e67ea56f5deecd76efc20"`);
        await queryRunner.query(`ALTER TABLE "event_member" DROP CONSTRAINT "FK_1791f560d1344e6c4ef3c64d2be"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_7a773352fcf1271324f2e5a3e41"`);
        await queryRunner.query(`ALTER TABLE "event_invitation" ADD CONSTRAINT "REL_742c47278cdaa787edc1444097" UNIQUE ("eventId")`);
        await queryRunner.query(`ALTER TABLE "event_invitation" ALTER COLUMN "eventId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_rule" ALTER COLUMN "eventId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD CONSTRAINT "REL_69d029e67ea56f5deecd76efc2" UNIQUE ("eventId")`);
        await queryRunner.query(`ALTER TABLE "event_member" ALTER COLUMN "eventId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_member" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_invitation" DROP COLUMN "inviteeId"`);
        await queryRunner.query(`ALTER TABLE "event_invitation" DROP COLUMN "invitorId"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "creatorId"`);
        await queryRunner.query(`ALTER TABLE "event_invitation" ADD "memberId" integer`);
        await queryRunner.query(`ALTER TABLE "event_invitation" ADD CONSTRAINT "REL_1c34f8133652f00bb30a7fb76d" UNIQUE ("memberId")`);
        await queryRunner.query(`ALTER TABLE "event_invitation" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD "memberId" integer`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD CONSTRAINT "REL_5064eb0d8bc1644f3a38fd2f2d" UNIQUE ("memberId")`);
        await queryRunner.query(`ALTER TABLE "event_invitation" ADD CONSTRAINT "FK_1c34f8133652f00bb30a7fb76d8" FOREIGN KEY ("memberId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_invitation" ADD CONSTRAINT "FK_742c47278cdaa787edc14440973" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD CONSTRAINT "FK_5064eb0d8bc1644f3a38fd2f2d8" FOREIGN KEY ("memberId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_member" ADD CONSTRAINT "FK_69d029e67ea56f5deecd76efc20" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
