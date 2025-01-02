/*
  Warnings:

  - Added the required column `user_id` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Coupon" DROP CONSTRAINT "Coupon_id_fkey";

-- AlterTable
CREATE SEQUENCE coupon_id_seq;
ALTER TABLE "Coupon" ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('coupon_id_seq');
ALTER SEQUENCE coupon_id_seq OWNED BY "Coupon"."id";

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
