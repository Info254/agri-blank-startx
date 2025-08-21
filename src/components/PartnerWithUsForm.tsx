import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createPartner } from '@/services/partnerService';
import { supabase } from '@/integrations/supabase/client';

const PartnerWithUsForm: React.FC = () => {
  const { toast } = useToast();
  const initForm = {
    user_id: '', // Will be set from auth context before submission
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    website: '',
    logoUrl: '',
    description: '',
    services: [],
    isVerified: false
  };
  
  const [form, setForm] = useState(initForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to submit a partner application');
        return;
      }
      
      const partnerData = {
        ...form,
        user_id: user.id
      };
      
      const { error } = await createPartner(partnerData);
      if (error) {
        setError(error.message);
      } else {
        toast({ title: 'Application Submitted', description: 'We will contact you soon.' });
        setForm(initForm);
      }
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto mb-8">
      <CardHeader>
        <CardTitle>Become a Partner</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Company Name" required />
          <Input name="email" value={form.email} onChange={handleChange} placeholder="Contact Email" type="email" required />
          <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Contact Phone" required />
          <Input name="website" value={form.website} onChange={handleChange} placeholder="Website" />
          <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your organization and partnership goals" rows={3} required />
          <Input name="address" value={form.address} onChange={handleChange} placeholder="Address" required />
          <Input name="city" value={form.city} onChange={handleChange} placeholder="City" required />
          <Input name="state" value={form.state} onChange={handleChange} placeholder="State/Province" required />
          <Input name="country" value={form.country} onChange={handleChange} placeholder="Country" required />
          <Input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Postal Code" required />
          <Input name="logoUrl" value={form.logoUrl} onChange={handleChange} placeholder="Logo URL (optional)" />
          <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</Button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
      </CardContent>
    </Card>
  );
};

export default PartnerWithUsForm;
