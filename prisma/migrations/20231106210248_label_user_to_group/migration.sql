/*
  Warnings:

  - You are about to drop the `UserLabel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Finance" DROP CONSTRAINT "Finance_labelId_fkey";

-- DropForeignKey
ALTER TABLE "Plan" DROP CONSTRAINT "Plan_labelId_fkey";

-- DropForeignKey
ALTER TABLE "UserLabel" DROP CONSTRAINT "UserLabel_labelId_fkey";

-- DropForeignKey
ALTER TABLE "UserLabel" DROP CONSTRAINT "UserLabel_userId_fkey";

-- AlterTable
ALTER TABLE "Finance" ALTER COLUMN "labelId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "labelId" DROP NOT NULL;

-- DropTable
DROP TABLE "UserLabel";

-- CreateTable
CREATE TABLE "GroupLabel" (
    "id" SERIAL NOT NULL,
    "labelId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "GroupLabel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupLabel_labelId_key" ON "GroupLabel"("labelId");

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finance" ADD CONSTRAINT "Finance_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupLabel" ADD CONSTRAINT "GroupLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupLabel" ADD CONSTRAINT "GroupLabel_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
