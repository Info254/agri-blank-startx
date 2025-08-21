import React, { useEffect, useState } from 'react';
import { createBulkOrder, getBulkOrders, bidBulkOrder, getBulkOrderBids, acceptBulkOrderBid } from '@/services/bulkAuctionService';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ReverseBulkAuctions: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [produceType, setProduceType] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [quality, setQuality] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [bidOrderId, setBidOrderId] = useState('');
  const [bidPrice, setBidPrice] = useState(0);
  const [bidQuality, setBidQuality] = useState('');
  const [bids, setBids] = useState<any[]>([]);

  useEffect(() => {
    getBulkOrders().then(({ data }) => setOrders(data || []));
    if (bidOrderId) getBulkOrderBids(bidOrderId).then(({ data }) => setBids(data || []));
  }, [bidOrderId]);

  const handlePostBulkNeed = async () => {
    await createBulkOrder({ produce_type: produceType, quantity, quality, delivery_date: deliveryDate });
    getBulkOrders().then(({ data }) => setOrders(data || []));
  };

  const handleBidOnOrder = async () => {
    await bidBulkOrder({ order_id: bidOrderId, price: bidPrice, quality_offer: bidQuality });
    getBulkOrderBids(bidOrderId).then(({ data }) => setBids(data || []));
  };

  const handleAcceptBid = async (bid_id) => {
    await acceptBulkOrderBid(bid_id);
    getBulkOrderBids(bidOrderId).then(({ data }) => setBids(data || []));
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Reverse Auctions for Bulk Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <input type="text" placeholder="Produce Type" value={produceType} onChange={e => setProduceType(e.target.value)} />
            <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
            <input type="text" placeholder="Quality" value={quality} onChange={e => setQuality(e.target.value)} />
            <input type="date" placeholder="Delivery Date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
            <Button onClick={handlePostBulkNeed}>Post Bulk Need</Button>
          </div>
          <ul>
            {orders.map(order => (
              <li key={order.id}>{order.produce_type} - {order.quantity} ({order.quality}) Delivery: {order.delivery_date} Status: {order.status}</li>
            ))}
          </ul>
          <div className="mt-6 mb-4">
            <input type="text" placeholder="Order ID to Bid" value={bidOrderId} onChange={e => setBidOrderId(e.target.value)} />
            <input type="number" placeholder="Bid Price" value={bidPrice} onChange={e => setBidPrice(Number(e.target.value))} />
            <input type="text" placeholder="Bid Quality" value={bidQuality} onChange={e => setBidQuality(e.target.value)} />
            <Button onClick={handleBidOnOrder}>Bid on Order</Button>
          </div>
          <ul>
            {bids.map(bid => (
              <li key={bid.id}>Bid: {bid.price} ({bid.quality_offer}) Status: {bid.status} <Button onClick={() => handleAcceptBid(bid.id)}>Accept Bid</Button></li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReverseBulkAuctions;
