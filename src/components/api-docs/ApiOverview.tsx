
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const ApiOverview: React.FC = () => {
  return (
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle>Production API Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Base URL</h3>
          <code className="bg-muted p-2 rounded-md block">
            https://cwcduhvwkihpnuaoflps.supabase.co/functions/v1
          </code>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Available API Endpoints</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="flex flex-col border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Farmers API</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm mb-4">Access farmer data from across Kenya with different access levels based on your subscription tier.</p>
                <div className="text-xs bg-white p-2 rounded">
                  <code>GET /api-farmers</code>
                </div>
              </CardContent>
            </Card>
            
            <Card className="flex flex-col border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Markets API</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm mb-4">Get market information with real price data and analytics. Available to Developer and Enterprise tiers.</p>
                <div className="text-xs bg-white p-2 rounded">
                  <code>GET /api-markets</code>
                </div>
              </CardContent>
            </Card>

            <Card className="flex flex-col border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Commodities API</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm mb-4">Access commodity pricing and trend data with different data depths based on subscription tier.</p>
                <div className="text-xs bg-white p-2 rounded">
                  <code>GET /api-commodities</code>
                </div>
              </CardContent>
            </Card>
            
            <Card className="flex flex-col border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Supply Chain API</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm mb-4">Enterprise-tier access to comprehensive supply chain analytics, logistics data, and forecasts.</p>
                <div className="text-xs bg-white p-2 rounded">
                  <code>GET /api-supply-chain</code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-green-100 p-4 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold mb-2">Production Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Security</h4>
              <ul className="space-y-2 list-disc pl-5 text-sm">
                <li>API key authentication with SHA-256 hashing</li>
                <li>Rate limiting by subscription tier</li>
                <li>Request validation and sanitization</li>
                <li>Row-level security policies</li>
                <li>Comprehensive request logging</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Performance</h4>
              <ul className="space-y-2 list-disc pl-5 text-sm">
                <li>Auto-scaling serverless functions</li>
                <li>Response time monitoring</li>
                <li>Traffic-based optimization</li>
                <li>Global CDN distribution</li>
                <li>Request caching mechanisms</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
          <ol className="space-y-2 list-decimal pl-5">
            <li>
              <span className="font-medium">Generate an API key: </span>
              <Link to="/api-docs?tab=keys" className="text-blue-600 inline-flex items-center hover:underline">
                Visit the API Keys tab <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </li>
            <li>
              <span className="font-medium">Send requests with your key: </span>
              Include your API key in the X-API-Key header
            </li>
            <li>
              <span className="font-medium">Upgrade your subscription: </span>
              Purchase a business advertisement to access higher tiers
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiOverview;
