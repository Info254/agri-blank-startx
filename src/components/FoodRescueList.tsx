import { notify } from '../services/notificationService';
import React, { useEffect, useState } from 'react';
import { getFoodRescueListings } from '../services/FoodRescueService';

export default function FoodRescueList() {
  const [listings, setListings] = useState([]);
  const [prevListings, setPrevListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;
    const fetchListings = async () => {
      setLoading(true);
      const { data } = await getFoodRescueListings();
      setListings(data || []);
      setLoading(false);
      // Notify on new listings or status changes
      if (prevListings.length > 0 && data) {
        data.forEach(listing => {
          const prev = prevListings.find(l => l.id === listing.id);
          if (!prev) {
            notify({ type: 'rescue_listing_new', title: 'New Food Rescue Listing', description: `${listing.product} (${listing.quantity} ${listing.unit})` });
          } else if (prev.status !== listing.status) {
            notify({ type: 'rescue_status', title: 'Rescue Listing Status Updated', description: `${listing.product}: ${listing.status}` });
          }
        });
      }
      setPrevListings(data || []);
    };
    fetchListings();
    intervalId = setInterval(fetchListings, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-white rounded shadow p-4 max-w-2xl mx-auto mt-4">
      <h2 className="text-lg font-bold mb-2">Food Rescue Listings</h2>
      {loading ? (
        <div>Loading...</div>
      ) : listings.length === 0 ? (
        <div className="text-gray-500">No rescue listings found.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {listings.map(listing => (
            <li key={listing.id} className="py-2 flex justify-between items-center">
              <div>
                <span className="font-semibold">{listing.product}</span> - {listing.quantity} {listing.unit}
                <span className="ml-2 text-xs text-gray-500">Status: {listing.status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
