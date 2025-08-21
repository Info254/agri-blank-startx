
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, AlertTriangle } from 'lucide-react';

const ApiSecurityStatus: React.FC = () => {
  const securityFeatures = [
    {
      title: 'API Key Authentication',
      status: 'Active',
      description: 'Every request requires valid API key in X-API-Key header',
      icon: <Lock className="h-4 w-4" />,
      color: 'green'
    },
    {
      title: 'Rate Limiting',
      status: 'Enforced',
      description: 'Free: 30/month, Developer: 10K/month, Enterprise: 100K/month',
      icon: <Shield className="h-4 w-4" />,
      color: 'green'
    },
    {
      title: 'Usage Monitoring',
      status: 'Active',
      description: 'All API calls logged with user tracking and analytics',
      icon: <Eye className="h-4 w-4" />,
      color: 'green'
    },
    {
      title: 'Subscription Validation',
      status: 'Active',
      description: 'Tier access verified through business advertisement payments',
      icon: <AlertTriangle className="h-4 w-4" />,
      color: 'green'
    }
  ];

  const endpoints = [
    {
      endpoint: '/api-farmers',
      url: 'https://cwcduhvwkihpnuaoflps.supabase.co/functions/v1/api-farmers',
      status: 'Live',
      tier: 'All Tiers'
    },
    {
      endpoint: '/api-markets', 
      url: 'https://cwcduhvwkihpnuaoflps.supabase.co/functions/v1/api-markets',
      status: 'Live',
      tier: 'Developer+'
    },
    {
      endpoint: '/api-supply-chain',
      url: 'https://cwcduhvwkihpnuaoflps.supabase.co/functions/v1/api-supply-chain', 
      status: 'Live',
      tier: 'Enterprise'
    },
    {
      endpoint: '/api-commodities',
      url: 'https://cwcduhvwkihpnuaoflps.supabase.co/functions/v1/api-commodities',
      status: 'Live', 
      tier: 'All Tiers'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            API Security & Protection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {feature.icon}
                  <h3 className="font-medium">{feature.title}</h3>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {feature.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live API Endpoints</CardTitle>
          <p className="text-muted-foreground">All endpoints are fully functional and protected</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <code className="text-sm font-mono">{endpoint.endpoint}</code>
                  <div className="text-xs text-muted-foreground mt-1">
                    {endpoint.url}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {endpoint.tier}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {endpoint.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiSecurityStatus;
