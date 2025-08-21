
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import FeaturedContent from '@/components/FeaturedContent';
import SearchSection from '@/components/SearchSection';
import { 
  Tractor, 
  TrendingUp, 
  DollarSign, 
  Users, 
  MapPin, 
  BarChart3,
  Truck,
  Warehouse,
  Clock
} from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Search Section */}
      <SearchSection />
      
      {/* Quick Action Cards */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
            <p className="text-lg text-muted-foreground">
              Choose your path to agricultural success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* City Markets Card */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>City Markets</CardTitle>
                <CardDescription>
                  View city market prices and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/city-markets">
                  <Button className="w-full" size="lg">
                    City Markets
                  </Button>
                </Link>
              </CardContent>
            </Card>
            {/* Start Farming Card */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Tractor className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Start Farming</CardTitle>
                <CardDescription>
                  Access farming tools, crop tracking, and agricultural resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/farmer-portal">
                  <Button className="w-full" size="lg">
                    Start Farming
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Farm Equipment Card */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Warehouse className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Farm Equipment</CardTitle>
                <CardDescription>
                  Buy, sell, or rent farm equipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/equipment-marketplace">
                  <Button className="w-full" size="lg">
                    Equipment Marketplace
                  </Button>
                </Link>
              </CardContent>
            </Card>
            {/* Farm to Market Integration Card */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Farm to Market Integration</CardTitle>
                <CardDescription>
                  Connect with buyers, access market prices, and manage sales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/market-linkages">
                  <Button className="w-full" size="lg">
                    Complete Integration
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Financial Visibility Card */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Realtime Financial Visibility</CardTitle>
                <CardDescription>
                  Track expenses, revenue, and financial performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/farmer-portal">
                  <Button className="w-full" size="lg">
                    View Finances
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Donations Card */}
            <Card className="text-center">
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <Link to="/donation-form">
                  <Button variant="outline" size="sm" className="mt-3">Make a Donation</Button>
                </Link>
                <Link to="/donation-list">
                  <Button variant="outline" size="sm" className="mt-3 ml-2">View Donations</Button>
                </Link>
              </CardContent>
            </Card>
            {/* Food Rescue Card */}
            <Card className="text-center">
              <CardHeader>
                <Warehouse className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Food Rescue</CardTitle>
              </CardHeader>
              <CardContent>
                <Link to="/food-rescue-dashboard">
                  <Button variant="outline" size="sm" className="mt-3">Food Rescue Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
            {/* Bulk Orders Card */}
            <Card className="text-center">
              <CardHeader>
                <Warehouse className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Bulk Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Link to="/bulk-order-dashboard">
                  <Button variant="outline" size="sm" className="mt-3">Bulk Order Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
            {/* Imperfect Surplus Card */}
            <Card className="text-center">
              <CardHeader>
                <Warehouse className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Imperfect Surplus</CardTitle>
              </CardHeader>
              <CardContent>
                <Link to="/imperfect-surplus-dashboard">
                  <Button variant="outline" size="sm" className="mt-3">Imperfect Surplus Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
            {/* Buy Requests Card */}
            <Card className="text-center">
              <CardHeader>
                <Warehouse className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Buy Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Link to="/farmer-portal">
                  <Button variant="outline" size="sm" className="mt-3">View Buy Requests</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need for agricultural success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Connect with farmers and experts
                </p>
                <Link to="/community-forum">
                  <Button variant="outline" size="sm" className="mt-3">
                    Join Forum
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Market Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Find buyers and market opportunities
                </p>
                <Link to="/market-linkages">
                  <Button variant="outline" size="sm" className="mt-3">
                    Explore Markets
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Logistics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Transport and storage solutions
                </p>
                <Link to="/logistics">
                  <Button variant="outline" size="sm" className="mt-3">
                    Find Transport
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Market insights and trends
                </p>
                <Link to="/sentiment-analysis">
                  <Button variant="outline" size="sm" className="mt-3">
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <FeaturedContent />
      
      <Footer />
      <div className="text-center py-4">
        <Link to="/partner-with-us" className="text-primary underline font-semibold">Partner with us</Link>
      </div>
    </div>
  );
};

export default Index;
