ALTER TABLE "orders" ADD COLUMN "deviceFingerprint" TEXT;
CREATE INDEX "orders_deviceFingerprint_idx" ON "orders"("deviceFingerprint");
CREATE TABLE "device_blocks" (
  "id" TEXT NOT NULL,
  "fingerprint" TEXT NOT NULL,
  "reason" VARCHAR(300),
  "isBlocked" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "device_blocks_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "device_blocks_fingerprint_key" ON "device_blocks"("fingerprint");
