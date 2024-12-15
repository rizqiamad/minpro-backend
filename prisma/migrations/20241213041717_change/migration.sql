/*
  Warnings:

  - The primary key for the `City` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `city_id` on the `City` table. All the data in the column will be lost.
  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `event_id` on the `Event` table. All the data in the column will be lost.
  - The primary key for the `Location` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `location_id` on the `Location` table. All the data in the column will be lost.
  - The primary key for the `Organizer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `organizer_id` on the `Organizer` table. All the data in the column will be lost.
  - The primary key for the `Point` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `points_id` on the `Point` table. All the data in the column will be lost.
  - The primary key for the `Ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ticket_id` on the `Ticket` table. All the data in the column will be lost.
  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `transaction_id` on the `Transaction` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - The required column `id` was added to the `Event` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Coupon" DROP CONSTRAINT "Coupon_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_location_id_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_organizer_id_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_city_id_fkey";

-- DropForeignKey
ALTER TABLE "Point" DROP CONSTRAINT "Point_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_event_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_event_id_fkey";

-- DropForeignKey
ALTER TABLE "TicketTransaction" DROP CONSTRAINT "TicketTransaction_ticket_id_fkey";

-- DropForeignKey
ALTER TABLE "TicketTransaction" DROP CONSTRAINT "TicketTransaction_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_user_id_fkey";

-- AlterTable
ALTER TABLE "City" DROP CONSTRAINT "City_pkey",
DROP COLUMN "city_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "City_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
DROP COLUMN "event_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Location" DROP CONSTRAINT "Location_pkey",
DROP COLUMN "location_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Location_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Organizer" DROP CONSTRAINT "Organizer_pkey",
DROP COLUMN "organizer_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Organizer_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Point" DROP CONSTRAINT "Point_pkey",
DROP COLUMN "points_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Point_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_pkey",
DROP COLUMN "ticket_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
DROP COLUMN "transaction_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTransaction" ADD CONSTRAINT "TicketTransaction_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTransaction" ADD CONSTRAINT "TicketTransaction_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Point" ADD CONSTRAINT "Point_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "Organizer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
