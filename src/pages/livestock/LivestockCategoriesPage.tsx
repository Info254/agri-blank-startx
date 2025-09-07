// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { fetchLivestockCategories, LivestockCategory } from '@/services/livestockMarketService';
import { useToast } from '@/components/ui/use-toast';

type CategoryWithCount = LivestockCategory & {
  count: number;
  popularBreeds: { name: string; count: number }[];
};

export default function LivestockCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryWithCount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        const data = await fetchLivestockCategories();
        
        // Mock data for demonstration
        const mockCategories: CategoryWithCount[] = [
          {
            id: 'cattle',
            name: 'Cattle',
            description: 'High-quality cattle including dairy and beef breeds',
            image: '/images/cattle.jpg',
            count: 1245,
            popularBreeds: [
              { name: 'Friesian', count: 342 },
              { name: 'Boran', count: 289 },
              { name: 'Sahiwal', count: 198 },
            ]
          },
          {
            id: 'goats',
            name: 'Goats',
            description: 'Various goat breeds for meat and milk production',
            image: '/images/goats.jpg',
            count: 876,
            popularBreeds: [
              { name: 'Galla', count: 245 },
              { name: 'Toggenburg', count: 187 },
              { name: 'Saanen', count: 156 },
            ]
          },
          {
            id: 'sheep',
            name: 'Sheep',
            description: 'Quality sheep for wool and meat',
            image: '/images/sheep.jpg',
            count: 654,
            popularBreeds: [
              { name: 'Dorper', count: 198 },
              { name: 'Red Maasai', count: 167 },
              { name: 'Blackhead Persian', count: 123 },
            ]
          },
          {
            id: 'poultry',
            name: 'Poultry',
            description: 'Chickens, turkeys, ducks, and other poultry',
            image: '/images/poultry.jpg',
            count: 2345,
            popularBreeds: [
              { name: 'Kienyeji', count: 876 },
              { name: 'Broilers', count: 765 },
              { name: 'Layers', count: 543 },
            ]
          },
          {
            id: 'pigs',
            name: 'Pigs',
            description: 'Pork production livestock',
            image: '/images/pigs.jpg',
            count: 432,
            popularBreeds: [
              { name: 'Large White', count: 187 },
              { name: 'Landrace', count: 143 },
              { name: 'Duroc', count: 98 },
            ]
          },
          {
            id: 'camels',
            name: 'Camels',
            description: 'Dairy and transport camels',
            image: '/images/camels.jpg',
            count: 187,
            popularBreeds: [
              { name: 'Dromedary', count: 98 },
              { name: 'Bactrian', count: 45 },
              { name: 'Somali', count: 32 },
            ]
          },
        ];
        
        setCategories(mockCategories);
        setFilteredCategories(mockCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load livestock categories. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [toast]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const filtered = categories.filter(
      category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.popularBreeds.some(breed => 
          breed.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const getCategoryImage = (categoryId: string) => {
    // In a real app, you would use the image URL from the category data
    // For now, we'll use placeholder images based on the category ID
    const imageMap: Record<string, string> = {
      cattle: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      goats: 'https://images.unsplash.com/photo-1550338861-45164a0fbf92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      sheep: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      poultry: 'https://images.unsplash.com/photo-1548550023-2b5f1b0f7a1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      pigs: 'https://images.unsplash.com/photo-1581344897547-9c7ae2401c1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80',
      camels: 'https://images.unsplash.com/photo-1581573759154-9759854a4af7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
    };
    
    return imageMap[categoryId] || 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80';
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/livestock/marketplace?category=${categoryId}`);
  };

  const handleBreedClick = (categoryId: string, breedName: string) => {
    navigate(`/livestock/marketplace?category=${categoryId}&breed=${encodeURIComponent(breedName)}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Livestock Categories</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse through our extensive collection of livestock categories to find exactly what you're looking for.
          </p>
        </div>

        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search categories or breeds..."
              className="pl-10 pr-4 py-6 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No categories found</h3>
            <p className="mt-1 text-gray-500">
              We couldn't find any categories matching your search. Try a different search term.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => setSearchTerm('')}
                variant="outline"
              >
                Clear search
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getCategoryImage(category.id)}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-sm text-gray-200">{category.count} listings available</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Breeds</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.popularBreeds.map((breed) => (
                        <Badge 
                          key={breed.name} 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-primary/10 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBreedClick(category.id, breed.name);
                          }}
                        >
                          {breed.name} ({breed.count})
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-2"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    View All {category.name} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Can't find what you're looking for?</h3>
          <p className="text-blue-700 mb-4">Let us help you find the perfect livestock for your needs.</p>
          <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
            Contact Our Livestock Specialists
          </Button>
        </div>
      </div>
    </div>
  );
}
