/*
  Warnings:

  - You are about to drop the column `timefix_Id` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `day` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Booking` DROP FOREIGN KEY `Booking_timefix_Id_fkey`;

-- DropIndex
DROP INDEX `Booking_timefix_Id_fkey` ON `Booking`;

-- AlterTable
ALTER TABLE `Booking` DROP COLUMN `timefix_Id`,
    ADD COLUMN `day` DATETIME(3) NOT NULL,
    ADD COLUMN `timeFixTimefix_id` VARCHAR(36) NULL,
    ADD COLUMN `timeId` VARCHAR(36) NOT NULL;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_timeId_fkey` FOREIGN KEY (`timeId`) REFERENCES `Time`(`time_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_timeFixTimefix_id_fkey` FOREIGN KEY (`timeFixTimefix_id`) REFERENCES `TimeFix`(`timefix_id`) ON DELETE SET NULL ON UPDATE CASCADE;
