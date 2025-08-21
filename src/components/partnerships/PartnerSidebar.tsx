import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Home, Calendar, User, Settings, PlusCircle } from 'lucide-react';

type SidebarLink = {
  title: string;
  href: string;
  icon: React.ReactNode;
  isActive?: boolean;
};

export function PartnerSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path);

  const links: SidebarLink[] = [
    {
      title: 'Overview',
      href: '/partner/dashboard',
      icon: <Home className="h-4 w-4" />,
      isActive: isActive('/partner/dashboard') && !isActive('/partner/dashboard/events'),
    },
    {
      title: 'Events',
      href: '/partner/dashboard/events',
      icon: <Calendar className="h-4 w-4" />,
      isActive: isActive('/partner/dashboard/events'),
    },
    {
      title: 'Profile',
      href: '/partner/dashboard/profile',
      icon: <User className="h-4 w-4" />,
      isActive: isActive('/partner/dashboard/profile'),
    },
    {
      title: 'Settings',
      href: '/partner/dashboard/settings',
      icon: <Settings className="h-4 w-4" />,
      isActive: isActive('/partner/dashboard/settings'),
    },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 border-r h-full">
      <div className="space-y 4 p-4">
        <div className="flex items-center space-x-2 p-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Partner Dashboard</p>
          </div>
        </div>
        
        <div className="space-y-1 mt-8">
          {links.map((link) => (
            <Button
              key={link.href}
              asChild
              variant={link.isActive ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start',
                link.isActive ? 'bg-accent' : ''
              )}
            >
              <Link to={link.href}>
                {link.icon}
                <span className="ml-2">{link.title}</span>
              </Link>
            </Button>
          ))}
          
          <Button
            asChild
            variant="outline"
            className="w-full justify-start mt-4"
          >
            <Link to="/partner/dashboard/events/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Event
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="p-4 mt-auto">
        <div className="rounded-lg bg-muted p-4">
          <h4 className="text-sm font-medium mb-2">Need help?</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Contact our support team for assistance with your partner account.
          </p>
          <Button variant="outline" size="sm" className="w-full">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
