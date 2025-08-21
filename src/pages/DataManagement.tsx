
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Database, Shield, Zap, CheckCircle, ExternalLink, Server, Cloud, Lock } from 'lucide-react';

const DataManagement: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Data Management & Integration Strategy
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Comprehensive overview of how AgriTender Connect handles, stores, and secures agricultural data
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="apis">API Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Real-Time Data
                  </CardTitle>
                  <CardDescription>
                    Live integration with government and institutional sources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Market prices updated hourly
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Production statistics from KNBS
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Weather data integration
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Data Integrity
                  </CardTitle>
                  <CardDescription>
                    100% verified sources with transparency badges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Government source verification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      No fake or sample data
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Source attribution required
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Performance
                  </CardTitle>
                  <CardDescription>
                    Optimized for field operations and mobile use
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Sub-second response times
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Offline capability
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Mobile-first design
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verified Data Sources</CardTitle>
                <CardDescription>
                  All data is sourced from legitimate Kenyan government and institutional sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Kenya National Bureau of Statistics (KNBS)</h3>
                      <Badge variant="outline" className="text-green-600 border-green-600">Verified</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Official agricultural census, production statistics, and economic surveys
                    </p>
                    <a 
                      href="https://www.knbs.or.ke/agricultural-statistics/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      knbs.or.ke/agricultural-statistics
                    </a>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Ministry of Agriculture & Livestock Development</h3>
                      <Badge variant="outline" className="text-green-600 border-green-600">Verified</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Policy updates, crop forecasts, and agricultural development programs
                    </p>
                    <a 
                      href="https://kilimo.go.ke/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      kilimo.go.ke
                    </a>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Nairobi Grain Exchange</h3>
                      <Badge variant="outline" className="text-green-600 border-green-600">Verified</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Real-time commodity prices and trading data
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Data Storage Architecture
                </CardTitle>
                <CardDescription>
                  Enterprise-grade storage with Supabase PostgreSQL backend
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Cloud className="h-4 w-4 text-blue-600" />
                        Primary Storage
                      </h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Supabase PostgreSQL database</li>
                        <li>• Row Level Security (RLS) enabled</li>
                        <li>• Automatic backups every 6 hours</li>
                        <li>• 99.9% uptime guarantee</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-600" />
                        Caching Layer
                      </h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Redis for real-time data</li>
                        <li>• CDN for static assets</li>
                        <li>• Browser caching optimization</li>
                        <li>• Smart cache invalidation</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Data Retention Policy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <strong>Market Prices:</strong><br />
                        <span className="text-muted-foreground">5 years historical data</span>
                      </div>
                      <div>
                        <strong>Production Data:</strong><br />
                        <span className="text-muted-foreground">10 years for analysis</span>
                      </div>
                      <div>
                        <strong>User Data:</strong><br />
                        <span className="text-muted-foreground">As per user preferences</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  Data Security & Privacy
                </CardTitle>
                <CardDescription>
                  Enterprise-grade security protecting farmer and market data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Encryption & Access Control</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        AES-256 encryption at rest
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        TLS 1.3 for data in transit
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Row Level Security (RLS)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Multi-factor authentication
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Compliance & Auditing</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Kenya Data Protection Act compliance
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Regular security audits
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Activity logging and monitoring
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Incident response procedures
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Data Integration</CardTitle>
                <CardDescription>
                  How external data is integrated, validated, and used throughout the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Data Integration Pipeline</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">1</div>
                        <div>
                          <strong>Data Ingestion</strong><br />
                          <span className="text-sm text-muted-foreground">Automated fetching from verified sources every hour</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">2</div>
                        <div>
                          <strong>Validation & Cleaning</strong><br />
                          <span className="text-sm text-muted-foreground">Data quality checks and format standardization</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-semibold text-sm">3</div>
                        <div>
                          <strong>Storage & Indexing</strong><br />
                          <span className="text-sm text-muted-foreground">Optimized storage for fast retrieval and analysis</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold text-sm">4</div>
                        <div>
                          <strong>API Distribution</strong><br />
                          <span className="text-sm text-muted-foreground">Real-time access through our monetized API platform</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Real-Time Updates</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Market prices: Every 30 minutes</li>
                        <li>• Weather data: Every 15 minutes</li>
                        <li>• Production stats: Daily</li>
                        <li>• Policy updates: As announced</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Data Quality Assurance</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Source verification checks</li>
                        <li>• Anomaly detection algorithms</li>
                        <li>• Historical trend validation</li>
                        <li>• Manual review for critical data</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataManagement;
