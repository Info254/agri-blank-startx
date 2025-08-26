// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { getProcessingMatches } from '../services/BulkOrderService';

export default function NegotiationAnalytics({ orderId }: { orderId: string }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      setError('');
      try {
        const { data, error } = await getProcessingMatches({ id: orderId });
        if (error) setError(error.message);
        else {
          const match = data?.[0];
          setLogs(Array.isArray(match?.negotiation_log) ? match.negotiation_log : []);
        }
      } catch (err) {
        setError('Failed to load analytics');
      }
      setLoading(false);
    }
    if (orderId) fetchLogs();
  }, [orderId]);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!logs.length) return <div>No negotiation messages yet.</div>;

  return (
    <div className="bg-white rounded shadow p-4 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2">Negotiation Analytics</h2>
      <ul className="divide-y">
        {logs.map((log, idx) => (
          <li key={idx} className="py-2">
            <div className="text-sm font-semibold">Sender: {log.sender_id}</div>
            <div className="text-sm">{log.message}</div>
            <div className="text-xs text-gray-500">{log.timestamp}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
