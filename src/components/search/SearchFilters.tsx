
import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';

interface SearchFiltersProps {
  location: string;
  setLocation: (location: string) => void;
  dateFrom: Date | undefined;
  setDateFrom: (date: Date | undefined) => void;
  dateTo: Date | undefined;
  setDateTo: (date: Date | undefined) => void;
  isFiltersOpen: boolean;
  setIsFiltersOpen: (isOpen: boolean) => void;
  handleSearch: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  location,
  setLocation,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  isFiltersOpen,
  setIsFiltersOpen,
  handleSearch
}) => {
  const clearFilters = () => {
    setLocation('');
    setDateFrom(undefined);
    setDateTo(undefined);
    setIsFiltersOpen(false);
  };

  return (
    <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="md:w-auto w-full">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {(location || dateFrom || dateTo) && 
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {[location, dateFrom, dateTo].filter(Boolean).length}
            </span>
          }
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Filter Results</h4>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. Nairobi, Nakuru..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="date-from" className="text-xs">From</Label>
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  className="border rounded-md"
                />
              </div>
              <div>
                <Label htmlFor="date-to" className="text-xs">To</Label>
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  className="border rounded-md"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={clearFilters} className="text-sm">
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
            <Button size="sm" onClick={() => {
              setIsFiltersOpen(false);
              handleSearch();
            }} className="text-sm">
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchFilters;
