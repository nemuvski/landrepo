-- AlterTable
ALTER TABLE "User" ADD COLUMN     "changeEmail" TEXT,
ADD COLUMN     "changeEmailCompletedAt" TIMESTAMP(3),
ADD COLUMN     "changeEmailSentAt" TIMESTAMP(3),
ADD COLUMN     "changeEmailToken" TEXT,
ADD COLUMN     "changePasswordCompletedAt" TIMESTAMP(3),
ADD COLUMN     "changePasswordSentAt" TIMESTAMP(3),
ADD COLUMN     "changePasswordToken" TEXT;
