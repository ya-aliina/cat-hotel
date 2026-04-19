-- Make user verification optional until email is confirmed.
ALTER TABLE "User"
ALTER COLUMN "verified" DROP NOT NULL;

-- Allow multiple auth tokens per user with explicit purpose and expiration.
CREATE TYPE "VerificationCodePurpose" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');

ALTER TABLE "VerificationCode"
ADD COLUMN "purpose" "VerificationCodePurpose" NOT NULL DEFAULT 'EMAIL_VERIFICATION',
ADD COLUMN "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + INTERVAL '1 day',
ADD COLUMN "consumedAt" TIMESTAMP(3);

DROP INDEX "VerificationCode_userId_key";

CREATE INDEX "VerificationCode_userId_purpose_idx" ON "VerificationCode"("userId", "purpose");

ALTER TABLE "VerificationCode"
ALTER COLUMN "expiresAt" DROP DEFAULT,
ALTER COLUMN "purpose" DROP DEFAULT;