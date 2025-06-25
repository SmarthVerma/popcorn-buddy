/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `movies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "movies_title_key";

-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "movies_key_key" ON "movies"("key");
