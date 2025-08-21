import React from 'react';

export default function NegotiationLog({ log }) {
  if (!log || log.length === 0) return <div className="text-gray-500">No negotiation history.</div>;
  return (
    <div className="bg-white rounded shadow p-4 max-w-2xl mx-auto mt-4">
      <h2 className="text-lg font-bold mb-2">Negotiation Log</h2>
      <ul className="divide-y divide-gray-200">
        {log.map((entry, idx) => (
          <li key={idx} className="py-2">
            <span className="font-semibold">{entry.actor}:</span> {entry.message}
            <span className="ml-2 text-xs text-gray-500">{entry.timestamp}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
