import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  AlertTriangle, 
  Shield, 
  MessageSquare,
  Calendar,
  MapPin,
  Eye,
  ThumbsUp,
  Share,
  Flag,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface RegulatoryAlert {
  id: string;
  title: string;
  category: 'pesticide-ban' | 'contamination' | 'recall' | 'safety-warning' | 'regulation-change' | 'market-rejection';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  affectedProducts: string[];
  affectedRegions: string[];
  source: string;
  datePosted: string;
  expiryDate?: string;
  author: {
    name: string;
    role: string;
    organization: string;
    verified: boolean;
  };
  attachments?: string[];
  views: number;
  likes: number;
  comments: number;
  status: 'active' | 'resolved' | 'under-investigation';
  actionRequired: string;
  alternativeRecommendations?: string[];
}

interface BehavioralMetric {
  playerId: string;
  playerType: 'farmer' | 'agro-dealer' | 'transporter' | 'processor';
  reportedBy: string;
  reporterRole: 'extension-officer' | 'field-agent' | 'cooperative-leader' | 'peer-farmer';
  metrics: {
    engagementLevel: number; // 1-10
    complianceRate: number; // percentage
    responsiveness: number; // 1-10
    collaborationScore: number; // 1-10
    innovationAdoption: number; // 1-10
    riskTolerance: number; // 1-10
  };
  observations: string;
  concerns: string[];
  recommendations: string[];
  reportDate: string;
  nextFollowUp: string;
}

const RegulatoryAlerts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'post-alert' | 'behavioral-data'>('alerts');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  // Mock regulatory alerts data
  const alerts: RegulatoryAlert[] = [
    {
      id: 'alert1',
      title: 'URGENT: Paraquat Herbicide Banned Effective Immediately',
      category: 'pesticide-ban',
      severity: 'critical',
      description: 'The Kenya Bureau of Standards (KEBS) has issued an immediate ban on all Paraquat-based herbicides due to severe health risks. All existing stocks must be returned to suppliers. Farmers using Paraquat should stop immediately and seek alternatives.',
      affectedProducts: ['Paraquat 20% SL', 'Gramoxone', 'Para-col', 'Quick Action'],
      affectedRegions: ['All Counties'],
      source: 'Kenya Bureau of Standards (KEBS)',
      datePosted: '2024-01-15',
      author: {
        name: 'Dr. James Mwangi',
        role: 'Senior Agricultural Officer',
        organization: 'Ministry of Agriculture',
        verified: true
      },
      views: 2847,
      likes: 156,
      comments: 89,
      status: 'active',
      actionRequired: 'Immediate cessation of use, return stocks to suppliers, switch to approved alternatives',
      alternativeRecommendations: ['Glyphosate-based herbicides', 'Manual weeding', 'Cover cropping', 'Mechanical cultivation']
    },
    {
      id: 'alert2',
      title: 'Aflatoxin Contamination Alert - Maize from Busia County',
      category: 'contamination',
      severity: 'high',
      description: 'High levels of aflatoxin detected in maize samples from several stores in Busia County. Affected batches have been identified and should not be consumed or sold. Farmers are advised to properly dry and store maize to prevent contamination.',
      affectedProducts: ['Yellow maize', 'White maize'],
      affectedRegions: ['Busia County', 'Siaya County'],
      source: 'Kenya Bureau of Standards (KEBS)',
      datePosted: '2024-01-12',
      author: {
        name: 'Mary Wanjiku',
        role: 'Food Safety Inspector',
        organization: 'KEBS',
        verified: true
      },
      views: 1923,
      likes: 78,
      comments: 45,
      status: 'under-investigation',
      actionRequired: 'Test maize before sale, improve drying and storage practices',
      alternativeRecommendations: ['Use moisture meters', 'Proper ventilation in storage', 'Regular quality testing']
    },
    {
      id: 'alert3',
      title: 'EU Rejects Kenyan Green Beans Due to Pesticide Residues',
      category: 'market-rejection',
      severity: 'high',
      description: 'The European Union has rejected a shipment of green beans from Kenya due to excessive pesticide residues. Exporters and farmers are advised to strictly follow Maximum Residue Limits (MRLs) and pre-harvest intervals.',
      affectedProducts: ['French beans', 'Green beans'],
      affectedRegions: ['Kirinyaga', 'Murang\'a', 'Kiambu'],
      source: 'Export Promotion Council',
      datePosted: '2024-01-10',
      author: {
        name: 'Peter Kiprotich',
        role: 'Export Quality Manager',
        organization: 'Fresh Produce Exporters Association',
        verified: true
      },
      views: 1456,
      likes: 92,
      comments: 67,
      status: 'active',
      actionRequired: 'Review pesticide application practices, extend pre-harvest intervals, conduct residue testing',
      alternativeRecommendations: ['Organic pesticides', 'Integrated Pest Management', 'Biological control methods']
    }
  ];

  // Mock behavioral metrics data
  const behavioralMetrics: BehavioralMetric[] = [
    {
      playerId: 'farmer001',
      playerType: 'farmer',
      reportedBy: 'John Kamau',
      reporterRole: 'extension-officer',
      metrics: {
        engagementLevel: 8,
        complianceRate: 92,
        responsiveness: 7,
        collaborationScore: 9,
        innovationAdoption: 6,
        riskTolerance: 4
      },
      observations: 'Samuel is highly engaged in cooperative activities and consistently follows recommended practices. Shows strong leadership potential and willingness to help other farmers.',
      concerns: ['Hesitant to adopt new technologies', 'Risk-averse when it comes to new crops'],
      recommendations: ['Provide technology demonstrations', 'Start with low-risk innovations', 'Pair with early adopter farmer'],
      reportDate: '2024-01-14',
      nextFollowUp: '2024-02-14'
    },
    {
      playerId: 'dealer003',
      playerType: 'agro-dealer',
      reportedBy: 'Grace Wanjiru',
      reporterRole: 'field-agent',
      metrics: {
        engagementLevel: 6,
        complianceRate: 78,
        responsiveness: 5,
        collaborationScore: 7,
        innovationAdoption: 8,
        riskTolerance: 7
      },
      observations: 'Dealer is knowledgeable about products but sometimes slow to respond to farmer inquiries. Good at stocking new products but needs improvement in customer service.',
      concerns: ['Delayed response to customer complaints', 'Inconsistent stock levels'],
      recommendations: ['Customer service training', 'Implement inventory management system', 'Regular customer feedback collection'],
      reportDate: '2024-01-12',
      nextFollowUp: '2024-02-12'
    }
  ];

  const categories = ['all', 'pesticide-ban', 'contamination', 'recall', 'safety-warning', 'regulation-change', 'market-rejection'];
  const severities = ['all', 'critical', 'high', 'medium', 'low'];
  const regions = ['all', 'All Counties', 'Busia County', 'Siaya County', 'Kirinyaga', 'Murang\'a', 'Kiambu'];

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || alert.category === categoryFilter;
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesRegion = regionFilter === 'all' || 
                         alert.affectedRegions.some(region => region === regionFilter);
    
    return matchesSearch && matchesCategory && matchesSeverity && matchesRegion;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <AlertCircle className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Regulatory Alerts & Safety Warnings</h1>
            <p className="text-muted-foreground mt-2">
              Community-driven alerts for supply chain safety and regulatory compliance
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-red-600">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {alerts.filter(a => a.severity === 'critical').length} Critical
            </Badge>
            <Badge variant="outline" className="text-orange-600">
              <Flag className="h-3 w-3 mr-1" />
              {alerts.filter(a => a.status === 'active').length} Active Alerts
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="alerts">View Alerts</TabsTrigger>
            <TabsTrigger value="post-alert">Post Alert</TabsTrigger>
            <TabsTrigger value="behavioral-data">Behavioral Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {severities.map(severity => (
                        <SelectItem key={severity} value={severity}>
                          {severity === 'all' ? 'All Severities' : severity.charAt(0).toUpperCase() + severity.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region} value={region}>
                          {region === 'all' ? 'All Regions' : region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Most Critical
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Alert Listings */}
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <Card key={alert.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getSeverityColor(alert.severity)} border`}>
                            {getSeverityIcon(alert.severity)}
                            <span className="ml-1">{alert.severity.toUpperCase()}</span>
                          </Badge>
                          <Badge variant="outline">
                            {alert.category.split('-').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Badge>
                          <Badge variant={alert.status === 'active' ? 'default' : 'secondary'}>
                            {alert.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{alert.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(alert.datePosted).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {alert.affectedRegions.join(', ')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            {alert.source}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm mb-4">{alert.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Affected Products</h4>
                        <div className="flex flex-wrap gap-1">
                          {alert.affectedProducts.map((product) => (
                            <Badge key={product} variant="outline" className="text-xs">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Required Action</h4>
                        <p className="text-sm text-muted-foreground">{alert.actionRequired}</p>
                      </div>
                      
                      {alert.alternativeRecommendations && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Recommended Alternatives</h4>
                          <div className="flex flex-wrap gap-1">
                            {alert.alternativeRecommendations.map((alt) => (
                              <Badge key={alt} variant="secondary" className="text-xs">
                                {alt}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {alert.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium flex items-center gap-1">
                              {alert.author.name}
                              {alert.author.verified && (
                                <Shield className="h-3 w-3 text-blue-600" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {alert.author.role}, {alert.author.organization}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            {alert.views}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <ThumbsUp className="h-4 w-4" />
                            {alert.likes}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MessageSquare className="h-4 w-4" />
                            {alert.comments}
                          </div>
                          <Button size="sm" variant="outline">
                            <Share className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="post-alert" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post New Alert</CardTitle>
                <p className="text-muted-foreground">
                  Share important safety information, regulatory changes, or warnings with the agricultural community.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Alert Title</label>
                      <Input placeholder="Brief, descriptive title" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pesticide-ban">Pesticide Ban</SelectItem>
                          <SelectItem value="contamination">Contamination</SelectItem>
                          <SelectItem value="recall">Product Recall</SelectItem>
                          <SelectItem value="safety-warning">Safety Warning</SelectItem>
                          <SelectItem value="regulation-change">Regulation Change</SelectItem>
                          <SelectItem value="market-rejection">Market Rejection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Severity Level</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Source Organization</label>
                      <Input placeholder="e.g., KEBS, Ministry of Agriculture" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Detailed Description</label>
                    <Textarea 
                      placeholder="Provide comprehensive details about the alert, including background, implications, and timeline"
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Affected Products (comma-separated)</label>
                      <Input placeholder="e.g., Paraquat 20% SL, Gramoxone" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Affected Regions (comma-separated)</label>
                      <Input placeholder="e.g., Busia County, All Counties" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Required Actions</label>
                    <Textarea 
                      placeholder="What should farmers, dealers, or other stakeholders do immediately?"
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Alternative Recommendations (optional)</label>
                    <Input placeholder="Suggest safer alternatives or best practices" />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Post Alert
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavioral-data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Behavioral Data Collection</CardTitle>
                <p className="text-muted-foreground">
                  Field agents and extension officers can report behavioral metrics for supply chain participants to enable predictive analytics.
                </p>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              {behavioralMetrics.map((metric, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {metric.playerType.charAt(0).toUpperCase() + metric.playerType.slice(1)} - {metric.playerId}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{metric.playerType}</Badge>
                          <Badge variant="outline">
                            Reported by {metric.reporterRole.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(metric.reportDate).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Performance Metrics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {Object.entries(metric.metrics).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{value}{key === 'complianceRate' ? '%' : '/10'}</div>
                              <div className="text-xs text-muted-foreground">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^\w/, c => c.toUpperCase())}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Observations</h4>
                        <p className="text-sm text-muted-foreground">{metric.observations}</p>
                      </div>
                      
                      {metric.concerns.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Concerns</h4>
                          <div className="flex flex-wrap gap-1">
                            {metric.concerns.map((concern, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs text-red-600">
                                {concern}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                        <div className="flex flex-wrap gap-1">
                          {metric.recommendations.map((rec, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {rec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t text-sm text-muted-foreground">
                        <div>Reported by: {metric.reportedBy}</div>
                        <div>Next follow-up: {new Date(metric.nextFollowUp).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Submit Behavioral Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Player ID/Name</label>
                      <Input placeholder="Enter player identifier" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Player Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="farmer">Farmer</SelectItem>
                          <SelectItem value="agro-dealer">Agro-dealer</SelectItem>
                          <SelectItem value="transporter">Transporter</SelectItem>
                          <SelectItem value="processor">Processor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Your Role</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="extension-officer">Extension Officer</SelectItem>
                          <SelectItem value="field-agent">Field Agent</SelectItem>
                          <SelectItem value="cooperative-leader">Cooperative Leader</SelectItem>
                          <SelectItem value="peer-farmer">Peer Farmer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Observations</label>
                    <Textarea 
                      placeholder="Detailed observations about the player's behavior, engagement, and performance"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      <Users className="h-4 w-4 mr-2" />
                      Submit Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default RegulatoryAlerts;
