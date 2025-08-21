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
  MapPin, 
  Users, 
  Building, 
  Plus,
  Star,
  Calendar,
  Phone,
  Mail,
  Leaf,
  TrendingUp,
  UserPlus,
  Shield,
  Award
} from 'lucide-react';

interface Cooperative {
  id: string;
  name: string;
  type: 'farming' | 'processing' | 'marketing' | 'savings' | 'multipurpose';
  description: string;
  location: {
    county: string;
    subcounty: string;
    ward: string;
  };
  memberCount: number;
  maxMembers?: number;
  established: string;
  registration: {
    certificateNumber: string;
    registrationDate: string;
    status: 'active' | 'pending' | 'suspended';
  };
  leadership: {
    chairperson: string;
    secretary: string;
    treasurer: string;
  };
  activities: string[];
  requirements: {
    minimumShare: number;
    monthlyContribution: number;
    joiningFee: number;
  };
  benefits: string[];
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  performance: {
    rating: number;
    activeProjects: number;
    totalRevenue: number;
    memberSatisfaction: number;
  };
  isRecruiting: boolean;
  organicCertified: boolean;
}

interface GroupFormation {
  id: string;
  initiator: string;
  title: string;
  description: string;
  targetMembers: number;
  currentMembers: number;
  location: string;
  focus: string[];
  requirements: string;
  status: 'forming' | 'active' | 'dissolved';
  createdAt: string;
  interestedMembers: string[];
}

const CooperativeHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'register' | 'form-group'>('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  // Mock data for cooperatives
  const cooperatives: Cooperative[] = [
    {
      id: 'coop1',
      name: 'Meru Organic Farmers Cooperative',
      type: 'farming',
      description: 'Certified organic farming cooperative specializing in vegetables and coffee. We provide training, inputs, and guaranteed market access for our members.',
      location: {
        county: 'Meru',
        subcounty: 'Imenti North',
        ward: 'Miriga Mieru East'
      },
      memberCount: 245,
      maxMembers: 300,
      established: '2018',
      registration: {
        certificateNumber: 'CS/4567/2018',
        registrationDate: '2018-03-15',
        status: 'active'
      },
      leadership: {
        chairperson: 'Mary Wanjiku',
        secretary: 'Peter Mwangi',
        treasurer: 'Grace Njeri'
      },
      activities: ['Organic farming', 'Input supply', 'Marketing', 'Training'],
      requirements: {
        minimumShare: 5000,
        monthlyContribution: 500,
        joiningFee: 1000
      },
      benefits: [
        'Subsidized farm inputs',
        'Guaranteed market access',
        'Technical training',
        'Credit facilities',
        'Insurance coverage'
      ],
      contactInfo: {
        phone: '+254 700 123 456',
        email: 'info@meruorganic.co.ke',
        address: 'Meru Town, Meru County'
      },
      performance: {
        rating: 4.8,
        activeProjects: 12,
        totalRevenue: 15000000,
        memberSatisfaction: 92
      },
      isRecruiting: true,
      organicCertified: true
    },
    {
      id: 'coop2',
      name: 'Nakuru Dairy Farmers Cooperative',
      type: 'farming',
      description: 'Leading dairy cooperative providing milk collection, processing, and marketing services to smallholder farmers in Nakuru region.',
      location: {
        county: 'Nakuru',
        subcounty: 'Nakuru East',
        ward: 'Biashara'
      },
      memberCount: 180,
      maxMembers: 250,
      established: '2015',
      registration: {
        certificateNumber: 'CS/3421/2015',
        registrationDate: '2015-07-20',
        status: 'active'
      },
      leadership: {
        chairperson: 'John Kimani',
        secretary: 'Susan Wanjiru',
        treasurer: 'David Maina'
      },
      activities: ['Milk collection', 'Processing', 'Marketing', 'Veterinary services'],
      requirements: {
        minimumShare: 10000,
        monthlyContribution: 800,
        joiningFee: 2000
      },
      benefits: [
        'Daily milk collection',
        'Competitive milk prices',
        'Veterinary services',
        'Feed supply',
        'Equipment leasing'
      ],
      contactInfo: {
        phone: '+254 701 234 567',
        email: 'contact@nakurudairy.co.ke',
        address: 'Nakuru Town, Nakuru County'
      },
      performance: {
        rating: 4.6,
        activeProjects: 8,
        totalRevenue: 25000000,
        memberSatisfaction: 88
      },
      isRecruiting: true,
      organicCertified: false
    }
  ];

  // Mock data for group formations
  const groupFormations: GroupFormation[] = [
    {
      id: 'group1',
      initiator: 'Samuel Kiprotich',
      title: 'Rift Valley Maize Growers Group',
      description: 'Looking to form a group of 20-30 maize farmers in Rift Valley for bulk input purchasing and collective marketing. Focus on hybrid varieties and modern farming techniques.',
      targetMembers: 25,
      currentMembers: 8,
      location: 'Uasin Gishu County',
      focus: ['Maize farming', 'Bulk purchasing', 'Marketing'],
      requirements: 'Must own at least 2 acres, commit to group farming practices, contribute KES 2,000 monthly',
      status: 'forming',
      createdAt: '2024-01-10',
      interestedMembers: ['John Doe', 'Jane Smith', 'Peter Mwangi', 'Mary Wanjiku']
    },
    {
      id: 'group2',
      initiator: 'Grace Nyambura',
      title: 'Women Horticulture Collective',
      description: 'Empowering women farmers through collective horticulture farming. Focus on vegetables, fruits, and value addition for local and export markets.',
      targetMembers: 15,
      currentMembers: 12,
      location: 'Kiambu County',
      focus: ['Horticulture', 'Value addition', 'Export markets'],
      requirements: 'Women only, experience in farming, willing to adopt new technologies',
      status: 'forming',
      createdAt: '2024-01-05',
      interestedMembers: ['Alice Wanjiku', 'Sarah Muthoni', 'Rebecca Njeri']
    }
  ];

  const counties = ['all', 'Meru', 'Nakuru', 'Kiambu', 'Uasin Gishu', 'Kisumu', 'Machakos'];
  const cooperativeTypes = ['all', 'farming', 'processing', 'marketing', 'savings', 'multipurpose'];

  const filteredCooperatives = cooperatives.filter(coop => {
    const matchesSearch = coop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coop.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || coop.location.county === locationFilter;
    const matchesType = typeFilter === 'all' || coop.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const joinCooperative = (coopId: string) => {
    alert(`Application to join cooperative submitted. You will be contacted by the cooperative leadership.`);
  };

  const expressInterest = (groupId: string) => {
    alert(`Interest expressed in joining group. The group initiator will contact you with next steps.`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Cooperative Hub</h1>
            <p className="text-muted-foreground mt-2">
              Join existing cooperatives or form new groups for collective farming success
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600">
              <Building className="h-3 w-3 mr-1" />
              {cooperatives.length} Active Cooperatives
            </Badge>
            <Badge variant="outline" className="text-blue-600">
              <Users className="h-3 w-3 mr-1" />
              {groupFormations.length} Forming Groups
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Cooperatives</TabsTrigger>
            <TabsTrigger value="register">Register Cooperative</TabsTrigger>
            <TabsTrigger value="form-group">Form/Join Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search cooperatives..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {counties.map(county => (
                        <SelectItem key={county} value={county}>
                          {county === 'all' ? 'All Counties' : county}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cooperativeTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Verified Only
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cooperative Listings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCooperatives.map((coop) => (
                <Card key={coop.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{coop.name}</CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{coop.type}</Badge>
                          {coop.organicCertified && (
                            <Badge variant="outline" className="text-green-600">
                              <Leaf className="h-3 w-3 mr-1" />
                              Organic
                            </Badge>
                          )}
                          <Badge variant="outline" className={coop.isRecruiting ? 'text-green-600' : 'text-gray-600'}>
                            {coop.isRecruiting ? 'Recruiting' : 'Full'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {coop.location.county}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {coop.memberCount} members
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {coop.performance.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {coop.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Activities</h4>
                        <div className="flex flex-wrap gap-1">
                          {coop.activities.map((activity) => (
                            <Badge key={activity} variant="outline" className="text-xs">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Joining Fee:</span>
                          <div className="font-medium">KES {coop.requirements.joiningFee.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Monthly Contribution:</span>
                          <div className="font-medium">KES {coop.requirements.monthlyContribution.toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Key Benefits</h4>
                        <div className="text-xs text-muted-foreground">
                          {coop.benefits.slice(0, 3).join(' • ')}
                          {coop.benefits.length > 3 && ' • +' + (coop.benefits.length - 3) + ' more'}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Est. {coop.established}
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            {coop.performance.memberSatisfaction}% satisfaction
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => alert(`Contact: ${coop.contactInfo.phone}`)}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                          {coop.isRecruiting && (
                            <Button
                              size="sm"
                              onClick={() => joinCooperative(coop.id)}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Apply
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Register Your Cooperative</CardTitle>
                <p className="text-muted-foreground">
                  Already have a registered cooperative? Join our platform to connect with farmers and expand your membership.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Cooperative Name</label>
                      <Input placeholder="Enter cooperative name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Registration Certificate Number</label>
                      <Input placeholder="CS/XXXX/YYYY" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="farming">Farming</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="savings">Savings & Credit</SelectItem>
                          <SelectItem value="multipurpose">Multipurpose</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">County</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                        <SelectContent>
                          {counties.slice(1).map(county => (
                            <SelectItem key={county} value={county}>{county}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea 
                        placeholder="Describe your cooperative's activities and goals"
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contact Phone</label>
                      <Input placeholder="+254 7XX XXX XXX" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contact Email</label>
                      <Input placeholder="info@cooperative.co.ke" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Current Member Count</label>
                      <Input type="number" placeholder="0" />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button>
                    <Building className="h-4 w-4 mr-2" />
                    Register Cooperative
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="form-group" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Group Formation</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Start New Group
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {groupFormations.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{group.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{group.status}</Badge>
                      <div className="text-sm text-muted-foreground">
                        {group.currentMembers}/{group.targetMembers} members
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {group.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium">Focus Areas:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {group.focus.map((focus) => (
                            <Badge key={focus} variant="outline" className="text-xs">
                              {focus}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Location:</span>
                        <div className="text-sm text-muted-foreground">{group.location}</div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Requirements:</span>
                        <div className="text-xs text-muted-foreground">{group.requirements}</div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Initiated by:</span>
                        <div className="text-sm">{group.initiator}</div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-xs text-muted-foreground">
                          Created {new Date(group.createdAt).toLocaleDateString()}
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => expressInterest(group.id)}
                          disabled={group.currentMembers >= group.targetMembers}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          {group.currentMembers >= group.targetMembers ? 'Full' : 'Join Interest'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CooperativeHub;
