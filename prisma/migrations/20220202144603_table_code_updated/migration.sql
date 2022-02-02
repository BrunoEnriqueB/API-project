/*
  Warnings:

  - A unique constraint covering the columns `[id_user]` on the table `passwordscodes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `passwordscodes_id_user_key` ON `passwordscodes`(`id_user`);
