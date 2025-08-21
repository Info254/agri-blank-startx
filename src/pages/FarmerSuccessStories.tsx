
import { useEffect, useState } from "react";
import { MainNav } from "@/components/MainNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Heart, MessageSquare, Share } from "lucide-react";

// Types for success stories
interface SuccessStory {
  id: string;
  farmerName: string;
  farmerLocation: string;
  farmerAvatar?: string;
  title: string;
  summary: string;
  content: string;
  cropType: string;
  tags: string[];
  likes: number;
  comments: number;
  publishedDate: Date;
  verified: boolean;
}

// Mock data for success stories
const mockSuccessStories: SuccessStory[] = [
  {
    id: '1',
    farmerName: 'John Kimani',
    farmerLocation: 'Nakuru',
    farmerAvatar: '/placeholder.svg',
    title: 'Doubling My Potato Yield with Modern Farming Techniques',
    summary: 'How I transformed my small farm from producing 5 tons to 12 tons of potatoes per season',
    content: 'When I started farming potatoes five years ago, I was struggling with poor yields and pest problems. After attending a training session organized by the local agricultural office, I learned about proper spacing, quality certified seeds, and integrated pest management. I implemented these practices and saw amazing results within just one season. My yields doubled, and the quality of potatoes improved significantly, allowing me to negotiate better prices with buyers. I also joined a cooperative that helped me access reliable markets and negotiate as a group.',
    cropType: 'Potatoes',
    tags: ['modern techniques', 'yield improvement', 'pest management', 'certified seeds'],
    likes: 128,
    comments: 23,
    publishedDate: new Date('2025-03-15'),
    verified: true
  },
  {
    id: '2',
    farmerName: 'Sarah Wanjiku',
    farmerLocation: 'Kiambu',
    farmerAvatar: '/placeholder.svg',
    title: 'From Market Frustration to Direct Exports: My Avocado Journey',
    summary: 'How joining a farmer group helped me bypass middlemen and access export markets directly',
    content: 'I used to sell my avocados to middlemen who would offer very low prices, claiming that the market was flooded. After joining a local farmer group, we pooled our resources to meet the volume requirements of exporters. We also invested in Global GAP certification, which opened doors to premium markets in Europe. Today, I receive three times the price I used to get from middlemen, and payments are transparent and timely. This success has allowed me to expand my farm from 1 acre to 5 acres and invest in a drip irrigation system.',
    cropType: 'Avocados',
    tags: ['export market', 'value addition', 'farmer group', 'certification'],
    likes: 236,
    comments: 41,
    publishedDate: new Date('2025-02-28'),
    verified: true
  },
  {
    id: '3',
    farmerName: 'David Ochieng',
    farmerLocation: 'Kisumu',
    farmerAvatar: '/placeholder.svg',
    title: 'Weather-Proofing My Farm: Success with Climate-Smart Agriculture',
    summary: 'Using water harvesting and drought-resistant varieties to maintain profitability despite climate challenges',
    content: 'After three consecutive seasons of crop failure due to erratic rainfall, I decided to invest in climate-smart agricultural practices. I constructed water pans that harvest rainwater during the rainy season, which I then use for supplemental irrigation during dry spells. I also switched to drought-resistant maize varieties that can withstand water stress. The results were immediate - while my neighbors experienced significant losses during a recent drought, I maintained about 80% of my normal yield. I\'ve now become a demonstration farmer, teaching others in my community about these techniques.',
    cropType: 'Maize',
    tags: ['climate-smart', 'water harvesting', 'drought-resistant', 'adaptation'],
    likes: 157,
    comments: 29,
    publishedDate: new Date('2025-04-05'),
    verified: true
  },
  {
    id: '4',
    farmerName: 'Alice Muthoni',
    farmerLocation: 'Meru',
    farmerAvatar: '/placeholder.svg',
    title: 'Transforming My Tomato Business with Value Addition',
    summary: 'How I started making tomato paste to reduce post-harvest losses and increase profits',
    content: 'I used to lose about 30% of my tomato harvest due to gluts in the market and transportation challenges. After attending a value addition workshop, I invested in simple processing equipment to make tomato paste. Now, whenever market prices drop below profitable levels, I process the tomatoes into paste and sell it to local schools, restaurants, and individual consumers. This has increased my income by 45% and virtually eliminated post-harvest losses. I\'ve also created employment for three young people from my community who help with processing and marketing.',
    cropType: 'Tomatoes',
    tags: ['value addition', 'post-harvest', 'processing', 'employment creation'],
    likes: 192,
    comments: 37,
    publishedDate: new Date('2025-03-22'),
    verified: true
  }
];

const FarmerSuccessStories = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [filteredStories, setFilteredStories] = useState<SuccessStory[]>(mockSuccessStories);
  
  useEffect(() => {
    document.title = "Farmer Success Stories | Kilimo Connect";
    
    // Filter stories based on active tab and selected tag
    let filtered = [...mockSuccessStories];
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(story => 
        story.cropType.toLowerCase() === activeTab.toLowerCase()
      );
    }
    
    if (selectedTag) {
      filtered = filtered.filter(story => 
        story.tags.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase()))
      );
    }
    
    setFilteredStories(filtered);
  }, [activeTab, selectedTag]);

  const allTags = Array.from(
    new Set(mockSuccessStories.flatMap(story => story.tags))
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Farmer Success Stories</h1>
          <p className="text-muted-foreground mt-2">
            Learn from the experiences of successful farmers across Kenya
          </p>
        </div>
        
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All Crops</TabsTrigger>
              <TabsTrigger value="potatoes">Potatoes</TabsTrigger>
              <TabsTrigger value="avocados">Avocados</TabsTrigger>
              <TabsTrigger value="maize">Maize</TabsTrigger>
              <TabsTrigger value="tomatoes">Tomatoes</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">Filter</Button>
            <Button>Share Your Success</Button>
          </div>
        </div>
        
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge 
            variant={selectedTag === '' ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setSelectedTag('')}
          >
            All Tags
          </Badge>
          {allTags.map(tag => (
            <Badge 
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStories.map(story => (
            <Card key={story.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={story.farmerAvatar} alt={story.farmerName} />
                      <AvatarFallback>{story.farmerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{story.farmerName}</CardTitle>
                      <CardDescription>{story.farmerLocation}</CardDescription>
                    </div>
                  </div>
                  {story.verified && (
                    <Badge variant="secondary">Verified Success</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-xl">{story.title}</h3>
                  <p className="text-muted-foreground mt-1">{story.summary}</p>
                </div>
                <div className="text-sm line-clamp-3">
                  {story.content}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{story.cropType}</Badge>
                  {story.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                  {story.tags.length > 2 && (
                    <Badge variant="outline">+{story.tags.length - 2} more</Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {story.likes}
                  </span>
                  <span className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {story.comments}
                  </span>
                  <span>
                    {story.publishedDate.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button size="sm">Read More</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
          
          {filteredStories.length === 0 && (
            <div className="col-span-full text-center p-12">
              <div className="mb-4 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 opacity-50" />
              </div>
              <h3 className="text-lg font-medium">No success stories found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try changing your filters or be the first to share a success story for this category.
              </p>
              <Button className="mt-4">Share Your Success</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FarmerSuccessStories;
