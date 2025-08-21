import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/use-toast';

export function PartnerRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // If still loading auth state, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    toast({
      title: 'Authentication Required',
      description: 'Please sign in to access the partner dashboard.',
      variant: 'destructive',
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has partner role
  // In a real app, you would check the user's roles/permissions
  const isPartner = user.roles?.includes('partner') || user.isPartner;
  
  if (!isPartner) {
    toast({
      title: 'Access Denied',
      description: 'You do not have permission to access the partner dashboard.',
      variant: 'destructive',
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
