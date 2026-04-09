/*
  Warnings:

  - You are about to drop the column `zoneId` on the `Fix` table. All the data in the column will be lost.
  - Added the required column `zoneId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Fix` DROP FOREIGN KEY `Fix_zoneId_fkey`;

-- DropIndex
DROP INDEX `Fix_zoneId_fkey` ON `Fix`;

-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `zoneId` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `Fix` DROP COLUMN `zoneId`,
    ADD COLUMN `zoneZone_id` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_zoneId_fkey` FOREIGN KEY (`zoneId`) REFERENCES `Zone`(`zone_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fix` ADD CONSTRAINT `Fix_zoneZone_id_fkey` FOREIGN KEY (`zoneZone_id`) REFERENCES `Zone`(`zone_id`) ON DELETE SET NULL ON UPDATE CASCADE;
