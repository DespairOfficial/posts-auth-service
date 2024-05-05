-- Create uuid7 function
create or replace function uuid7() returns uuid as $$
declare
v_time timestamp with time zone:= null;
v_secs bigint := null;
v_msec bigint := null;
v_usec bigint := null;

v_timestamp bigint := null;
v_timestamp_hex varchar := null;

v_random bigint := null;
v_random_hex varchar := null;

v_bytes bytea;

c_variant bit(64):= x'8000000000000000'; -- RFC-4122 variant: b'10xx...'
begin

-- Get seconds and micros
v_time := clock_timestamp();
v_secs := EXTRACT(EPOCH FROM v_time);
v_msec := mod(EXTRACT(MILLISECONDS FROM v_time)::numeric, 10^3::numeric);
v_usec := mod(EXTRACT(MICROSECONDS FROM v_time)::numeric, 10^3::numeric);

-- Generate timestamp hexadecimal (and set version 7)
v_timestamp := (((v_secs * 10^3) + v_msec)::bigint << 12) | (v_usec << 2);
v_timestamp_hex := lpad(to_hex(v_timestamp), 16, '0');
v_timestamp_hex := substr(v_timestamp_hex, 2, 12) || '7' || substr(v_timestamp_hex, 14, 3);

-- Generate the random hexadecimal (and set variant b'10xx')
v_random := ((random()::numeric * 2^62::numeric)::bigint::bit(64) | c_variant)::bigint;
v_random_hex := lpad(to_hex(v_random), 16, '0');

-- Concat timestemp and random hexadecimal
v_bytes := decode(v_timestamp_hex || v_random_hex, 'hex');

return encode(v_bytes, 'hex')::uuid;

end $$ language plpgsql;


-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT uuid7(),
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "image" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Password" (
    "userId" UUID NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "refreshToken" UUID NOT NULL DEFAULT uuid7(),
    "userId" UUID NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("refreshToken")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_ip_key" ON "User"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_fingerprint_key" ON "Session"("fingerprint");

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
