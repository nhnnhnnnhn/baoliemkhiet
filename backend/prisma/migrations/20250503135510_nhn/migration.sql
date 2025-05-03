-- AlterTable
ALTER TABLE "Otp" ALTER COLUMN "expired_at" SET DEFAULT NOW() + INTERVAL '60 seconds';
