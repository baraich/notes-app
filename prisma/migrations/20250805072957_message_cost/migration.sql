/*
  Warnings:

  - Added the required column `cost` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCost` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'PROCESSING', 'PROCESSED');

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationsId_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "cost" TEXT NOT NULL,
ADD COLUMN     "status" "MessageStatus" NOT NULL,
ADD COLUMN     "totalCost" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationsId_fkey" FOREIGN KEY ("conversationsId") REFERENCES "Conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
