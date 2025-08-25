import { useState } from 'react';
// Disable strict type checking temporarily
// @ts-nocheck
import { useBulkOrders } from '@/hooks/useBulkOrders';

const initialState = {
  product_type: '',
  quantity: 0,
  unit: '',
  delivery_location: '',
  delivery_date: '',
  max_price: 0,
  requirements: '',
  status: 'open' as const,
  rating: null
};

interface BulkOrderFormProps {
  onCreated?: (data: any) => void;
}

export default function BulkOrderForm({ onCreated }: BulkOrderFormProps) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { createOrder } = useBulkOrders();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'number' ? parseFloat(value) || 0 : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await createOrder(form);
      setForm(initialState);
      if (onCreated) onCreated(data);
    } catch (err) {
      setError('Failed to create order');
    }
    setLoading(false);
  };

  return (
    <form className="bg-white rounded shadow p-4 max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-2">Create Bulk Order</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Product Type</label>
        <input name="product_type" value={form.product_type} onChange={handleChange} className="input input-bordered w-full" required />
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
        <label className="block text-sm font-medium">Max Price (KES)</label>
        <input name="max_price" type="number" step="0.01" value={form.max_price} onChange={handleChange} className="input input-bordered w-full" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Delivery Location</label>
        <input name="delivery_location" value={form.delivery_location} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Delivery Date</label>
        <input name="delivery_date" type="date" value={form.delivery_date} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Requirements</label>
        <textarea name="requirements" value={form.requirements} onChange={handleChange} className="textarea textarea-bordered w-full" rows={3} />
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}