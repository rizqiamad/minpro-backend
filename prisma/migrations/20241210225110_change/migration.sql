/*
  Warnings:

  - You are about to drop the `Events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Points` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ticket_Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Events" DROP CONSTRAINT "Events_location_id_fkey";

-- DropForeignKey
ALTER TABLE "Events" DROP CONSTRAINT "Events_organizer_id_fkey";

-- DropForeignKey
ALTER TABLE "Points" DROP CONSTRAINT "Points_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_event_id_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_event_id_fkey";

-- DropForeignKey
ALTER TABLE "Ticket_Transaction" DROP CONSTRAINT "Ticket_Transaction_ticket_id_fkey";

-- DropForeignKey
ALTER TABLE "Ticket_Transaction" DROP CONSTRAINT "Ticket_Transaction_transaction_id_fkey";

-- DropTable
DROP TABLE "Events";

-- DropTable
DROP TABLE "Points";

-- DropTable
DROP TABLE "Ticket_Transaction";

-- CreateTable
CREATE TABLE "TicketTransaction" (
    "transaction_id" INTEGER NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,

    CONSTRAINT "TicketTransaction_pkey" PRIMARY KEY ("transaction_id","ticket_id")
);

-- CreateTable
CREATE TABLE "Point" (
    "points_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Point_pkey" PRIMARY KEY ("points_id")
);

-- CreateTable
CREATE TABLE "Event" (
    "event_id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "image" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "location_id" INTEGER NOT NULL,
    "organizer_id" INTEGER NOT NULL,
    "category" "EventCategory" NOT NULL,
    "type" "EventType" NOT NULL,
    "description" TEXT NOT NULL,
    "terms_condition" TEXT NOT NULL,
    "coupon_seat" INTEGER,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("event_id")
);

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTransaction" ADD CONSTRAINT "TicketTransaction_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("transaction_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTransaction" ADD CONSTRAINT "TicketTransaction_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "Ticket"("ticket_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Point" ADD CONSTRAINT "Point_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "Organizer"("organizer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;
