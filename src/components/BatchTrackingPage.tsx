import React, { useEffect, useState } from 'react';
import {
  createBatch,
  getBatch,
  updateBatch,
  listBatches,
  addEventToBatch,
  getBatchJourney
} from '../services/batchTrackingService';

export const BatchTrackingPage: React.FC<{ farmerId: string }> = ({ farmerId }) => {
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<any | null>(null);
  const [newBatch, setNewBatch] = useState({ product_type: '', quantity: 0, origin: '', destination: '' });
  const [eventText, setEventText] = useState('');
  const [journey, setJourney] = useState<any[]>([]);

  useEffect(() => {
    listBatches(farmerId).then(({ data }) => setBatches(data || []));
  }, [farmerId]);

  const handleCreateBatch = async () => {
    await createBatch({ ...newBatch, farmer_id: farmerId });
    listBatches(farmerId).then(({ data }) => setBatches(data || []));
    setNewBatch({ product_type: '', quantity: 0, origin: '', destination: '' });
  };

  const handleSelectBatch = async (batch: any) => {
    setSelectedBatch(batch);
    const journeyData = await getBatchJourney(batch.batch_id);
    setJourney(journeyData);
  };

  const handleAddEvent = async () => {
    if (selectedBatch) {
      await addEventToBatch(selectedBatch.batch_id, { text: eventText, date: new Date().toISOString() });
      const journeyData = await getBatchJourney(selectedBatch.batch_id);
      setJourney(journeyData);
      setEventText('');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Batch Tracking</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Create New Batch</h3>
        <input type="text" placeholder="Product Type" value={newBatch.product_type} onChange={e => setNewBatch({ ...newBatch, product_type: e.target.value })} />
        <input type="number" placeholder="Quantity" value={newBatch.quantity} onChange={e => setNewBatch({ ...newBatch, quantity: Number(e.target.value) })} />
        <input type="text" placeholder="Origin" value={newBatch.origin} onChange={e => setNewBatch({ ...newBatch, origin: e.target.value })} />
        <input type="text" placeholder="Destination" value={newBatch.destination} onChange={e => setNewBatch({ ...newBatch, destination: e.target.value })} />
        <button onClick={handleCreateBatch}>Create Batch</button>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Your Batches</h3>
        <ul>
          {batches.map(batch => (
            <li key={batch.batch_id}>
              <button onClick={() => handleSelectBatch(batch)}>{batch.product_type} ({batch.status})</button>
            </li>
          ))}
        </ul>
      </div>
      {selectedBatch && (
        <div className="mb-4">
          <h3 className="font-semibold">Batch Journey</h3>
          <ul>
            {journey.map((event, idx) => (
              <li key={idx}>{event.text} - {event.date}</li>
            ))}
          </ul>
          <input type="text" placeholder="Add event" value={eventText} onChange={e => setEventText(e.target.value)} />
          <button onClick={handleAddEvent}>Add Event</button>
        </div>
      )}
    </div>
  );
};
