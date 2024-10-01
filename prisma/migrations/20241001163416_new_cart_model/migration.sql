/*
  Warnings:

  - You are about to drop the column `billing_address_id` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `region_id` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_address_id` on the `Cart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "billing_address_id",
DROP COLUMN "region_id",
DROP COLUMN "shipping_address_id";
