
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Home, 
  TrendingUp, 
  Truck, 
  Users, 
  MessageCircle, 
  BarChart3,
  DollarSign,
  Megaphone,
  AlertTriangle,
  MapPin,
  Sprout,
  CheckCircle,
  Calendar,
  Clock,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Market Data', href: '/kilimo-ams-data', icon: TrendingUp },
  { name: 'Logistics', href: '/logistics', icon: Truck },
  { name: 'Service Providers', href: '/service-providers', icon: Users },
  { name: 'Advertise Business', href: '/business-marketing', icon: Megaphone, highlight: true },
  { name: 'Trading', href: '/commodity-trading', icon: DollarSign },
  { name: 'Community', href: '/community-forum', icon: MessageCircle },
  { name: 'Analytics', href: '/sentiment-analysis', icon: BarChart3 },
  { name: 'Donations', href: '/donation-list', icon: DollarSign },
  { name: 'Food Rescue', href: '/food-rescue-dashboard', icon: AlertTriangle },
  { name: 'Auctions', href: '/agent-product-auction-dashboard', icon: TrendingUp },
  { name: 'Marketplace - Farm Inputs', href: '/farm-input-marketplace', icon: BarChart3 },
  { name: 'Marketplace - Commodity Trading', href: '/commodity-trading', icon: BarChart3 },
  { name: 'Marketplace - City Markets', href: '/city-markets', icon: MapPin },
  { name: 'Marketplace - Equipment', href: '/EquipmentMarketplace', icon: BarChart3 },
  { name: 'Marketplace - Export Opportunities', href: '/ExportMarketOpportunities', icon: Globe },
  { name: 'Animals', href: '/farmer-portal#animals', icon: Sprout },
  { name: 'Veterinary', href: '/veterinary-services', icon: CheckCircle },
  { name: 'Feed & Nutrition', href: '/feed-nutrition', icon: Calendar },
  { name: 'Genetics & Breeding', href: '/genetics-breeding', icon: Clock },
  { name: 'Farm Construction', href: '/farm-construction', icon: MapPin },
  { name: 'Consultancies', href: '/consultancies', icon: Users },
];

export const MobileNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <div className="flex flex-col space-y-4 mt-4">
            <Link to="/" className="flex items-center space-x-2 mb-6" onClick={() => setOpen(false)}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">A</span>
              </div>
              <span className="font-bold text-lg">AgriConnect</span>
            </Link>
            
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : item.highlight
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : "hover:bg-muted"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                  {item.highlight && (
                    <span className="ml-auto text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
