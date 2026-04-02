/*
  Warnings:

  - You are about to drop the column `branchBranch_id` on the `Time` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `Zone` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Time` DROP FOREIGN KEY `Time_branchBranch_id_fkey`;

-- DropForeignKey
ALTER TABLE `Zone` DROP FOREIGN KEY `Zone_branchId_fkey`;

-- DropIndex
DROP INDEX `Time_branchBranch_id_fkey` ON `Time`;

-- DropIndex
DROP INDEX `Zone_branchId_fkey` ON `Zone`;

-- AlterTable
ALTER TABLE `Time` DROP COLUMN `branchBranch_id`,
    MODIFY `date` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `TimeFix` ADD COLUMN `branchId` VARCHAR(36) NULL;

-- AlterTable
ALTER TABLE `Zone` DROP COLUMN `branchId`;

-- AddForeignKey
ALTER TABLE `TimeFix` ADD CONSTRAINT `TimeFix_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`branch_id`) ON DELETE SET NULL ON UPDATE CASCADE;
