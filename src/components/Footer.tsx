// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">AgriConnect</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting Kenyan farmers with markets, services, and opportunities.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
              <Twitter className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
              <Instagram className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/marketplaces" className="text-muted-foreground hover:text-primary">Markets</Link></li>
              <li><Link to="/bluetooth-coordination" className="text-muted-foreground hover:text-primary">Transport</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-primary">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Languages</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary">English</a></li>
              <li><a href="#" className="text-muted-foregreen hover:text-primary">Kiswahili</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Kikuyu</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Luo</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          © 2024 AgriConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;