/*
  Warnings:

  - You are about to alter the column `customer_number` on the `card` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
  - You are about to alter the column `card_number` on the `card` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
  - You are about to alter the column `vip_number` on the `card` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(5)`.
  - You are about to drop the column `name` on the `giftcard` table. All the data in the column will be lost.
  - You are about to drop the column `point` on the `giftcard` table. All the data in the column will be lost.
  - You are about to alter the column `customer_number` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
  - You are about to alter the column `province` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(5)`.
  - You are about to alter the column `district` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `village` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - A unique constraint covering the columns `[card_number]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invoice_number]` on the table `Fix` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gift_Code]` on the table `GiftCard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customer_number]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `card_number` to the `Fix` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoice_number` to the `Fix` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gift_Code` to the `GiftCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardId` to the `GiftHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `card_number` to the `GiftHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `claimed_date` to the `GiftHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gift_Code` to the `GiftHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_phoneNumber_key` ON `user`;

-- AlterTable
ALTER TABLE `card` ADD COLUMN `active_point` DOUBLE NULL,
    ADD COLUMN `card_type` VARCHAR(1) NULL,
    ADD COLUMN `color` VARCHAR(20) NULL,
    ADD COLUMN `countCard` DECIMAL(18, 0) NULL,
    ADD COLUMN `engine_number` VARCHAR(30) NULL,
    ADD COLUMN `expiration_date` DATETIME NULL,
    ADD COLUMN `frame_number` VARCHAR(30) NULL,
    ADD COLUMN `goldIssued` DATETIME NULL,
    ADD COLUMN `issued_date` DATETIME NULL,
    ADD COLUMN `plate_number` VARCHAR(10) NULL,
    ADD COLUMN `received` VARCHAR(1) NULL,
    ADD COLUMN `running_labour` DOUBLE NULL,
    ADD COLUMN `running_part` DOUBLE NULL,
    ADD COLUMN `total_point` DOUBLE NULL,
    ADD COLUMN `vehicle_model` VARCHAR(30) NULL,
    MODIFY `customer_number` VARCHAR(10) NOT NULL,
    MODIFY `card_number` VARCHAR(10) NOT NULL,
    MODIFY `vip_number` VARCHAR(5) NOT NULL,
    MODIFY `discount` INTEGER NULL;

-- AlterTable
ALTER TABLE `fix` ADD COLUMN `card_number` VARCHAR(10) NOT NULL,
    ADD COLUMN `exchange_rate` INTEGER NULL,
    ADD COLUMN `invoice_date` DATETIME NULL,
    ADD COLUMN `invoice_number` VARCHAR(8) NOT NULL,
    ADD COLUMN `labour_point` DOUBLE NULL,
    ADD COLUMN `labour_total` INTEGER NULL,
    ADD COLUMN `part_point` DOUBLE NULL,
    ADD COLUMN `part_total` INTEGER NULL,
    ADD COLUMN `payment_type` VARCHAR(10) NULL;

-- AlterTable
ALTER TABLE `giftcard` DROP COLUMN `name`,
    DROP COLUMN `point`,
    ADD COLUMN `gift_Code` VARCHAR(3) NOT NULL,
    ADD COLUMN `gift_Name` VARCHAR(10) NULL,
    ADD COLUMN `gift_Point` DOUBLE NULL;

-- AlterTable
ALTER TABLE `gifthistory` ADD COLUMN `cardId` VARCHAR(36) NOT NULL,
    ADD COLUMN `card_number` VARCHAR(10) NOT NULL,
    ADD COLUMN `claimed_date` DATETIME NOT NULL,
    ADD COLUMN `gift_Code` VARCHAR(3) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `address` VARCHAR(70) NULL,
    ADD COLUMN `coperate` VARCHAR(1) NULL,
    ADD COLUMN `corperate_name` VARCHAR(100) NULL,
    ADD COLUMN `dob` DATETIME NULL,
    ADD COLUMN `first_name` VARCHAR(25) NULL,
    ADD COLUMN `gender` VARCHAR(1) NULL,
    ADD COLUMN `house` VARCHAR(5) NULL,
    ADD COLUMN `last_name` VARCHAR(25) NULL,
    ADD COLUMN `nationality` VARCHAR(20) NULL,
    ADD COLUMN `ocupation` VARCHAR(40) NULL,
    ADD COLUMN `pobox` VARCHAR(10) NULL,
    ADD COLUMN `street` VARCHAR(30) NULL,
    ADD COLUMN `unit` VARCHAR(5) NULL,
    MODIFY `customer_number` VARCHAR(10) NOT NULL,
    MODIFY `phoneNumber` VARCHAR(20) NOT NULL,
    MODIFY `province` VARCHAR(5) NULL,
    MODIFY `district` VARCHAR(30) NULL,
    MODIFY `village` VARCHAR(30) NULL;

-- CreateTable
CREATE TABLE `Setting` (
    `setting_id` VARCHAR(36) NOT NULL,
    `priceFix` INTEGER NOT NULL,
    `pricePart` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`setting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Card_card_number_key` ON `Card`(`card_number`);

-- CreateIndex
CREATE UNIQUE INDEX `Fix_invoice_number_key` ON `Fix`(`invoice_number`);

-- CreateIndex
CREATE UNIQUE INDEX `GiftCard_gift_Code_key` ON `GiftCard`(`gift_Code`);

-- CreateIndex
CREATE UNIQUE INDEX `User_customer_number_key` ON `User`(`customer_number`);

-- AddForeignKey
ALTER TABLE `GiftHistory` ADD CONSTRAINT `GiftHistory_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`card_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fix` ADD CONSTRAINT `Fix_card_number_fkey` FOREIGN KEY (`card_number`) REFERENCES `Card`(`card_number`) ON DELETE RESTRICT ON UPDATE CASCADE;
