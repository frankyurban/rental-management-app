-- CreateTable
CREATE TABLE "Property" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "rent" INTEGER NOT NULL,
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
