// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EquipmentForm from '@/components/EquipmentForm';

interface Equipment {
  id: string;
  name: string;
  description: string;
  category: string;
  available_for: string[];
  price: number;
  location: string;
  county: string;
  contact_phone: string;
  contact_email: string;
}

const EquipmentMarketplace: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, []);

  async function fetchEquipment() {
    setLoading(true);
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .eq('is_active', true);
    if (!error && data) setEquipment(data);
    setLoading(false);
  }

  const categories = Array.from(new Set(equipment.map(e => e.category)));
  const types = ['rental', 'lease', 'purchase'];

  const filteredEquipment = equipment.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
    const matchesType = selectedType === 'all' || e.available_for.includes(selectedType);
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleEquipmentAdded = () => {
    setShowAddForm(false);
    fetchEquipment(); // Refresh the equipment list
  };

  return (
    <div className="min-h-screen">
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Equipment Marketplace</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Find agricultural equipment for rental, lease, or purchase
            </p>
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 hover:bg-green-700"
          >
            {showAddForm ? 'View Listings' : 'Add Equipment'}
          </Button>
        </div>
        
        {showAddForm ? (
          <div className="mb-8">
            <EquipmentForm onSubmit={handleEquipmentAdded} />
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="sm:w-64"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
            </div>
            <div className="grid gap-6">
              {loading ? (
                <div>Loading equipment...</div>
              ) : filteredEquipment.length > 0 ? (
                filteredEquipment.map(eq => (
                  <Card key={eq.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl mb-2">{eq.name}</CardTitle>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="secondary">{eq.category}</Badge>
                        {eq.available_for.map(type => (
                          <Badge key={type} variant="outline">{type}</Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 text-muted-foreground">{eq.description}</div>
                      <div className="mb-2">Location: {eq.location || eq.county}</div>
                      <div className="mb-2">Price: {eq.price ? `KES ${eq.price}` : 'Contact for price'}</div>
                      <div className="mb-2">Contact: {eq.contact_phone} {eq.contact_email && `| ${eq.contact_email}`}</div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div>No equipment found.</div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default EquipmentMarketplace;