-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('GENERAL', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('BANNED', 'CANCELED', 'CONFIRMED', 'NOT_CONFIRMED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'GENERAL',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'NOT_CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastSignedInAt" TIMESTAMP(3),
    "signUpConfirmedAt" TIMESTAMP(3),
    "signUpConfirmationSentAt" TIMESTAMP(3),
    "signUpConfirmationToken" TEXT,
    "changeEmail" TEXT,
    "changeEmailCompletedAt" TIMESTAMP(3),
    "changeEmailSentAt" TIMESTAMP(3),
    "changeEmailToken" TEXT,
    "changePasswordCompletedAt" TIMESTAMP(3),
    "changePasswordSentAt" TIMESTAMP(3),
    "changePasswordToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CancelUser" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CancelUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresIn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "CancelUser" ADD CONSTRAINT "CancelUser_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
