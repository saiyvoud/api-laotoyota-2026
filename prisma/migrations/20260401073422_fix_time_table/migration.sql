/*
  Warnings:

  - You are about to drop the column `zoneZone_id` on the `time` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `time` DROP FOREIGN KEY `Time_zoneZone_id_fkey`;

-- DropIndex
DROP INDEX `Time_zoneZone_id_fkey` ON `time`;

-- AlterTable
ALTER TABLE `time` DROP COLUMN `zoneZone_id`,
    ADD COLUMN `zoneId` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `Time` ADD CONSTRAINT `Time_zoneId_fkey` FOREIGN KEY (`zoneId`) REFERENCES `Zone`(`zone_id`) ON DELETE SET NULL ON UPDATE CASCADE;
