-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TShirtSize" AS ENUM ('YXS', 'YS', 'YM', 'YL', 'XS', 'S', 'M', 'L', 'XL');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "StuntFormat" AS ENUM ('PARTNER_STUNT', 'GROUP_STUNT');

-- CreateEnum
CREATE TYPE "PrivateInterest" AS ENUM ('NONE', 'PAIR_60', 'PAIR_90', 'GROUP_60', 'GROUP_90', 'INDIVIDUAL_60', 'INDIVIDUAL_90');

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "camp_slug" TEXT NOT NULL,
    "camp_title" TEXT NOT NULL,
    "camp_location" TEXT NOT NULL,
    "camp_start_date" TIMESTAMP(3) NOT NULL,
    "camp_end_date" TIMESTAMP(3) NOT NULL,
    "participant_first_name" TEXT NOT NULL,
    "participant_last_name" TEXT NOT NULL,
    "participant_birth_date" TIMESTAMP(3) NOT NULL,
    "guardian_name" TEXT NOT NULL,
    "guardian_email" TEXT NOT NULL,
    "guardian_phone" TEXT NOT NULL,
    "emergency_contact_name" TEXT NOT NULL,
    "emergency_contact_phone" TEXT NOT NULL,
    "experience_level" "ExperienceLevel" NOT NULL,
    "stunt_format" "StuntFormat" NOT NULL,
    "team_name" TEXT,
    "stunt_partner_or_group" TEXT,
    "saturday_wish" TEXT,
    "private_interest" "PrivateInterest" NOT NULL DEFAULT 'NONE',
    "tshirt_size" "TShirtSize" NOT NULL,
    "allergies" TEXT,
    "notes" TEXT,
    "photo_consent" BOOLEAN NOT NULL DEFAULT false,
    "accepted_terms" BOOLEAN NOT NULL DEFAULT false,
    "stripe_checkout_session_id" TEXT,
    "stripe_payment_intent_id" TEXT,
    "amount_cents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_stripe_checkout_session_id_key" ON "bookings"("stripe_checkout_session_id");

-- CreateIndex
CREATE INDEX "bookings_camp_slug_created_at_idx" ON "bookings"("camp_slug", "created_at");

-- CreateIndex
CREATE INDEX "bookings_guardian_email_idx" ON "bookings"("guardian_email");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");
