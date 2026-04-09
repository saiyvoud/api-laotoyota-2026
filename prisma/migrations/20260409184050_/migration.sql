/*
  Warnings:

  - You are about to drop the column `zoneZone_id` on the `Fix` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Fix` DROP FOREIGN KEY `Fix_zoneZone_id_fkey`;

-- DropIndex
DROP INDEX `Fix_zoneZone_id_fkey` ON `Fix`;

-- AlterTable
ALTER TABLE `Fix` DROP COLUMN `zoneZone_id`;
