
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, TrendingUp, Droplets, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Crop {
  id: string;
  name: string;
  currentYield: number;
  previousYield: number;
  unit: string;
  quality: string;
  surface: number;
}

const CropTracking: React.FC = () => {
  const [crops] = useState<Crop[]>([
    { id: '1', name: 'Maize', currentYield: 25, previousYield: 20, unit: 'bags/acre', quality: 'Good', surface: 12500 },
    { id: '2', name: 'Coffee', currentYield: 15, previousYield: 12, unit: 'kg/tree', quality: 'Excellent', surface: 2300 },
    { id: '3', name: 'Beans', currentYield: 8, previousYield: 10, unit: 'bags/acre', quality: 'Good', surface: 3500 },
    { id: '4', name: 'Potatoes', currentYield: 180, previousYield: 150, unit: 'bags/acre', quality: 'Average', surface: 4200 },
    { id: '5', name: 'Tea', currentYield: 2200, previousYield: 2000, unit: 'kg/ha', quality: 'Good', surface: 1800 }
  ]);

  const yieldData = crops.map(crop => ({
    name: crop.name,
    'Current Yield': crop.currentYield,
    'Previous Yield': crop.previousYield
  }));

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Average': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Crop Management & Tracking</h2>
          <p className="text-muted-foreground">Track your crop yields and quality for major Kenyan agricultural products</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Crop
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Yield Tracking for Kenyan Crops
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Monitor yields and quality for major crops grown in Kenya
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yieldData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Current Yield" fill="#22c55e" />
                  <Bar dataKey="Previous Yield" fill="#7c2d12" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {crops.map((crop) => (
            <Card key={crop.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{crop.name}</h3>
                    <p className="text-sm text-muted-foreground">Area: {crop.surface} m²</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Current yield</span>
                    <span className="font-medium">{crop.currentYield} {crop.unit}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Previous yield</span>
                    <span className="text-sm text-muted-foreground">{crop.previousYield} {crop.unit}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Quality</span>
                    <Badge className={getQualityColor(crop.quality)}>
                      {crop.quality}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">
                      +{((crop.currentYield - crop.previousYield) / crop.previousYield * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CropTracking;
