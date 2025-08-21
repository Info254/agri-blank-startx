import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Store, 
  ShoppingCart, 
  Building2, 
  Wrench,
  Globe,
  Sprout
} from 'lucide-react';

const marketplaceItems = [
  {
    name: 'Farm Inputs',
    href: '/inputs',
    icon: Sprout,
    description: 'Seeds, fertilizers, pesticides'
  },
  {
    name: 'Commodity Trading',
    href: '/commodity-trading',
    icon: ShoppingCart,
    description: 'Buy and sell agricultural products'
  },
  {
    name: 'City Markets',
    href: '/city-markets',
    icon: Building2,
    description: 'Local urban agricultural markets'
  },
  {
    name: 'Equipment',
    href: '/EquipmentMarketplace',
    icon: Wrench,
    description: 'Agricultural machinery and tools'
  },
  {
    name: 'Export Opportunities',
    href: '/ExportMarketOpportunities',
    icon: Globe,
    description: 'International trade opportunities'
  }
];

export const MarketplaceNav: React.FC = () => {
  const location = useLocation();

  return (
    <div className="bg-muted/30 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 py-2 overflow-x-auto">
          <Store className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Marketplace:</span>
          {marketplaceItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <item.icon className="h-3 w-3" />
                  <span className="text-xs">{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};