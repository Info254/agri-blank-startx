import React, { useEffect, useState } from 'react';
import { getRecipients, donateCityMarketProduct, getCityMarketProducts } from '@/services/cityMarketService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProductDonationAndRecipientUI: React.FC<{ agentId: string; marketId: string }> = ({ agentId, marketId }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);

  useEffect(() => {
    getCityMarketProducts(marketId).then(({ data }) => setProducts(data || []));
    getRecipients().then(({ data }) => setRecipients(data || []));
  }, [marketId]);

  const handleDonate = async () => {
    if (selectedProduct && selectedRecipient) {
      await donateCityMarketProduct(selectedProduct, selectedRecipient, agentId);
      setSelectedProduct(null);
      setSelectedRecipient(null);
      getCityMarketProducts(marketId).then(({ data }) => setProducts(data || []));
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Donate Product to Recipient</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <select value={selectedProduct || ''} onChange={e => setSelectedProduct(e.target.value)}>
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.product_type} - {p.quantity}</option>
              ))}
            </select>
            <select value={selectedRecipient || ''} onChange={e => setSelectedRecipient(e.target.value)}>
              <option value="">Select Recipient</option>
              {recipients.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.type})</option>
              ))}
            </select>
            <Button onClick={handleDonate} disabled={!selectedProduct || !selectedRecipient}>Donate</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDonationAndRecipientUI;
