'use client'
import React, { useState } from 'react';
import { api } from '../../lib/api';

export default function IrrigationTracker({ journeyId }: { journeyId: string }) {
  const [volume, setVolume] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    await api.cropJourney.addIrrigation(journeyId, { volumeLiters: parseFloat(volume) });
    setVolume('');
    setSubmitting(false);
  };

  return (
    <div className="mt-3">
      <div className="flex gap-2 items-center">
        <input value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="Liters" className="border rounded p-1 w-28" />
        <button disabled={submitting} onClick={submit} className="px-3 py-1 bg-green-600 text-white rounded">Log Irrigation</button>
      </div>
    </div>
  );
}
