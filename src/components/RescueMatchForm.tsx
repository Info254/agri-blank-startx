import React, { useState } from 'react';
import { createRescueMatch } from '../services/FoodRescueService';
import { notify } from '../services/notificationService';

const initialState = {
  listing_id: '',
  rescuer_id: '',
  status: 'pending',
  notes: '',
};

export default function RescueMatchForm({ onCreated }) {
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
      const { data, error } = await createRescueMatch(form);
      if (error) setError(error.message);
      else {
        setForm(initialState);
        notify({ type: 'rescue_match_new', title: 'New Rescue Match', description: `Match for listing ${form.listing_id}` });
        if (onCreated) onCreated(data);
      }
    } catch (err) {
      setError('Failed to submit match');
    }
    setLoading(false);
  };

  return (
    <form className="bg-white rounded shadow p-4 max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-2">Create Rescue Match</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Listing ID</label>
        <input name="listing_id" value={form.listing_id} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Rescuer ID</label>
        <input name="rescuer_id" value={form.rescuer_id} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} className="textarea textarea-bordered w-full" />
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
