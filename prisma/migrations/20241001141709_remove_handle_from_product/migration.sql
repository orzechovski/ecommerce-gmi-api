/*
  Warnings:

  - You are about to drop the column `handle` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Product_handle_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "handle";
