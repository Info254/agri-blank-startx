// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Users, TrendingUp } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern" />
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Soko Connect - Connecting Farmers</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Agricultural Market Platform for Kenya
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect directly with buyers, access real-time market prices, coordinate transport, 
            and grow your agricultural business with AI-powered insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/marketplaces">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Markets
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">10,000+ Farmers</h3>
              <p className="text-sm text-muted-foreground">
                Connected across Kenya's agricultural regions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Prices</h3>
              <p className="text-sm text-muted-foreground">
                Live market data from major trading centers
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Multi-language support with market insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;