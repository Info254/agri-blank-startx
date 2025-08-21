import React, { useEffect, useState } from 'react';
import { getResources } from '../services/RecipeResourceService';

export default function ResourceList() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResources() {
      setLoading(true);
      const { data } = await getResources();
      setResources(data || []);
      setLoading(false);
    }
    fetchResources();
  }, []);

  return (
    <div className="bg-white rounded shadow p-4 max-w-2xl mx-auto mt-4">
      <h2 className="text-lg font-bold mb-2">Resources</h2>
      {loading ? (
        <div>Loading...</div>
      ) : resources.length === 0 ? (
        <div className="text-gray-500">No resources found.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {resources.map(resource => (
            <li key={resource.id} className="py-2 flex justify-between items-center">
              <div>
                <span className="font-semibold">{resource.title}</span>
                <span className="ml-2 text-xs text-gray-500">{resource.link}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
