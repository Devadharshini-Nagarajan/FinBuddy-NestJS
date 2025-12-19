/*
  Warnings:

  - You are about to drop the column `incomeCents` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `targetSavingsCents` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `limitCents` on the `BudgetCategory` table. All the data in the column will be lost.
  - You are about to drop the column `amountCents` on the `Item` table. All the data in the column will be lost.
  - Added the required column `income` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "incomeCents",
DROP COLUMN "targetSavingsCents",
ADD COLUMN     "income" INTEGER NOT NULL,
ADD COLUMN     "targetSavings" INTEGER;

-- AlterTable
ALTER TABLE "BudgetCategory" DROP COLUMN "limitCents",
ADD COLUMN     "limit" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "amountCents",
ADD COLUMN     "amount" INTEGER NOT NULL;
