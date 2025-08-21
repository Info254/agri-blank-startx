import React, { useEffect, useState } from 'react';
import { getWorkshops } from '../services/RecipeResourceService';

export default function WorkshopList() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkshops() {
      setLoading(true);
      const { data } = await getWorkshops();
      setWorkshops(data || []);
      setLoading(false);
    }
    fetchWorkshops();
  }, []);

  return (
    <div className="bg-white rounded shadow p-4 max-w-2xl mx-auto mt-4">
      <h2 className="text-lg font-bold mb-2">Workshops</h2>
      {loading ? (
        <div>Loading...</div>
      ) : workshops.length === 0 ? (
        <div className="text-gray-500">No workshops found.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {workshops.map(workshop => (
            <li key={workshop.id} className="py-2 flex justify-between items-center">
              <div>
                <span className="font-semibold">{workshop.title}</span>
                <span className="ml-2 text-xs text-gray-500">{workshop.date} @ {workshop.location}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
