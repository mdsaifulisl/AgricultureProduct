-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN     "insideDhakaDeliveryFee" DOUBLE PRECISION DEFAULT 60,
ADD COLUMN     "outsideDhakaDeliveryFee" DOUBLE PRECISION DEFAULT 120,
ADD COLUMN     "telegramBotToken" TEXT,
ADD COLUMN     "telegramChatId" TEXT;
