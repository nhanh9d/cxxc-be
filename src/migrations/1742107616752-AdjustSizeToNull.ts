import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustSizeToNull1742107616752 implements MigrationInterface {
    name = 'AdjustSizeToNull1742107616752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "size" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "size" SET NOT NULL`);
    }

}
