/*
  Warnings:

  - A unique constraint covering the columns `[city]` on the table `City` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refer_by" VARCHAR(255),
ALTER COLUMN "ref_code" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "City_city_key" ON "City"("city");
