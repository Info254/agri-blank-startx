
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const SearchResultsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <div className="flex gap-2">
          <Input placeholder="Search for products, farmers, or services..." className="flex-1" />
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Enter a search term to find products, farmers, or services in the AgriConnect platform.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchResultsPage;
