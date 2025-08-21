
import { useState, useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, Tag } from "lucide-react";
import { TrainingEvent } from "@/types";
import { fetchTrainingEvents } from "@/services/serviceProvidersAPI";
import { useToast } from "@/hooks/use-toast";

const TrainingEvents = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<TrainingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">("upcoming");
  
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTrainingEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching training events:", error);
        toast({
          title: "Error",
          description: "Failed to load training events. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [toast]);

  const filteredEvents = events.filter(event => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by tab
    const eventDate = new Date(event.date);
    const now = new Date();
    
    if (activeTab === "upcoming") {
      return matchesSearch && eventDate > now;
    } else if (activeTab === "past") {
      return matchesSearch && eventDate <= now;
    }
    
    return matchesSearch;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="hidden md:block">
            <MainNav />
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Training Events</h1>
            <p className="text-muted-foreground mt-2">
              Discover agricultural training events and workshops across Kenya
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>Add Training Event</Button>
          </div>
        </div>

        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={(v) => setActiveTab(v as "upcoming" | "past" | "all")} className="mb-8">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
            <TabsTrigger value="all">All Events</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-8">
          <Input
            placeholder="Search events by title, provider, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-2/3 lg:w-1/2"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card key={n} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-5 bg-muted rounded w-1/4"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No events found</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              {activeTab === "upcoming" 
                ? "No upcoming events match your search. Try different keywords or check back later." 
                : "No past events match your search. Try different keywords or check all events."}
            </p>
            {activeTab !== "all" && (
              <Button variant="outline" onClick={() => setActiveTab("all")}>
                View All Events
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription>{event.providerName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                  
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{event.registeredCount}/{event.capacity} registered</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {event.topics.map(topic => (
                      <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Badge>{event.cost}</Badge>
                  <Button size="sm">
                    {new Date(event.date) > new Date() ? "Register" : "View Details"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TrainingEvents;
