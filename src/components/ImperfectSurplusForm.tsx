import React, { useState } from 'react';
import { createImperfectSurplusProduce } from '../services/ImperfectSurplusService';
import { notify } from '../services/notificationService';

const initialState = {
  product: '',
  quantity: '',
  unit: '',
  status: 'available',
};

export default function ImperfectSurplusForm({ onCreated }) {
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
      const { data, error } = await createImperfectSurplusProduce(form);
      if (error) setError(error.message);
      else {
        setForm(initialState);
        notify({ type: 'surplus_new', title: 'New Surplus Produce Listed', description: `${form.product} (${form.quantity} ${form.unit})` });
        if (onCreated) onCreated(data);
      }
    } catch (err) {
      setError('Failed to submit produce');
    }
    setLoading(false);
  };

  return (
    <form className="bg-white rounded shadow p-4 max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-2">List Imperfect Surplus Produce</h2>
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
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
