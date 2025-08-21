
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Category, DataItem, SearchFilters } from '@/types';
import { fetchData } from '@/services/api';
import DetailView from '@/components/DetailView';
import CategoryTabs from './search/CategoryTabs';
import SearchBar from './search/SearchBar';
import SearchResults from './search/SearchResults';
import { assessContentLegitimacy, isVerifiedSource } from '@/services/apiUtils';
import { useToast } from '@/hooks/use-toast';

interface SearchSectionProps {
  id?: string;
}

const SearchSection: React.FC<SearchSectionProps> = ({ id }) => {
  // Only include agricultural solutions and issues, remove tenders
  const [activeTab, setActiveTab] = useState<Category | 'all'>('solutions');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DataItem[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    setIsLoading(true);
    
    const filters: SearchFilters = {
      query: query.trim() === '' ? undefined : query,
      location: location.trim() === '' ? undefined : location,
      dateFrom,
      dateTo,
    };
    
    if (activeTab !== 'all') {
      filters.category = activeTab;
    }
    
    try {
      const data = await fetchData(filters);
      
      // Filter out tender-related items
      let filteredData = data.filter(
        item => item.category !== 'tender' && item.category !== 'awarded-tender'
      );
      
      // Apply verification checks for legitimacy and remove fake/unverifiable content
      filteredData = filteredData.filter(item => {
        // Check URL validity
        if (item.url && !isVerifiedSource(item.url)) {
          console.warn(`Filtered item with unverified URL: ${item.title}`);
          return false;
        }
        
        // Check content legitimacy
        if (!assessContentLegitimacy(item)) {
          console.warn(`Filtered possibly illegitimate content: ${item.title}`);
          return false;
        }
        
        return true;
      });
      
      // Log verification results
      console.log(`Showing ${filteredData.length} verified results out of ${data.length} total results`);
      
      if (filteredData.length === 0 && data.length > 0) {
        toast({
          title: "Verification Results",
          description: "Some results were filtered out because they could not be verified with legitimate sources.",
          duration: 5000
        });
      }
      
      setResults(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Search Error",
        description: "Could not complete search. Please try again later.",
        variant: "destructive"
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleItemClick = (item: DataItem) => {
    setSelectedItem(item);
  };

  const closeDetail = () => {
    setSelectedItem(null);
  };

  return (
    <section id={id || "search-section"} className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-12 animate-fade-up">
        <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-2">
          Search & Discover
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Agricultural Information</h2>
        <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
          Search across verified agricultural issues and innovative solutions throughout Kenya.
        </p>
      </div>
      
      <Card className="p-6 rounded-xl shadow-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-default-border">
        <CategoryTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          hideTenderTabs={true}
        />
        
        <SearchBar
          query={query}
          setQuery={setQuery}
          location={location}
          setLocation={setLocation}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          isFiltersOpen={isFiltersOpen}
          setIsFiltersOpen={setIsFiltersOpen}
          handleSearch={handleSearch}
        />

        <SearchResults 
          results={results}
          isLoading={isLoading}
          activeTab={activeTab}
          onItemClick={handleItemClick}
        />
      </Card>
      
      {selectedItem && (
        <DetailView item={selectedItem} onClose={closeDetail} />
      )}
    </section>
  );
};

export default SearchSection;
