/*
  Warnings:

  - You are about to alter the column `countCard` on the `card` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - You are about to drop the column `card_number` on the `fix` table. All the data in the column will be lost.
  - You are about to alter the column `claimed_date` on the `gifthistory` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date` on the `timefix` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Made the column `goldIssued` on table `card` required. This step will fail if there are existing NULL values in that column.
  - Made the column `issued_date` on table `card` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `fix` DROP FOREIGN KEY `Fix_bookingId_fkey`;

-- DropForeignKey
ALTER TABLE `fix` DROP FOREIGN KEY `Fix_card_number_fkey`;

-- DropIndex
DROP INDEX `Fix_bookingId_fkey` ON `fix`;

-- DropIndex
DROP INDEX `Fix_card_number_fkey` ON `fix`;

-- AlterTable
ALTER TABLE `card` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `vip_number` VARCHAR(191) NULL,
    MODIFY `countCard` INTEGER NULL,
    MODIFY `goldIssued` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `issued_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `fix` DROP COLUMN `card_number`,
    ADD COLUMN `Tax_invoice_code` VARCHAR(191) NULL,
    ADD COLUMN `branchId` VARCHAR(36) NULL,
    ADD COLUMN `cardId` VARCHAR(191) NULL,
    MODIFY `bookingId` VARCHAR(36) NULL,
    MODIFY `fixStatus` VARCHAR(191) NULL DEFAULT 'padding';

-- AlterTable
ALTER TABLE `gifthistory` MODIFY `claimed_date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `timefix` MODIFY `date` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `Fix` ADD CONSTRAINT `Fix_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`booking_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fix` ADD CONSTRAINT `Fix_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`branch_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fix` ADD CONSTRAINT `Fix_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`card_id`) ON DELETE SET NULL ON UPDATE CASCADE;
