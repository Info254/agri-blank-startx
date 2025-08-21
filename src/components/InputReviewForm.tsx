import React, { useState } from 'react';
import { createInputReview } from '../services/inputPricingService';
import { notify } from '../services/notificationService';

const initialState = {
  supplier_id: '',
  rating: '',
  comment: '',
};

export default function InputReviewForm({ onCreated }) {
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
      const { data, error } = await createInputReview(form);
      if (error) setError(error.message);
      else {
        setForm(initialState);
        notify({ type: 'review_new', title: 'New Review Submitted', description: `Supplier: ${form.supplier_id}, Rating: ${form.rating}` });
        if (onCreated) onCreated(data);
      }
    } catch (err) {
      setError('Failed to submit review');
    }
    setLoading(false);
  };

  return (
    <form className="bg-white rounded shadow p-4 max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-2">Submit Supplier Review</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Supplier ID</label>
        <input name="supplier_id" value={form.supplier_id} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Rating</label>
        <input name="rating" type="number" min="1" max="5" value={form.rating} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Comment</label>
        <textarea name="comment" value={form.comment} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
