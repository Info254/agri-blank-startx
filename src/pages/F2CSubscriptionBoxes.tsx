import React, { useEffect, useState } from 'react';
import { subscribeBox, getSubscriptionBoxes, updateSubscriptionBox, getBoxDeliveries, markBoxDeliveryDelivered } from '@/services/f2cSubscriptionService';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, Package, Truck, Clock, Users, Leaf } from 'lucide-react';
import Header from '@/components/Header';

const F2CSubscriptionBoxes: React.FC = () => {
  const [boxType, setBoxType] = useState('');
  const [frequency, setFrequency] = useState('weekly');
  const [farmerId, setFarmerId] = useState('');
  const [boxes, setBoxes] = useState<any[]>([]);
  const [consumerId, setConsumerId] = useState('');
  const [selectedBoxId, setSelectedBoxId] = useState('');
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [packagingPreference, setPackagingPreference] = useState('eco-friendly');
  const [deliveryTime, setDeliveryTime] = useState('morning');

  useEffect(() => {
    if (consumerId) getSubscriptionBoxes(consumerId).then(({ data }) => setBoxes(data || []));
    if (selectedBoxId) getBoxDeliveries(selectedBoxId).then(({ data }) => setDeliveries(data || []));
  }, [consumerId, selectedBoxId]);

  const handleSubscribe = async () => {
    await subscribeBox({ 
      consumer_id: consumerId, 
      farmer_id: farmerId, 
      box_type: boxType, 
      frequency,
      delivery_address: deliveryAddress,
      packaging_preference: packagingPreference,
      delivery_time: deliveryTime
    });
    getSubscriptionBoxes(consumerId).then(({ data }) => setBoxes(data || []));
  };

  const handleMarkDelivered = async (delivery_id: string) => {
    await markBoxDeliveryDelivered(delivery_id);
    getBoxDeliveries(selectedBoxId).then(({ data }) => setDeliveries(data || []));
  };

  const boxTypes = [
    { value: 'vegetables', label: 'Fresh Vegetables Box', description: 'Seasonal vegetables from local farms' },
    { value: 'fruits', label: 'Fresh Fruits Box', description: 'Organic fruits in season' },
    { value: 'mixed', label: 'Mixed Produce Box', description: 'Combination of vegetables and fruits' },
    { value: 'herbs', label: 'Herbs & Spices Box', description: 'Fresh herbs and spices' },
    { value: 'grains', label: 'Grains & Cereals Box', description: 'Locally grown grains and cereals' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Farm-to-Consumer Subscription Boxes</h1>
          <p className="text-muted-foreground text-lg">
            Get fresh, locally-grown produce delivered directly from farmers to your doorstep. 
            Support local agriculture while enjoying the freshest seasonal produce.
          </p>
        </div>

        {/* What is F2C Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              What is Farm-to-Consumer?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Direct Connection</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Farm-to-Consumer (F2C) subscription boxes create a direct link between local farmers and consumers, 
                  eliminating middlemen and ensuring farmers get fair prices while consumers get the freshest produce.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Support local farmers</span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <Package className="h-4 w-4 text-primary" />
                  <span>Fresh, seasonal produce</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Benefits</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Guaranteed income for farmers</li>
                  <li>• Reduced food waste through planned harvesting</li>
                  <li>• Lower carbon footprint from reduced transportation</li>
                  <li>• Access to organic and specialty varieties</li>
                  <li>• Educational connection to seasonal eating</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Subscription Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="consumerId">Consumer ID</Label>
                  <Input
                    id="consumerId"
                    placeholder="Your consumer ID"
                    value={consumerId}
                    onChange={e => setConsumerId(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="farmerId">Farmer ID</Label>
                  <Input
                    id="farmerId"
                    placeholder="Preferred farmer ID"
                    value={farmerId}
                    onChange={e => setFarmerId(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="boxType">Box Type</Label>
                <Select value={boxType} onValueChange={setBoxType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select box type" />
                  </SelectTrigger>
                  <SelectContent>
                    {boxTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="frequency">Delivery Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <Input
                  id="deliveryAddress"
                  placeholder="Your delivery address"
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="packaging">Packaging Preference</Label>
                  <Select value={packagingPreference} onValueChange={setPackagingPreference}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eco-friendly">Eco-Friendly</SelectItem>
                      <SelectItem value="minimal">Minimal Packaging</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deliveryTime">Preferred Time</Label>
                  <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8-12 PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12-6 PM)</SelectItem>
                      <SelectItem value="evening">Evening (6-8 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSubscribe} className="w-full">
                Create Subscription
              </Button>
            </CardContent>
          </Card>

          {/* Active Subscriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Your Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              {boxes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No active subscriptions</p>
                  <p className="text-sm">Create your first subscription to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {boxes.map(box => (
                    <div key={box.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{box.box_type}</h3>
                          <p className="text-sm text-muted-foreground">
                            Delivered {box.frequency}
                          </p>
                        </div>
                        <Badge variant={box.status === 'active' ? 'default' : 'secondary'}>
                          {box.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Farmer: {box.farmer_id}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {box.delivery_address}
                        </div>
                      </div>

                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setSelectedBoxId(box.id)}
                        className="w-full"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        View Deliveries
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Delivery History */}
        {selectedBoxId && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Delivery History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deliveries.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No deliveries yet</p>
              ) : (
                <div className="space-y-3">
                  {deliveries.map(delivery => (
                    <div key={delivery.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Delivery: {delivery.delivery_date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {delivery.delivered ? (
                          <Badge variant="default">✓ Delivered</Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleMarkDelivered(delivery.id)}
                          >
                            Mark as Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default F2CSubscriptionBoxes;