import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FoodRescueDashboard() {
  const [surplus, setSurplus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('city_market_products')
        .select('*')
        .in('category', ['imperfect', 'surplus'])
        .order('created_at', { ascending: false });
      setSurplus(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="py-8 px-6 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Food Rescue Dashboard</h1>
      <p className="text-muted-foreground mb-6">Divert imperfect/surplus produce to charities and low-cost channels.</p>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {surplus.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{p.product_type}</span>
                  <Badge variant="secondary">{p.category}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Qty: {p.quantity}</div>
                  <div>Price: {p.price}</div>
                  <div>Status: {p.status}</div>
                </div>
              </CardContent>
            </Card>
          ))}
          {surplus.length === 0 && (
            <Card><CardContent className="py-6">No surplus items found yet.</CardContent></Card>
          )}
        </div>
      )}
    </div>
  );
}
