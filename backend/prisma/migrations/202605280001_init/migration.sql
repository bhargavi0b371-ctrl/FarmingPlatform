-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('FARMER', 'EXPERT', 'ADMIN');

-- CreateEnum
CREATE TYPE "CropStatus" AS ENUM ('PLANNING', 'PLANTING', 'GROWING', 'HARVESTING', 'HARVESTED');

-- CreateEnum
CREATE TYPE "SeverityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AdvisoryType" AS ENUM ('IRRIGATION', 'FERTILIZER', 'PEST', 'DISEASE', 'HARVEST', 'GENERAL');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'ALERT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('WEATHER', 'PEST_ALERT', 'MARKET', 'ADVISORY', 'SYSTEM');

-- CreateEnum
CREATE TYPE "SensorType" AS ENUM ('SOIL_MOISTURE', 'TEMPERATURE', 'HUMIDITY', 'LIGHT', 'PH');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'FARMER',
    "language" TEXT NOT NULL DEFAULT 'en',
    "name" TEXT,
    "email" TEXT,
    "avatarUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "bio" TEXT,
    "farmSizeAcres" DECIMAL(10,2),
    "soilType" TEXT,
    "cropsGrown" TEXT[],
    "yearsExperience" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpToken" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "otpCode" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "OtpToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Farm" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "areaAcres" DECIMAL(10,2) NOT NULL,
    "soilType" TEXT,
    "waterSource" TEXT,
    "irrigationMethod" TEXT,
    "soilPh" DECIMAL(3,1),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Farm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crop" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "variety" TEXT,
    "plantingDate" TIMESTAMP(3) NOT NULL,
    "expectedHarvest" TIMESTAMP(3),
    "harvestedDate" TIMESTAMP(3),
    "status" "CropStatus" NOT NULL DEFAULT 'PLANTING',
    "yieldKg" DECIMAL(10,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoilReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "farmId" TEXT,
    "cropId" TEXT,
    "nitrogenPpm" DECIMAL(6,2),
    "phosphorusPpm" DECIMAL(6,2),
    "potassiumPpm" DECIMAL(6,2),
    "ph" DECIMAL(3,1),
    "texture" TEXT,
    "organicMatterPct" DECIMAL(5,2),
    "moisturePct" DECIMAL(5,2),
    "ecDsM" DECIMAL(6,2),
    "recommendations" TEXT,
    "labName" TEXT,
    "sampleDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SoilReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PestDetection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cropId" TEXT,
    "imageUrl" TEXT NOT NULL,
    "pestName" TEXT,
    "diseaseName" TEXT,
    "confidence" DECIMAL(5,4),
    "symptoms" TEXT,
    "organicTreatment" TEXT,
    "chemicalTreatment" TEXT,
    "prevention" TEXT,
    "severity" "SeverityLevel" NOT NULL DEFAULT 'MEDIUM',
    "modelVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PestDetection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CropImage" (
    "id" TEXT NOT NULL,
    "detectionId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CropImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advisory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cropId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "AdvisoryType" NOT NULL DEFAULT 'GENERAL',
    "severity" "AlertSeverity" NOT NULL DEFAULT 'INFO',
    "aiGenerated" BOOLEAN NOT NULL DEFAULT true,
    "createdByExpertId" TEXT,
    "relevantUntil" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Advisory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "temperatureC" DECIMAL(5,2),
    "feelsLikeC" DECIMAL(5,2),
    "humidityPercent" INTEGER,
    "rainfallMm" DECIMAL(6,2),
    "windSpeedKmh" DECIMAL(5,2),
    "windDirection" TEXT,
    "atmosphericPressureMb" INTEGER,
    "cloudCoverPercent" INTEGER,
    "weatherCondition" TEXT,
    "uvIndex" DECIMAL(3,1),
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeatherLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketPrice" (
    "id" TEXT NOT NULL,
    "cropName" TEXT NOT NULL,
    "mandiName" TEXT NOT NULL,
    "pricePerUnit" DECIMAL(10,2) NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'kg',
    "priceChangePercent" DECIMAL(6,3),
    "previousPrice" DECIMAL(10,2),
    "trend" TEXT,
    "quality" TEXT,
    "supplyVolume" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT,

    CONSTRAINT "MarketPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "imageUrl" TEXT,
    "actionUrl" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "sessionId" TEXT,
    "intent" TEXT,
    "confidence" DECIMAL(3,2),
    "voiceInput" BOOLEAN NOT NULL DEFAULT false,
    "voiceOutput" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "advisoryId" TEXT,
    "rating" INTEGER,
    "comment" TEXT,
    "helpful" BOOLEAN,
    "implemented" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernmentScheme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "eligibilityCriteria" TEXT,
    "benefits" TEXT,
    "applicationUrl" TEXT,
    "deadline" TIMESTAMP(3),
    "stateApplicable" TEXT[],
    "cropApplicable" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernmentScheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IoTSensorLog" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "sensorId" TEXT,
    "sensorType" "SensorType" NOT NULL DEFAULT 'SOIL_MOISTURE',
    "value" DECIMAL(8,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IoTSensorLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YieldPrediction" (
    "id" TEXT NOT NULL,
    "cropId" TEXT NOT NULL,
    "predictedYieldKg" DECIMAL(10,2) NOT NULL,
    "confidence" DECIMAL(3,2) NOT NULL,
    "factors" JSONB,
    "modelVersion" TEXT,
    "predictionDate" TIMESTAMP(3),
    "actualYieldKg" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "YieldPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "OtpToken_phone_idx" ON "OtpToken"("phone");

-- CreateIndex
CREATE INDEX "OtpToken_expiresAt_idx" ON "OtpToken"("expiresAt");

-- CreateIndex
CREATE INDEX "OtpToken_userId_idx" ON "OtpToken"("userId");

-- CreateIndex
CREATE INDEX "Farm_userId_idx" ON "Farm"("userId");

-- CreateIndex
CREATE INDEX "Crop_farmId_idx" ON "Crop"("farmId");

-- CreateIndex
CREATE INDEX "SoilReport_userId_idx" ON "SoilReport"("userId");

-- CreateIndex
CREATE INDEX "SoilReport_farmId_idx" ON "SoilReport"("farmId");

-- CreateIndex
CREATE INDEX "PestDetection_userId_idx" ON "PestDetection"("userId");

-- CreateIndex
CREATE INDEX "PestDetection_cropId_idx" ON "PestDetection"("cropId");

-- CreateIndex
CREATE INDEX "PestDetection_pestName_idx" ON "PestDetection"("pestName");

-- CreateIndex
CREATE INDEX "Advisory_userId_idx" ON "Advisory"("userId");

-- CreateIndex
CREATE INDEX "Advisory_cropId_idx" ON "Advisory"("cropId");

-- CreateIndex
CREATE INDEX "WeatherLog_userId_idx" ON "WeatherLog"("userId");

-- CreateIndex
CREATE INDEX "WeatherLog_timestamp_idx" ON "WeatherLog"("timestamp");

-- CreateIndex
CREATE INDEX "MarketPrice_cropName_idx" ON "MarketPrice"("cropName");

-- CreateIndex
CREATE INDEX "MarketPrice_mandiName_idx" ON "MarketPrice"("mandiName");

-- CreateIndex
CREATE INDEX "MarketPrice_updatedAt_idx" ON "MarketPrice"("updatedAt");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "ChatHistory_userId_idx" ON "ChatHistory"("userId");

-- CreateIndex
CREATE INDEX "ChatHistory_sessionId_idx" ON "ChatHistory"("sessionId");

-- CreateIndex
CREATE INDEX "ChatHistory_timestamp_idx" ON "ChatHistory"("timestamp");

-- CreateIndex
CREATE INDEX "Feedback_userId_idx" ON "Feedback"("userId");

-- CreateIndex
CREATE INDEX "Feedback_advisoryId_idx" ON "Feedback"("advisoryId");

-- CreateIndex
CREATE INDEX "IoTSensorLog_farmId_idx" ON "IoTSensorLog"("farmId");

-- CreateIndex
CREATE INDEX "IoTSensorLog_timestamp_idx" ON "IoTSensorLog"("timestamp");

-- CreateIndex
CREATE INDEX "YieldPrediction_cropId_idx" ON "YieldPrediction"("cropId");

-- AddForeignKey
ALTER TABLE "OtpToken" ADD CONSTRAINT "OtpToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crop" ADD CONSTRAINT "Crop_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoilReport" ADD CONSTRAINT "SoilReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoilReport" ADD CONSTRAINT "SoilReport_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoilReport" ADD CONSTRAINT "SoilReport_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PestDetection" ADD CONSTRAINT "PestDetection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PestDetection" ADD CONSTRAINT "PestDetection_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CropImage" ADD CONSTRAINT "CropImage_detectionId_fkey" FOREIGN KEY ("detectionId") REFERENCES "PestDetection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advisory" ADD CONSTRAINT "Advisory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advisory" ADD CONSTRAINT "Advisory_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Advisory" ADD CONSTRAINT "Advisory_createdByExpertId_fkey" FOREIGN KEY ("createdByExpertId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeatherLog" ADD CONSTRAINT "WeatherLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatHistory" ADD CONSTRAINT "ChatHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_advisoryId_fkey" FOREIGN KEY ("advisoryId") REFERENCES "Advisory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IoTSensorLog" ADD CONSTRAINT "IoTSensorLog_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YieldPrediction" ADD CONSTRAINT "YieldPrediction_cropId_fkey" FOREIGN KEY ("cropId") REFERENCES "Crop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

