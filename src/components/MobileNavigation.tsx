// @ts-nocheck
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  Search,
  MessageCircle,
  User,
  ShoppingCart,
  Tractor,
  TrendingUp,
  Truck,
  Heart,
  Bell
} from 'lucide-react';

const navigationItems = [
  {
    href: '/',
    label: 'Home',
    icon: Home
  },
  {
    href: '/marketplace',
    label: 'Market',
    icon: ShoppingCart
  },
  {
    href: '/equipment',
    label: 'Equipment',
    icon: Tractor
  },
  {
    href: '/transport',
    label: 'Transport',
    icon: Truck
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: User
  }
];

export function MobileNavigation() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || 
            (item.href !== '/' && location.pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Add floating action buttons for key actions
export function FloatingActionButtons() {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const actions = [
    {
      icon: MessageCircle,
      label: 'Chat Assistant',
      href: '/assistant',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: Bell,
      label: 'Notifications',
      href: '/notifications',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      icon: Heart,
      label: 'Food Rescue',
      href: '/food-rescue',
      color: 'bg-green-500 hover:bg-green-600'
    }
  ];

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-4">
      <div className="flex flex-col items-end space-y-2">
        {isExpanded && (
          <div className="flex flex-col space-y-2">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.href}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg transition-all duration-200",
                    action.color,
                    "transform scale-0 animate-in fade-in slide-in-from-bottom-2"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setIsExpanded(false)}
                >
                  <Icon className="h-6 w-6" />
                </Link>
              );
            })}
          </div>
        )}
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg transition-all duration-200",
            isExpanded && "rotate-45"
          )}
        >
          <Search className="h-7 w-7" />
        </button>
      </div>
    </div>
  );
}

export default MobileNavigation;