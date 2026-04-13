ALTER TABLE "RoomArea"
ADD COLUMN "widthCm" INTEGER,
ADD COLUMN "depthCm" INTEGER,
ADD COLUMN "heightCm" INTEGER;

UPDATE "RoomArea" AS ra
SET
  "widthCm" = rc."widthCm",
  "depthCm" = rc."depthCm",
  "heightCm" = rc."heightCm"
FROM (
  SELECT
    "areaId",
    MIN("widthCm") AS "widthCm",
    MIN("depthCm") AS "depthCm",
    MIN("heightCm") AS "heightCm"
  FROM "RoomCategory"
  GROUP BY "areaId"
) AS rc
WHERE ra."id" = rc."areaId";

ALTER TABLE "RoomArea"
ALTER COLUMN "widthCm" SET NOT NULL,
ALTER COLUMN "depthCm" SET NOT NULL,
ALTER COLUMN "heightCm" SET NOT NULL;

ALTER TABLE "RoomCategory"
DROP COLUMN "widthCm",
DROP COLUMN "depthCm",
DROP COLUMN "heightCm";
