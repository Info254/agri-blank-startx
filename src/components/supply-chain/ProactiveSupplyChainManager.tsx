import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Package,
  Truck,
  Building,
  Brain,
  Target,
  Zap,
  Shield,
  Clock,
  BarChart3
} from 'lucide-react';

interface ChurnRiskScore {
  playerId: string;
  playerName: string;
  playerType: 'farmer' | 'agro-dealer' | 'transporter' | 'processor' | 'cooperative';
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  keyIndicators: {
    engagementTrend: 'increasing' | 'stable' | 'declining';
    transactionFrequency: 'increasing' | 'stable' | 'declining';
    complianceRate: number;
    satisfactionScore: number;
    communicationResponsiveness: number;
  };
  predictedChurnDate?: string;
  recommendedActions: string[];
  lastUpdated: string;
}

interface SupplyChainOptimization {
  id: string;
  type: 'aggregation' | 'route-optimization' | 'inventory-balance' | 'quality-improvement';
  title: string;
  description: string;
  potentialSavings: number;
  implementationEffort: 'low' | 'medium' | 'high';
  affectedPlayers: string[];
  timeline: string;
  status: 'identified' | 'proposed' | 'in-progress' | 'completed';
  roi: number; // percentage
}

interface RelationshipHealth {
  partnerId1: string;
  partnerId2: string;
  partnerNames: [string, string];
  relationshipType: 'buyer-seller' | 'cooperative-member' | 'supplier-dealer' | 'farmer-processor';
  healthScore: number; // 0-100
  healthTrend: 'improving' | 'stable' | 'declining';
  keyMetrics: {
    transactionVolume: number;
    paymentTimeliness: number;
    qualityCompliance: number;
    communicationFrequency: number;
  };
  riskFactors: string[];
  strengthFactors: string[];
  recommendations: string[];
}

const ProactiveSupplyChainManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'churn-prediction' | 'optimization' | 'relationships'>('churn-prediction');

  // Mock churn risk data
  const churnRisks: ChurnRiskScore[] = [
    {
      playerId: 'farmer_001',
      playerName: 'Samuel Kiprotich',
      playerType: 'farmer',
      riskScore: 78,
      riskLevel: 'high',
      keyIndicators: {
        engagementTrend: 'declining',
        transactionFrequency: 'declining',
        complianceRate: 85,
        satisfactionScore: 6.2,
        communicationResponsiveness: 4.1
      },
      predictedChurnDate: '2024-03-15',
      recommendedActions: [
        'Schedule personal visit by extension officer',
        'Offer price premium for next 3 months',
        'Provide additional technical support',
        'Connect with successful peer farmer mentor'
      ],
      lastUpdated: '2024-01-15'
    },
    {
      playerId: 'dealer_003',
      playerName: 'Nakuru Agro Supplies',
      playerType: 'agro-dealer',
      riskScore: 65,
      riskLevel: 'medium',
      keyIndicators: {
        engagementTrend: 'stable',
        transactionFrequency: 'declining',
        complianceRate: 92,
        satisfactionScore: 7.1,
        communicationResponsiveness: 6.8
      },
      recommendedActions: [
        'Introduce new product lines',
        'Offer volume-based incentives',
        'Improve inventory management system',
        'Enhance customer service training'
      ],
      lastUpdated: '2024-01-14'
    },
    {
      playerId: 'coop_005',
      playerName: 'Meru Organic Farmers Coop',
      playerType: 'cooperative',
      riskScore: 23,
      riskLevel: 'low',
      keyIndicators: {
        engagementTrend: 'increasing',
        transactionFrequency: 'increasing',
        complianceRate: 96,
        satisfactionScore: 8.7,
        communicationResponsiveness: 8.9
      },
      recommendedActions: [
        'Continue current engagement strategies',
        'Consider expansion opportunities',
        'Share best practices with other cooperatives'
      ],
      lastUpdated: '2024-01-15'
    }
  ];

  // Mock optimization opportunities
  const optimizations: SupplyChainOptimization[] = [
    {
      id: 'opt_001',
      type: 'aggregation',
      title: 'Consolidate Maize Collection Routes in Uasin Gishu',
      description: 'Combine 5 separate collection routes into 3 optimized routes, reducing transport costs and improving farmer pickup times.',
      potentialSavings: 450000,
      implementationEffort: 'medium',
      affectedPlayers: ['15 farmers', '3 transporters', '2 cooperatives'],
      timeline: '6-8 weeks',
      status: 'proposed',
      roi: 35
    },
    {
      id: 'opt_002',
      type: 'inventory-balance',
      title: 'Redistribute Fertilizer Stock Across Dealers',
      description: 'Move excess DAP fertilizer from Nakuru dealers to high-demand areas in Meru and Kiambu.',
      potentialSavings: 280000,
      implementationEffort: 'low',
      affectedPlayers: ['8 agro-dealers', '200+ farmers'],
      timeline: '2-3 weeks',
      status: 'in-progress',
      roi: 28
    },
    {
      id: 'opt_003',
      type: 'quality-improvement',
      title: 'Implement Cold Chain for Horticulture Exports',
      description: 'Establish temperature-controlled transport and storage for French beans and snow peas to reduce post-harvest losses.',
      potentialSavings: 1200000,
      implementationEffort: 'high',
      affectedPlayers: ['45 farmers', '3 exporters', '5 transporters'],
      timeline: '12-16 weeks',
      status: 'identified',
      roi: 42
    }
  ];

  // Mock relationship health data
  const relationships: RelationshipHealth[] = [
    {
      partnerId1: 'farmer_001',
      partnerId2: 'coop_005',
      partnerNames: ['Samuel Kiprotich', 'Meru Organic Farmers Coop'],
      relationshipType: 'cooperative-member',
      healthScore: 72,
      healthTrend: 'declining',
      keyMetrics: {
        transactionVolume: 85,
        paymentTimeliness: 78,
        qualityCompliance: 92,
        communicationFrequency: 45
      },
      riskFactors: [
        'Reduced participation in meetings',
        'Late payment of membership fees',
        'Decreased delivery volumes'
      ],
      strengthFactors: [
        'High quality produce',
        'Long-term member',
        'Good technical knowledge'
      ],
      recommendations: [
        'Schedule one-on-one meeting with cooperative leadership',
        'Offer flexible payment terms',
        'Provide additional market access opportunities'
      ]
    },
    {
      partnerId1: 'dealer_003',
      partnerId2: 'processor_007',
      partnerNames: ['Nakuru Agro Supplies', 'Fresh Produce Processing Ltd'],
      relationshipType: 'supplier-dealer',
      healthScore: 89,
      healthTrend: 'stable',
      keyMetrics: {
        transactionVolume: 92,
        paymentTimeliness: 95,
        qualityCompliance: 88,
        communicationFrequency: 82
      },
      riskFactors: [
        'Occasional quality issues with packaging materials'
      ],
      strengthFactors: [
        'Consistent supply',
        'Competitive pricing',
        'Excellent payment record',
        'Strong communication'
      ],
      recommendations: [
        'Implement quality control checks',
        'Continue current partnership model',
        'Explore expansion opportunities'
      ]
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            Proactive Supply Chain Intelligence
          </h2>
          <p className="text-muted-foreground">
            AI-powered insights to prevent churn, optimize operations, and strengthen relationships
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-600">
            <Zap className="h-3 w-3 mr-1" />
            Real-time Analytics
          </Badge>
          <Badge variant="outline" className="text-green-600">
            <Shield className="h-3 w-3 mr-1" />
            Predictive Insights
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="churn-prediction">Churn Prediction</TabsTrigger>
          <TabsTrigger value="optimization">Supply Chain Optimization</TabsTrigger>
          <TabsTrigger value="relationships">Relationship Health</TabsTrigger>
        </TabsList>

        <TabsContent value="churn-prediction" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Critical Risk</p>
                    <p className="text-2xl font-bold text-red-600">
                      {churnRisks.filter(r => r.riskLevel === 'critical').length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {churnRisks.filter(r => r.riskLevel === 'high').length}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Medium Risk</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {churnRisks.filter(r => r.riskLevel === 'medium').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Low Risk</p>
                    <p className="text-2xl font-bold text-green-600">
                      {churnRisks.filter(r => r.riskLevel === 'low').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {churnRisks.map((risk) => (
              <Card key={risk.playerId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {risk.playerType === 'farmer' && <Users className="h-5 w-5" />}
                        {risk.playerType === 'agro-dealer' && <Building className="h-5 w-5" />}
                        {risk.playerType === 'transporter' && <Truck className="h-5 w-5" />}
                        {risk.playerType === 'processor' && <Package className="h-5 w-5" />}
                        {risk.playerType === 'cooperative' && <Users className="h-5 w-5" />}
                        {risk.playerName}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{risk.playerType}</Badge>
                        <Badge className={`${getRiskColor(risk.riskLevel)} border`}>
                          {risk.riskLevel.toUpperCase()} RISK
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{risk.riskScore}%</div>
                      <div className="text-sm text-muted-foreground">Risk Score</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Key Indicators</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            {getTrendIcon(risk.keyIndicators.engagementTrend)}
                            <span className="text-sm">Engagement</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{risk.keyIndicators.engagementTrend}</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            {getTrendIcon(risk.keyIndicators.transactionFrequency)}
                            <span className="text-sm">Transactions</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{risk.keyIndicators.transactionFrequency}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{risk.keyIndicators.complianceRate}%</div>
                          <div className="text-xs text-muted-foreground">Compliance</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{risk.keyIndicators.satisfactionScore}/10</div>
                          <div className="text-xs text-muted-foreground">Satisfaction</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{risk.keyIndicators.communicationResponsiveness}/10</div>
                          <div className="text-xs text-muted-foreground">Responsiveness</div>
                        </div>
                      </div>
                    </div>
                    
                    {risk.predictedChurnDate && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Predicted churn date: {new Date(risk.predictedChurnDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recommended Actions</h4>
                      <div className="space-y-2">
                        {risk.recommendedActions.map((action, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-xs text-muted-foreground">
                        Last updated: {new Date(risk.lastUpdated).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm">Take Action</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Potential Savings</p>
                    <p className="text-2xl font-bold text-green-600">
                      KES {optimizations.reduce((sum, opt) => sum + opt.potentialSavings, 0).toLocaleString()}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Optimizations</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {optimizations.filter(opt => opt.status === 'in-progress').length}
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Average ROI</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(optimizations.reduce((sum, opt) => sum + opt.roi, 0) / optimizations.length)}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {optimizations.map((optimization) => (
              <Card key={optimization.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{optimization.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{optimization.type.replace('-', ' ')}</Badge>
                        <Badge variant={optimization.status === 'in-progress' ? 'default' : 'outline'}>
                          {optimization.status.replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline" className={
                          optimization.implementationEffort === 'low' ? 'text-green-600' :
                          optimization.implementationEffort === 'medium' ? 'text-yellow-600' : 'text-red-600'
                        }>
                          {optimization.implementationEffort} effort
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">
                        KES {optimization.potentialSavings.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">{optimization.roi}% ROI</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{optimization.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Affected Players</h4>
                        <div className="flex flex-wrap gap-1">
                          {optimization.affectedPlayers.map((player, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {player}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Timeline</h4>
                        <div className="text-sm text-muted-foreground">{optimization.timeline}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      {optimization.status === 'identified' && (
                        <Button size="sm">Propose Implementation</Button>
                      )}
                      {optimization.status === 'proposed' && (
                        <Button size="sm">Start Implementation</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-6">
          <div className="space-y-4">
            {relationships.map((relationship, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {relationship.partnerNames[0]} ↔ {relationship.partnerNames[1]}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">
                          {relationship.relationshipType.replace('-', ' ')}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(relationship.healthTrend)}
                          <span className="text-sm text-muted-foreground">{relationship.healthTrend}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getHealthColor(relationship.healthScore)}`}>
                        {relationship.healthScore}%
                      </div>
                      <div className="text-sm text-muted-foreground">Health Score</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Key Metrics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(relationship.keyMetrics).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-lg font-bold">{value}%</div>
                            <div className="text-xs text-muted-foreground">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^\w/, c => c.toUpperCase())}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Strength Factors</h4>
                        <div className="space-y-1">
                          {relationship.strengthFactors.map((factor, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span className="text-xs">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Risk Factors</h4>
                        <div className="space-y-1">
                          {relationship.riskFactors.map((factor, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-red-600" />
                              <span className="text-xs">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                      <div className="space-y-1">
                        {relationship.recommendations.map((rec, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Target className="h-3 w-3 text-blue-600" />
                            <span className="text-xs">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">View History</Button>
                      <Button size="sm">Strengthen Relationship</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProactiveSupplyChainManager;
