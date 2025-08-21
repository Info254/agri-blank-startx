
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ApiAuthentication: React.FC = () => {
  const { toast } = useToast();

  const handleApiKeyRequest = () => {
    toast({
      title: "Visit the API Keys tab",
      description: "Please use the API Keys tab to generate and manage your API keys.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Authentication</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">API Key Authentication</h3>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
            <p className="font-medium text-green-800 mb-2">✅ Production-Ready API Keys</p>
            <p className="text-sm mb-4">You can generate real API keys that work with our endpoints by visiting the API Keys tab.</p>
            <Link to="/api-docs?tab=keys">
              <Button className="flex items-center">
                Go to API Keys Management
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Using Your API Key</h3>
          <p className="mb-4">Include your API key in the <code>X-API-Key</code> header of all API requests:</p>
          
          <div className="bg-muted p-3 rounded-md">
            <pre className="text-xs overflow-auto">
{`// Example: X-API-Key header
X-API-Key: your_api_key_here

// Example curl request
curl -H "X-API-Key: your_api_key_here" https://cwcduhvwkihpnuaoflps.supabase.co/functions/v1/api-farmers`}
            </pre>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">⚠️ API Key Security</h4>
            <ul className="space-y-2 text-sm list-disc pl-5 text-yellow-800">
              <li>Never expose your API key in client-side code</li>
              <li>Use environment variables to store keys in your server code</li>
              <li>Set up proper CORS policies on your server</li>
              <li>Rotate your API keys periodically for added security</li>
              <li>Delete inactive API keys to prevent unauthorized access</li>
            </ul>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Rate Limiting</h3>
          <p className="mb-2">Our API enforces the following rate limits based on your subscription tier:</p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border px-4 py-2 text-left">Subscription</th>
                  <th className="border px-4 py-2 text-left">Rate Limit</th>
                  <th className="border px-4 py-2 text-left">Monthly Requests</th>
                  <th className="border px-4 py-2 text-left">Data Access</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">Free</td>
                  <td className="border px-4 py-2">100 req/minute</td>
                  <td className="border px-4 py-2">1,000</td>
                  <td className="border px-4 py-2">Basic (Limited)</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Developer</td>
                  <td className="border px-4 py-2">500 req/minute</td>
                  <td className="border px-4 py-2">50,000</td>
                  <td className="border px-4 py-2">Standard</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">Enterprise</td>
                  <td className="border px-4 py-2">2,000 req/minute</td>
                  <td className="border px-4 py-2">500,000</td>
                  <td className="border px-4 py-2">Premium (Full)</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">ℹ️ Rate Limit Response</h4>
            <p className="text-sm mb-2 text-blue-700">When rate limited, the API returns a 429 status code with headers:</p>
            <pre className="bg-white p-2 rounded text-xs">
{`{
  "error": "Rate limit exceeded",
  "meta": {
    "limit": 100,
    "remaining": 0,
    "reset_time": "2025-06-11T12:30:00Z"
  }
}`}
            </pre>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Error Handling</h3>
          <p className="mb-2">Common API error responses:</p>
          <ul className="space-y-2">
            <li><code>401 Unauthorized</code> - Invalid or missing API key</li>
            <li><code>403 Forbidden</code> - Subscription level doesn't allow access</li>
            <li><code>404 Not Found</code> - Endpoint or resource not found</li>
            <li><code>429 Too Many Requests</code> - Rate limit exceeded</li>
            <li><code>500 Internal Server Error</code> - Server-side error</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiAuthentication;
