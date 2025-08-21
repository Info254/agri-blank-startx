import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PartnerNavItem() {
  const location = useLocation();
  const isActive = location.pathname.startsWith('/partner/dashboard');

  return (
    <Button
      asChild
      variant={isActive ? 'secondary' : 'ghost'}
      className={cn(
        'w-full justify-start',
        isActive ? 'bg-accent' : ''
      )}
    >
      <Link to="/partner/dashboard">
        <User className="mr-2 h-4 w-4" />
        Partner Dashboard
      </Link>
    </Button>
  );
}
