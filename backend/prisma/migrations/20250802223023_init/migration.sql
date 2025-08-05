/*
  Warnings:

  - You are about to alter the column `rent` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- CreateTable
CREATE TABLE "PropertyAnalysis" (
    "propertyId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scenarioName" TEXT,
    "vacancy" REAL,
    "repairs" REAL,
    "capex" REAL,
    "propManagement" REAL,
    "rentalIncome" REAL,
    "laundry" REAL,
    "storage" REAL,
    "parking" REAL,
    "miscIncomes" TEXT,
    "miscIncomeVals" TEXT,
    "taxes" REAL,
    "insurance" REAL,
    "water" REAL,
    "garbage" REAL,
    "electric" REAL,
    "gas" REAL,
    "hoa" REAL,
    "lawn" REAL,
    "mortgage" REAL,
    "downPayment" REAL,
    "closingCosts" REAL,
    "rehab" REAL,
    "cashMisc" TEXT,
    "cashMiscVals" TEXT,
    CONSTRAINT "PropertyAnalysis_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "rent" REAL NOT NULL,
    "imageUrl" TEXT,
    "sqft" INTEGER,
    "bedrooms" INTEGER,
    "fullBaths" INTEGER,
    "threeQuarterBaths" INTEGER,
    "halfBaths" INTEGER,
    "quarterBaths" INTEGER,
    "yearBuilt" INTEGER,
    "propertyType" TEXT,
    "features" TEXT,
    "renovations" TEXT
);
INSERT INTO "new_Property" ("address", "bedrooms", "city", "features", "fullBaths", "halfBaths", "id", "imageUrl", "propertyType", "quarterBaths", "renovations", "rent", "sqft", "state", "threeQuarterBaths", "yearBuilt", "zip") SELECT "address", "bedrooms", "city", "features", "fullBaths", "halfBaths", "id", "imageUrl", "propertyType", "quarterBaths", "renovations", "rent", "sqft", "state", "threeQuarterBaths", "yearBuilt", "zip" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
