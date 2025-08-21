import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Globe, Tractor, Landmark, Star } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';

interface ExportOpportunity {
  id: string;
  buyer_name: string;
  destination_country: string;
  crop_type: string;
  quantity_tons: number;
  price_per_ton: number;
  required_certifications: string[];
  min_order_quantity: number;
}

const ExportMarketOpportunities: React.FC = () => {
  const [opportunities, setOpportunities] = useState<ExportOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [priceComparison, setPriceComparison] = useState(null);
  const [newOpp, setNewOpp] = useState({
    type: 'buy',
    buyer_name: '',
    destination_country: '',
    crop_type: '',
    quantity_tons: 0,
    price_per_ton: 0,
    min_order_quantity: 0,
    required_certifications: ''
  });

  useEffect(() => {
    fetchOpportunities();
  }, []);

  async function fetchOpportunities() {
    setLoading(true);
    const { data, error } = await supabase
      .from('export_opportunities')
      .select('*')
      .eq('status', 'open');
    if (!error && data) setOpportunities(data);
    setLoading(false);
  }

  async function handlePostOpportunity() {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      toast({ title: 'Login required', description: 'Please sign in to post.' });
      return;
    }
    const payload: any = {
      buyer_name: newOpp.buyer_name,
      destination_country: newOpp.destination_country,
      crop_type: newOpp.crop_type,
      quantity_tons: Number(newOpp.quantity_tons) || 0,
      price_per_ton: Number(newOpp.price_per_ton) || 0,
      min_order_quantity: Number(newOpp.min_order_quantity) || 0,
      required_certifications: newOpp.required_certifications
        ? newOpp.required_certifications.split(',').map(s => s.trim())
        : [],
      status: 'open',
      specifications: `type:${newOpp.type}`,
      created_by: authUser.id,
    };
    const { error } = await supabase.from('export_opportunities').insert(payload);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Posted', description: 'Your opportunity has been posted.' });
      setNewOpp({ type: 'buy', buyer_name: '', destination_country: '', crop_type: '', quantity_tons: 0, price_per_ton: 0, min_order_quantity: 0, required_certifications: '' });
      fetchOpportunities();
    }
  }

  const crops = Array.from(new Set(opportunities.map(o => o.crop_type).filter(c => c && c.trim().length)));
  const countries = Array.from(new Set(opportunities.map(o => o.destination_country).filter(c => c && c.trim().length)));

  const filteredOpportunities = opportunities.filter(o => {
    const matchesSearch = o.buyer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'all' || o.crop_type === selectedCrop;
    const matchesCountry = selectedCountry === 'all' || o.destination_country === selectedCountry;
    return matchesSearch && matchesCrop && matchesCountry;
  });

  async function handleDeleteOrder(orderId) {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    const { error } = await supabase.from('export_orders').delete().eq('id', orderId);
    if (!error) {
      // Remove from UI
      setOpportunities(opportunities.filter(o => o.id !== orderId));
      setSelectedOrder(null);
    }
  }

  async function fetchTimeline(orderId) {
    const { data } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('export_order_id', orderId)
      .order('event_time');
    setTimeline(data || []);
  }

  async function fetchDocuments(opportunityId) {
    const { data } = await supabase
      .from('export_documentation')
      .select('*')
      .eq('export_opportunity_id', opportunityId);
    setDocuments(data || []);
  }

  async function fetchPriceComparison(commodity, opportunityId) {
    const { data } = await supabase
      .from('price_comparisons')
      .select('*')
      .eq('commodity_name', commodity)
      .eq('export_opportunity_id', opportunityId)
      .single();
    setPriceComparison(data);
  }

  return (
    <div className="min-h-screen">
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Export Market Opportunities</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Connect with international buyers and access global markets
        </p>
        {/* Post Opportunity */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Post Export Opportunity</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-3">
            <Select value={newOpp.type} onValueChange={(v) => setNewOpp({ ...newOpp, type: v })}>
              <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Company / Contact" value={newOpp.buyer_name} onChange={(e) => setNewOpp({ ...newOpp, buyer_name: e.target.value })} />
            <Input placeholder="Destination Country" value={newOpp.destination_country} onChange={(e) => setNewOpp({ ...newOpp, destination_country: e.target.value })} />
            <Input placeholder="Crop Type" value={newOpp.crop_type} onChange={(e) => setNewOpp({ ...newOpp, crop_type: e.target.value })} />
            <Input type="number" placeholder="Quantity (tons)" value={newOpp.quantity_tons} onChange={(e) => setNewOpp({ ...newOpp, quantity_tons: Number(e.target.value) })} />
            <Input type="number" placeholder="Price per ton (KES)" value={newOpp.price_per_ton} onChange={(e) => setNewOpp({ ...newOpp, price_per_ton: Number(e.target.value) })} />
            <Input type="number" placeholder="Min Order (tons)" value={newOpp.min_order_quantity} onChange={(e) => setNewOpp({ ...newOpp, min_order_quantity: Number(e.target.value) })} />
            <Input placeholder="Required Certifications (comma separated)" value={newOpp.required_certifications} onChange={(e) => setNewOpp({ ...newOpp, required_certifications: e.target.value })} />
            <Button onClick={handlePostOpportunity}>Post</Button>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search buyers..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="sm:w-64"
          />
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Crops" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              {crops.map(crop => (
                <SelectItem key={crop} value={crop}>{crop}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-6">
          {loading ? (
            <div>Loading opportunities...</div>
          ) : filteredOpportunities.length > 0 ? (
            filteredOpportunities.map(opp => (
              <Card key={opp.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl mb-2 flex items-center justify-between">
                    <span>{opp.buyer_name}</span>
                    <Badge variant="secondary"><Globe className="mr-2 h-4 w-4" />{opp.destination_country}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><Tractor className="mr-2 h-4 w-4 inline-block" />Crop: {opp.crop_type}</div>
                    <div><Landmark className="mr-2 h-4 w-4 inline-block" />Quantity: {opp.quantity_tons} tons</div>
                    <div>Price: KES {opp.price_per_ton}/ton</div>
                    <div>Min Order: {opp.min_order_quantity} tons</div>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold">Requirements:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {opp.required_certifications.map(cert => (
                        <Badge key={cert} variant="outline">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => { setSelectedOrder(opp); fetchTimeline(opp.id); fetchDocuments(opp.id); fetchPriceComparison(opp.crop_type, opp.id); }}>
                      View Details
                    </Button>
                    <Button variant="outline">Express Interest</Button>
                    <Button variant="outline">Form Consolidation</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div>No export opportunities found.</div>
          )}
        </div>
        {selectedOrder && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="timeline-list">
                {timeline.map(event => (
                  <li key={event.id} className="mb-2">
                    <span className="font-semibold">{event.event_type}</span>: {event.event_description} <span className="text-muted-foreground">({new Date(event.event_time).toLocaleString()})</span>
                  </li>
                ))}
              </ul>
              {(user?.id === selectedOrder.created_by || user?.role === 'admin') && (
                <Button variant="destructive" onClick={() => handleDeleteOrder(selectedOrder.id)}>
                  Delete Order
                </Button>
              )}
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Export Documentation Checklist</h4>
                <ul>
                  {documents.map(doc => (
                    <li key={doc.id} className="mb-1">
                      {doc.document_type} - {doc.status}
                      {doc.file_url ? (
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 underline">View</a>
                      ) : (
                        <span className="ml-2 text-red-600">Not uploaded</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {priceComparison && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Price Comparison</h4>
                  <div>Domestic: KES {priceComparison.domestic_price} | Export: KES {priceComparison.export_price}</div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ExportMarketOpportunities; 