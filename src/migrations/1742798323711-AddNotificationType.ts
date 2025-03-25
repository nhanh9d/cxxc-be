import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotificationType1742798323711 implements MigrationInterface {
    name = 'AddNotificationType1742798323711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "metadata" jsonb`);
        await queryRunner.query(`ALTER TYPE "public"."event_status_enum" RENAME TO "event_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."event_status_enum" AS ENUM('opened', 'finished', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "status" TYPE "public"."event_status_enum" USING "status"::"text"::"public"."event_status_enum"`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "status" SET DEFAULT 'opened'`);
        await queryRunner.query(`DROP TYPE "public"."event_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_type_enum" RENAME TO "notification_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum" AS ENUM('EVENT_FINISHED', 'EVENT_INVITATION', 'EVENT_UPDATE', 'EVENT_CANCEL', 'EVENT_MEMBER_JOINED', 'EVENT_MEMBER_LEFT', 'EVENT_MEMBER_INVITATION', 'EVENT_MEMBER_REJECTED', 'EVENT_MEMBER_ACCEPTED', 'EVENT_MEMBER_REMOVED', 'USER_PROFILE_UPDATED', 'USER_PROFILE_VERIFIED', 'USER_PROFILE_REJECTED', 'VEHICLE_CREATED', 'VEHICLE_UPDATED', 'VEHICLE_VERIFIED', 'VEHICLE_REJECTED')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum" USING "type"::"text"::"public"."notification_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notification_type_enum_old" AS ENUM('EVENT_MEMBER_JOINED', 'EVENT_MEMBER_LEFT')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "type" TYPE "public"."notification_type_enum_old" USING "type"::"text"::"public"."notification_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_type_enum_old" RENAME TO "notification_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."event_status_enum_old" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "status" TYPE "public"."event_status_enum_old" USING "status"::"text"::"public"."event_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "status" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "public"."event_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."event_status_enum_old" RENAME TO "event_status_enum"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "metadata"`);
    }

}
