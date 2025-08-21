import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';

// Lazy load components for better performance
const MarketplacePage = lazy(() => import('@/pages/livestock/MarketplacePage'));
const LivestockDetailPage = lazy(() => import('@/pages/livestock/LivestockDetailPage'));
const SellLivestockPage = lazy(() => import('@/pages/livestock/SellLivestockPage'));
const EditLivestockPage = lazy(() => import('@/pages/livestock/EditLivestockPage'));
const UserListingsPage = lazy(() => import('@/pages/livestock/UserListingsPage'));

// Layout component for authenticated routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // In a real app, you would check if the user is authenticated
  // const { user, loading } = useAuth();
  const isAuthenticated = true; // Replace with actual auth check
  
  // if (loading) {
  //   return <LoadingSpinner />;
  // }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export const livestockRouter = createBrowserRouter([
  {
    path: '/livestock',
    element: <MarketplacePage />,
  },
  {
    path: '/livestock/:id',
    element: <LivestockDetailPage />,
  },
  {
    path: '/livestock/sell',
    element: (
      <ProtectedRoute>
        <SellLivestockPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/livestock/edit/:id',
    element: (
      <ProtectedRoute>
        <EditLivestockPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-listings',
    element: (
      <ProtectedRoute>
        <UserListingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/livestock" replace />,
  },
]);

// Navigation helper
export const livestockNavLinks = [
  {
    title: 'Marketplace',
    href: '/livestock',
    icon: 'shopping-cart',
  },
  {
    title: 'Sell Livestock',
    href: '/livestock/sell',
    icon: 'plus-circle',
    auth: true,
  },
  {
    title: 'My Listings',
    href: '/my-listings',
    icon: 'list',
    auth: true,
  },
];
