-- CreateTable
CREATE TABLE "daily_plans" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "quote_text" TEXT NOT NULL,
    "quote_author" TEXT NOT NULL,
    "workout" TEXT NOT NULL,
    "meals" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_plans_date_key" ON "daily_plans"("date");

-- CreateIndex
CREATE INDEX "daily_plans_date_idx" ON "daily_plans"("date");

-- CreateIndex
CREATE INDEX "daily_plans_created_at_idx" ON "daily_plans"("created_at");
