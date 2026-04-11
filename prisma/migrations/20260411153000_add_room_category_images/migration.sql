CREATE TABLE "RoomCategoryImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "roomCategoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomCategoryImage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RoomCategoryImage_roomCategoryId_sortOrder_key"
ON "RoomCategoryImage"("roomCategoryId", "sortOrder");

ALTER TABLE "RoomCategoryImage"
ADD CONSTRAINT "RoomCategoryImage_roomCategoryId_fkey"
FOREIGN KEY ("roomCategoryId") REFERENCES "RoomCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;