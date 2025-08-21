
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Edit, Trash2 } from 'lucide-react';
import ParcelMapView from './ParcelMapView';

interface Parcel {
  id: string;
  name: string;
  size: number;
  crop: string;
  status: 'active' | 'inactive';
  lastHarvest: string;
  harvestIn: number;
  coordinates?: [number, number];
}

const LandManagement: React.FC = () => {
  const [parcels] = useState<Parcel[]>([
    {
      id: '1',
      name: 'Nakuru North',
      size: 12.5,
      crop: 'Maize',
      status: 'active',
      lastHarvest: '8/15/2023',
      harvestIn: 76,
      coordinates: [36.0667, -0.3031]
    },
    {
      id: '2',
      name: 'Kiambu South',
      size: 8.3,
      crop: 'Coffee',
      status: 'active',
      lastHarvest: '6/10/2023',
      harvestIn: 120,
      coordinates: [36.8356, -1.1743]
    },
    {
      id: '3',
      name: 'Meru East',
      size: 5.2,
      crop: 'Beans',
      status: 'active',
      lastHarvest: '9/20/2023',
      harvestIn: 45,
      coordinates: [37.6573, 0.0472]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParcel, setSelectedParcel] = useState<Parcel | undefined>();

  const filteredParcels = parcels.filter(parcel => 
    parcel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parcel.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Land & Parcel Management</h2>
          <p className="text-muted-foreground">Manage and monitor all your agricultural parcels across Kenya</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Parcel
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search parcels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select className="px-3 py-2 border rounded-md">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filteredParcels.map((parcel) => (
            <Card 
              key={parcel.id} 
              className={`border-l-4 border-l-green-500 cursor-pointer transition-all hover:shadow-md ${
                selectedParcel?.id === parcel.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedParcel(parcel)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{parcel.name}</CardTitle>
                    <Badge variant={parcel.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                      {parcel.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MapPin className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium">{parcel.size} acres</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Last harvest:</span>
                    <span>{parcel.lastHarvest}</span>
                  </div>
                  <div className="mt-3 p-2 bg-green-50 rounded">
                    <div className="text-sm font-medium text-green-800">{parcel.crop}</div>
                    <div className="text-xs text-green-600">Next harvest in: {parcel.harvestIn} days</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <ParcelMapView selectedParcel={selectedParcel} />
        </div>
      </div>
    </div>
  );
};

export default LandManagement;
