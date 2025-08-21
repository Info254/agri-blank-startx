import React, { useEffect, useState } from 'react';
import { getCityMarketProducts, addCityMarketProduct, getCityMarketAuctions, createCityMarketAuction } from '@/services/cityMarketService';
import ValidatedForm from '@/components/ValidatedForm';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface AgentProductAuctionDashboardProps {
  agentId: string;
  marketId: string;
}

const productFields = [
  { name: 'market_id', label: 'Market ID', required: true },
  { name: 'product_type', label: 'Product Type', required: true },
  { name: 'quantity', label: 'Quantity', type: 'number', required: true },
  { name: 'price', label: 'Price', type: 'number', required: true },
];

const auctionFields = [
  { name: 'product_id', label: 'Product', required: true },
  { name: 'auction_start', label: 'Start Time', type: 'datetime-local', required: true },
  { name: 'auction_end', label: 'End Time', type: 'datetime-local', required: true },
  { name: 'starting_price', label: 'Starting Price', type: 'number', required: true },
];

const AgentProductAuctionDashboard: React.FC<AgentProductAuctionDashboardProps> = ({ agentId, marketId }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCityMarketProducts(marketId).then(({ data, error }) => {
      if (error) toast({ title: 'Error loading products', description: error.message });
      setProducts(data || []);
      setLoading(false);
    });
    getCityMarketAuctions(marketId).then(({ data, error }) => {
      if (error) toast({ title: 'Error loading auctions', description: error.message });
      setAuctions(data || []);
    });
  }, [marketId]);

  const handleAddProduct = async (values: any) => {
    const { data, error } = await addCityMarketProduct({ ...values, seller_user_id: agentId });
    if (error) {
      toast({ title: 'Error adding product', description: error.message });
    } else {
      toast({ title: 'Product added', description: 'Product created.' });
      getCityMarketProducts(marketId).then(({ data }) => setProducts(data || []));
    }
    return { data, error };
  };

  const handleAddAuction = async (values: any) => {
    const { data, error } = await createCityMarketAuction({ ...values });
    if (error) {
      toast({ title: 'Error creating auction', description: error.message });
    } else {
      toast({ title: 'Auction created', description: 'Auction created.' });
      getCityMarketAuctions(marketId).then(({ data }) => setAuctions(data || []));
    }
    return { data, error };
  };

  return (
    <div className="p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ValidatedForm fields={productFields} onSubmit={handleAddProduct} submitLabel="Add Product" />
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Products</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div>No products found.</div>
          ) : (
            <ul>
              {products.map((product) => (
                <li key={product.id}>{product.product_type} - {product.quantity} @ {product.price}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create Auction</CardTitle>
        </CardHeader>
        <CardContent>
          <ValidatedForm fields={auctionFields} onSubmit={handleAddAuction} submitLabel="Create Auction" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Auctions</CardTitle>
        </CardHeader>
        <CardContent>
          {auctions.length === 0 ? (
            <div>No auctions found.</div>
          ) : (
            <ul>
              {auctions.map((auction) => (
                <li key={auction.id}>Product: {auction.product_id} | Start: {auction.auction_start} | End: {auction.auction_end} | Starting Price: {auction.starting_price}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentProductAuctionDashboard;
