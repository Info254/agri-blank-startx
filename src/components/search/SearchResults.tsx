
import React from 'react';
import { DataItem } from '@/types';
import ResultCard from '@/components/ResultCard';
import { Loader2 } from 'lucide-react';

interface SearchResultsProps {
  results: DataItem[];
  isLoading: boolean;
  activeTab: string;
  onItemClick: (item: DataItem) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  isLoading, 
  activeTab,
  onItemClick
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium mb-2">No results found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  // Filter out any results that don't have a valid URL
  const validResults = results.filter(result => {
    if (!result.url || !isValidUrl(result.url)) {
      console.warn(`Filtering out result with invalid URL: ${result.title}`);
      return false;
    }
    return true;
  });

  return (
    <div>
      <div className="mb-3 text-muted-foreground">
        Found {validResults.length} {activeTab !== 'all' ? activeTab : 'results'}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {validResults.map((item) => (
          <ResultCard 
            key={item.id} 
            item={item} 
            onClick={() => onItemClick(item)} 
          />
        ))}
      </div>
    </div>
  );
};

// Helper function to validate URLs
function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    // Most common protocols - exclude javascript: protocol for security
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

export default SearchResults;
