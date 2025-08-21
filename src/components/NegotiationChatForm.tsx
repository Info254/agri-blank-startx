import React, { useState } from 'react';
import { addNegotiationLog } from '../services/BulkOrderService';
import { notify } from '../services/notificationService';

const initialState = {
  order_id: '',
  sender_id: '',
  message: '',
};

interface NegotiationChatFormProps {
  onSent: (data: any) => void;
}

export default function NegotiationChatForm({ onSent }: NegotiationChatFormProps) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const logEntry = { sender_id: form.sender_id, message: form.message, timestamp: new Date().toISOString() };
      const result = await addNegotiationLog(form.order_id, logEntry);
      if ('error' in result && result.error) setError(result.error.message);
      else if ('data' in result) {
        setForm(initialState);
        notify({ type: 'negotiation_update', title: 'Negotiation Message Sent', description: `Message for order ${form.order_id}` });
        if (onSent) onSent(result.data);
      }
    } catch (err) {
      setError('Failed to send message');
    }
    setLoading(false);
  };

  return (
    <form className="bg-white rounded shadow p-4 max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-2">Negotiation Chat</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Order ID</label>
        <input name="order_id" value={form.order_id} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Sender ID</label>
        <input name="sender_id" value={form.sender_id} onChange={handleChange} className="input input-bordered w-full" required />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} className="textarea textarea-bordered w-full" required />
      </div>
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
