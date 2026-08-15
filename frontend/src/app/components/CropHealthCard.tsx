'use client'
import React, { useState } from 'react';
import { api } from '../../lib/api';

export default function CropHealthCard({ journeyId }: { journeyId: string }) {
  const [score, setScore] = useState(90);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    await api.cropJourney.addHealth(journeyId, { healthScore: score, note });
    setNote('');
    setSubmitting(false);
  };

  return (
    <div className="mt-3 p-3 border rounded bg-slate-50 dark:bg-slate-700">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Health Score: {score}</div>
        <div className="text-xs text-slate-500">Adjust and save</div>
      </div>
      <div className="mt-2 flex gap-2 items-center">
        <input type="range" min={0} max={100} value={score} onChange={(e) => setScore(Number(e.target.value))} />
      </div>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Notes" className="w-full mt-2 p-2 rounded border" />
      <div className="mt-2">
        <button disabled={submitting} onClick={submit} className="px-3 py-1 bg-blue-600 text-white rounded">Save Health Log</button>
      </div>
    </div>
  );
}
