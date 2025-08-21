
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  Lightbulb, 
  Settings,
  Send
} from 'lucide-react';
import { fetchMarketSentiment, submitMarketReport } from '@/services/sentimentAnalysisService';
import { MarketSentimentRecord } from '@/types';
import { useToast } from '@/hooks/use-toast';

const SentimentInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sentimentData, setSentimentData] = useState<MarketSentimentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportForm, setReportForm] = useState({
    commodity: '',
    county: '',
    report: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSentimentData();
  }, []);

  const loadSentimentData = async () => {
    try {
      setLoading(true);
      const data = await fetchMarketSentiment();
      setSentimentData(data);
    } catch (error) {
      console.error('Error loading sentiment data:', error);
      toast({
        title: "Error",
        description: "Failed to load sentiment data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.commodity || !reportForm.county || !reportForm.report) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const success = await submitMarketReport(
        reportForm.commodity,
        reportForm.county,
        reportForm.report
      );

      if (success) {
        toast({
          title: "Report Submitted",
          description: "Your market report has been analyzed and submitted successfully",
        });
        setReportForm({ commodity: '', county: '', report: '' });
        loadSentimentData(); // Reload data
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getFilteredData = () => {
    return sentimentData.filter(item => 
      (selectedCrop === 'all' || item.commodity_name.toLowerCase().includes(selectedCrop.toLowerCase())) &&
      (selectedLocation === 'all' || item.county.toLowerCase().includes(selectedLocation.toLowerCase()))
    );
  };

  const getAlerts = () => {
    return getFilteredData().filter(item => 
      item.sentiment_score < -0.3 || 
      item.issues.some(issue => ['counterfeit_products', 'pest_disease'].includes(issue))
    );
  };

  const renderSubmitReport = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Submit Market Report</CardTitle>
        <CardDescription>
          Share your market experience to help the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="commodity">Commodity</Label>
              <Input
                id="commodity"
                value={reportForm.commodity}
                onChange={(e) => setReportForm(prev => ({ ...prev, commodity: e.target.value }))}
                placeholder="e.g., Maize, Tomatoes, Potatoes"
              />
            </div>
            <div>
              <Label htmlFor="county">County</Label>
              <Input
                id="county"
                value={reportForm.county}
                onChange={(e) => setReportForm(prev => ({ ...prev, county: e.target.value }))}
                placeholder="e.g., Nakuru, Kiambu, Kisumu"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="report">Market Report</Label>
            <Textarea
              id="report"
              value={reportForm.report}
              onChange={(e) => setReportForm(prev => ({ ...prev, report: e.target.value }))}
              placeholder="Describe your market experience, prices, quality issues, or any concerns..."
              rows={4}
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing & Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderAlerts = () => {
    const alerts = getAlerts();
    
    if (loading) {
      return <div className="p-6 text-center">Loading alerts...</div>;
    }
    
    if (alerts.length === 0) {
      return (
        <div className="p-6 text-center">
          <div className="mb-4 text-muted-foreground">
            <AlertTriangle className="mx-auto h-12 w-12 opacity-50" />
          </div>
          <h3 className="text-lg font-medium">No alerts found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            There are no current alerts matching your criteria.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {alerts.map(alert => (
          <Alert key={alert.id} variant={alert.sentiment_score < -0.5 ? "destructive" : "default"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Alert: {alert.commodity_name} in {alert.county}</AlertTitle>
            <AlertDescription>
              <div className="mt-2">
                <p>Sentiment Score: {(alert.sentiment_score * 100).toFixed(0)}%</p>
                <p>Reports: {alert.report_count}</p>
                {alert.issues.length > 0 && (
                  <p>Issues: {alert.issues.join(', ')}</p>
                )}
                {alert.tags.length > 0 && (
                  <p>Tags: {alert.tags.join(', ')}</p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    );
  };
  
  const renderInsights = () => {
    const insights = getFilteredData();
    
    if (loading) {
      return <div className="p-6 text-center">Loading insights...</div>;
    }
    
    if (insights.length === 0) {
      return (
        <div className="p-6 text-center">
          <div className="mb-4 text-muted-foreground">
            <Lightbulb className="mx-auto h-12 w-12 opacity-50" />
          </div>
          <h3 className="text-lg font-medium">No insights found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            There are no insights matching your criteria.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {insights.map(insight => (
          <Card key={insight.id}>
            <CardHeader>
              <CardTitle>{insight.commodity_name} Market Sentiment</CardTitle>
              <CardDescription>
                {insight.county} • Reports: {insight.report_count} • 
                Updated: {new Date(insight.updated_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span>Sentiment Score:</span>
                  <span className={`font-bold ${
                    insight.sentiment_score > 0.1 ? 'text-green-600' : 
                    insight.sentiment_score < -0.1 ? 'text-red-600' : 
                    'text-yellow-600'
                  }`}>
                    {(insight.sentiment_score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      insight.sentiment_score > 0.1 ? 'bg-green-500' : 
                      insight.sentiment_score < -0.1 ? 'bg-red-500' : 
                      'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.abs(insight.sentiment_score) * 100}%` }}
                  />
                </div>
              </div>
              
              {insight.tags.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {insight.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {insight.issues.length > 0 && (
                <div className="bg-red-50 p-3 rounded-md">
                  <h4 className="font-medium mb-2 text-red-800">Issues Identified:</h4>
                  <ul className="list-disc list-inside text-red-700">
                    {insight.issues.map((issue, idx) => (
                      <li key={idx} className="text-sm">{issue.replace(/_/g, ' ')}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Collective Intelligence Insights</CardTitle>
        <CardDescription>
          Real-time sentiment analysis from farmer reports and community feedback
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderSubmitReport()}
        
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="crop">Crop Filter</Label>
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger id="crop">
                <SelectValue placeholder="All Crops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                <SelectItem value="maize">Maize</SelectItem>
                <SelectItem value="potato">Potato</SelectItem>
                <SelectItem value="tomato">Tomato</SelectItem>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="rice">Rice</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="location">Location Filter</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="nakuru">Nakuru</SelectItem>
                <SelectItem value="kisumu">Kisumu</SelectItem>
                <SelectItem value="kiambu">Kiambu</SelectItem>
                <SelectItem value="machakos">Machakos</SelectItem>
                <SelectItem value="uasin gishu">Uasin Gishu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="alerts" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="alerts">
            {renderAlerts()}
          </TabsContent>
          
          <TabsContent value="insights">
            {renderInsights()}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 text-sm text-muted-foreground flex justify-between">
        <div>Based on real-time sentiment analysis of community reports</div>
        <Button variant="ghost" size="icon" onClick={loadSentimentData}>
          <Settings className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SentimentInsights;
