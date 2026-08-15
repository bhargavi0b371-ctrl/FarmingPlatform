-- Optional initialization script for local Docker Postgres.
-- Prisma migrations are the primary schema source of truth.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE IF EXISTS "User"
ADD COLUMN IF NOT EXISTS "fcmToken" TEXT;

