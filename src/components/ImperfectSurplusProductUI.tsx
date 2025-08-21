import React, { useEffect, useState } from 'react';
import { getCityMarketProductsByCategory, setCityMarketProductCategory, updateCityMarketProductStatus } from '@/services/cityMarketService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const categories = ['imperfect', 'surplus', 'near_expiry', 'spoilt'];

const ImperfectSurplusProductUI: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('imperfect');

  useEffect(() => {
    getCityMarketProductsByCategory(selectedCategory).then(({ data }) => setProducts(data || []));
  }, [selectedCategory]);

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Imperfect/Surplus/Near-Spoilt Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            {categories.map(cat => (
              <Button key={cat} onClick={() => setSelectedCategory(cat)} variant={selectedCategory === cat ? 'default' : 'outline'}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>
          {products.length === 0 ? (
            <div>No products found in this category.</div>
          ) : (
            <ul>
              {products.map(product => (
                <li key={product.id}>{product.product_type} - {product.quantity} @ {product.price} ({product.status})</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImperfectSurplusProductUI;
