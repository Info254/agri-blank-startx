import React, { useState } from 'react';
import { createInputVerification } from '../services/inputPricingService';
import { notify } from '../services/notificationService';

const initialState = {
  pricing_id: '',
  verified_by: '',
  notes: '',
};

export default function InputVerificationForm({ onCreated }) {
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
      const { data, error } = await createInputVerification(form);
      if (error) setError(error.message);
      else {
        setForm(initialState);
        notify({ type: 'input_pricing_verified', title: 'Input Pricing Verified', description: `Pricing ID: ${form.pricing_id}` });
        if (onCreated) onCreated(data);
      }
    } catch (err) {
      setError('Failed to submit verification');
    }
    setLoading(false);
  };

  return (
    <form className="bg-white rounded shadow p-4 max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-2">Verify Input Pricing</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Pricing ID</label>
        <input name="pricing_id" value={form.pricing_id} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Verified By</label>
        <input name="verified_by" value={form.verified_by} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} className="input input-bordered w-full" />
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
