
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Truck, 
  MessageCircle, 
  ArrowRight,
  Megaphone,
  DollarSign,
  Target
} from 'lucide-react';

const Hero: React.FC = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Real-time Market Data',
      description: 'Access live agricultural market prices and demand forecasts',
      link: '/kilimo-ams-data'
    },
    {
      icon: Users,
      title: 'Service Providers',
      description: 'Connect with agricultural service providers and experts',
      link: '/service-providers'
    },
    {
      icon: Truck,
      title: 'Logistics Solutions',
      description: 'Find transportation and storage solutions for your produce',
      link: '/logistics'
    },
    {
      icon: MessageCircle,
      title: 'Community Forum',
      description: 'Join discussions with fellow farmers and agribusiness professionals',
      link: '/community-forum'
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            🌾 Agricultural Technology Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect. Trade. Grow.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Empowering farmers and agribusiness with real-time market data, logistics solutions, 
            and community connections across Kenya's agricultural value chain.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/kilimo-ams-data">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Market Data
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/business-marketing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
                <Megaphone className="mr-2 h-4 w-4" />
                Advertise Your Business
              </Button>
            </Link>
          </div>

          {/* Business Marketing Highlight */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6 mb-12 border border-green-200">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Megaphone className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">Business Marketing</h3>
              <Badge className="bg-green-600">Popular</Badge>
            </div>
            <p className="text-green-700 mb-4">
              Reach thousands of farmers and agricultural professionals. Advertise your business for just $20 for 30 days.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-green-600">
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>Targeted Audience</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>$20 for 30 Days</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>1000+ Daily Visitors</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link to={feature.link}>
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Trusted by farmers, cooperatives, and agribusiness across Kenya
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
