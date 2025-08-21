
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PostHarvestLosses: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Post-Harvest Losses</h1>
          <p className="text-muted-foreground max-w-3xl">
            In Kenya, post-harvest losses account for up to 30-40% of harvested crops due to inadequate storage, 
            transportation issues, and limited processing facilities. Our platform provides solutions to reduce these losses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Storage Solutions</CardTitle>
              <CardDescription>Improved storage techniques and facilities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Access affordable storage solutions like hermetic bags, metal silos, and community cold storage 
              facilities that can extend the shelf life of your produce.</p>
              <Button asChild>
                <Link to="/supply-chain-api">Find Storage Providers</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Preservation Methods</CardTitle>
              <CardDescription>Value addition through processing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Learn about low-cost preservation methods such as solar drying, fermenting, and canning 
              that can transform perishable produce into items with longer shelf life.</p>
              <Button asChild>
                <Link to="/supply-chain-problems/quality-control">Explore Preservation Techniques</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Market Linkages</CardTitle>
              <CardDescription>Faster routes to market</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Connect directly with buyers to reduce the time between harvest and sale, minimizing the 
              risk of spoilage during extended storage periods.</p>
              <Button asChild>
                <Link to="/commodity-trading">Connect with Buyers</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-muted/30 p-6 rounded-lg mb-10">
          <h2 className="text-2xl font-bold mb-4">Post-Harvest Loss Statistics in Kenya</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-primary mb-2">30-40%</div>
              <div className="text-sm text-muted-foreground">Overall post-harvest losses</div>
            </div>
            <div className="bg-background p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-primary mb-2">50%</div>
              <div className="text-sm text-muted-foreground">Fruits & vegetables losses</div>
            </div>
            <div className="bg-background p-6 rounded-lg text-center">
              <div className="text-4xl font-bold text-primary mb-2">$500M</div>
              <div className="text-sm text-muted-foreground">Annual economic impact</div>
            </div>
          </div>
        </div>
        
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Quality Control & Contract Farming</CardTitle>
            <CardDescription>Improving quality and reliability through partnerships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-2">Organic Certification</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Organic certification through KEBS or international bodies helps farmers access premium markets and improve
                  product value while reducing chemical inputs.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/supply-chain-problems/quality-control">Learn About Certification</Link>
                </Button>
              </div>
              <div className="border p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-2">Contract Farming</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Partner with buyers from planting to harvest, receiving quality inputs, technical support, and guaranteed markets
                  while meeting specific standards.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/supply-chain-problems/market-access">Find Contract Partners</Link>
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-1">Meru Potato Farmers Cooperative</h3>
                <p className="text-sm text-muted-foreground mb-2">Reduced losses from 35% to 8% through community cold storage</p>
                <Button variant="link" className="px-0" asChild>
                  <Link to="/supply-chain-api">Read More</Link>
                </Button>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-medium mb-1">Kitui Mango Processors</h3>
                <p className="text-sm text-muted-foreground mb-2">Transformed excess mangoes into dried products and juices</p>
                <Button variant="link" className="px-0" asChild>
                  <Link to="/supply-chain-problems/quality-control">Read More</Link>
                </Button>
              </div>
              <div>
                <h3 className="font-medium mb-1">Nakuru Grain Farmers</h3>
                <p className="text-sm text-muted-foreground mb-2">Adopted hermetic bags to prevent pest damage during storage</p>
                <Button variant="link" className="px-0" asChild>
                  <Link to="/supply-chain-api">Read More</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="bg-muted/30 py-8 px-6 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto">
          <p>© {new Date().getFullYear()} Soko-Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PostHarvestLosses;
