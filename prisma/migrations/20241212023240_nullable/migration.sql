-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "terms_condition" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Organizer" ALTER COLUMN "avatar" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "description" DROP NOT NULL;
