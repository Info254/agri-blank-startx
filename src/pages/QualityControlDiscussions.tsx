
import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { QualityControlDiscussion } from "@/types";
import { fetchQualityDiscussions } from "@/services/serviceProvidersAPI";
import { useToast } from "@/hooks/use-toast";
import { DiscussionHeader } from "@/components/discussions/DiscussionHeader";
import { DiscussionFilters } from "@/components/discussions/DiscussionFilters";
import { DiscussionCard } from "@/components/discussions/DiscussionCard";

const QualityControlDiscussions = () => {
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<QualityControlDiscussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState<string>("all");
  
  const allTags = ["counterfeit", "verification", "export", "regulations", "avocados", "EU", "pesticides"];

  useEffect(() => {
    const loadDiscussions = async () => {
      try {
        setIsLoading(true);
        const data = await fetchQualityDiscussions();
        setDiscussions(data);
      } catch (error) {
        console.error("Error fetching discussions:", error);
        toast({
          title: "Error",
          description: "Failed to load discussions. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDiscussions();
  }, [toast]);

  const filteredDiscussions = discussions.filter(discussion => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tag
    const matchesTag = filterTag === "all" || discussion.tags.includes(filterTag);
    
    return matchesSearch && matchesTag;
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
        <DiscussionHeader />

        <DiscussionFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterTag={filterTag}
          setFilterTag={setFilterTag}
          allTags={allTags}
        />

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDiscussions.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No discussions found</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Be the first to start a discussion on this topic!
            </p>
            <Button>Start New Discussion</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDiscussions.map((discussion) => (
              <DiscussionCard
                key={discussion.id}
                discussion={discussion}
                filterTag={filterTag}
                setFilterTag={setFilterTag}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default QualityControlDiscussions;
