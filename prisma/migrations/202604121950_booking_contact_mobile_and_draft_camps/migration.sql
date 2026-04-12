DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'guardian_name'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'contact_name'
  ) THEN
    ALTER TABLE "public"."bookings" RENAME COLUMN "guardian_name" TO "contact_name";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'guardian_email'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'contact_email'
  ) THEN
    ALTER TABLE "public"."bookings" RENAME COLUMN "guardian_email" TO "contact_email";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'guardian_phone'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'contact_phone'
  ) THEN
    ALTER TABLE "public"."bookings" RENAME COLUMN "guardian_phone" TO "contact_phone";
  END IF;
END $$;

ALTER TABLE "public"."bookings"
  ALTER COLUMN "camp_start_date" DROP NOT NULL,
  ALTER COLUMN "camp_end_date" DROP NOT NULL;

ALTER TABLE "public"."bookings"
  ADD COLUMN IF NOT EXISTS "participant_mobile" TEXT;

UPDATE "public"."bookings"
SET "participant_mobile" = COALESCE("participant_mobile", "contact_phone")
WHERE "participant_mobile" IS NULL;

ALTER TABLE "public"."bookings"
  ALTER COLUMN "participant_mobile" SET NOT NULL;

ALTER TABLE "public"."bookings"
  DROP COLUMN IF EXISTS "tshirt_size";

DROP INDEX IF EXISTS "bookings_guardian_email_idx";
CREATE INDEX IF NOT EXISTS "bookings_contact_email_idx" ON "public"."bookings"("contact_email");
