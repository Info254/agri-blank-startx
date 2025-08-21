
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, FileText, Lightbulb, MessageSquare } from "lucide-react";
import { useEffect } from "react";
import SentimentInsights from "@/components/SentimentInsights";

const SentimentAnalysis = () => {
  useEffect(() => {
    document.title = "Agricultural Sentiment Analysis | AgriConnect";
  }, []);

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Agricultural Sentiment Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Insights derived from farmer feedback, reports, and community discussions
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Important Alerts</AlertTitle>
          <AlertDescription className="text-amber-700">
            We've detected significant sentiment patterns regarding agricultural products in various counties. 
            View details in the dashboard below.
          </AlertDescription>
          <div className="mt-2">
            <Button variant="outline" size="sm" className="bg-white">
              View Alert Details
            </Button>
          </div>
        </Alert>

        <Tabs defaultValue="insights" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span>Sentiment Insights</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Submit Report</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Community Discussions</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights">
            <SentimentInsights />
          </TabsContent>
          
          <TabsContent value="reports">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Submit Your Experience</h2>
              <p className="text-gray-600 mb-6">
                Share your feedback about agricultural products, services, or policies to help 
                other farmers make informed decisions.
              </p>
              <form className="space-y-4">
                {/* Form content would go here */}
                <div className="flex justify-end">
                  <Button>Submit Report</Button>
                </div>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="community">
            <div className="bg-white p-6 rounded-lg border text-center">
              <h2 className="text-xl font-semibold mb-4">Community Discussions</h2>
              <p className="text-gray-600 mb-6">
                This feature is coming soon. Join discussions with other farmers about shared experiences.
              </p>
              <Button variant="outline">Get Notified When Available</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
