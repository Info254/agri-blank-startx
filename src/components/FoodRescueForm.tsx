import React, { useState } from 'react';
import { createFoodRescueListing } from '../services/FoodRescueService';
import { notify } from '../services/notificationService';

const initialState = {
  product: '',
  quantity: '',
  unit: '',
  location: '',
  urgency: '',
  status: 'available',
};

export default function FoodRescueForm({ onCreated }) {
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
      const { data, error } = await createFoodRescueListing(form);
      if (error) setError(error.message);
      else {
        setForm(initialState);
        notify({ type: 'rescue_listing_new', title: 'New Food Rescue Listing', description: `${form.product} (${form.quantity} ${form.unit})` });
        if (onCreated) onCreated(data);
      }
    } catch (err) {
      setError('Failed to submit listing');
    }
    setLoading(false);
  };

  return (
    <form className="bg-white rounded shadow p-4 max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-2">Submit Food Rescue Listing</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Product</label>
        <input name="product" value={form.product} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Quantity</label>
        <input name="quantity" type="number" value={form.quantity} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Unit</label>
        <input name="unit" value={form.unit} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Location</label>
        <input name="location" value={form.location} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Urgency</label>
        <input name="urgency" value={form.urgency} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
