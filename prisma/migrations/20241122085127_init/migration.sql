-- CreateTable
CREATE TABLE `domain_extensions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `extension` VARCHAR(191) NOT NULL,
    `whois_uri` VARCHAR(191) NOT NULL,
    `available` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
