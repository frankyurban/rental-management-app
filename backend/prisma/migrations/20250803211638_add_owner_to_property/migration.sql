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
    "renovations" TEXT,
    "ownerId" INTEGER,
    CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("address", "bedrooms", "city", "features", "fullBaths", "halfBaths", "id", "imageUrl", "propertyType", "quarterBaths", "renovations", "rent", "sqft", "state", "threeQuarterBaths", "yearBuilt", "zip") SELECT "address", "bedrooms", "city", "features", "fullBaths", "halfBaths", "id", "imageUrl", "propertyType", "quarterBaths", "renovations", "rent", "sqft", "state", "threeQuarterBaths", "yearBuilt", "zip" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
