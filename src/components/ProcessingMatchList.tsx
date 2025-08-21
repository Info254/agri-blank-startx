import React, { useEffect, useState } from 'react';
import { getProcessingMatches } from '../services/BulkOrderService';
import { notify } from '../services/notificationService';

export default function ProcessingMatchList({ bulkOrderId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prevMatches, setPrevMatches] = useState([]);

  useEffect(() => {
    let intervalId;
    const fetchMatches = async () => {
      setLoading(true);
      const { data } = await getProcessingMatches({ bulk_order_id: bulkOrderId });
      setMatches(data || []);
      setLoading(false);
      // Notify on new matches or status changes
      if (prevMatches.length > 0 && data) {
        data.forEach(match => {
          const prev = prevMatches.find(m => m.id === match.id);
          if (!prev) {
            notify({ type: 'match_new', title: 'New Offer Received', description: `Offer: ${match.offer_price}` });
          } else if (prev.status !== match.status) {
            notify({ type: 'match_status', title: 'Offer Status Updated', description: `Offer: ${match.offer_price}, Status: ${match.status}` });
          }
        });
      }
      setPrevMatches(data || []);
    };
    if (bulkOrderId) {
      fetchMatches();
      intervalId = setInterval(fetchMatches, 5000); // Poll every 5 seconds
    }
    return () => intervalId && clearInterval(intervalId);
  }, [bulkOrderId]);

  if (!bulkOrderId) return null;

  return (
    <div className="bg-white rounded shadow p-4 max-w-2xl mx-auto mt-4">
      <h2 className="text-lg font-bold mb-2">Processing Matches</h2>
      {loading ? (
        <div>Loading...</div>
      ) : matches.length === 0 ? (
        <div className="text-gray-500">No matches found.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {matches.map(match => (
            <li key={match.id} className="py-2 flex justify-between items-center">
              <div>
                <span className="font-semibold">Offer:</span> {match.offer_price}
                <span className="ml-2 text-xs text-gray-500">Status: {match.status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
