import React, { useState, useEffect } from 'react';
import { NotificationType } from '../services/notificationService';

const notificationOptions: { type: NotificationType; label: string }[] = [
  { type: 'bulk_order_new', label: 'New Bulk Order' },
  { type: 'bulk_order_status', label: 'Bulk Order Status Change' },
  { type: 'match_new', label: 'New Offer/Match' },
  { type: 'match_status', label: 'Offer/Match Status Change' },
  { type: 'negotiation_update', label: 'Negotiation Update' },
  { type: 'rescue_listing_new', label: 'New Food Rescue Listing' },
  { type: 'rescue_status', label: 'Food Rescue Status Change' },
  { type: 'input_pricing_new', label: 'New Input Pricing' },
  { type: 'input_pricing_verified', label: 'Input Pricing Verified' },
  { type: 'review_new', label: 'New Review' },
  { type: 'review_verified', label: 'Review Verified' },
  { type: 'surplus_new', label: 'New Surplus Produce' },
  { type: 'surplus_status', label: 'Surplus Produce Status Change' },
  { type: 'recipe_new', label: 'New Recipe' },
  { type: 'resource_new', label: 'New Resource' },
  { type: 'workshop_new', label: 'New Workshop' },
  { type: 'workshop_update', label: 'Workshop Update' },
  { type: 'rsvp_new', label: 'New RSVP/Registration' },
];

export default function NotificationSettings({ userId }) {
  const initialPrefs: Record<NotificationType, boolean> = notificationOptions.reduce((acc, opt) => {
    acc[opt.type] = true;
    return acc;
  }, {} as Record<NotificationType, boolean>);
  const [prefs, setPrefs] = useState<Record<NotificationType, boolean>>(initialPrefs);

  useEffect(() => {
    // TODO: Load user preferences from backend
    // For now, default all to true
    setPrefs(initialPrefs);
  }, []);

  const handleToggle = (type: NotificationType) => {
    setPrefs(prev => ({ ...prev, [type]: !prev[type] }));
    // TODO: Save updated preferences to backend
  };

  return (
    <div className="bg-white rounded shadow p-4 max-w-lg mx-auto mt-4">
      <h2 className="text-lg font-bold mb-2">Notification Settings</h2>
      <ul className="divide-y divide-gray-200">
        {notificationOptions.map(opt => (
          <li key={opt.type} className="py-2 flex justify-between items-center">
            <span>{opt.label}</span>
            <input
              type="checkbox"
              checked={!!prefs[opt.type]}
              onChange={() => handleToggle(opt.type)}
              className="form-checkbox h-5 w-5 text-primary"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
