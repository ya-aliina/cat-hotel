ALTER TABLE "RoomCategoryImage"
ADD COLUMN "isCover" BOOLEAN NOT NULL DEFAULT false;

UPDATE "RoomCategoryImage"
SET "isCover" = true
WHERE "sortOrder" = 0;