import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const BuyRequestForm: React.FC<{ userId: string; onSubmitted?: () => void }> = ({ userId, onSubmitted }) => {
  const [form, setForm] = useState({
    product: '',
    quantity: '',
    unit: 'kg',
    description: '',
    imageFile: null as File | null,
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPEG, PNG, or WebP images are allowed.');
      return;
    }
    if (file.size > 1024 * 1024) {
      alert('Image must be less than 1MB.');
      return;
    }
    setForm(f => ({ ...f, imageFile: file }));
    const { data } = await supabase.storage.from('buy-request-images').upload(`buy-requests/${Date.now()}_${file.name}`, file);
    if (data?.path) {
      const { data: urlData } = supabase.storage.from('buy-request-images').getPublicUrl(data.path);
      setForm(f => ({ ...f, imageUrl: urlData.publicUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await (supabase.from as any)('buy_requests').insert({
      user_id: userId,
      product: form.product,
      quantity: form.quantity,
      unit: form.unit,
      description: form.description,
      image_url: form.imageUrl
    });
    setLoading(false);
    setForm({ product: '', quantity: '', unit: 'kg', description: '', imageFile: null, imageUrl: '' });
    if (onSubmitted) onSubmitted();
  };

  return (
    <Card className="max-w-xl mx-auto my-4">
      <CardHeader>
        <CardTitle>Post a Buy Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="border p-2 rounded w-full" name="product" placeholder="Product" value={form.product} onChange={handleChange} required />
          <input className="border p-2 rounded w-full" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
          <select className="border p-2 rounded w-full" name="unit" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
            <option value="kg">Kilograms (kg)</option>
            <option value="tonnes">Tonnes</option>
            <option value="bags">Bags</option>
          </select>
          <textarea className="border p-2 rounded w-full" name="description" placeholder="Describe your request" value={form.description} onChange={handleChange} required />
          <div>
            <label htmlFor="buy-request-image" className="block text-sm font-medium text-gray-700">Image (max 1MB, JPEG/PNG/WebP)</label>
            <input type="file" id="buy-request-image" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
            {form.imageUrl && <img src={form.imageUrl} alt="Request" className="mt-2 h-24 rounded" />}
          </div>
          <Button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post Buy Request'}</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BuyRequestForm;
