import React, { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Button, Card, Input, Select } from './ui';
import { toast } from './ui/use-toast';

interface Bid {
  id: string;
  auction_id: string;
  bidder_user_id: string;
  bid_amount: number;
  bid_time: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export const BidManagement: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const { data, error } = await supabase
        .from('city_market_bids')
        .select('*')
        .eq('bidder_user_id', user?.id);

      if (error) throw error;
      setBids(data || []);
    } catch (error) {
      toast({
        title: 'Error fetching bids',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBidAction = async (bidId: string, action: 'accept' | 'reject') => {
    try {
      const { error } = await supabase
        .from('city_market_bids')
        .update({ status: action })
        .eq('id', bidId);

      if (error) throw error;

      toast({
        title: `Bid ${action}ed successfully`,
        variant: 'default',
      });

      fetchBids();
    } catch (error) {
      toast({
        title: `Error ${action}ing bid`,
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Bid Management</h2>
      {loading ? (
        <div>Loading bids...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bids.map((bid) => (
            <Card key={bid.id} className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Bid Amount: ${bid.bid_amount}</h3>
                <p>Bid Time: {new Date(bid.bid_time).toLocaleString()}</p>
                <p>Status: {bid.status}</p>
                {bid.status === 'pending' && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() => handleBidAction(bid.id, 'accept')}
                      variant="default"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleBidAction(bid.id, 'reject')}
                      variant="destructive"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
