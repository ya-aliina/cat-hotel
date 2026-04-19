-- CreateTable
CREATE TABLE "RoomCategoryPerfectFor" (
    "id" SERIAL NOT NULL,
    "icon" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "roomCategoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomCategoryPerfectFor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomCategoryPerfectFor_roomCategoryId_sortOrder_key" ON "RoomCategoryPerfectFor"("roomCategoryId", "sortOrder");

-- AddForeignKey
ALTER TABLE "RoomCategoryPerfectFor" ADD CONSTRAINT "RoomCategoryPerfectFor_roomCategoryId_fkey" FOREIGN KEY ("roomCategoryId") REFERENCES "RoomCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
