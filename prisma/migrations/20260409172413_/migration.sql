-- DropForeignKey
ALTER TABLE `Booking` DROP FOREIGN KEY `Booking_zoneId_fkey`;

-- DropIndex
DROP INDEX `Booking_zoneId_fkey` ON `Booking`;

-- AlterTable
ALTER TABLE `Booking` MODIFY `zoneId` VARCHAR(191) NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_zoneId_fkey` FOREIGN KEY (`zoneId`) REFERENCES `Zone`(`zone_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
