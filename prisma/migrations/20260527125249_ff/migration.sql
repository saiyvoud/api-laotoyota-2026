/*
  Warnings:

  - You are about to drop the column `color` on the `card` table. All the data in the column will be lost.
  - You are about to drop the column `engine_number` on the `card` table. All the data in the column will be lost.
  - You are about to drop the column `frame_number` on the `card` table. All the data in the column will be lost.
  - You are about to drop the column `plate_number` on the `card` table. All the data in the column will be lost.
  - You are about to drop the column `vehicle_model` on the `card` table. All the data in the column will be lost.
  - You are about to alter the column `claimed_date` on the `gifthistory` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date` on the `timefix` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[carId]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `carId` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `card` DROP FOREIGN KEY `Card_userId_fkey`;

-- DropIndex
DROP INDEX `Card_userId_fkey` ON `card`;

-- AlterTable
ALTER TABLE `card` DROP COLUMN `color`,
    DROP COLUMN `engine_number`,
    DROP COLUMN `frame_number`,
    DROP COLUMN `plate_number`,
    DROP COLUMN `vehicle_model`,
    ADD COLUMN `carId` VARCHAR(36) NOT NULL,
    MODIFY `userId` VARCHAR(36) NULL;

-- AlterTable
ALTER TABLE `gifthistory` MODIFY `claimed_date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `timefix` MODIFY `date` DATETIME NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Card_carId_key` ON `Card`(`carId`);

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`car_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
