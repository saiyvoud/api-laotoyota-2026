/*
  Warnings:

  - You are about to drop the column `totalPoint` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `point` on the `GiftHistory` table. All the data in the column will be lost.
  - You are about to drop the column `point` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Booking` DROP COLUMN `totalPoint`;

-- AlterTable
ALTER TABLE `Fix` ADD COLUMN `totalPoint` INTEGER NULL;

-- AlterTable
ALTER TABLE `GiftHistory` DROP COLUMN `point`,
    ADD COLUMN `total` INTEGER NULL;

-- AlterTable
ALTER TABLE `Service` DROP COLUMN `point`;
