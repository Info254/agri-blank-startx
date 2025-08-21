
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, ExternalLink } from 'lucide-react';
import { KilimoDataService } from '@/services/database/kilimoDataService';
import { useToast } from '@/hooks/use-toast';

const DataStatus: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [apiTest, setApiTest] = useState<any>(null);
  const [dbData, setDbData] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [fetchLogs, setFetchLogs] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    setLoading(true);
    
    // Test API directly
    try {
      console.log('Testing Kilimo API...');
      const apiResponse = await fetch("https://statistics.kilimo.go.ke/en/api/apputils/", {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        setApiTest({
          status: 'success',
          message: `API working. Counties: ${apiData.county?.length || 0}`,
          data: apiData
        });
        console.log('API Response:', apiData);
      } else {
        setApiTest({
          status: 'error',
          message: `API returned ${apiResponse.status}`,
          data: null
        });
      }
    } catch (error) {
      console.error('API Test Error:', error);
      setApiTest({
        status: 'error',
        message: 'Failed to connect to API',
        data: null
      });
    }

    // Check database data
    try {
      const [data, analyticsData, logs] = await Promise.all([
        KilimoDataService.getLatestStats(20),
        KilimoDataService.getAnalytics(),
        KilimoDataService.getFetchLogs(10)
      ]);
      
      setDbData(data);
      setAnalytics(analyticsData);
      setFetchLogs(logs);
      
      console.log('Database Data:', { data: data.length, analytics: analyticsData });
    } catch (error) {
      console.error('Database Error:', error);
    }
    
    setLoading(false);
  };

  const triggerManualFetch = async () => {
    try {
      toast({
        title: "Triggering data fetch...",
        description: "Please wait while we fetch new data",
      });
      
      const result = await KilimoDataService.triggerManualFetch();
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        // Refresh the status
        setTimeout(() => checkSystemStatus(), 2000);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch data",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Manual fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to trigger data fetch",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">System Data Status Check</h1>
          <p className="text-muted-foreground">
            Real-time verification of API connectivity and data collection
          </p>
          <Button onClick={checkSystemStatus} className="mt-4 mr-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
          <Button onClick={triggerManualFetch} variant="outline">
            <Database className="h-4 w-4 mr-2" />
            Trigger Data Fetch
          </Button>
        </div>

        {/* API Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {apiTest?.status === 'success' ? 
                <CheckCircle className="h-5 w-5 text-green-600" /> : 
                <XCircle className="h-5 w-5 text-red-600" />
              }
              Kilimo API Status
            </CardTitle>
            <CardDescription>
              Direct connection to https://statistics.kilimo.go.ke/
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <Badge variant={apiTest?.status === 'success' ? 'default' : 'destructive'}>
                  {apiTest?.status || 'Unknown'}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Message:</span>
                <p className="text-sm text-muted-foreground mt-1">{apiTest?.message}</p>
              </div>
              {apiTest?.data && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">API Response Sample:</p>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(apiTest.data, null, 2).slice(0, 500)}...
                  </pre>
                </div>
              )}
              <a 
                href="https://statistics.kilimo.go.ke/en/api/apputils/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                Test API Directly <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Database Storage Status
            </CardTitle>
            <CardDescription>
              Stored data from automatic and manual fetches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{analytics?.totalRecords || 0}</div>
                <div className="text-sm text-muted-foreground">Total Records</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{analytics?.categoriesCount || 0}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{analytics?.countiesCount || 0}</div>
                <div className="text-sm text-muted-foreground">Counties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {analytics?.lastUpdateDate !== 'Never' ? 
                    new Date(analytics.lastUpdateDate).toLocaleDateString() : 
                    'Never'
                  }
                </div>
                <div className="text-sm text-muted-foreground">Last Update</div>
              </div>
            </div>

            {dbData.length > 0 ? (
              <div>
                <h4 className="font-medium mb-3">Recent Data Sample:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Category</th>
                        <th className="text-left p-2">County</th>
                        <th className="text-left p-2">Value</th>
                        <th className="text-left p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbData.slice(0, 5).map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{item.name}</td>
                          <td className="p-2">
                            <Badge variant="outline">{item.category}</Badge>
                          </td>
                          <td className="p-2">{item.county}</td>
                          <td className="p-2">{item.value}</td>
                          <td className="p-2">{new Date(item.fetch_date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No data found in database. Try triggering a manual fetch.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fetch Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Fetch Logs</CardTitle>
            <CardDescription>
              History of data collection attempts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fetchLogs.length > 0 ? (
              <div className="space-y-3">
                {fetchLogs.map((log, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                          {log.status}
                        </Badge>
                        <span className="font-medium">{log.source}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      Records: {log.records_count} | Time: {log.execution_time_ms}ms
                      {log.error_message && (
                        <div className="text-red-600 mt-1">Error: {log.error_message}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No fetch logs found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataStatus;
