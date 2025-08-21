
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface AddWarehouseFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const AddWarehouseForm: React.FC<AddWarehouseFormProps> = ({ onSubmit, onCancel }) => {
  const { toast } = useToast();
  
  // Form state
  const [warehouseName, setWarehouseName] = useState('');
  const [warehouseLocation, setWarehouseLocation] = useState('');
  const [warehouseCounty, setWarehouseCounty] = useState('');
  const [warehouseCapacity, setWarehouseCapacity] = useState('');
  const [warehouseGoods, setWarehouseGoods] = useState('');
  const [warehouseHasRefrigeration, setWarehouseHasRefrigeration] = useState(false);

  const handleSubmit = () => {
    if (!warehouseName || !warehouseLocation || !warehouseCounty || !warehouseCapacity) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all required fields',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Warehouse Added',
      description: `${warehouseName} has been submitted for approval`,
    });

    onSubmit();
  };

  return (
    <div className="grid gap-4 py-4">
      <div>
        <Label htmlFor="name">Warehouse Name</Label>
        <Input
          id="name"
          value={warehouseName}
          onChange={(e) => setWarehouseName(e.target.value)}
          placeholder="e.g. Nakuru Cold Storage"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={warehouseLocation}
            onChange={(e) => setWarehouseLocation(e.target.value)}
            placeholder="e.g. Industrial Area, Nakuru"
          />
        </div>
        
        <div>
          <Label htmlFor="county">County</Label>
          <Select value={warehouseCounty} onValueChange={setWarehouseCounty}>
            <SelectTrigger id="county">
              <SelectValue placeholder="Select County" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nairobi">Nairobi</SelectItem>
              <SelectItem value="Nakuru">Nakuru</SelectItem>
              <SelectItem value="Mombasa">Mombasa</SelectItem>
              <SelectItem value="Kisumu">Kisumu</SelectItem>
              <SelectItem value="Uasin Gishu">Uasin Gishu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="capacity">Storage Capacity</Label>
        <div className="flex space-x-2">
          <Input
            id="capacity"
            type="number"
            min="1"
            value={warehouseCapacity}
            onChange={(e) => setWarehouseCapacity(e.target.value)}
            placeholder="e.g. 5000"
            className="flex-1"
          />
          <Select defaultValue="tons">
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tons">Tons</SelectItem>
              <SelectItem value="sq-m">Square Meters</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="goods">Goods Types</Label>
        <Textarea
          id="goods"
          value={warehouseGoods}
          onChange={(e) => setWarehouseGoods(e.target.value)}
          placeholder="e.g. Cereals, Fruits, Vegetables (comma separated)"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="refrigeration" 
          checked={warehouseHasRefrigeration}
          onCheckedChange={(checked) => setWarehouseHasRefrigeration(checked === true)}
        />
        <Label htmlFor="refrigeration">Has Refrigeration</Label>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit Warehouse</Button>
      </DialogFooter>
    </div>
  );
};

export default AddWarehouseForm;
