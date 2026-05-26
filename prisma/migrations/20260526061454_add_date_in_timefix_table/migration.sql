/*
  Warnings:

  - You are about to alter the column `expiration_date` on the `card` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `goldIssued` on the `card` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `issued_date` on the `card` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `carPartPrice` on the `fix` table. All the data in the column will be lost.
  - You are about to drop the column `fixCarPrice` on the `fix` table. All the data in the column will be lost.
  - You are about to drop the column `totalPoint` on the `fix` table. All the data in the column will be lost.
  - You are about to alter the column `invoice_date` on the `fix` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `claimed_date` on the `gifthistory` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `dob` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `date` to the `TimeFix` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `card` MODIFY `expiration_date` DATETIME NULL,
    MODIFY `goldIssued` DATETIME NULL,
    MODIFY `issued_date` DATETIME NULL;

-- AlterTable
ALTER TABLE `fix` DROP COLUMN `carPartPrice`,
    DROP COLUMN `fixCarPrice`,
    DROP COLUMN `totalPoint`,
    MODIFY `invoice_date` DATETIME NULL;

-- AlterTable
ALTER TABLE `gifthistory` MODIFY `claimed_date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `timefix` ADD COLUMN `date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `province` VARCHAR(30) NULL,
    MODIFY `dob` DATETIME NULL;
