-- CreateTable
CREATE TABLE "daily_plans" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "quote_text" TEXT NOT NULL,
    "quote_author" TEXT NOT NULL,
    "workout" TEXT NOT NULL,
    "meals" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_plans_date_key" ON "daily_plans"("date");

-- CreateIndex
CREATE INDEX "daily_plans_date_idx" ON "daily_plans"("date");

-- CreateIndex
CREATE INDEX "daily_plans_created_at_idx" ON "daily_plans"("created_at");
