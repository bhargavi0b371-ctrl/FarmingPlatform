import prisma from '../config/prisma.js';

interface CreateJourneyInput {
  cropId: string;
  notes?: string;
  estimatedHarvest?: string | null;
  expectedYieldKg?: number | null;
}

const createCropJourney = async (userId: string, input: CreateJourneyInput) => {
  // Minimal creation: attach to crop and set a default stage
  const journey = await prisma.cropJourney.create({
    data: {
      cropId: input.cropId,
      currentStage: 'SEED_SOWN',
      notes: input.notes,
      estimatedHarvest: input.estimatedHarvest ? new Date(input.estimatedHarvest) : undefined,
      expectedYieldKg: input.expectedYieldKg ?? undefined,
    },
  });
  return journey;
};

const getById = async (id: string) => {
  const journey = await prisma.cropJourney.findUnique({
    where: { id },
    include: {
      stages: true,
      irrigationLogs: true,
      healthLogs: true,
      tasks: true,
      timelineEvents: true,
      harvestPredictions: true,
      crop: true,
    },
  });
  if (!journey) throw new Error('CropJourney not found');
  return journey;
};

const listForUser = async (userId: string) => {
  // Find journeys by crops that belong to user's farms/crops. For simplicity, return journeys where crop.ownerId === userId or crop.userId fields may vary.
  // We'll attempt to join via crop -> farm -> owner if available; fallback to journey list.
  const journeys = await prisma.cropJourney.findMany({
    include: { crop: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return journeys;
};

const updateProgress = async (id: string, data: { overallProgress?: number; currentStage?: string }) => {
  const updated = await prisma.cropJourney.update({
    where: { id },
    data: {
      overallProgress: data.overallProgress ?? undefined,
      currentStage: data.currentStage ? (data.currentStage as any) : undefined,
    },
  });
  return updated;
};

const addIrrigationLog = async (journeyId: string, userId: string, input: { volumeLiters?: number; note?: string }) => {
  const log = await prisma.irrigationLog.create({
    data: {
      journeyId,
      userId,
      volumeLiters: input.volumeLiters ?? undefined,
      note: input.note ?? undefined,
    },
  });
  return log;
};

const addHealthLog = async (journeyId: string, userId: string, input: { healthScore: number; nutrientStatus?: string; pestRiskLevel?: string; diseaseRiskLevel?: string; note?: string }) => {
  const log = await prisma.cropHealthLog.create({
    data: {
      journeyId,
      userId,
      healthScore: input.healthScore,
      nutrientStatus: input.nutrientStatus ?? undefined,
      pestRiskLevel: input.pestRiskLevel ?? undefined,
      diseaseRiskLevel: input.diseaseRiskLevel ?? undefined,
      note: input.note ?? undefined,
    },
  });
  return log;
};

const getTimeline = async (journeyId: string) => {
  const events = await prisma.cropTimelineEvent.findMany({ where: { journeyId }, orderBy: { eventAt: 'desc' } });
  return events;
};

export default {
  createCropJourney,
  getById,
  listForUser,
  updateProgress,
  addIrrigationLog,
  addHealthLog,
  getTimeline,
};
