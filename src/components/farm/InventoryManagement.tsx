
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, Package, Filter, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  status: 'normal' | 'warning' | 'critical';
  minimum: number;
}

const InventoryManagement: React.FC = () => {
  const [items] = useState<InventoryItem[]>([
    { id: '1', name: 'Diesel Fuel', category: 'Fuel', quantity: 350, unit: 'L', unitPrice: 150, totalValue: 52500, status: 'normal', minimum: 100 },
    { id: '2', name: 'NPK Fertilizer', category: 'Fertilizers', quantity: 800, unit: 'kg', unitPrice: 80, totalValue: 64000, status: 'normal', minimum: 200 },
    { id: '3', name: 'Maize Seeds', category: 'Seeds', quantity: 150, unit: 'kg', unitPrice: 300, totalValue: 45000, status: 'normal', minimum: 50 },
    { id: '4', name: 'Roundup Herbicide', category: 'Pesticides', quantity: 50, unit: 'L', unitPrice: 1200, totalValue: 60000, status: 'normal', minimum: 20 },
    { id: '5', name: 'Engine Oil', category: 'Lubricants', quantity: 25, unit: 'L', unitPrice: 800, totalValue: 20000, status: 'normal', minimum: 10 },
    { id: '6', name: 'Bean Seeds', category: 'Seeds', quantity: 80, unit: 'kg', unitPrice: 400, totalValue: 32000, status: 'warning', minimum: 100 },
    { id: '7', name: 'Coffee Seedlings', category: 'Planting Material', quantity: 500, unit: 'pieces', unitPrice: 25, totalValue: 12500, status: 'normal', minimum: 200 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const categories = ['All Categories', ...Array.from(new Set(items.map(item => item.category)))];
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = items.filter(item => item.quantity <= item.minimum);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      default: return <Badge className="bg-green-100 text-green-800">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inventory & Stock Management</h2>
          <p className="text-muted-foreground">Manage your farm inventory and track stock levels for Kenyan agricultural operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Package className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Stock Item
          </Button>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{item.name}</span>
                  <div>
                    <span>Current stock: {item.quantity}</span>
                    <span className="text-muted-foreground ml-2">Minimum: {item.minimum}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        <Input
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter by date
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Stock Management</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">List</Button>
              <Button size="sm" variant="outline">Statistics</Button>
              <Button size="sm" variant="outline">Export</Button>
              <Button size="sm" variant="outline">Import</Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Manage your inventory and track stock levels</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity} {item.unit}</TableCell>
                    <TableCell>KES {item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>KES {item.totalValue.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;
