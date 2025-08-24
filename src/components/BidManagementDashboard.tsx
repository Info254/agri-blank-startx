import React from 'react';
import { useParams } from 'react-router-dom';
import { useRealtimeBids } from '@/hooks/useRealtimeBids';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { BidValidator } from '@/services/BidValidator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

export function BidManagementDashboard() {
  const { auctionId } = useParams();
  const { bids, loading } = useRealtimeBids(auctionId!);
  const [bidAmount, setBidAmount] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const { user } = useAuth();

  const validator = new BidValidator({
    minimumBidAmount: 1,
    maximumBidAmount: 1000000,
    bidIncrement: 10,
    allowAutoBidding: true,
    maxBidsPerUser: 5,
    requiredUserVerification: true
  }, supabase);

  const handlePlaceBid = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to place bids',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const validation = await validator.validateBid({
        auction_id: auctionId!,
        bidder_user_id: user.id,
        bid_amount: parseFloat(bidAmount)
      });

      if (!validation.isValid) {
        toast({
          title: 'Invalid Bid',
          description: validation.errors.join('\n'),
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('city_market_bids')
        .insert({
          auction_id: auctionId!,
          bidder_user_id: user?.id!,
          bid_amount: parseFloat(bidAmount)
        });

      if (error) throw error;

      toast({
        title: 'Bid Placed Successfully',
        variant: 'default',
      });
      setBidAmount('');
    } catch (error) {
      toast({
        title: 'Error Placing Bid',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Auction Bidding</h1>
        <div className="flex gap-4">
          <Card className="w-48">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Total Bids</div>
              <div className="text-2xl font-bold">{bids.length}</div>
            </CardContent>
          </Card>
          <Card className="w-48">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Highest Bid</div>
              <div className="text-2xl font-bold">
                ${Math.max(...bids.map(b => b.bid_amount), 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Place a Bid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="number"
              placeholder="Enter bid amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-48"
            />
            <Button 
              onClick={handlePlaceBid} 
              disabled={submitting || !bidAmount}
            >
              Place Bid
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bids.map((bid) => (
          <Card key={bid.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-lg font-semibold">
                    ${bid.bid_amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(bid.bid_time).toLocaleString()}
                  </div>
                </div>
                {getStatusIcon(bid.status)}
              </div>
              
              <div className="flex gap-2 items-center text-sm text-gray-500">
                {bid.status === 'pending' && (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
                Status: {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
              </div>

              {user?.id === bid.bidder_user_id && (
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={bid.status !== 'pending'}
                    onClick={() => {/* Implement bid withdrawal */}}
                  >
                    Withdraw Bid
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
