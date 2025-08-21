import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { Leaf, Users, Calendar, Tag, MapPin, ExternalLink, RefreshCw, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  fetchFeaturedNews, 
  fetchFeaturedServices, 
  fetchFeaturedProducts, 
  submitNewsItem,
  FeaturedItem 
} from '@/services/amis-ke/featured-content';

// News submission form type
type NewsSubmission = {
  title: string;
  source: string;
  tags: string;
  location: string;
  summary: string;
  url: string;
};

const FeaturedContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState("news");
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [newsItems, setNewsItems] = useState<FeaturedItem[]>([]);
  const [servicesItems, setServicesItems] = useState<FeaturedItem[]>([]);
  const [productsItems, setProductsItems] = useState<FeaturedItem[]>([]);
  const [newsSubmission, setNewsSubmission] = useState<NewsSubmission>({
    title: '',
    source: '',
    tags: '',
    location: '',
    summary: '',
    url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load data and check for updates
  useEffect(() => {
    const fetchFeaturedContent = async () => {
      setIsLoading(true);
      try {
        // Fetch real data from API endpoints
        const [newsData, servicesData, productsData] = await Promise.all([
          fetchFeaturedNews(),
          fetchFeaturedServices(),
          fetchFeaturedProducts()
        ]);
        
        setNewsItems(newsData);
        setServicesItems(servicesData);
        setProductsItems(productsData);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching featured content:', error);
        toast({
          title: "Error loading content",
          description: "Could not load the featured content. Please check your connection and try again.",
          variant: "destructive",
        });
        
        // Keep previous data if available, otherwise show empty state
        setNewsItems(prev => prev.length ? prev : []);
        setServicesItems(prev => prev.length ? prev : []);
        setProductsItems(prev => prev.length ? prev : []);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchFeaturedContent();

    // Set up refresh every 4 hours (in milliseconds) - more frequent than before
    const refreshInterval = 4 * 60 * 60 * 1000;
    const intervalId = setInterval(fetchFeaturedContent, refreshInterval);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [toast]);

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Fetch fresh data from API endpoints
      const [newsData, servicesData, productsData] = await Promise.all([
        fetchFeaturedNews(),
        fetchFeaturedServices(),
        fetchFeaturedProducts()
      ]);
      
      setNewsItems(newsData);
      setServicesItems(servicesData);
      setProductsItems(productsData);
      setLastUpdated(new Date());
      
      toast({
        title: "Content refreshed",
        description: "Featured content has been updated with the latest data.",
      });
    } catch (error) {
      console.error('Error refreshing featured content:', error);
      toast({
        title: "Error refreshing content",
        description: "Could not refresh the content. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle news submission form change
  const handleSubmissionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewsSubmission(prev => ({ ...prev, [name]: value }));
  };

  // Handle news submission
  const handleSubmitNews = async () => {
    // Validate form
    if (!newsSubmission.title || !newsSubmission.source || !newsSubmission.summary) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to the API
      const success = await submitNewsItem({
        title: newsSubmission.title,
        source: newsSubmission.source,
        date: new Date().toISOString().split('T')[0],
        tags: newsSubmission.tags.split(',').map(tag => tag.trim()),
        location: newsSubmission.location,
        summary: newsSubmission.summary,
        url: newsSubmission.url || '#'
      });

      if (success) {
        // Refresh news data after successful submission
        const newsData = await fetchFeaturedNews();
        setNewsItems(newsData);
        
        // Reset form and close dialog
        setNewsSubmission({
          title: '',
          source: '',
          tags: '',
          location: '',
          summary: '',
          url: ''
        });
        
        setIsDialogOpen(false);

        toast({
          title: "News submitted",
          description: "Your news has been submitted successfully.",
        });
      }
    } catch (error) {
      console.error('Error submitting news:', error);
      toast({
        title: "Submission error",
        description: "Could not submit your news. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderContentItems = (items: FeaturedItem[]) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found. Please check your connection and try refreshing.</p>
          <Button onClick={handleRefresh} variant="outline" className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(item => (
          <Card key={item.id} className="hover:shadow-md transition-all overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-muted/40 p-5">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{item.provider || item.source}</span>
                </div>
                <div className="flex flex-wrap gap-y-1 text-xs">
                  <div className="flex items-center mr-3">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center mr-3">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.summary}</p>
                
                {item.price && (
                  <div className="font-bold text-primary mb-4">{item.price}</div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag) => (
                    <div key={tag} className="bg-secondary/50 text-secondary-foreground text-xs px-2 py-1 rounded-full flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </div>
                  ))}
                </div>
                
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center"
                  >
                    View Details <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" /> Submit News
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Submit News Item</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={newsSubmission.title}
                    onChange={handleSubmissionChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="source">Source *</Label>
                  <Input 
                    id="source" 
                    name="source" 
                    value={newsSubmission.source}
                    onChange={handleSubmissionChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input 
                    id="tags" 
                    name="tags" 
                    value={newsSubmission.tags}
                    onChange={handleSubmissionChange}
                    placeholder="e.g. maize, exports, policy"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={newsSubmission.location}
                    onChange={handleSubmissionChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="summary">Summary *</Label>
                  <Textarea 
                    id="summary" 
                    name="summary" 
                    rows={3}
                    value={newsSubmission.summary}
                    onChange={handleSubmissionChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">Source URL</Label>
                  <Input 
                    id="url" 
                    name="url" 
                    type="url"
                    value={newsSubmission.url}
                    onChange={handleSubmissionChange}
                    placeholder="https://"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleSubmitNews} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit News'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button onClick={handleRefresh} variant="ghost" size="sm" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="news" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="news" className="flex items-center">
              <Leaf className="h-4 w-4 mr-2" />
              News
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="news" className="mt-0">
          {renderContentItems(newsItems)}
        </TabsContent>
        
        <TabsContent value="services" className="mt-0">
          {renderContentItems(servicesItems)}
        </TabsContent>
        
        <TabsContent value="products" className="mt-0">
          {renderContentItems(productsItems)}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default FeaturedContent;
