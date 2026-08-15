'use client'
import React from 'react';
import GrowthStageTracker from './GrowthStageTracker';

export default function CropJourneyCard({ journey }: { journey: any }) {
  const datePlanted = journey.crop?.plantingDate ? new Date(journey.crop.plantingDate) : null;
  const estimatedHarvest = journey.estimatedHarvest ? new Date(journey.estimatedHarvest) : null;
  
  const today = new Date();
  const daysCompleted = datePlanted ? Math.floor((today.getTime() - datePlanted.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const daysRemaining = estimatedHarvest ? Math.floor((estimatedHarvest.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const healthColor = journey.healthScore >= 75 ? 'text-green-600' : journey.healthScore >= 50 ? 'text-yellow-600' : 'text-red-600';
  const healthBg = journey.healthScore >= 75 ? 'bg-green-100 dark:bg-green-900/30' : journey.healthScore >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-red-100 dark:bg-red-900/30';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 mb-6">
      {/* Header with image and quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
        {/* Crop Image or Placeholder */}
        <div className="md:col-span-1">
          {journey.crop?.imageUrl || journey.notes?.includes('Image:') ? (
            <img 
              src={journey.crop?.imageUrl || 'https://via.placeholder.com/300'} 
              alt={journey.crop?.name}
              className="w-full h-40 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-40 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-4xl">🌾</span>
            </div>
          )}
        </div>

        {/* Crop Info and Stats */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{journey.crop?.name || 'Crop Journey'}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">{journey.notes || 'No description'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Health Score */}
            <div className={`p-3 rounded-lg ${healthBg}`}>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Health Score</div>
              <div className={`text-2xl font-bold ${healthColor}`}>{journey.healthScore}%</div>
            </div>

            {/* Current Stage */}
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Current Stage</div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{journey.currentStage?.replace(/_/g, ' ')}</div>
            </div>

            {/* Days Completed */}
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Days Growing</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{daysCompleted}</div>
            </div>

            {/* Days Until Harvest */}
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Days to Harvest</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{Math.max(0, daysRemaining)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Timeline and Progress */}
      <div className="p-6">
        <GrowthStageTracker
          currentStage={journey.currentStage}
          overallProgress={journey.overallProgress}
          daysCompleted={daysCompleted}
          daysRemaining={Math.max(0, daysRemaining)}
          stages={journey.stages}
        />

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors">
            🚿 Log Irrigation
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
            💚 Check Health
          </button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors">
            📸 Add Photos
          </button>
        </div>
      </div>
    </div>
  );
}
