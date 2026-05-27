/*
  Warnings:

  - You are about to drop the column `discount` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `carPartPrice` on the `Fix` table. All the data in the column will be lost.
  - You are about to drop the column `fixCarPrice` on the `Fix` table. All the data in the column will be lost.
  - You are about to drop the column `totalPoint` on the `Fix` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `GiftCard` table. All the data in the column will be lost.
  - You are about to drop the column `point` on the `GiftCard` table. All the data in the column will be lost.
  - You are about to alter the column `customer_number` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
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
DROP INDEX `User_phoneNumber_key` ON `User`;

-- AlterTable
ALTER TABLE `Branch` MODIFY `createBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Car` MODIFY `createBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Card` DROP COLUMN `discount`,
    ADD COLUMN `active_point` DOUBLE NULL,
    ADD COLUMN `card_type` VARCHAR(191) NULL,
    ADD COLUMN `color` VARCHAR(191) NULL,
    ADD COLUMN `countCard` DECIMAL(65, 30) NULL,
    ADD COLUMN `engine_number` VARCHAR(191) NULL,
    ADD COLUMN `expiration_date` DATETIME(3) NULL,
    ADD COLUMN `frame_number` VARCHAR(191) NULL,
    ADD COLUMN `goldIssued` DATETIME(3) NULL,
    ADD COLUMN `issued_date` DATETIME(3) NULL,
    ADD COLUMN `plate_number` VARCHAR(191) NULL,
    ADD COLUMN `received` VARCHAR(191) NULL,
    ADD COLUMN `running_labour` DOUBLE NULL,
    ADD COLUMN `running_part` DOUBLE NULL,
    ADD COLUMN `total_point` DOUBLE NULL,
    ADD COLUMN `vehicle_model` VARCHAR(191) NULL,
    MODIFY `createBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Employee` MODIFY `createBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Fix` DROP COLUMN `carPartPrice`,
    DROP COLUMN `fixCarPrice`,
    DROP COLUMN `totalPoint`,
    ADD COLUMN `card_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `exchange_rate` INTEGER NULL,
    ADD COLUMN `invoice_date` DATETIME(3) NULL,
    ADD COLUMN `invoice_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `labour_point` DOUBLE NULL,
    ADD COLUMN `labour_total` INTEGER NULL,
    ADD COLUMN `part_point` DOUBLE NULL,
    ADD COLUMN `part_total` INTEGER NULL,
    ADD COLUMN `payment_type` VARCHAR(191) NULL,
    MODIFY `createBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `GiftCard` DROP COLUMN `name`,
    DROP COLUMN `point`,
    ADD COLUMN `gift_Code` VARCHAR(191) NOT NULL,
    ADD COLUMN `gift_Name` VARCHAR(191) NULL,
    ADD COLUMN `gift_Point` DOUBLE NULL,
    MODIFY `createBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `GiftHistory` ADD COLUMN `cardId` VARCHAR(36) NOT NULL,
    ADD COLUMN `card_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `claimed_date` DATETIME NOT NULL,
    ADD COLUMN `gift_Code` VARCHAR(191) NOT NULL,
    MODIFY `createBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Promotion` MODIFY `createBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Service` MODIFY `createBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Time` MODIFY `createBy` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `TimeFix` ADD COLUMN `date` DATETIME NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `coperate` VARCHAR(191) NULL,
    ADD COLUMN `corperate_name` VARCHAR(191) NULL,
    ADD COLUMN `dob` DATETIME(3) NULL,
    ADD COLUMN `first_name` VARCHAR(191) NULL,
    ADD COLUMN `gender` VARCHAR(191) NULL,
    ADD COLUMN `house` VARCHAR(191) NULL,
    ADD COLUMN `last_name` VARCHAR(191) NULL,
    ADD COLUMN `nationality` VARCHAR(191) NULL,
    ADD COLUMN `ocupation` VARCHAR(191) NULL,
    ADD COLUMN `pobox` VARCHAR(191) NULL,
    ADD COLUMN `street` VARCHAR(191) NULL,
    ADD COLUMN `unit` VARCHAR(191) NULL,
    MODIFY `customer_number` VARCHAR(10) NOT NULL,
    MODIFY `phoneNumber` VARCHAR(191) NOT NULL,
    MODIFY `province` VARCHAR(191) NULL,
    MODIFY `district` VARCHAR(191) NULL,
    MODIFY `village` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Zone` MODIFY `createBy` VARCHAR(191) NULL;

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
