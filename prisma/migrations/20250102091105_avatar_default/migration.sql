/*
  Warnings:

  - Made the column `avatar` on table `Organizer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `avatar` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Organizer" ALTER COLUMN "avatar" SET NOT NULL,
ALTER COLUMN "avatar" SET DEFAULT 'https://res.cloudinary.com/dozmme9hc/image/upload/v1734232945/Default_idtsln.png';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatar" SET NOT NULL,
ALTER COLUMN "avatar" SET DEFAULT 'https://res.cloudinary.com/dozmme9hc/image/upload/v1734232945/Default_idtsln.png';
