import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateImageUrls1742627870037 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Update event banner
        await queryRunner.query(`
            UPDATE "event" 
            SET "banner" = REPLACE("banner", 'https://1cfc-14-232-206-135.ngrok-free.app', '')
            WHERE "banner" LIKE '%https://1cfc-14-232-206-135.ngrok-free.app%'
        `);

        // Update user profile images
        await queryRunner.query(`
            UPDATE "user"
            SET "profileImages" = ARRAY(
                SELECT REPLACE(unnest("profileImages"), 'https://1cfc-14-232-206-135.ngrok-free.app', '')
                FROM "user" u2
                WHERE u2.id = "user".id
                AND "profileImages" IS NOT NULL
            )
            WHERE EXISTS (
                SELECT 1 FROM unnest("profileImages") img
                WHERE img LIKE '%https://1cfc-14-232-206-135.ngrok-free.app%'
            )
        `);

        // Update user verification images
        await queryRunner.query(`
            UPDATE "user"
            SET "verificationImages" = ARRAY(
                SELECT REPLACE(unnest("verificationImages"), 'https://1cfc-14-232-206-135.ngrok-free.app', '')
                FROM "user" u2
                WHERE u2.id = "user".id
                AND "verificationImages" IS NOT NULL
            )
            WHERE EXISTS (
                SELECT 1 FROM unnest("verificationImages") img
                WHERE img LIKE '%https://1cfc-14-232-206-135.ngrok-free.app%'
            )
        `);

        // Update vehicle images
        await queryRunner.query(`
            UPDATE "vehicle"
            SET "images" = ARRAY(
                SELECT REPLACE(unnest("images"), 'https://1cfc-14-232-206-135.ngrok-free.app', '')
                FROM "vehicle" v2
                WHERE v2.id = "vehicle".id
                AND "images" IS NOT NULL
            )
            WHERE EXISTS (
                SELECT 1 FROM unnest("images") img
                WHERE img LIKE '%https://1cfc-14-232-206-135.ngrok-free.app%'
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert event banner
        await queryRunner.query(`
            UPDATE "event" 
            SET "banner" = CONCAT("banner", 'https://1cfc-14-232-206-135.ngrok-free.app')
            WHERE "banner" NOT LIKE '%https://1cfc-14-232-206-135.ngrok-free.app%'
        `);

        // Revert user profile images
        await queryRunner.query(`
            UPDATE "user"
            SET "profileImages" = ARRAY(
                SELECT CONCAT(unnest("profileImages"), 'https://1cfc-14-232-206-135.ngrok-free.app')
                FROM "user" u2
                WHERE u2.id = "user".id
                AND "profileImages" IS NOT NULL
            )
            WHERE EXISTS (
                SELECT 1 FROM unnest("profileImages") img
                WHERE img NOT LIKE '%https://1cfc-14-232-206-135.ngrok-free.app%'
            )
        `);

        // Revert user verification images
        await queryRunner.query(`
            UPDATE "user"
            SET "verificationImages" = ARRAY(
                SELECT CONCAT(unnest("verificationImages"), 'https://1cfc-14-232-206-135.ngrok-free.app')
                FROM "user" u2
                WHERE u2.id = "user".id
                AND "verificationImages" IS NOT NULL
            )
            WHERE EXISTS (
                SELECT 1 FROM unnest("verificationImages") img
                WHERE img NOT LIKE '%https://1cfc-14-232-206-135.ngrok-free.app%'
            )
        `);

        // Revert vehicle images
        await queryRunner.query(`
            UPDATE "vehicle"
            SET "images" = ARRAY(
                SELECT CONCAT(unnest("images"), 'https://1cfc-14-232-206-135.ngrok-free.app')
                FROM "vehicle" v2
                WHERE v2.id = "vehicle".id
                AND "images" IS NOT NULL
            )
            WHERE EXISTS (
                SELECT 1 FROM unnest("images") img
                WHERE img NOT LIKE '%https://1cfc-14-232-206-135.ngrok-free.app%'
            )
        `);
    }
}