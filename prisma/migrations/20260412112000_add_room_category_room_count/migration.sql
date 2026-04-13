ALTER TABLE "RoomCategory"
ADD COLUMN "roomCount" INTEGER NOT NULL DEFAULT 1;

UPDATE "RoomCategory" AS rc
SET "roomCount" = counts."roomsCount"
FROM (
  SELECT "categoryId", COUNT(*)::INTEGER AS "roomsCount"
  FROM "Room"
  GROUP BY "categoryId"
) AS counts
WHERE rc."id" = counts."categoryId";
