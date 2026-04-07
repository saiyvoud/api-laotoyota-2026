/*
  Warnings:

  - You are about to drop the column `timeFixTimefix_id` on the `Booking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Booking` DROP FOREIGN KEY `Booking_timeFixTimefix_id_fkey`;

-- DropIndex
DROP INDEX `Booking_timeFixTimefix_id_fkey` ON `Booking`;

-- AlterTable
ALTER TABLE `Booking` DROP COLUMN `timeFixTimefix_id`;
