import React, { useEffect, useState } from 'react';
import {
  createEvent,
  getEvent,
  updateEvent,
  listEvents,
  createPartnership,
  updatePartnership,
  listPartnerships,
  createMatch,
  updateMatch,
  listMatches,
  createMentorship,
  updateMentorship,
  listMentorships,
  createRequest,
  updateRequest,
  listRequests
} from '../services/networkingService';

export const NetworkingPage: React.FC<{ userId: string }> = ({ userId }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [partnerships, setPartnerships] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    listEvents().then(({ data }) => setEvents(data || []));
    listPartnerships(userId).then(({ data }) => setPartnerships(data || []));
    listMatches(userId).then(({ data }) => setMatches(data || []));
    listMentorships(userId).then(({ data }) => setMentorships(data || []));
    listRequests(userId).then(({ data }) => setRequests(data || []));
  }, [userId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Networking & Partnerships</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Events</h3>
        <ul>
          {events.map(event => (
            <li key={event.id}>{event.title} ({event.date})</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Partnerships</h3>
        <ul>
          {partnerships.map(p => (
            <li key={p.id}>{p.type} ({p.status})</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Business Matches</h3>
        <ul>
          {matches.map(m => (
            <li key={m.id}>{m.match_type} ({m.status})</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Mentorships</h3>
        <ul>
          {mentorships.map(ms => (
            <li key={ms.id}>{ms.topic} ({ms.status})</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Research Requests</h3>
        <ul>
          {requests.map(r => (
            <li key={r.id}>{r.topic} ({r.status})</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
