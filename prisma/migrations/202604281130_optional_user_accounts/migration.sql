CREATE TABLE "public"."users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "name" TEXT,
  "participant_first_name" TEXT,
  "participant_last_name" TEXT,
  "participant_birth_date" TIMESTAMP(3),
  "contact_phone" TEXT,
  "participant_mobile" TEXT,
  "emergency_contact_name" TEXT,
  "emergency_contact_phone" TEXT,
  "team_name" TEXT,
  "stunt_partner_or_group" TEXT,
  "allergies" TEXT,
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."user_sessions" (
  "id" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "public"."bookings" ADD COLUMN "user_id" TEXT;

CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");
CREATE UNIQUE INDEX "user_sessions_token_hash_key" ON "public"."user_sessions"("token_hash");
CREATE INDEX "user_sessions_user_id_idx" ON "public"."user_sessions"("user_id");
CREATE INDEX "user_sessions_expires_at_idx" ON "public"."user_sessions"("expires_at");
CREATE INDEX "bookings_user_id_idx" ON "public"."bookings"("user_id");

ALTER TABLE "public"."user_sessions"
  ADD CONSTRAINT "user_sessions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."bookings"
  ADD CONSTRAINT "bookings_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
