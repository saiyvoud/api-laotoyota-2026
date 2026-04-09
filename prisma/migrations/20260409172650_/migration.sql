/*
  Warnings:

  - You are about to alter the column `zoneId` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(36)`.

*/
-- DropForeignKey
ALTER TABLE `Booking` DROP FOREIGN KEY `Booking_zoneId_fkey`;

-- DropIndex
DROP INDEX `Booking_zoneId_fkey` ON `Booking`;

-- AlterTable
ALTER TABLE `Booking` MODIFY `zoneId` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_zoneId_fkey` FOREIGN KEY (`zoneId`) REFERENCES `Zone`(`zone_id`) ON DELETE SET NULL ON UPDATE CASCADE;
