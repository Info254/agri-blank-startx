import React, { useEffect, useState } from 'react';
import { getPartnerEvents } from '../services/partnerService';

import { PartnerEvent } from '@/types/partner';

interface PartnerEventsListProps {
  limit?: number;
}

const PartnerEventsList: React.FC<PartnerEventsListProps> = ({ limit }) => {
  const [events, setEvents] = useState<PartnerEvent[]>([]);
  useEffect(() => {
    getPartnerEvents().then(({ data }) => {
      if (Array.isArray(data)) {
        const mappedEvents = data.map(e => ({
          ...e,
          createdAt: e.createdAt || new Date().toISOString(),
          updatedAt: e.updatedAt || new Date().toISOString()
        }));
        setEvents(limit ? mappedEvents.slice(0, limit) : mappedEvents);
      } else {
        setEvents([]);
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {events.map(event => (
        <div key={event.id} className="border rounded-lg p-4 bg-white shadow">
          <h3 className="font-bold text-lg mb-1">{event.title}</h3>
          <div className="text-sm text-muted-foreground mb-2">{event.startDate} - {event.endDate} &bull; {event.location}</div>
          <p className="mb-2">{event.description}</p>
          {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="h-32 object-cover rounded" />}
        </div>
      ))}
    </div>
  );
};

export default PartnerEventsList;
