
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  fetchDailyAmisPrices, 
  updateWeeklyKilimoStats, 
  archiveMonthlyHistoricalData,
  runAllCronJobs,
  testDataExtraction,
  getArchivedData
} from '@/services/api';
import { toast } from 'sonner';

const DataJobs: React.FC = () => {
  const [loading, setLoading] = useState<{[key: string]: boolean}>({
    daily: false,
    weekly: false,
    monthly: false,
    all: false,
    test: false
  });
  const [results, setResults] = useState<{[key: string]: any}>({});

  const runJob = async (jobType: 'daily' | 'weekly' | 'monthly' | 'all' | 'test') => {
    setLoading(prev => ({ ...prev, [jobType]: true }));
    
    try {
      let result;
      
      switch (jobType) {
        case 'daily':
          result = await fetchDailyAmisPrices();
          break;
        case 'weekly':
          result = await updateWeeklyKilimoStats();
          break;
        case 'monthly':
          result = await archiveMonthlyHistoricalData();
          break;
        case 'all':
          result = await runAllCronJobs();
          break;
        case 'test':
          result = await testDataExtraction();
          break;
      }
      
      setResults(prev => ({ ...prev, [jobType]: result }));
      
      if (result.success !== false) {
        toast.success(`${jobType.charAt(0).toUpperCase() + jobType.slice(1)} job completed successfully`);
      } else {
        toast.error(`${jobType.charAt(0).toUpperCase() + jobType.slice(1)} job failed: ${result.message}`);
      }
    } catch (error) {
      console.error(`Error running ${jobType} job:`, error);
      toast.error(`Error running ${jobType} job: ${error}`);
    } finally {
      setLoading(prev => ({ ...prev, [jobType]: false }));
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderResultsJSON = (data: any) => {
    if (!data) return null;
    
    return (
      <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
        <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };

  // Get latest price headlines from the data
  const getLatestPriceHeadlines = (type: 'daily' | 'weekly' | 'monthly' | 'all' | 'test') => {
    const result = results[type];
    if (!result || !result.data) return null;
    
    let headlines: React.ReactNode[] = [];
    
    if (type === 'daily' && Array.isArray(result.data)) {
      headlines = result.data.slice(0, 3).map((item, index) => (
        <div key={index} className="flex justify-between items-center py-2 border-b">
          <span className="font-medium">{item.commodity}</span>
          <span className="text-right">KES {item.price} per {item.unit}</span>
        </div>
      ));
    }
    
    return headlines.length > 0 ? (
      <div className="mt-4 border rounded-md p-3 bg-muted/30">
        <h4 className="font-medium mb-2">Latest Prices:</h4>
        {headlines}
      </div>
    ) : null;
  };

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Data Jobs & API Integration</h1>
        <p className="text-muted-foreground">
          Manage and test automated data jobs for AMIS Kenya and Kilimo statistics integration
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Daily AMIS Kenya Updates</CardTitle>
            <CardDescription>
              Fetch latest prices from AMIS Kenya (daily updates)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Run this job to fetch the most recent commodity prices from AMIS Kenya markets.
            </p>
            {getLatestPriceHeadlines('daily')}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => runJob('daily')} 
              disabled={loading.daily}
              className="w-full"
            >
              {loading.daily ? 'Running...' : 'Run Daily Job'}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Kilimo Stats</CardTitle>
            <CardDescription>
              Update agricultural statistics from Kilimo (weekly)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Run this job to update agricultural statistics from the Kilimo platform.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => runJob('weekly')} 
              disabled={loading.weekly}
              className="w-full"
            >
              {loading.weekly ? 'Running...' : 'Run Weekly Job'}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Data Archive</CardTitle>
            <CardDescription>
              Archive historical data for trend analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Run this job to archive current data snapshots for long-term trend analysis.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => runJob('monthly')} 
              disabled={loading.monthly}
              className="w-full"
            >
              {loading.monthly ? 'Running...' : 'Run Monthly Job'}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Run All Jobs</CardTitle>
            <CardDescription>
              Execute all scheduled jobs at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This will run all automated jobs in sequence and report results.
            </p>
            <Button 
              onClick={() => runJob('all')} 
              disabled={loading.all}
              className="w-full"
            >
              {loading.all ? 'Running All Jobs...' : 'Run All Jobs'}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Test Data Extraction</CardTitle>
            <CardDescription>
              Test API connectivity and data extraction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This will test connectivity to the APIs and extract sample data to verify integration.
            </p>
            <Button 
              onClick={() => runJob('test')} 
              disabled={loading.test}
              className="w-full"
              variant="secondary"
            >
              {loading.test ? 'Testing...' : 'Run Extraction Test'}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Job Results</CardTitle>
          <CardDescription>
            View the results of your most recent job runs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="test">Test</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily">
              {results.daily ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={results.daily.success !== false ? "default" : "destructive"}>
                      {results.daily.success !== false ? "Success" : "Failed"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {results.daily.timestamp && formatTimestamp(results.daily.timestamp)}
                    </span>
                  </div>
                  {renderResultsJSON(results.daily)}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground">No results yet. Run the daily job to see data here.</p>
              )}
            </TabsContent>
            
            <TabsContent value="weekly">
              {results.weekly ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={results.weekly.success !== false ? "default" : "destructive"}>
                      {results.weekly.success !== false ? "Success" : "Failed"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {results.weekly.timestamp && formatTimestamp(results.weekly.timestamp)}
                    </span>
                  </div>
                  {renderResultsJSON(results.weekly)}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground">No results yet. Run the weekly job to see data here.</p>
              )}
            </TabsContent>
            
            <TabsContent value="monthly">
              {results.monthly ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={results.monthly.success !== false ? "default" : "destructive"}>
                      {results.monthly.success !== false ? "Success" : "Failed"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {results.monthly.timestamp && formatTimestamp(results.monthly.timestamp)}
                    </span>
                  </div>
                  {renderResultsJSON(results.monthly)}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground">No results yet. Run the monthly job to see data here.</p>
              )}
            </TabsContent>
            
            <TabsContent value="all">
              {results.all ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline">
                      Combined Results
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {results.all.timestamp && formatTimestamp(results.all.timestamp)}
                    </span>
                  </div>
                  {renderResultsJSON(results.all)}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground">No results yet. Run all jobs to see combined data here.</p>
              )}
            </TabsContent>
            
            <TabsContent value="test">
              {results.test ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={results.test.success !== false ? "default" : "destructive"}>
                      {results.test.success !== false ? "Success" : "Failed"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {results.test.timestamp && formatTimestamp(results.test.timestamp)}
                    </span>
                  </div>
                  {renderResultsJSON(results.test)}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground">No results yet. Run the test to see extraction results here.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataJobs;
