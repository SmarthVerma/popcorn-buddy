-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('NETFLIX', 'AMAZON_PRIME', 'HOTSTAR');

-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('ACTION', 'ADVENTURE', 'COMEDY', 'DRAMA', 'HORROR', 'ROMANCE', 'SCI_FI', 'THRILLER', 'FANTASY');

-- CreateTable
CREATE TABLE "movies" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "platform" "Platform"[],
    "genre" "Genre"[],
    "thumbnail" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "movies_title_key" ON "movies"("title");
