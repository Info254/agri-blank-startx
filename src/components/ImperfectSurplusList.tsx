import { notify } from '../services/notificationService';
import React, { useEffect, useState } from 'react';
import { getImperfectSurplusProduce } from '../services/ImperfectSurplusService';

export default function ImperfectSurplusList() {
  const [produce, setProduce] = useState([]);
  const [prevProduce, setPrevProduce] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;
    const fetchProduce = async () => {
      setLoading(true);
      const { data } = await getImperfectSurplusProduce();
      setProduce(data || []);
      setLoading(false);
      // Notify on new listings or status changes
      if (prevProduce.length > 0 && data) {
        data.forEach(item => {
          const prev = prevProduce.find(p => p.id === item.id);
          if (!prev) {
            notify({ type: 'surplus_new', title: 'New Surplus Produce', description: `${item.product} (${item.quantity} ${item.unit})` });
          } else if (prev.status !== item.status) {
            notify({ type: 'surplus_status', title: 'Surplus Produce Status Updated', description: `${item.product}: ${item.status}` });
          }
        });
      }
      setPrevProduce(data || []);
    };
    fetchProduce();
    intervalId = setInterval(fetchProduce, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-white rounded shadow p-4 max-w-2xl mx-auto mt-4">
      <h2 className="text-lg font-bold mb-2">Imperfect Surplus Produce</h2>
      {loading ? (
        <div>Loading...</div>
      ) : produce.length === 0 ? (
        <div className="text-gray-500">No surplus produce found.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {produce.map(item => (
            <li key={item.id} className="py-2 flex justify-between items-center">
              <div>
                <span className="font-semibold">{item.product}</span> - {item.quantity} {item.unit}
                <span className="ml-2 text-xs text-gray-500">Status: {item.status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
