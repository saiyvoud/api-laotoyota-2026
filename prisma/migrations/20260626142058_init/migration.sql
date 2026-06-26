-- CreateTable
CREATE TABLE `User` (
    `user_id` VARCHAR(36) NOT NULL,
    `customer_number` VARCHAR(10) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `profile` VARCHAR(191) NULL,
    `point` INTEGER NOT NULL DEFAULT 0,
    `province` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `village` VARCHAR(191) NULL,
    `deviceToken` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `address` VARCHAR(191) NULL,
    `coperate` VARCHAR(191) NULL,
    `corperate_name` VARCHAR(191) NULL,
    `dob` DATETIME(3) NULL,
    `first_name` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `house` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `nationality` VARCHAR(191) NULL,
    `ocupation` VARCHAR(191) NULL,
    `pobox` VARCHAR(191) NULL,
    `street` VARCHAR(191) NULL,
    `unit` VARCHAR(191) NULL,

    UNIQUE INDEX `User_customer_number_key`(`customer_number`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employee` (
    `employee_id` VARCHAR(36) NOT NULL,
    `employee_code` VARCHAR(191) NOT NULL,
    `employee_name` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `branchId` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `createBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`employee_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Branch` (
    `branch_id` VARCHAR(36) NOT NULL,
    `branch_code` VARCHAR(191) NOT NULL,
    `branch_name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `createBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`branch_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Promotion` (
    `promotion_id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `detail` TEXT NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `createBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`promotion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `service_id` VARCHAR(36) NOT NULL,
    `serviceName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `createBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`service_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GiftCard` (
    `giftcard_id` VARCHAR(36) NOT NULL,
    `amount` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `gift_Code` VARCHAR(191) NOT NULL,
    `gift_Name` VARCHAR(191) NULL,
    `gift_Point` DOUBLE NULL,

    UNIQUE INDEX `GiftCard_gift_Code_key`(`gift_Code`),
    PRIMARY KEY (`giftcard_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GiftHistory` (
    `gifthistory_id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `giftcardId` VARCHAR(36) NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'await',
    `createBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `total` INTEGER NULL,
    `cardId` VARCHAR(36) NOT NULL,
    `card_number` VARCHAR(191) NOT NULL,
    `claimed_date` DATETIME(0) NOT NULL,
    `gift_Code` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`gifthistory_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Card` (
    `card_id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NULL,
    `card_number` VARCHAR(191) NOT NULL,
    `vip_number` VARCHAR(191) NULL,
    `createBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `active_point` INTEGER NULL,
    `carId` VARCHAR(36) NOT NULL,
    `card_type` VARCHAR(191) NULL,
    `countCard` INTEGER NULL,
    `expiration_date` DATETIME(3) NULL,
    `goldIssued` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `issued_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `received` VARCHAR(191) NULL,
    `running_labour` DOUBLE NULL,
    `running_part` DOUBLE NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `total_point` INTEGER NULL,

    UNIQUE INDEX `Card_card_number_key`(`card_number`),
    UNIQUE INDEX `Card_carId_key`(`carId`),
    PRIMARY KEY (`card_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Car` (
    `car_id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NULL,
    `model` VARCHAR(191) NOT NULL,
    `frameNumber` VARCHAR(191) NOT NULL,
    `engineNumber` VARCHAR(191) NULL,
    `plateNumber` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `createBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`car_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `setting_id` VARCHAR(36) NOT NULL,
    `priceFix` INTEGER NOT NULL,
    `pricePart` INTEGER NOT NULL,
    `pointFix` INTEGER NOT NULL DEFAULT 0,
    `pointPart` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`setting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimeFix` (
    `timefix_id` VARCHAR(36) NOT NULL,
    `timeId` VARCHAR(36) NOT NULL,
    `branchId` VARCHAR(36) NULL,
    `zoneId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `date` DATETIME(0) NULL,

    PRIMARY KEY (`timefix_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Time` (
    `time_id` VARCHAR(36) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NULL,
    `timeStatus` BOOLEAN NOT NULL DEFAULT true,
    `qty` INTEGER NOT NULL DEFAULT 0,
    `createBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`time_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Zone` (
    `zone_id` VARCHAR(36) NOT NULL,
    `zoneName` VARCHAR(191) NOT NULL,
    `timeFix` VARCHAR(191) NULL,
    `zoneStatus` BOOLEAN NOT NULL,
    `createBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`zone_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `booking_id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `carId` VARCHAR(36) NOT NULL,
    `timeId` VARCHAR(36) NOT NULL,
    `day` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `remark` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,
    `bookingStatus` VARCHAR(191) NOT NULL DEFAULT 'await',
    `branchId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `zoneId` VARCHAR(36) NULL,

    PRIMARY KEY (`booking_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookingDetail` (
    `booking_detail_id` VARCHAR(36) NOT NULL,
    `bookingId` VARCHAR(36) NOT NULL,
    `serviceId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`booking_detail_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fix` (
    `fix_id` VARCHAR(36) NOT NULL,
    `bookingId` VARCHAR(36) NULL,
    `detailFix` VARCHAR(191) NULL,
    `kmLast` INTEGER NULL,
    `kmNext` INTEGER NULL,
    `totalPrice` INTEGER NULL,
    `fixStatus` VARCHAR(191) NULL DEFAULT 'padding',
    `createBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `branchId` VARCHAR(36) NULL,
    `cardId` VARCHAR(191) NULL,
    `frameNumber` VARCHAR(191) NULL,
    `exchange_rate` INTEGER NULL,
    `invoice_date` DATETIME(3) NULL,
    `invoice_number` VARCHAR(191) NULL,
    `labour_point` INTEGER NULL,
    `labour_total` INTEGER NULL,
    `part_point` INTEGER NULL,
    `part_total` INTEGER NULL,
    `payment_type` VARCHAR(191) NULL,
    `tax_invoice_code` VARCHAR(191) NULL,

    PRIMARY KEY (`fix_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`branch_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GiftHistory` ADD CONSTRAINT `GiftHistory_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`card_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GiftHistory` ADD CONSTRAINT `GiftHistory_giftcardId_fkey` FOREIGN KEY (`giftcardId`) REFERENCES `GiftCard`(`giftcard_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GiftHistory` ADD CONSTRAINT `GiftHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`car_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Card` ADD CONSTRAINT `Card_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeFix` ADD CONSTRAINT `TimeFix_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`branch_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeFix` ADD CONSTRAINT `TimeFix_timeId_fkey` FOREIGN KEY (`timeId`) REFERENCES `Time`(`time_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeFix` ADD CONSTRAINT `TimeFix_zoneId_fkey` FOREIGN KEY (`zoneId`) REFERENCES `Zone`(`zone_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`branch_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`car_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_timeId_fkey` FOREIGN KEY (`timeId`) REFERENCES `Time`(`time_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_zoneId_fkey` FOREIGN KEY (`zoneId`) REFERENCES `Zone`(`zone_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingDetail` ADD CONSTRAINT `BookingDetail_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`booking_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingDetail` ADD CONSTRAINT `BookingDetail_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`service_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fix` ADD CONSTRAINT `Fix_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`booking_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fix` ADD CONSTRAINT `Fix_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`branch_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fix` ADD CONSTRAINT `Fix_cardId_fkey` FOREIGN KEY (`cardId`) REFERENCES `Card`(`card_id`) ON DELETE SET NULL ON UPDATE CASCADE;
