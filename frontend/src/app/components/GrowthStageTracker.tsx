'use client'
import React from 'react';

const GROWTH_STAGES = [
  { key: 'SEED_SOWN', label: 'Seed Sown', icon: '🌱', color: 'bg-blue-100 dark:bg-blue-900' },
  { key: 'GERMINATION', label: 'Germination', icon: '🌿', color: 'bg-green-100 dark:bg-green-900' },
  { key: 'EARLY_GROWTH', label: 'Early Growth', icon: '🌱', color: 'bg-green-100 dark:bg-green-900' },
  { key: 'VEGETATIVE', label: 'Vegetative', icon: '🌾', color: 'bg-lime-100 dark:bg-lime-900' },
  { key: 'FLOWERING', label: 'Flowering', icon: '🌼', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { key: 'FRUITING', label: 'Fruiting', icon: '🌽', color: 'bg-amber-100 dark:bg-amber-900' },
  { key: 'RIPENING', label: 'Ripening', icon: '🌾', color: 'bg-orange-100 dark:bg-orange-900' },
  { key: 'HARVEST_READY', label: 'Ready for Harvest', icon: '✂️', color: 'bg-red-100 dark:bg-red-900' },
];

export default function GrowthStageTracker({ 
  currentStage, 
  overallProgress, 
  daysCompleted,
  daysRemaining,
  stages 
}: { 
  currentStage: string;
  overallProgress: number;
  daysCompleted?: number;
  daysRemaining?: number;
  stages?: any[];
}) {
  const currentIdx = GROWTH_STAGES.findIndex(s => s.key === currentStage);

  return (
    <div className="mt-6 space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-900 dark:text-white">Overall Progress</h3>
          <span className="text-sm font-bold text-green-600 dark:text-green-400">{overallProgress}%</span>
        </div>
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Days Info */}
      {(daysCompleted !== undefined || daysRemaining !== undefined) && (
        <div className="grid grid-cols-2 gap-4">
          {daysCompleted !== undefined && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="text-xs text-slate-600 dark:text-slate-400">Days Completed</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{daysCompleted}</div>
            </div>
          )}
          {daysRemaining !== undefined && (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
              <div className="text-xs text-slate-600 dark:text-slate-400">Days Remaining</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{daysRemaining}</div>
            </div>
          )}
        </div>
      )}

      {/* Shipment-style Timeline */}
      <div className="relative">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Growth Timeline</h3>
        
        <div className="space-y-4">
          {GROWTH_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const stageData = stages?.find(s => s.type === stage.key);
            const percentComplete = stageData?.percentCompleted || 0;

            return (
              <div key={stage.key} className="flex gap-4 items-start">
                {/* Timeline dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                      isCompleted
                        ? 'bg-green-600 text-white'
                        : isCurrent
                        ? 'bg-gradient-to-br from-green-500 to-blue-500 text-white scale-110 animate-pulse'
                        : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {stage.icon}
                  </div>
                  {idx < GROWTH_STAGES.length - 1 && (
                    <div
                      className={`w-1 h-12 mt-2 transition-all ${
                        isCompleted ? 'bg-green-600' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                  )}
                </div>

                {/* Stage content */}
                <div className={`flex-1 pt-1 ${isCurrent ? 'ring-2 ring-green-400 p-4 rounded-lg bg-green-50 dark:bg-green-900/20' : ''}`}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div>
                      <h4 className={`font-semibold ${
                        isCompleted
                          ? 'text-green-600 dark:text-green-400'
                          : isCurrent
                          ? 'text-slate-900 dark:text-white text-lg'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {stage.label}
                      </h4>
                      {stageData && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Expected: {stageData.expectedDurationDays || '—'} days
                        </p>
                      )}
                    </div>
                    {isCurrent && (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">Active</span>
                    )}
                    {isCompleted && (
                      <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">✓ Done</span>
                    )}
                  </div>

                  {/* Progress bar for stages with data */}
                  {(isCurrent || isCompleted) && stageData && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400">Progress</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{stageData.percentCompleted}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
                          style={{ width: `${stageData.percentCompleted}%` }}
                        />
                      </div>
                      {stageData.aiRecommendation && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500 rounded text-xs text-slate-700 dark:text-slate-300">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">💡 AI Tip: </span>
                          {stageData.aiRecommendation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
