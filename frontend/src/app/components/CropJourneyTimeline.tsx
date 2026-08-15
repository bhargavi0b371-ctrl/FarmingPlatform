'use client'
import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function CropJourneyTimeline({ journeyId }: { journeyId: string }) {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await api.cropJourney.timeline(journeyId);
      if (res.success && res.data) setTimeline(res.data as any[]);
      setLoading(false);
    }
    load();
  }, [journeyId]);

  if (loading) return <div>Loading timeline...</div>;
  if (!timeline || timeline.length === 0) return <div className="text-sm text-slate-500">No timeline events yet.</div>;

  return (
    <div className="mt-3">
      <ul className="space-y-2">
        {timeline.map((ev: any) => (
          <li key={ev.id} className="p-2 bg-slate-50 dark:bg-slate-700 rounded">
            <div className="text-sm font-medium">{ev.eventType}</div>
            <div className="text-xs text-slate-500">{new Date(ev.eventAt).toLocaleString()}</div>
            {ev.details && <div className="text-sm mt-1">{ev.details}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
