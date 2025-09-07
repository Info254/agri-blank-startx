// @ts-nocheck
import React, { Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PartnerRoute } from '@/components/auth/PartnerRoute';

// Lazy load partner components for better performance
const PartnerDashboardPage = React.lazy(() => import('@/pages/PartnerDashboardPage'));
const PartnerOnboarding = React.lazy(() => import('@/pages/PartnerOnboarding'));
const PartnerProfile = React.lazy(() => import('@/pages/PartnerProfile'));
const PartnerServices = React.lazy(() => import('@/pages/PartnerServices'));
const PartnerAnalytics = React.lazy(() => import('@/pages/PartnerAnalytics'));
const PartnerSettings = React.lazy(() => import('@/pages/PartnerSettings'));
const PartnerEventsList = React.lazy(() => import('@/components/partnerships/PartnerEventsList'));
const PartnerEventForm = React.lazy(() => import('@/components/partnerships/PartnerEventForm'));
const PartnerWithUs = React.lazy(() => import('@/pages/PartnerWithUs'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const partnerRoutes: RouteObject[] = [
  {
    path: '/partner/dashboard',
    element: (
      <PartnerRoute>
        <Suspense fallback={<LoadingFallback />}>
          <PartnerDashboardPage />
        </Suspense>
      </PartnerRoute>
    ),
    children: [
      {
        index: true,
        element: <PartnerDashboardPage />,
      },
      {
        path: 'events',
        children: [
          {
            index: true,
            element: <PartnerEventsList />,
          },
          {
            path: 'new',
            element: <PartnerEventForm />,
          },
          {
            path: ':eventId/edit',
            element: <PartnerEventForm />,
          },
        ],
      },
      {
        path: 'profile',
        element: <PartnerProfile />,
      },
      {
        path: 'services',
        element: <PartnerServices />,
      },
      {
        path: 'analytics',
        element: <PartnerAnalytics />,
      },
      {
        path: 'settings',
        element: <PartnerSettings />,
      },
    ],
  },
  {
    path: '/partner/onboarding',
    element: (
      <PartnerRoute>
        <Suspense fallback={<LoadingFallback />}>
          <PartnerOnboarding />
        </Suspense>
      </PartnerRoute>
    ),
  },
  {
    path: '/partner/with-us',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PartnerWithUs />
      </Suspense>
    ),
  },
];

export default partnerRoutes;
