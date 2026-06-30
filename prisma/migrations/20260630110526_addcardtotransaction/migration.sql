-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_cardId_fkey`;

-- DropIndex
DROP INDEX `Transaction_cardId_fkey` ON `transaction`;

-- AlterTable
ALTER TABLE `transaction` MODIFY `cardId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`card_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
