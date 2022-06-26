/*
  Warnings:

  - The `usertype` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "USERTYPE" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "usertype",
ADD COLUMN     "usertype" "USERTYPE" NOT NULL DEFAULT E'USER';
