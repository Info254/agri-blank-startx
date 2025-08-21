
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchKilimoStats } from '@/services/kilimoAPI';
import { KilimoStats } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Package, Truck, AlertTriangle, MapPin } from 'lucide-react';
import LogisticsOnboarding from '@/features/logistics/LogisticsOnboarding';
import LogisticsChallenges from '@/components/logistics/LogisticsChallenges';
import LogisticsDataAnalysis from '@/components/logistics/LogisticsDataAnalysis';

const LogisticsIssues: React.FC = () => {
  const navigate = useNavigate();
  const [kilimoData, setKilimoData] = useState<KilimoStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('issues');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchKilimoStats();
        setKilimoData(data);
      } catch (error) {
        console.error('Error fetching Kilimo data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Logistics Issues</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Understanding and addressing transportation and delivery challenges in agricultural supply chains
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button 
              onClick={() => navigate('/logistics-solutions-map')}
              className="flex gap-2 items-center"
              variant="outline"
            >
              <MapPin className="h-4 w-4" />
              View Logistics Solutions Map
            </Button>
            
            <Button
              onClick={() => setActiveTab('register')}
              variant="default"
            >
              Register as Provider
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8">
            <TabsTrigger value="issues" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Logistics Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Data Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span>Register as Provider</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="issues">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Common Logistics Challenges</CardTitle>
                <CardDescription>
                  Key transportation and delivery issues faced by agricultural businesses in Kenya
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LogisticsChallenges />
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/logistics-solutions-map')}
                  className="flex gap-2 items-center w-full sm:w-auto"
                  variant="outline"
                >
                  <MapPin className="h-4 w-4" />
                  Find Logistics Providers Near You
                </Button>
                
                <Button 
                  onClick={() => setActiveTab('register')}
                  className="ml-auto w-full sm:w-auto"
                >
                  Be Part of the Solution - Register
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Logistics Data Analysis</CardTitle>
                <CardDescription>
                  Data-driven insights on agricultural logistics challenges based on national statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LogisticsDataAnalysis isLoading={isLoading} />
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate('/logistics-solutions-map')}
                  className="ml-auto"
                >
                  Find Solutions on Map
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <LogisticsOnboarding />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LogisticsIssues;
