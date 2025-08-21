import React, { useState } from 'react';
import { notify } from '../services/notificationService';

const initialState = {
  product_id: '',
  recipient_type: '',
  recipient_id: '',
  agent_id: '',
  feedback: '',
  feedback_rating: '',
};

export default function DonationForm({ onDonated }) {
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
      // Replace with your actual service call
      // const { data, error } = await donateProduct(form);
      // if (error) setError(error.message);
      // else {
      setForm(initialState);
      notify({ type: 'donation_new', title: 'Donation Submitted', description: `Product: ${form.product_id}, Recipient: ${form.recipient_type} (${form.recipient_id}), Agent: ${form.agent_id}` });
      if (onDonated) onDonated(form);
      // }
    } catch (err) {
      setError('Failed to submit donation');
    }
    setLoading(false);
  };

  return (
    <form className="bg-white rounded shadow p-4 max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-2">Submit Donation</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Product ID</label>
        <input name="product_id" value={form.product_id} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Recipient Type</label>
        <select name="recipient_type" value={form.recipient_type} onChange={handleChange} className="input input-bordered w-full" required>
          <option value="">Select...</option>
          <option value="school">School</option>
          <option value="CBO">CBO</option>
          <option value="hospital">Hospital</option>
          <option value="church">Church</option>
          <option value="hospice">Hospice</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Recipient ID</label>
        <input name="recipient_id" value={form.recipient_id} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Agent ID</label>
        <input name="agent_id" value={form.agent_id} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Feedback (optional)</label>
        <input name="feedback" value={form.feedback} onChange={handleChange} className="input input-bordered w-full" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Feedback Rating (1-5, optional)</label>
        <input name="feedback_rating" type="number" min="1" max="5" value={form.feedback_rating} onChange={handleChange} className="input input-bordered w-full" />
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
