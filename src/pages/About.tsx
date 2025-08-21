
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  TrendingUp, 
  Shield, 
  Heart,
  Mail,
  Phone,
  MapPin,
  Truck,
  Wheat,
  Building2,
  BarChart3,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Active Farmers', value: '50,000+', icon: <Users className="h-5 w-5" /> },
    { label: 'Counties Covered', value: '47', icon: <MapPin className="h-5 w-5" /> },
    { label: 'Service Providers', value: '2,500+', icon: <Building2 className="h-5 w-5" /> },
    { label: 'Monthly Transactions', value: 'KES 500M+', icon: <TrendingUp className="h-5 w-5" /> }
  ];

  const features = [
    {
      icon: <Wheat className="h-6 w-6 text-primary" />,
      title: 'Farm Management',
      description: 'Comprehensive tools for crop tracking, inventory management, and yield optimization'
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: 'Market Intelligence',
      description: 'Real-time market prices, demand forecasting, and trade opportunities'
    },
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: 'Smart Logistics',
      description: 'End-to-end logistics solutions connecting farmers to markets efficiently'
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'Financial Services',
      description: 'Access to credit, insurance, and digital payment solutions'
    }
  ];

  const achievements = [
    'Winner - Kenya Digital Economy Awards 2024',
    'ISO 27001 Certified for Data Security',
    'Partnership with Ministry of Agriculture',
    'Featured in TechCrunch Africa',
    'Google for Startups Alumni'
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Transforming Agriculture in Kenya</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            AgriConnect is East Africa's leading agricultural technology platform, 
            empowering farmers, connecting markets, and driving sustainable food security 
            through innovative digital solutions.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={() => navigate('/contact')}>
              <Mail className="h-4 w-4 mr-2" />
              Partner With Us
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
              Learn More
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                To revolutionize Kenya's agricultural sector by providing farmers with access to 
                technology, markets, and financial services that increase productivity, profitability, 
                and sustainability across the entire value chain.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-secondary" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                A digitally-enabled agricultural ecosystem where every farmer in Kenya has 
                access to the tools, knowledge, and opportunities needed to thrive in 
                modern agriculture and contribute to national food security.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-3">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section className="mb-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Since 2020, we've been driving measurable change in Kenya's agricultural sector
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">300%</div>
              <div className="text-muted-foreground">Average yield increase for participating farmers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">KES 2.5B</div>
              <div className="text-muted-foreground">Total value of trades facilitated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-muted-foreground">Customer satisfaction rate</div>
            </div>
          </div>
        </section>

        {/* Recognition */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Recognition & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Sarah Mwangi</h3>
                <p className="text-muted-foreground mb-2">CEO & Co-Founder</p>
                <Badge variant="outline">MSc. Agriculture, University of Nairobi</Badge>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">David Kipchoge</h3>
                <p className="text-muted-foreground mb-2">CTO & Co-Founder</p>
                <Badge variant="outline">BSc. Computer Science, JKUAT</Badge>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Grace Wanjiku</h3>
                <p className="text-muted-foreground mb-2">Head of Operations</p>
                <Badge variant="outline">MBA, Strathmore University</Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-8 pb-8">
              <Heart className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Ready to Transform Agriculture Together?</h2>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of farmers, businesses, and partners who are already part of the AgriConnect ecosystem.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="secondary" size="lg" onClick={() => navigate('/contact')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Our Team
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" onClick={() => navigate('/auth')}>
                  Join Platform
                </Button>
              </div>
              
              <Separator className="my-6 bg-white/20" />
              
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  partnerships@agriconnect.co.ke
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  +254 700 123 456
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Nairobi, Kenya
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;
