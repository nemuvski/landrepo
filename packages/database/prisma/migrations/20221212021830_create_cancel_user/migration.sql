-- CreateTable
CREATE TABLE "CancelUser" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CancelUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CancelUser" ADD CONSTRAINT "CancelUser_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
