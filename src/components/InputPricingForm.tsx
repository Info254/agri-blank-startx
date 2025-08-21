import React, { useState } from 'react';
import { createInputPricing } from '../services/inputPricingService';
import { notify } from '../services/notificationService';

const initialState = {
  product_id: '',
  supplier_id: '',
  price: '',
};

export default function InputPricingForm({ onCreated }) {
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
      const { data, error } = await createInputPricing({
        product_id: form.product_id,
        supplier_id: form.supplier_id,
        price: Number(form.price),
      });
      if (error) setError(error.message);
      else {
        setForm(initialState);
        notify({ type: 'input_pricing_new', title: 'New Input Pricing Submitted', description: `Product: ${form.product_id}, Supplier: ${form.supplier_id}, Price: ${form.price}` });
        if (onCreated) onCreated(data);
      }
    } catch (err) {
      setError('Failed to submit pricing');
    }
    setLoading(false);
  };

  return (
    <form className="bg-white rounded shadow p-4 max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-2">Submit Input Pricing</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Product ID</label>
        <input name="product_id" value={form.product_id} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Supplier ID</label>
        <input name="supplier_id" value={form.supplier_id} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Price</label>
        <input name="price" type="number" value={form.price} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
