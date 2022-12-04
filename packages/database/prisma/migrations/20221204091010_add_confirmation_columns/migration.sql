-- AlterTable
ALTER TABLE "User" ADD COLUMN     "signUpConfirmationSentAt" TIMESTAMP(3),
ADD COLUMN     "signUpConfirmationToken" TEXT,
ADD COLUMN     "signUpConfirmedAt" TIMESTAMP(3);
