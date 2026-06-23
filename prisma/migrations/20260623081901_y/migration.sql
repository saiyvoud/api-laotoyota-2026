-- DropIndex
DROP INDEX `Fix_invoice_number_key` ON `Fix`;

-- AlterTable
ALTER TABLE `Car` MODIFY `engineNumber` VARCHAR(191) NULL,
    MODIFY `province` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Card` MODIFY `active_point` INTEGER NULL,
    MODIFY `total_point` INTEGER NULL;

-- AlterTable
ALTER TABLE `Fix` ADD COLUMN `frameNumber` VARCHAR(191) NULL,
    MODIFY `invoice_number` VARCHAR(191) NULL,
    MODIFY `labour_point` INTEGER NULL,
    MODIFY `part_point` INTEGER NULL;

-- AlterTable
ALTER TABLE `GiftHistory` ADD COLUMN `received` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Setting` ADD COLUMN `pointFix` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `pointPart` INTEGER NOT NULL DEFAULT 0;
