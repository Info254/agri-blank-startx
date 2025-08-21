
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SupplyChainProblems: React.FC = () => {
  const problems = [
    {
      id: 'post-harvest-losses',
      title: 'Post-Harvest Losses',
      description: 'Up to 40% of harvested crops are lost due to inadequate storage, transportation issues, and limited processing facilities.',
      solutions: ['Affordable storage technologies', 'Value addition and processing', 'Direct market linkages'],
      path: '/supply-chain-problems/post-harvest-losses',
      implemented: true
    },
    {
      id: 'logistics-issues',
      title: 'Logistics Issues',
      description: 'Poor infrastructure and inefficient transportation lead to delays, spoilage, and higher costs for farmers.',
      solutions: ['Optimized transport routes', 'Cold chain solutions', 'Shared logistics services'],
      path: '/supply-chain-problems/logistics-issues',
      implemented: true
    },
    {
      id: 'market-access',
      title: 'Market Access',
      description: 'Farmers struggle to connect with buyers and often rely on exploitative middlemen.',
      solutions: ['Direct buyer-farmer connections', 'Market information systems', 'Collective marketing groups'],
      path: '/supply-chain-problems/market-access',
      implemented: true
    },
    {
      id: 'price-volatility',
      title: 'Price Volatility',
      description: 'Unpredictable price fluctuations make planning difficult and reduce farmer incomes.',
      solutions: ['Forward contracts', 'Price prediction tools', 'Storage solutions to sell when prices improve'],
      path: '/supply-chain-problems/price-volatility',
      implemented: true
    },
    {
      id: 'quality-control',
      title: 'Quality Control',
      description: 'Inconsistent produce quality limits access to premium markets and reduces prices.',
      solutions: ['Quality verification systems', 'Training on standards', 'Certification support'],
      path: '/supply-chain-problems/quality-control',
      implemented: true
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Agricultural Supply Chain Challenges</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Addressing key challenges in Kenya's agricultural supply chains with practical, technology-driven solutions
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="default" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              All Solutions Implemented
            </Badge>
            <Badge variant="outline">5 Key Challenges Addressed</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {problems.map((problem) => (
            <Card key={problem.id} className="flex flex-col relative">
              {problem.implemented && (
                <Badge variant="default" className="absolute top-4 right-4 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Live
                </Badge>
              )}
              <CardHeader className="pb-2">
                <CardTitle>{problem.title}</CardTitle>
                <CardDescription>{problem.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <h4 className="font-medium mb-2">Our Solutions</h4>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  {problem.solutions.map((solution, idx) => (
                    <li key={idx} className="text-sm">{solution}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full md:w-auto">
                  <Link to={problem.path}>
                    Learn More & Access Tools
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-muted/30 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">How AgriTender Connect Addresses Supply Chain Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technology Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  Our platform uses technology to connect all actors in the supply chain, creating 
                  transparency and improving coordination between farmers, transporters, and buyers.
                </p>
                <ul className="text-xs space-y-1">
                  <li>• Real-time tracking and monitoring</li>
                  <li>• Automated matching algorithms</li>
                  <li>• Mobile-first design for accessibility</li>
                  <li>• Integration with payment systems</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data-Driven Decisions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  Real-time market data and production forecasts help farmers and buyers make 
                  informed decisions about what to grow, when to sell, and where to sell.
                </p>
                <ul className="text-xs space-y-1">
                  <li>• AI-powered price predictions</li>
                  <li>• Weather-based recommendations</li>
                  <li>• Market demand forecasting</li>
                  <li>• Risk assessment tools</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alternative Trading</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">
                  Our barter exchange system and community trading networks create alternative 
                  pathways for farmers to exchange goods and access markets without cash.
                </p>
                <ul className="text-xs space-y-1">
                  <li>• Crop-to-crop exchanges</li>
                  <li>• Service-for-produce trades</li>
                  <li>• Community cooperatives</li>
                  <li>• Digital payment alternatives</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-green-900 mb-2">Platform Risk Disclaimer</h3>
            <p className="text-sm text-green-800">
              AgriTender Connect provides technology solutions to facilitate agricultural connections and transactions. 
              We do not manage farming operations, guarantee crop outcomes, or assume responsibility for agricultural 
              risks. Users make independent decisions regarding their farming and business activities.
            </p>
          </div>
          
          <div className="text-center">
            <Button size="lg" asChild>
              <Link to="/commodity-trading">Start Trading Now</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupplyChainProblems;
