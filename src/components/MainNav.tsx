import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  TrendingUp, 
  Truck, 
  Users, 
  MessageCircle, 
  BarChart3,
  DollarSign,
  Megaphone,
  Globe,
  Store
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Market Data',
    href: '/kilimo-ams-data',
    icon: TrendingUp,
  },
  {
    name: 'Logistics',
    href: '/logistics',
    icon: Truck,
  },
  {
    name: 'Marketplace',
    href: '/inputs',
    icon: Store,
    submenu: [
      { name: 'Farm Inputs', href: '/inputs' },
      { name: 'Commodity Trading', href: '/commodity-trading' },
      { name: 'City Markets', href: '/city-markets' },
      { name: 'Equipment', href: '/EquipmentMarketplace' },
      { name: 'Export Opportunities', href: '/ExportMarketOpportunities' }
    ]
  },
  {
    name: 'Service Providers',
    href: '/service-providers',
    icon: Users,
  },
  {
    name: 'Advertise Business',
    href: '/business-marketing',
    icon: Megaphone,
    highlight: true,
  },
  {
    name: 'Trading',
    href: '/commodity-trading',
    icon: DollarSign,
  },
  {
    name: 'Community',
    href: '/community-forum',
    icon: MessageCircle,
  },
  {
    name: 'Analytics',
    href: '/sentiment-analysis',
    icon: BarChart3,
  },
  {
    name: 'Export Opportunities',
    href: '/ExportMarketOpportunities',
    icon: Globe, // Use an existing icon for consistency
  },
];

export const MainNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="hidden md:flex items-center space-x-1">
      <Link to="/" className="flex items-center space-x-2 mr-6">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold">A</span>
        </div>
        <span className="hidden lg:inline-block font-bold">AgriConnect</span>
      </Link>
      
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.href;
        if (item.name === 'Marketplace' && item.submenu) {
          return (
            <div key={item.name} className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={isActive ? 'default' : 'ghost'} size="sm" className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {item.submenu.map((sub) => (
                    <Link key={sub.name} to={sub.href}>
                      <DropdownMenuItem className="cursor-pointer">{sub.name}</DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        }
        return (
          <Link key={item.name} to={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex items-center space-x-2",
                item.highlight && !isActive && "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200",
                item.highlight && isActive && "bg-green-600 hover:bg-green-700"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden lg:inline">{item.name}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};
