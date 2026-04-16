CREATE TABLE IF NOT EXISTS "public"."managed_camps" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "subtitle" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "venue" TEXT NOT NULL,
  "start_date" TIMESTAMP(3),
  "end_date" TIMESTAMP(3),
  "date_label" TEXT,
  "price_cents" INTEGER NOT NULL,
  "capacity" INTEGER NOT NULL,
  "capacity_text" TEXT NOT NULL,
  "ages" TEXT NOT NULL,
  "level" TEXT NOT NULL,
  "coaches" JSONB NOT NULL,
  "coach_mode_label" TEXT NOT NULL,
  "format_options" JSONB NOT NULL,
  "general_camp_time" TEXT NOT NULL,
  "overnight_included" BOOLEAN NOT NULL DEFAULT true,
  "private_available" BOOLEAN NOT NULL DEFAULT true,
  "private_payment_note" TEXT NOT NULL,
  "cover_image" TEXT NOT NULL,
  "cover_image_alt" TEXT NOT NULL,
  "booking_image" TEXT NOT NULL,
  "booking_image_alt" TEXT NOT NULL,
  "gallery" JSONB NOT NULL,
  "private_options" JSONB NOT NULL,
  "focus" JSONB NOT NULL,
  "highlights" JSONB NOT NULL,
  "schedule" JSONB NOT NULL,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "booking_open" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "managed_camps_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "managed_camps_slug_key" ON "public"."managed_camps"("slug");
CREATE INDEX IF NOT EXISTS "managed_camps_booking_open_idx" ON "public"."managed_camps"("booking_open");
CREATE INDEX IF NOT EXISTS "managed_camps_featured_idx" ON "public"."managed_camps"("featured");
