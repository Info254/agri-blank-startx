
import { useEffect, useState } from "react";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, MapPin, TrendingUp } from "lucide-react";

// Types for market demand
interface DemandHotspot {
  id: string;
  crop: string;
  location: string;
  county: string;
  demandLevel: 'high' | 'medium' | 'low';
  pricePerKg: number;
  buyerCount: number;
  description: string;
  lastUpdated: Date;
}

// Mock data for demand hotspots
const mockDemandHotspots: DemandHotspot[] = [
  {
    id: '1',
    crop: 'Tomatoes',
    location: 'Wakulima Market',
    county: 'Nairobi',
    demandLevel: 'high',
    pricePerKg: 120,
    buyerCount: 15,
    description: 'High demand for fresh tomatoes with consistent supply for restaurants and hotels',
    lastUpdated: new Date('2025-04-22')
  },
  {
    id: '2',
    crop: 'Potatoes',
    location: 'Nakuru Main Market',
    county: 'Nakuru',
    demandLevel: 'high',
    pricePerKg: 45,
    buyerCount: 12,
    description: 'Wholesale buyers looking for bulk potato supply for distribution to retail outlets',
    lastUpdated: new Date('2025-04-23')
  },
  {
    id: '3',
    crop: 'Maize',
    location: 'Eldoret Grain Market',
    county: 'Uasin Gishu',
    demandLevel: 'medium',
    pricePerKg: 35,
    buyerCount: 8,
    description: 'Millers seeking quality maize with moisture content below 13%',
    lastUpdated: new Date('2025-04-21')
  },
  {
    id: '4',
    crop: 'Mangoes',
    location: 'Mombasa Fruit Market',
    county: 'Mombasa',
    demandLevel: 'high',
    pricePerKg: 90,
    buyerCount: 10,
    description: 'Export buyers seeking apple and ngowe mango varieties for international markets',
    lastUpdated: new Date('2025-04-20')
  },
  {
    id: '5',
    crop: 'Avocados',
    location: 'Thika Market',
    county: 'Kiambu',
    demandLevel: 'high',
    pricePerKg: 150,
    buyerCount: 7,
    description: 'Processing companies looking for hass avocados for oil extraction and export',
    lastUpdated: new Date('2025-04-22')
  }
];

const MarketDemandHotspot = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [filteredHotspots, setFilteredHotspots] = useState<DemandHotspot[]>(mockDemandHotspots);
  
  useEffect(() => {
    document.title = "Market Demand Hotspots | Kilimo Connect";
    
    // Filter the hotspots based on selections
    let filtered = [...mockDemandHotspots];
    
    if (selectedCrop) {
      filtered = filtered.filter(hotspot => 
        hotspot.crop.toLowerCase().includes(selectedCrop.toLowerCase())
      );
    }
    
    if (selectedCounty) {
      filtered = filtered.filter(hotspot => 
        hotspot.county.toLowerCase().includes(selectedCounty.toLowerCase())
      );
    }
    
    setFilteredHotspots(filtered);
  }, [selectedCrop, selectedCounty]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Market Demand Hotspots</h1>
          <p className="text-muted-foreground mt-2">
            Discover where buyers are actively looking for specific crops and connect directly with them
          </p>
        </div>
        
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="crop" className="block text-sm font-medium mb-1">Crop</label>
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger id="crop">
                <SelectValue placeholder="All Crops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Crops</SelectItem>
                <SelectItem value="tomatoes">Tomatoes</SelectItem>
                <SelectItem value="potatoes">Potatoes</SelectItem>
                <SelectItem value="maize">Maize</SelectItem>
                <SelectItem value="mangoes">Mangoes</SelectItem>
                <SelectItem value="avocados">Avocados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="county" className="block text-sm font-medium mb-1">County</label>
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger id="county">
                <SelectValue placeholder="All Counties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Counties</SelectItem>
                <SelectItem value="nairobi">Nairobi</SelectItem>
                <SelectItem value="nakuru">Nakuru</SelectItem>
                <SelectItem value="uasin gishu">Uasin Gishu</SelectItem>
                <SelectItem value="mombasa">Mombasa</SelectItem>
                <SelectItem value="kiambu">Kiambu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button variant="outline" className="w-full" onClick={() => {
              setSelectedCrop("");
              setSelectedCounty("");
            }}>
              Clear Filters
            </Button>
          </div>
        </div>
        
        <div className="relative h-[300px] w-full border rounded-md bg-muted/20 flex items-center justify-center mb-6">
          <p className="text-muted-foreground">Market Demand Heatmap Visualization</p>
          {filteredHotspots.map(hotspot => (
            <div 
              key={hotspot.id}
              className={`absolute w-4 h-4 rounded-full flex items-center justify-center
                ${hotspot.demandLevel === 'high' ? 'bg-red-500' : 
                  hotspot.demandLevel === 'medium' ? 'bg-orange-400' : 'bg-yellow-300'}`}
              style={{ 
                top: `${Math.random() * 70 + 15}%`, 
                left: `${Math.random() * 70 + 15}%` 
              }}
              title={`${hotspot.crop} demand in ${hotspot.location}, ${hotspot.county}`}
            >
              <MapPin className="h-3 w-3 text-white" />
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotspots.map(hotspot => (
            <Card key={hotspot.id} className={
              hotspot.demandLevel === 'high' 
                ? 'border-red-200 bg-red-50' 
                : hotspot.demandLevel === 'medium'
                ? 'border-orange-200 bg-orange-50'
                : 'border-yellow-200 bg-yellow-50'
            }>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{hotspot.crop}</CardTitle>
                    <CardDescription>
                      {hotspot.location}, {hotspot.county}
                    </CardDescription>
                  </div>
                  <div className={`rounded-full px-2 py-1 text-xs font-medium 
                    ${hotspot.demandLevel === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : hotspot.demandLevel === 'medium'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {hotspot.demandLevel.charAt(0).toUpperCase() + hotspot.demandLevel.slice(1)} Demand
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Price</span>
                    <span className="font-medium">KSh {hotspot.pricePerKg}/kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Buyers</span>
                    <span className="font-medium">{hotspot.buyerCount}</span>
                  </div>
                  <p className="text-sm mt-2">{hotspot.description}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-xs text-muted-foreground">
                  Updated: {hotspot.lastUpdated.toLocaleDateString()}
                </span>
                <Button size="sm">Connect with Buyers</Button>
              </CardFooter>
            </Card>
          ))}
          
          {filteredHotspots.length === 0 && (
            <div className="col-span-full text-center p-12">
              <div className="mb-4 text-muted-foreground">
                <TrendingUp className="mx-auto h-12 w-12 opacity-50" />
              </div>
              <h3 className="text-lg font-medium">No demand hotspots found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try changing your filter criteria or check back later for new demand opportunities.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MarketDemandHotspot;
