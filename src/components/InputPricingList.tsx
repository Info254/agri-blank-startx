import { notify } from '../services/notificationService';
import React, { useEffect, useState } from 'react';
import { getInputPricing } from '../services/inputPricingService';

import { createInputPricing } from '../services/inputPricingService';
interface InputPricing {
  id: string;
  product_id: string;
  supplier_id: string;
  price: number;
  date: string;
  verified: boolean;
  crowdsource_source: string;
}

export default function InputPricingList() {
  const [pricing, setPricing] = useState<InputPricing[]>([]);
  const [prevPricing, setPrevPricing] = useState<InputPricing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;
    const fetchPricing = async () => {
      setLoading(true);
      const { data } = await getInputPricing();
      setPricing(data || []);
      setLoading(false);
      // Notify on new pricing or status changes
      if (prevPricing.length > 0 && data) {
        data.forEach(item => {
          const prev = prevPricing.find(p => p.id === item.id);
          if (!prev) {
            notify({ type: 'input_pricing_new', title: 'New Input Pricing', description: `Price: ${item.price}` });
          } else if (prev.verified !== item.verified) {
            notify({ type: 'input_pricing_verified', title: 'Input Pricing Verified', description: `Price: ${item.price}` });
          }
        });
      }
      setPrevPricing(data || []);
    };
    fetchPricing();
    intervalId = setInterval(fetchPricing, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-white rounded shadow p-4 max-w-2xl mx-auto mt-4">
      <h2 className="text-lg font-bold mb-2">Input Pricing</h2>
      {loading ? (
        <div>Loading...</div>
      ) : pricing.length === 0 ? (
        <div className="text-gray-500">No input pricing found.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {pricing.map(item => (
            <li key={item.id} className="py-2 flex justify-between items-center">
              <div>
                <span className="font-semibold">{item.product_id}</span>: {item.price}
                <span className="ml-2 text-xs text-gray-500">{item.verified ? 'Verified' : 'Unverified'}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
