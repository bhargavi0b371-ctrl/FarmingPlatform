import { PrismaClient } from '@prisma/client';
import { config } from './index.js';

declare global {
  // eslint-disable-next-line no-var
  var __ecofarmPrisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: config.nodeEnv === 'development' ? ['warn', 'error'] : ['error'],
  });
}

export const prisma: PrismaClient = globalThis.__ecofarmPrisma ?? createPrismaClient();

if (config.nodeEnv !== 'production') {
  globalThis.__ecofarmPrisma = prisma;
}

export async function ensureDatabaseSchema(): Promise<void> {
  const statements = [
    `ALTER TABLE IF EXISTS "User" ADD COLUMN IF NOT EXISTS "fcmToken" TEXT`,
    `CREATE TABLE IF NOT EXISTS "CropJourney" (
        "id" TEXT PRIMARY KEY,
        "cropId" TEXT NOT NULL,
        "currentStage" TEXT NOT NULL,
        "healthScore" INTEGER NOT NULL DEFAULT 100,
        "overallProgress" INTEGER NOT NULL DEFAULT 0,
        "estimatedHarvest" TIMESTAMP(3),
        "expectedYieldKg" DECIMAL(10,2),
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
    `CREATE TABLE IF NOT EXISTS "GrowthStage" (
        "id" TEXT PRIMARY KEY,
        "journeyId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "startedAt" TIMESTAMP(3),
        "expectedDurationDays" INTEGER,
        "completedAt" TIMESTAMP(3),
        "percentCompleted" INTEGER NOT NULL DEFAULT 0,
        "aiRecommendation" TEXT
      )`,
    `CREATE TABLE IF NOT EXISTS "IrrigationLog" (
        "id" TEXT PRIMARY KEY,
        "journeyId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "irrigatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "volumeLiters" DECIMAL(10,2),
        "note" TEXT
      )`,
    `CREATE TABLE IF NOT EXISTS "CropHealthLog" (
        "id" TEXT PRIMARY KEY,
        "journeyId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "healthScore" INTEGER NOT NULL,
        "nutrientStatus" TEXT,
        "pestRiskLevel" TEXT,
        "diseaseRiskLevel" TEXT,
        "note" TEXT
      )`,
    `CREATE TABLE IF NOT EXISTS "HarvestPrediction" (
        "id" TEXT PRIMARY KEY,
        "journeyId" TEXT NOT NULL,
        "predictedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "estimatedDate" TIMESTAMP(3) NOT NULL,
        "expectedYieldKg" DECIMAL(10,2),
        "confidence" DECIMAL(3,2),
        "factors" JSONB
      )`,
    `CREATE TABLE IF NOT EXISTS "FarmerTask" (
        "id" TEXT PRIMARY KEY,
        "journeyId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "dueAt" TIMESTAMP(3),
        "completed" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`,
    `CREATE TABLE IF NOT EXISTS "CropTimelineEvent" (
        "id" TEXT PRIMARY KEY,
        "journeyId" TEXT NOT NULL,
        "eventType" TEXT NOT NULL,
        "eventAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "details" TEXT
      )`,
    `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'CropJourney_cropId_fkey'
        ) THEN
          ALTER TABLE "CropJourney"
            ADD CONSTRAINT "CropJourney_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE CASCADE;
        END IF;
      END$$`,
    `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'GrowthStage_journeyId_fkey'
        ) THEN
          ALTER TABLE "GrowthStage"
            ADD CONSTRAINT "GrowthStage_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "CropJourney"("id") ON DELETE CASCADE;
        END IF;
      END$$`,
    `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'IrrigationLog_journeyId_fkey'
        ) THEN
          ALTER TABLE "IrrigationLog"
            ADD CONSTRAINT "IrrigationLog_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "CropJourney"("id") ON DELETE CASCADE;
        END IF;
      END$$`,
    `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'IrrigationLog_userId_fkey'
        ) THEN
          ALTER TABLE "IrrigationLog"
            ADD CONSTRAINT "IrrigationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
        END IF;
      END$$`,
    `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'CropHealthLog_journeyId_fkey'
        ) THEN
          ALTER TABLE "CropHealthLog"
            ADD CONSTRAINT "CropHealthLog_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "CropJourney"("id") ON DELETE CASCADE;
        END IF;
      END$$`,
    `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'CropHealthLog_userId_fkey'
        ) THEN
          ALTER TABLE "CropHealthLog"
            ADD CONSTRAINT "CropHealthLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
        END IF;
      END$$`,
    `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'HarvestPrediction_journeyId_fkey'
        ) THEN
          ALTER TABLE "HarvestPrediction"
            ADD CONSTRAINT "HarvestPrediction_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "CropJourney"("id") ON DELETE CASCADE;
        END IF;
      END$$`,
    `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'FarmerTask_journeyId_fkey'
        ) THEN
          ALTER TABLE "FarmerTask"
            ADD CONSTRAINT "FarmerTask_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "CropJourney"("id") ON DELETE CASCADE;
        END IF;
      END$$`,
    `DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'CropTimelineEvent_journeyId_fkey'
        ) THEN
          ALTER TABLE "CropTimelineEvent"
            ADD CONSTRAINT "CropTimelineEvent_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "CropJourney"("id") ON DELETE CASCADE;
        END IF;
      END$$`,
    `CREATE INDEX IF NOT EXISTS "CropJourney_cropId_index" ON "CropJourney"("cropId")`,
    `CREATE INDEX IF NOT EXISTS "GrowthStage_journeyId_index" ON "GrowthStage"("journeyId")`,
    `CREATE INDEX IF NOT EXISTS "IrrigationLog_journeyId_index" ON "IrrigationLog"("journeyId")`,
    `CREATE INDEX IF NOT EXISTS "IrrigationLog_userId_index" ON "IrrigationLog"("userId")`,
    `CREATE INDEX IF NOT EXISTS "CropHealthLog_journeyId_index" ON "CropHealthLog"("journeyId")`,
    `CREATE INDEX IF NOT EXISTS "CropHealthLog_userId_index" ON "CropHealthLog"("userId")`,
    `CREATE INDEX IF NOT EXISTS "HarvestPrediction_journeyId_index" ON "HarvestPrediction"("journeyId")`,
    `CREATE INDEX IF NOT EXISTS "FarmerTask_journeyId_index" ON "FarmerTask"("journeyId")`,
    `CREATE INDEX IF NOT EXISTS "CropTimelineEvent_journeyId_index" ON "CropTimelineEvent"("journeyId")`,
  ];

  try {
    for (const statement of statements) {
      await prisma.$executeRawUnsafe(statement);
    }
  } catch (error) {
    console.warn('Failed to ensure database schema for CropJourney tables:', error);
  }
}

export default prisma;

