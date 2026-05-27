/*
  Warnings:

  - You are about to drop the column `customer_number` on the `card` table. All the data in the column will be lost.
  - You are about to alter the column `claimed_date` on the `gifthistory` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `date` on the `timefix` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `card` DROP COLUMN `customer_number`;

-- AlterTable
ALTER TABLE `gifthistory` MODIFY `claimed_date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `timefix` MODIFY `date` DATETIME NULL;
