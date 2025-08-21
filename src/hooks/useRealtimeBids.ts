import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from '@/components/ui/use-toast';

interface Bid {
  id: string;
  auction_id: string;
  bidder_user_id: string;
  bid_amount: number;
  bid_time: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export function useRealtimeBids(auctionId: string) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();

  useEffect(() => {
    // Initial fetch
    fetchBids();

    // Set up real-time subscription
    const subscription = supabase
      .channel('city_market_bids')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'city_market_bids',
          filter: `auction_id=eq.${auctionId}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBids(current => [...current, payload.new as Bid]);
            toast({
              title: 'New bid received',
              description: `New bid of $${payload.new.bid_amount} placed`,
            });
          } else if (payload.eventType === 'UPDATE') {
            setBids(current =>
              current.map(bid =>
                bid.id === payload.new.id ? { ...bid, ...payload.new } : bid
              )
            );
            if (payload.new.status === 'accepted') {
              toast({
                title: 'Bid accepted',
                description: `Bid of $${payload.new.bid_amount} was accepted`,
              });
            } else if (payload.new.status === 'rejected') {
              toast({
                title: 'Bid rejected',
                description: `Bid of $${payload.new.bid_amount} was rejected`,
              });
            }
          } else if (payload.eventType === 'DELETE') {
            setBids(current =>
              current.filter(bid => bid.id !== payload.old.id)
            );
            toast({
              title: 'Bid withdrawn',
              description: 'A bid was withdrawn from the auction',
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [auctionId, supabase]);

  const fetchBids = async () => {
    try {
      const { data, error } = await supabase
        .from('city_market_bids')
        .select('*')
        .eq('auction_id', auctionId)
        .order('bid_time', { ascending: false });

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

  return { bids, loading };
}
