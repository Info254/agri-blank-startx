import React, { useState } from 'react';
import { createResource } from '../services/RecipeResourceService';
import { notify } from '../services/notificationService';

const initialState = {
  title: '',
  description: '',
  link: '',
};

export default function ResourceForm({ onCreated }) {
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
      const { data, error } = await createResource(form);
      if (error) setError(error.message);
      else {
        setForm(initialState);
        notify({ type: 'resource_new', title: 'New Resource Posted', description: `${form.title}` });
        if (onCreated) onCreated(data);
      }
    } catch (err) {
      setError('Failed to submit resource');
    }
    setLoading(false);
  };

  return (
    <form className="bg-white rounded shadow p-4 max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-2">Post a Resource</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Title</label>
        <input name="title" value={form.title} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Link</label>
        <input name="link" value={form.link} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
