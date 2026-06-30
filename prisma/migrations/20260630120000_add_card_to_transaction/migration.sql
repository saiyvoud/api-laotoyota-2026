-- ລຶບ test data ເກົ່າ (dev only)
DELETE FROM `Transaction`;

-- ລຶບ foreign key userId ເກົ່າ
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_userId_fkey`;

-- ລຶບ column userId ເກົ່າ
ALTER TABLE `Transaction` DROP COLUMN `userId`;

-- ເພີ່ມ column cardId ໃໝ່
ALTER TABLE `Transaction` ADD COLUMN `cardId` VARCHAR(36) NOT NULL;

-- ເພີ່ມ foreign key cardId
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`card_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
