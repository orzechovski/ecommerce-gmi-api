-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL,
ALTER COLUMN "billing_address_id" DROP NOT NULL;
