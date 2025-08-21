import React, { useState } from 'react';
import { createProcessingMatch } from '../services/BulkOrderService';

const initialState = {
  offer_price: '',
};

export default function ProcessingMatchForm({ bulkOrderId, farmerId, onCreated }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const match = {
        bulk_order_id: bulkOrderId,
        farmer_id: farmerId,
        offer_price: form.offer_price,
        status: 'pending',
        negotiation_log: [],
      };
      const { data, error } = await createProcessingMatch(match);
      if (error) setError(error.message);
      else {
        setForm(initialState);
        if (onCreated) onCreated(data);
      }
    } catch (err) {
      setError('Failed to submit match');
    }
    setLoading(false);
  };

  return (
    <form className="bg-white rounded shadow p-4 max-w-md mx-auto mt-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-2">Submit Offer</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Offer Price</label>
        <input name="offer_price" type="number" value={form.offer_price} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
