-- CreateTable
CREATE TABLE "Verification" (
    "email" TEXT NOT NULL,
    "forgotPasswordCode" TEXT,
    "emailVerificationCode" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Verification_email_key" ON "Verification"("email");
