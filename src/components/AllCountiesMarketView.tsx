import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { fetchKilimoStats, fetchMarkets } from '@/services/api';
import { KilimoStats, Market } from '@/types';

const AllCountiesMarketView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [kilimoStats, setKilimoStats] = useState<KilimoStats[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string>('');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [counties, setCounties] = useState<string[]>([]);
  const [commodities, setCommodities] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch real markets data and Kilimo stats
        const marketsData = await fetchMarkets();
        const kilimoData = await fetchKilimoStats();
        
        setMarkets(marketsData);
        setKilimoStats(kilimoData);
        
        // Extract unique counties and commodities
        const uniqueCounties = Array.from(new Set(marketsData.map(market => market.county)));
        setCounties(uniqueCounties);
        
        const uniqueCommodities = Array.from(new Set(
          marketsData.flatMap(market => 
            market.producePrices.map(price => price.produceName)
          )
        ));
        setCommodities(uniqueCommodities);
        
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter markets based on selections
  const filteredMarkets = markets.filter(market => {
    const matchesCounty = !selectedCounty || market.county === selectedCounty;
    const matchesSearch = !searchTerm || 
      market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.county.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check if any produce matches the selected commodity
    const matchesCommodity = !selectedCommodity || 
      market.producePrices.some(price => 
        price.produceName === selectedCommodity
      );
      
    return matchesCounty && matchesSearch && matchesCommodity;
  });
  
  const renderLocation = (location: { county: string; coordinates?: { latitude: number; longitude: number; } }) => {
    return <span>{location.county}</span>;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>All Counties Market Prices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="county-filter">Filter by County</Label>
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger id="county-filter">
                <SelectValue placeholder="All Counties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Counties</SelectItem>
                {counties.map(county => (
                  <SelectItem key={county} value={county}>{county}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Label htmlFor="commodity-filter">Filter by Commodity</Label>
            <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
              <SelectTrigger id="commodity-filter">
                <SelectValue placeholder="All Commodities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Commodities</SelectItem>
                {commodities.map(commodity => (
                  <SelectItem key={commodity} value={commodity}>{commodity}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Label htmlFor="search">Search Markets</Label>
            <Input 
              id="search" 
              placeholder="Search by name or location" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="self-end">
            <Button 
              onClick={() => {
                setSelectedCounty('');
                setSelectedCommodity('');
                setSearchTerm('');
              }}
              variant="outline"
            >
              Reset Filters
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredMarkets.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Market</TableHead>
                  <TableHead>County</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Commodity</TableHead>
                  <TableHead>Price (KES)</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMarkets.flatMap(market => 
                  market.producePrices.map((price, idx) => (
                    <TableRow key={`${market.id}-${idx}`}>
                      <TableCell className="font-medium">{market.name}</TableCell>
                      <TableCell>{market.county}</TableCell>
                      <TableCell>
                        {renderLocation(market.location)}
                      </TableCell>
                      <TableCell>{price.produceName}</TableCell>
                      <TableCell>{price.price}</TableCell>
                      <TableCell>{price.unit}</TableCell>
                      <TableCell>{price.date}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No market data found matching your filters. Try different criteria or reset filters.</p>
          </div>
        )}
        
        {/* Display Kilimo Stats Summary */}
        {kilimoStats.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">Kilimo API Data Summary</h3>
            <p>Retrieved {kilimoStats.length} data points from Kilimo Statistics API</p>
            <p>Found {kilimoStats.filter(stat => stat.category === 'County').length} counties with data</p>
            <p>Data categories: {Array.from(new Set(kilimoStats.map(stat => stat.category))).join(', ')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AllCountiesMarketView;
