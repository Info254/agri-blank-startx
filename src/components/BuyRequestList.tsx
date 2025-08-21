import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BuyRequest {
  id: string;
  user_id: string;
  product: string;
  quantity: string;
  unit: string;
  description: string;
  image_url?: string;
  created_at?: string;
}

const BuyRequestList: React.FC = () => {
  const [requests, setRequests] = useState<BuyRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    const { data, error } = await (supabase.from as any)('buy_requests').select('*').order('created_at', { ascending: false });
    if (!error) setRequests(data || []);
    setLoading(false);
  }

  return (
    <Card className="max-w-2xl mx-auto my-4">
      <CardHeader>
        <CardTitle>Buy Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div>Loading...</div>}
        {requests.length === 0 && !loading && <div className="text-gray-500">No buy requests found.</div>}
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.id} className="p-4 border rounded flex items-center gap-4">
              {req.image_url && <img src={req.image_url} alt="Request" className="h-16 w-16 object-cover rounded" />}
              <div className="flex-1">
                <div className="font-bold">{req.product} ({req.quantity} {req.unit})</div>
                <div className="text-xs text-gray-500 mb-1">{req.description}</div>
                <Button size="sm" variant="secondary" onClick={() => window.open(`mailto:${req.user_id}`)}>Contact Buyer</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BuyRequestList;
