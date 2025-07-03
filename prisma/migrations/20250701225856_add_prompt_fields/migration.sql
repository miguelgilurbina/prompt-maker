-- AlterTable
ALTER TABLE "Prompt" ADD COLUMN     "authorName" TEXT,
ADD COLUMN     "variables" JSONB,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "category" SET DEFAULT 'general';

-- CreateIndex
CREATE INDEX "Prompt_category_idx" ON "Prompt"("category");
