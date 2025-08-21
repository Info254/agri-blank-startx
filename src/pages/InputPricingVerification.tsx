import React, { useEffect, useState } from 'react';
import { createInputPricing, getInputPricing, reviewSupplier, getSupplierReviews } from '@/services/inputPricingService';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const InputPricingVerification: React.FC = () => {
  const [productId, setProductId] = useState('');
  const [price, setPrice] = useState(0);
  const [prices, setPrices] = useState<any[]>([]);
  const [supplierId, setSupplierId] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (productId && supplierId) {
      getInputPricing({ product_id: productId, supplier_id: supplierId }).then(({ data }) => setPrices(data || []));
    } else if (productId) {
      getInputPricing({ product_id: productId }).then(({ data }) => setPrices(data || []));
    } else if (supplierId) {
      getInputPricing({ supplier_id: supplierId }).then(({ data }) => setPrices(data || []));
    } else {
      getInputPricing().then(({ data }) => setPrices(data || []));
    }
    if (supplierId) getSupplierReviews(supplierId).then(({ data }) => setReviews(data || []));
  }, [productId, supplierId]);

  const handleReportPrice = async () => {
    if (!productId || !supplierId) return;
    await createInputPricing({ product_id: productId, supplier_id: supplierId, price });
    getInputPricing({ product_id: productId, supplier_id: supplierId }).then(({ data }) => setPrices(data || []));
  };

  const handleReviewSupplier = async () => {
    await reviewSupplier({ supplier_id: supplierId, rating, review });
    getSupplierReviews(supplierId).then(({ data }) => setReviews(data || []));
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Input Pricing & Supplier Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <input type="text" placeholder="Product ID" value={productId} onChange={e => setProductId(e.target.value)} />
            <input type="text" placeholder="Supplier ID" value={supplierId} onChange={e => setSupplierId(e.target.value)} />
            <input type="number" placeholder="Price" value={price} onChange={e => setPrice(Number(e.target.value))} />
            <Button onClick={handleReportPrice}>Report Price</Button>
          </div>
          <ul>
            {prices.map(p => (
              <li key={p.id}>Product: {p.product_id} - Supplier: {p.supplier_id} - {p.price} {p.verified ? '✔️' : ''}</li>
            ))}
          </ul>
          <div className="mt-6 mb-4">
            <input type="text" placeholder="Supplier ID" value={supplierId} onChange={e => setSupplierId(e.target.value)} />
            <input type="number" placeholder="Rating" value={rating} onChange={e => setRating(Number(e.target.value))} />
            <input type="text" placeholder="Review" value={review} onChange={e => setReview(e.target.value)} />
            <Button onClick={handleReviewSupplier}>Review Supplier</Button>
          </div>
          <ul>
            {reviews.map(r => (
              <li key={r.id}>Supplier: {r.supplier_id} - {r.rating} stars - {r.review} {r.verified ? '✔️' : ''}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default InputPricingVerification;
