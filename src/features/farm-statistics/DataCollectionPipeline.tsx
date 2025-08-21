import React, { useState } from 'react';
import { useFarmStatistics } from '@/features/farm-statistics/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const DataCollectionPipeline: React.FC = () => {
  const { addYield, addResource, addAnalytics, isLoading } = useFarmStatistics();
  const { toast } = useToast();

  // Yield tracking form
  const [yieldForm, setYieldForm] = useState({
    parcel_id: '',
    crop_type: '',
    planting_date: new Date(),
    area_planted: '',
    expected_yield: '',
    actual_yield: '',
    notes: ''
  });

  // Resource usage form
  const [resourceForm, setResourceForm] = useState({
    resource_type: '',
    parcel_id: '',
    usage_date: new Date(),
    quantity: '',
    unit: '',
    cost_per_unit: '',
    notes: ''
  });

  // Analytics data form
  const [analyticsForm, setAnalyticsForm] = useState({
    date: new Date(),
    metric_name: '',
    metric_value: '',
    unit: '',
    parcel_id: '',
    sensor_id: '',
    notes: ''
  });

  // Automated data collection settings
  const [automatedCollection, setAutomatedCollection] = useState({
    enabled: false,
    interval: '30', // minutes
    metrics: ['soil_moisture', 'temperature', 'rainfall']
  });

  // Form submission handlers
  const handleYieldSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addYield({
        ...yieldForm,
        planting_date: yieldForm.planting_date.toISOString(),
        area_planted: Number(yieldForm.area_planted),
        expected_yield: Number(yieldForm.expected_yield),
        actual_yield: yieldForm.actual_yield ? Number(yieldForm.actual_yield) : null
      });
      toast({
        title: 'Success',
        description: 'Yield data has been recorded successfully.',
      });
      // Reset form
      setYieldForm({
        parcel_id: '',
        crop_type: '',
        planting_date: new Date(),
        area_planted: '',
        expected_yield: '',
        actual_yield: '',
        notes: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record yield data. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addResource({
        ...resourceForm,
        usage_date: resourceForm.usage_date.toISOString(),
        quantity: Number(resourceForm.quantity),
        cost_per_unit: Number(resourceForm.cost_per_unit)
      });
      toast({
        title: 'Success',
        description: 'Resource usage has been recorded successfully.',
      });
      // Reset form
      setResourceForm({
        resource_type: '',
        parcel_id: '',
        usage_date: new Date(),
        quantity: '',
        unit: '',
        cost_per_unit: '',
        notes: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record resource usage. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleAnalyticsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAnalytics({
        ...analyticsForm,
        date: analyticsForm.date.toISOString(),
        metric_value: Number(analyticsForm.metric_value)
      });
      toast({
        title: 'Success',
        description: 'Analytics data has been recorded successfully.',
      });
      // Reset form
      setAnalyticsForm({
        date: new Date(),
        metric_name: '',
        metric_value: '',
        unit: '',
        parcel_id: '',
        sensor_id: '',
        notes: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record analytics data. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const toggleAutomatedCollection = () => {
    setAutomatedCollection(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
    toast({
      title: automatedCollection.enabled ? 'Automated Collection Disabled' : 'Automated Collection Enabled',
      description: automatedCollection.enabled 
        ? 'Data collection has been switched to manual mode.'
        : 'Data will be collected automatically at the specified interval.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Collection Pipeline</h1>
          <p className="text-muted-foreground">
            Manage your farm data collection process
          </p>
        </div>
        <Button
          variant={automatedCollection.enabled ? "default" : "outline"}
          onClick={toggleAutomatedCollection}
        >
          {automatedCollection.enabled ? 'Disable' : 'Enable'} Automated Collection
        </Button>
      </div>

      {automatedCollection.enabled && (
        <Card>
          <CardHeader>
            <CardTitle>Automated Collection Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Collection Interval (minutes)</Label>
                <Input
                  type="number"
                  value={automatedCollection.interval}
                  onChange={(e) => setAutomatedCollection(prev => ({
                    ...prev,
                    interval: e.target.value
                  }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Metrics to Collect</Label>
                <div className="flex gap-2">
                  {['soil_moisture', 'temperature', 'rainfall', 'humidity'].map(metric => (
                    <Button
                      key={metric}
                      variant={automatedCollection.metrics.includes(metric) ? "default" : "outline"}
                      onClick={() => setAutomatedCollection(prev => ({
                        ...prev,
                        metrics: prev.metrics.includes(metric)
                          ? prev.metrics.filter(m => m !== metric)
                          : [...prev.metrics, metric]
                      }))}
                    >
                      {metric}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="yield" className="space-y-4">
        <TabsList>
          <TabsTrigger value="yield">Yield Data</TabsTrigger>
          <TabsTrigger value="resource">Resource Usage</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Data</TabsTrigger>
        </TabsList>

        <TabsContent value="yield">
          <Card>
            <CardHeader>
              <CardTitle>Record Yield Data</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleYieldSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Parcel ID</Label>
                  <Input
                    required
                    value={yieldForm.parcel_id}
                    onChange={(e) => setYieldForm(prev => ({
                      ...prev,
                      parcel_id: e.target.value
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Crop Type</Label>
                  <Input
                    required
                    value={yieldForm.crop_type}
                    onChange={(e) => setYieldForm(prev => ({
                      ...prev,
                      crop_type: e.target.value
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Planting Date</Label>
                  <DatePicker
                    selected={yieldForm.planting_date}
                    onChange={(date) => setYieldForm(prev => ({
                      ...prev,
                      planting_date: date || new Date()
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Area Planted (hectares)</Label>
                  <Input
                    type="number"
                    required
                    value={yieldForm.area_planted}
                    onChange={(e) => setYieldForm(prev => ({
                      ...prev,
                      area_planted: e.target.value
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Expected Yield (tons)</Label>
                  <Input
                    type="number"
                    required
                    value={yieldForm.expected_yield}
                    onChange={(e) => setYieldForm(prev => ({
                      ...prev,
                      expected_yield: e.target.value
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Actual Yield (tons)</Label>
                  <Input
                    type="number"
                    value={yieldForm.actual_yield}
                    onChange={(e) => setYieldForm(prev => ({
                      ...prev,
                      actual_yield: e.target.value
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Notes</Label>
                  <Input
                    value={yieldForm.notes}
                    onChange={(e) => setYieldForm(prev => ({
                      ...prev,
                      notes: e.target.value
                    }))}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Recording...' : 'Record Yield Data'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resource">
          <Card>
            <CardHeader>
              <CardTitle>Record Resource Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResourceSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Resource Type</Label>
                  <Select
                    value={resourceForm.resource_type}
                    onValueChange={(value) => setResourceForm(prev => ({
                      ...prev,
                      resource_type: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select resource type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="fertilizer">Fertilizer</SelectItem>
                      <SelectItem value="pesticide">Pesticide</SelectItem>
                      <SelectItem value="labor">Labor</SelectItem>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="fuel">Fuel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Usage Date</Label>
                  <DatePicker
                    selected={resourceForm.usage_date}
                    onChange={(date) => setResourceForm(prev => ({
                      ...prev,
                      usage_date: date || new Date()
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    required
                    value={resourceForm.quantity}
                    onChange={(e) => setResourceForm(prev => ({
                      ...prev,
                      quantity: e.target.value
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Unit</Label>
                  <Input
                    required
                    value={resourceForm.unit}
                    onChange={(e) => setResourceForm(prev => ({
                      ...prev,
                      unit: e.target.value
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Cost per Unit (KES)</Label>
                  <Input
                    type="number"
                    required
                    value={resourceForm.cost_per_unit}
                    onChange={(e) => setResourceForm(prev => ({
                      ...prev,
                      cost_per_unit: e.target.value
                    }))}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Recording...' : 'Record Resource Usage'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Record Analytics Data</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalyticsSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Metric Name</Label>
                  <Select
                    value={analyticsForm.metric_name}
                    onValueChange={(value) => setAnalyticsForm(prev => ({
                      ...prev,
                      metric_name: value
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soil_moisture">Soil Moisture</SelectItem>
                      <SelectItem value="temperature">Temperature</SelectItem>
                      <SelectItem value="rainfall">Rainfall</SelectItem>
                      <SelectItem value="humidity">Humidity</SelectItem>
                      <SelectItem value="ph_level">pH Level</SelectItem>
                      <SelectItem value="nitrogen_level">Nitrogen Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <DatePicker
                    selected={analyticsForm.date}
                    onChange={(date) => setAnalyticsForm(prev => ({
                      ...prev,
                      date: date || new Date()
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Metric Value</Label>
                  <Input
                    type="number"
                    required
                    value={analyticsForm.metric_value}
                    onChange={(e) => setAnalyticsForm(prev => ({
                      ...prev,
                      metric_value: e.target.value
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Unit</Label>
                  <Input
                    required
                    value={analyticsForm.unit}
                    onChange={(e) => setAnalyticsForm(prev => ({
                      ...prev,
                      unit: e.target.value
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Sensor ID (optional)</Label>
                  <Input
                    value={analyticsForm.sensor_id}
                    onChange={(e) => setAnalyticsForm(prev => ({
                      ...prev,
                      sensor_id: e.target.value
                    }))}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Recording...' : 'Record Analytics Data'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataCollectionPipeline;
