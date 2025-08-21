
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ShoppingCart, PlusCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CartItem {
  id: string;
  product_name: string;
  quantity: number;
  price_per_unit: number;
  supplier: {
    id: string;
    supplier_name: string;
    contact_phone: string;
  };
}

const FarmInputMarketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('farm_input_products')
        .select(`
          *,
          supplier:farm_input_suppliers (
            id,
            supplier_name,
            contact_phone
          )
        `)
        .eq('is_active', true);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.product_description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.product_category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.product_category)));

  const addToCart = (product: any, quantity: number) => {
    const cartItem: CartItem = {
      id: product.id,
      product_name: product.product_name,
      quantity,
      price_per_unit: product.price_per_unit,
      supplier: {
        id: product.supplier.id,
        supplier_name: product.supplier.supplier_name,
        contact_phone: product.supplier.contact_phone
      }
    };

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, cartItem];
    });

    toast({
      title: 'Added to Cart',
      description: `${quantity} ${product.unit_of_measure} of ${product.product_name} added to cart`,
    });
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to place orders.',
          variant: 'destructive'
        });
        return;
      }

      // Group cart items by supplier
      const ordersBySupplier = cart.reduce((acc, item) => {
        const supplierId = item.supplier.id;
        if (!acc[supplierId]) {
          acc[supplierId] = {
            supplier: item.supplier,
            items: [],
            total: 0
          };
        }
        acc[supplierId].items.push(item);
        acc[supplierId].total += item.quantity * item.price_per_unit;
        return acc;
      }, {} as Record<string, any>);

      // Create orders for each supplier
      for (const [supplierId, orderData] of Object.entries(ordersBySupplier)) {
        const { data: order, error: orderError } = await supabase
          .from('farm_input_orders')
          .insert({
            buyer_id: user.id,
            supplier_id: supplierId,
            total_amount: orderData.total,
            delivery_method: 'pickup',
            buyer_name: user.user_metadata?.full_name || 'John Farmer',
            buyer_phone: user.user_metadata?.phone || '+254700000000',
            delivery_county: 'Nairobi'
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = orderData.items.map((item: CartItem) => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price_per_unit,
          total_price: item.quantity * item.price_per_unit
        }));

        const { error: itemsError } = await supabase
          .from('farm_input_order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;
      }

      setCart([]);
      toast({
        title: 'Orders Placed Successfully',
        description: `${Object.keys(ordersBySupplier).length} order(s) have been placed with different suppliers.`,
      });
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Error',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-12 px-6 max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-lg">Loading farm inputs...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Farm Input Marketplace</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Source quality agricultural inputs from verified suppliers
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{product.product_name}</CardTitle>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="secondary">{product.product_category}</Badge>
                      <Badge variant="default">
                        {product.price_per_unit} KES / {product.unit_of_measure}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {product.supplier.supplier_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.supplier.contact_phone}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{product.product_description}</p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Available Stock:</div>
                    <div className="text-sm font-medium">{product.stock_quantity}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Brand:</div>
                    <div className="text-sm font-medium">{product.brand_name || 'N/A'}</div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Input type="number" placeholder="Quantity" defaultValue={1} className="w-24" />
                  <Button 
                    onClick={() => addToCart(product, 1)}
                    className="flex-1"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria to find what you're looking for.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Shopping Cart */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <ShoppingCart className="h-5 w-5" />
            <span className="font-medium">
              {cart.length} items in cart
            </span>
          </div>
          
          <div>
            <Button onClick={placeOrder} disabled={cart.length === 0 || loading}>
              {loading ? (
                <>
                  Placing Order...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Place Order
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmInputMarketplace;
