import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Copy, 
  Check, 
  DollarSign, 
  Zap, 
  Shield, 
  Globe,
  BarChart3,
  Users,
  Truck,
  Database
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const SupplyChainAPI: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('developer');
  const { user } = useAuth();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const apiPlans = [
    {
      id: 'starter',
      name: 'Free Tier',
      price: 0,
      currency: 'KES',
      period: 'month',
      requests: '30',
      features: [
        'Basic market data access',
        'County-level statistics',
        'Standard rate limits',
        'Community support'
      ],
      popular: false,
      buttonText: 'Get Started Free'
    },
    {
      id: 'developer',
      name: 'Developer',
      price: 2500,
      currency: 'KES',
      period: 'month',
      requests: '10,000',
      features: [
        'Full market data access',
        'Real-time price feeds',
        'Supply chain analytics',
        'Priority email support',
        'API analytics dashboard'
      ],
      popular: true,
      buttonText: 'Start Developer Plan'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 15000,
      currency: 'KES',
      period: 'month',
      requests: '100,000+',
      features: [
        'Unlimited API access',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantees',
        'Custom data feeds',
        'White-label options'
      ],
      popular: false,
      buttonText: 'Contact Sales'
    }
  ];

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/v1/supply-chain/farmers',
      description: 'Retrieve farmer data across Kenya with location and crop information',
      example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.agriconnect.co.ke/v1/supply-chain/farmers?county=nakuru'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/supply-chain/markets',
      description: 'Access real-time market prices and demand data for agricultural commodities',
      example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.agriconnect.co.ke/v1/supply-chain/markets?commodity=maize'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/supply-chain/logistics',
      description: 'Transportation and warehouse data for supply chain optimization',
      example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.agriconnect.co.ke/v1/supply-chain/logistics?type=transport'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/supply-chain/analytics',
      description: 'Advanced analytics and forecasting for agricultural supply chains',
      example: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.agriconnect.co.ke/v1/supply-chain/analytics?metric=price-forecast'
    }
  ];

  const useCases = [
    {
      title: 'Agribusiness Integration',
      description: 'Integrate real-time market data into your agricultural business applications',
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      revenue: 'KES 500K+/month'
    },
    {
      title: 'Fintech Agriculture',
      description: 'Build financial products for farmers using our verified agricultural data',
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      revenue: 'KES 1M+/month'
    },
    {
      title: 'Logistics Optimization',
      description: 'Optimize transportation routes and costs using our supply chain APIs',
      icon: <Truck className="h-8 w-8 text-orange-600" />,
      revenue: 'KES 300K+/month'
    },
    {
      title: 'Research & Analytics',
      description: 'Access comprehensive datasets for agricultural research and analysis',
      icon: <Database className="h-8 w-8 text-purple-600" />,
      revenue: 'KES 200K+/month'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Supply Chain API Platform
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto mb-4">
          Monetized access to Kenya's most comprehensive agricultural supply chain data and analytics
        </p>
        <div className="flex items-center justify-center gap-4 mb-6">
          <Badge className="bg-green-100 text-green-800">Live API ✅</Badge>
          <Badge className="bg-blue-100 text-blue-800">99.9% Uptime</Badge>
          <Badge className="bg-purple-100 text-purple-800">Enterprise Ready</Badge>
          <Badge className="bg-orange-100 text-orange-800">
            Hosted: Supabase Edge Functions
          </Badge>
        </div>
        {user && (
          <div className="text-sm text-muted-foreground mb-4">
            Signed in as: {user.email}
          </div>
        )}
      </div>

      {/* API Security Status */}
      <div className="mb-8 max-w-4xl mx-auto">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">API Security Status</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-green-700">✅ Authentication</div>
                <div className="text-green-600">API Key validation active</div>
              </div>
              <div>
                <div className="font-medium text-green-700">✅ Rate Limiting</div>
                <div className="text-green-600">Per-tier limits enforced</div>
              </div>
              <div>
                <div className="font-medium text-green-700">✅ Monitoring</div>
                <div className="text-green-600">Usage tracking enabled</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <main className="py-8 px-4 md:px-6 max-w-7xl mx-auto">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="endpoints">API Docs</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">47</div>
                  <div className="text-sm text-muted-foreground">Counties Covered</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm text-muted-foreground">Registered Farmers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">2M+</div>
                  <div className="text-sm text-muted-foreground">API Calls/Month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm text-muted-foreground">API Uptime</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue-Generating Use Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {useCases.map((useCase, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        {useCase.icon}
                        <div>
                          <h3 className="font-medium mb-2">{useCase.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{useCase.description}</p>
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            Revenue Potential: {useCase.revenue}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Choose Your API Plan</h2>
              <p className="text-muted-foreground">Updated pricing with new request limits</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {apiPlans.map((plan) => (
                <Card key={plan.id} className={`relative ${plan.popular ? 'border-green-500 shadow-lg' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">{plan.currency} {plan.price.toLocaleString()}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Up to {plan.requests} API requests
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <p className="text-muted-foreground">Complete reference for our supply chain API</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiEndpoints.map((endpoint, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono">{endpoint.endpoint}</code>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{endpoint.description}</p>
                      <div className="bg-muted p-3 rounded text-sm font-mono overflow-x-auto">
                        {endpoint.example}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => copyToClipboard(endpoint.example)}
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        Copy Example
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>JavaScript/Node.js</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-md">
                    <pre className="text-sm overflow-auto">
{`const response = await fetch(
  'https://api.agriconnect.co.ke/v1/supply-chain/farmers',
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);

const farmers = await response.json();
console.log(\`Found \${farmers.length} farmers\`);`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Python</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-md">
                    <pre className="text-sm overflow-auto">
{`import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.agriconnect.co.ke/v1/supply-chain/markets',
    headers=headers
)

markets = response.json()
print(f"Found {len(markets)} markets")`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Integration Example</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-sm overflow-auto">
{`// Example: Building a profitable agritech app
const buildProfitableApp = async () => {
  // Get market data for price predictions
  const markets = await agriConnectAPI.getMarkets();
  
  // Get farmer data for targeted services
  const farmers = await agriConnectAPI.getFarmers();
  
  // Build premium features with our data
  const premiumInsights = await agriConnectAPI.getAnalytics();
  
  // Monetize with subscription model
  return {
    monthlyRevenue: 'KES 500,000+',
    userBase: farmers.length,
    features: premiumInsights
  };
};`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Build the Future of Agriculture?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join hundreds of developers building profitable agricultural applications with our comprehensive API platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Start Building Today
              </Button>
              <Button size="lg" variant="outline">
                Contact Enterprise Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SupplyChainAPI;
