
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Award, Users, BookOpen, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const QualityControl: React.FC = () => {
  const [activeTab, setActiveTab] = useState('standards');
  const navigate = useNavigate();

  const generateQualityData = () => {
    return [
      { crop: 'Coffee', grade_a: 45, grade_b: 35, grade_c: 20 },
      { crop: 'Tea', grade_a: 60, grade_b: 30, grade_c: 10 },
      { crop: 'Maize', grade_a: 25, grade_b: 50, grade_c: 25 },
      { crop: 'Beans', grade_a: 40, grade_b: 40, grade_c: 20 },
      { crop: 'Potatoes', grade_a: 30, grade_b: 45, grade_c: 25 },
    ];
  };

  const generateCertificationData = () => {
    return [
      { name: 'Organic Certified', value: 15, color: '#0088FE' },
      { name: 'GAP Certified', value: 25, color: '#00C49F' },
      { name: 'Fair Trade', value: 10, color: '#FFBB28' },
      { name: 'No Certification', value: 50, color: '#FF8042' },
    ];
  };

  const qualityStandards = [
    {
      title: 'Kenya Bureau of Standards (KEBS)',
      description: 'National standards for agricultural products including grading, packaging, and labeling requirements.',
      scope: 'Cereals, pulses, fruits, vegetables, and processed foods',
      benefits: 'Market access, consumer confidence, export opportunities',
      certification_process: 'Application → Inspection → Testing → Certification → Annual surveillance',
    },
    {
      title: 'GlobalGAP Certification',
      description: 'International standard for good agricultural practices ensuring food safety and sustainability.',
      scope: 'Fresh produce, aquaculture, and livestock',
      benefits: 'Access to export markets, premium pricing, risk reduction',
      certification_process: 'Training → Implementation → Self-assessment → External audit → Certification',
    },
    {
      title: 'Organic Certification',
      description: 'Standards for organic production methods without synthetic chemicals and GMOs.',
      scope: 'All agricultural products including crops and livestock',
      benefits: 'Premium pricing (20-40% higher), niche market access, environmental benefits',
      certification_process: 'Transition period (3 years) → Application → Inspection → Certification → Annual renewal',
    },
    {
      title: 'Fair Trade Certification',
      description: 'Social and economic standards ensuring fair prices and working conditions for farmers.',
      scope: 'Coffee, tea, cocoa, bananas, sugar, and other export crops',
      benefits: 'Guaranteed minimum price, social premium, market stability',
      certification_process: 'Group formation → Training → Implementation → Audit → Certification',
    },
  ];

  const qualityChallenges = [
    {
      title: 'Lack of Standardization',
      description: 'Inconsistent quality metrics and grading systems across different markets and buyers.',
      impact: 'Price disputes, market rejection, reduced competitiveness',
      solution: 'Adoption of standardized grading systems and quality measurement tools',
    },
    {
      title: 'Limited Testing Facilities',
      description: 'Few accessible laboratories for quality testing and certification in rural areas.',
      impact: 'Inability to verify quality claims, limited certification opportunities',
      solution: 'Mobile testing units, decentralized testing centers, and rapid testing kits',
    },
    {
      title: 'Poor Post-Harvest Handling',
      description: 'Inadequate storage, processing, and transportation practices affecting product quality.',
      impact: 'Quality degradation, shorter shelf life, reduced market value',
      solution: 'Training on best practices, improved infrastructure, and technology adoption',
    },
    {
      title: 'Cost of Certification',
      description: 'High certification costs and complex procedures limiting smallholder farmer participation.',
      impact: 'Exclusion from premium markets, continued dependence on commodity pricing',
      solution: 'Group certification, subsidized programs, and simplified procedures for smallholders',
    },
  ];

  const qualityImprovementPrograms = [
    {
      title: 'Farmer Field Schools',
      description: 'Hands-on training programs teaching quality production and post-harvest practices.',
      target: 'Smallholder farmers and farmer groups',
      delivery: 'Weekly sessions over full crop cycle',
      topics: ['Good Agricultural Practices', 'Pest and Disease Management', 'Harvest Timing', 'Post-Harvest Handling'],
    },
    {
      title: 'Quality Management Systems',
      description: 'Implementation of systematic approaches to quality control and documentation.',
      target: 'Farmer cooperatives and agribusinesses',
      delivery: 'Consultancy and training workshops',
      topics: ['HACCP Implementation', 'Traceability Systems', 'Record Keeping', 'Continuous Improvement'],
    },
    {
      title: 'Technology Adoption Support',
      description: 'Assistance in adopting quality-enhancing technologies and equipment.',
      target: 'Progressive farmers and cooperatives',
      delivery: 'Demonstrations, subsidies, and technical support',
      topics: ['Quality Testing Equipment', 'Sorting and Grading Machines', 'Storage Technologies', 'Processing Equipment'],
    },
    {
      title: 'Market Linkage Programs',
      description: 'Connecting quality-conscious farmers with premium market opportunities.',
      target: 'Certified farmers and high-quality producers',
      delivery: 'B2B platforms and trade facilitation',
      topics: ['Buyer Identification', 'Contract Negotiation', 'Quality Agreements', 'Payment Guarantees'],
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Quality Control</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Implementing quality standards and certification systems to access premium markets and improve farmer incomes
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-1 sm:grid-cols-4 gap-2 mb-8">
            <TabsTrigger value="standards" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Standards</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              <span>Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="programs" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Programs</span>
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Impact</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="standards">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quality Standards and Certification</CardTitle>
                <CardDescription>
                  Overview of major quality standards and certification systems for Kenyan agriculture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6">
                  {qualityStandards.map((standard, index) => (
                    <Card key={index} className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{standard.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p>{standard.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium">Scope:</span>
                            <p className="text-sm text-muted-foreground">{standard.scope}</p>
                          </div>
                          <div>
                            <span className="font-medium">Benefits:</span>
                            <p className="text-sm text-muted-foreground">{standard.benefits}</p>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Certification Process:</span>
                          <p className="text-sm text-muted-foreground">{standard.certification_process}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-10 p-6 border rounded-lg bg-blue-50">
                  <h3 className="text-xl font-medium mb-4">Benefits of Quality Certification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">20-40%</div>
                      <div className="text-sm">Price Premium</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">60%</div>
                      <div className="text-sm">Market Access Improvement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">80%</div>
                      <div className="text-sm">Customer Satisfaction</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="challenges">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quality Control Challenges</CardTitle>
                <CardDescription>
                  Common barriers to implementing effective quality control in agricultural value chains
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {qualityChallenges.map((challenge, index) => (
                    <Card key={index} className="border-l-4 border-l-red-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p>{challenge.description}</p>
                        <p><span className="font-medium">Impact:</span> {challenge.impact}</p>
                        <p><span className="font-medium">Solution:</span> {challenge.solution}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-10">
                  <h3 className="text-lg font-medium mb-4">Current Quality Distribution</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={generateQualityData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="crop" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="grade_a" stackId="a" fill="#22c55e" name="Grade A (Premium)" />
                      <Bar dataKey="grade_b" stackId="a" fill="#eab308" name="Grade B (Standard)" />
                      <Bar dataKey="grade_c" stackId="a" fill="#ef4444" name="Grade C (Below Standard)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="programs">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Quality Improvement Programs</CardTitle>
                <CardDescription>
                  Training and support programs to help farmers meet quality standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {qualityImprovementPrograms.map((program, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{program.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm">{program.description}</p>
                        <div>
                          <span className="font-medium text-sm">Target:</span>
                          <p className="text-sm text-muted-foreground">{program.target}</p>
                        </div>
                        <div>
                          <span className="font-medium text-sm">Delivery:</span>
                          <p className="text-sm text-muted-foreground">{program.delivery}</p>
                        </div>
                        <div>
                          <span className="font-medium text-sm">Key Topics:</span>
                          <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                            {program.topics.map((topic, idx) => (
                              <li key={idx}>{topic}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-10 p-6 border rounded-lg bg-green-50">
                  <h3 className="text-xl font-medium mb-4">Join Our Quality Improvement Programs</h3>
                  <p className="mb-4">
                    AgriTender Connect partners with certification bodies and training organizations to offer:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Training Workshops</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Regular training on quality standards and best practices</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/service-providers')}>
                          Find Training
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Certification Support</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Guidance and support through certification processes</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/service-providers')}>
                          Get Support
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="impact">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Impact of Quality Improvements</CardTitle>
                <CardDescription>
                  Measuring the benefits of quality control and certification programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Certification Status in Kenya</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={generateCertificationData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {generateCertificationData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Success Story: Nyeri Coffee Cooperative</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Implemented quality management systems and achieved specialty coffee certification
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Price Increase:</span>
                          <Badge variant="default">+45%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Rejection Rate:</span>
                          <Badge variant="destructive">-60%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Export Markets:</span>
                          <Badge variant="default">+3</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Success Story: Meru Organic Farmers</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Transitioned to organic farming and achieved organic certification
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Premium Pricing:</span>
                          <Badge variant="default">+30%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Input Costs:</span>
                          <Badge variant="destructive">-25%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Soil Health:</span>
                          <Badge variant="default">Improved</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg bg-muted/30">
                  <h3 className="text-lg font-medium mb-4">Measurable Impact of Quality Programs</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Farmers with certification earn 20-40% higher prices compared to non-certified farmers</li>
                    <li>Quality-focused cooperatives reduce post-harvest losses by up to 50%</li>
                    <li>Certified farms have 30% lower rejection rates from buyers</li>
                    <li>Quality improvement programs increase farmer income by an average of 35%</li>
                    <li>Export opportunities increase by 60% for certified producers</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/commodity-trading')} className="ml-auto">
                  Start Your Quality Journey
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default QualityControl;
